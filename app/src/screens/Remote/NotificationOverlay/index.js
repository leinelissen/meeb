import React, { Component } from 'react';
import { Notifications, BlurView, Constants } from 'expo';
import {
    View, 
    Text, 
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native'
import axios from 'axios';
import { BACKEND_ENDPOINT } from '../../../env';
import { Colors } from '../../../styles';
import AsyncErrorHandler from '../../../helpers/AsyncErrorHandler';
import FeedbackPrompt from './components/FeedbackPrompt';

/**
 * These are the response types that are passed to the back-end whenever someone
 * taps one of the buttons in the NotificationOverlay
 */
const RESPONSE_TYPES = {
    ACCEPT: 'ACCEPTED',
    REJECT: 'REJECTED',
    NOT_AT_HOME: 'NOT_AT_HOME',
};

class NotificationOverlay extends Component {
    state = {
        notification: {},
        notificationIsRejected: false,
    }

    /**
     * Subscribe to any incoming notifications
     */
    componentDidMount() {
        this.notificationSubscription = Notifications.addListener(this.handleNotification);
    }

    /**
     * Save any incoming notifications to the state
     *
     * @memberof NotificationOverlay
     */
    handleNotification = (notification) => {
        this.setState({ notification });
    };

    /**
     * Handler for when the prompt is accepted
     *
     * @memberof NotificationOverlay
     */
    close = () => {
        const data = {
            device_uuid: Constants.deviceId,
            response_type: RESPONSE_TYPES.ACCEPT
        };

        return axios.put(BACKEND_ENDPOINT + 'notification-response', data)
            .then(() => this.setState({ notification: {} }))
            .catch(AsyncErrorHandler);
    }
    
    /**
     * Handler for when the user is not at home
     *
     * @memberof NotificationOverlay
     */
    skip = () => {
        const data = {
            device_uuid: Constants.deviceId,
            response_type: RESPONSE_TYPES.NOT_AT_HOME
        };
        
        return axios.put(BACKEND_ENDPOINT + 'notification-response', data)
            .then(() => this.setState({ notification: {} }))
            .catch(AsyncErrorHandler);
    }

    /**
     * Handler for when the user rejects the prompt
     *
     * @memberof NotificationOverlay
     */
    reject = () => {
        this.setState({ notificationIsRejected: true });
    }

    /**
     * Handler for processing the feedback when a user rejects the prompt
     *
     * @memberof NotificationOverlay
     */
    sendRejectedFeedback = (feedback = null) => {
        console.log('RECEIVED PROMPt');

        const data = {
            device_uuid: Constants.deviceId,
            response_type: RESPONSE_TYPES.REJECT,
            feedback
        };
        
        return axios.put(BACKEND_ENDPOINT + 'notification-response', data)
            .then(() => this.setState({ notification: {} }))
            .catch(AsyncErrorHandler);
    }

    renderIllustration() {
        // Parse the incoming data from the notification into a format, so that
        // it is easy to iterate over.
        const notificationData = [[
            this.state.notification.data.windowIsClosed, 
            this.state.notification.data.shouldWindowBeClosed,
        ],[
            this.state.notification.data.doorIsClosed,
            this.state.notification.data.shouldDoorBeClosed
        ]];

        // Generate styles for the images on the fly, so that we can resize them
        // according to screen width
        const style = { 
            width: Dimensions.get('window').width / 8,
            height: 100,
            resizeMode: 'contain',
            margin: 10,
        };

        // Reduce the prepared notfication data to a JSX array
        return notificationData.reduce((sum, [currentState, intendedState], i) => {
            // If the two states for the current iteration are the same, we do
            // not need to generate an illustration, so we can return the sum
            if (currentState === intendedState) {
                return sum;
            }

            // Create a function that return the correct image for a given sensor
            const imageSelector = (isClosed) => {
                if (i === 0) {
                    return isClosed
                        ? <Image style={style} source={require('../../../assets/window-closed.png')} />
                        : <Image style={style} source={require('../../../assets/window-open.png')} />
                } else {
                    return isClosed
                        ? <Image style={style} source={require('../../../assets/door-closed.png')} />
                        : <Image style={style} source={require('../../../assets/door-open.png')} />
                }
            }

            return [
                ...sum,
                (
                    <View style={styles.action} key={i}>
                        {imageSelector(currentState)}
                        <View style={{ justifyContent: 'center', margin: 20 }}>
                            <Text>{intendedState ? 'CLOSE' : 'OPEN'}</Text>
                            <Image style={styles.arrow} source={require('../../../assets/arrow-right.png')} />
                        </View>
                        {imageSelector(intendedState)}
                    </View>
                )
            ]
        }, []);
    }

    /**
     * Will generate an advice message based on the current state of the window
     * and door as well as the recommended state.
     *
     * @memberof NotificationOverlay
     */
    generateAdvice = () => {
        const {
            windowIsClosed,
            doorIsClosed,
            shouldWindowBeClosed,
            shouldDoorBeClosed
        } = this.state.notification.data;

        if (windowIsClosed !== shouldWindowBeClosed
            && doorIsClosed !== shouldDoorBeClosed) {
                return `Please ${shouldWindowBeClosed ? 'close' : 'open'} the window and ${shouldDoorBeClosed ? 'close' : 'open'} the door.`;
        } else if (windowIsClosed !== shouldWindowBeClosed) {
            return `Please ${shouldWindowBeClosed ? 'close' : 'open'} the window.`;
        } else if (doorIsClosed !== shouldDoorBeClosed) {
            return `Please ${shouldDoorBeClosed ? 'close' : 'open'} the door.`;
        } else {
            return "Please follow the given advice."
        }
    }

    render() {
        if (!this.state.notification.message) {
            return null;
        } else if (this.state.notificationIsRejected) {
            return (
                <BlurView style={styles.overlay} intensity={90}>
                    <SafeAreaView style={{flex: 1}}>
                        <View style={styles.container}>
                            <FeedbackPrompt 
                                onSkip={this.sendRejectedFeedback}
                                onSubmit={this.sendRejectedFeedback}
                            />
                        </View>
                    </SafeAreaView>
                </BlurView>
            );
        }

        return (
            <BlurView style={styles.overlay} intensity={90}>
                <SafeAreaView style={{flex: 1}}>
                    <View style={styles.container}>
                        <View />
                        <View style={styles.message}>
                            <View style={styles.visualisation}>
                                {this.renderIllustration()}
                            </View>
                            <View>
                                <Text style={styles.text}>{this.state.notification.message}</Text>
                                <Text style={styles.text}>
                                    {this.generateAdvice()}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.response}>
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={this.close}
                            >
                                <Text style={{ color: Colors.blue, fontWeight: '600', fontSize: 16 }}>Sure</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={this.reject}
                            >
                                <Text style={{ color: Colors.red, fontWeight: '600', fontSize: 16 }}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.button, styles.lastButton]}
                                onPress={this.skip}
                            >
                                <Text style={{ color: Colors.grey.normal, fontSize: 16 }}>I'm not at home...</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </BlurView>
        );
    }
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        padding: 15,
    },
    message: { 
        borderWidth: 1,
        borderColor: Colors.grey.light,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    response: {
        borderWidth: 1,
        borderColor: Colors.grey.light,
        backgroundColor: 'white',
        borderRadius: 10,
    },
    button: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
        padding: 20,
        alignItems: 'center'
    },
    lastButton: {
        borderBottomWidth: 0,
    },
    visualisation: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
        alignItems: 'center',
        flex: 0,
        padding: 20,
    },
    text: {
        padding: 15,
        textAlign: 'center',
    },
    arrow: {
        resizeMode: 'contain',
        width: 40,
        height: 40,
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'center',
        flex: 0,
    }
});

export default NotificationOverlay;