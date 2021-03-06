import React, { PureComponent } from 'react';
import { ActivityIndicator, View, StyleSheet, AsyncStorage } from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import axios from 'axios';
import { Constants, Notifications, Permissions } from 'expo';
import { BACKEND_ENDPOINT } from './env';

import Feedback from './screens/Feedback';
import Preferences from './screens/Preferences';
import NotificationOverlay from './components/NotificationOverlay';
import NamePrompt from './components/NamePrompt';
import AsyncErrorHandler from './helpers/AsyncErrorHandler';

const TabNavigator = createBottomTabNavigator({
    Preferences,
    Feedback
}, {
    tabBarOptions: {
        tabStyle: {
            justifyContent: 'center'
        },
        showIcon: false
    } 
});

const styles = StyleSheet.create({
    spinner: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    }
});

class Remote extends PureComponent {
    state = {
        initialised: false,
        registered: false,
        name: '',
    }

    static router = TabNavigator.router;

    componentDidMount() {
        AsyncStorage.getItem('remote_state')
            .then(data => {
                const state = JSON.parse(data);

                return this.setState({
                    ...state,
                    initialised: true,
                });
            });
    }

    componentDidUpdate() {
        return AsyncStorage.setItem('remote_state', JSON.stringify(this.state))
            .catch(console.error);
    }

    componentDidCatch(error) {
        console.error('CAUGHT ERROR', error);
    }

    /**
     * We need to ask for permissions in order to be able to show notifications.
     * We do this every time the app is run, so we never have to deal with it.
     *
     * @returns Promise
     * @memberof RoutineScreen
     */
    registerPushNotifications() {
        // Check if the device is real, since the function will throw an error
        // if it is run from a Simulator
        if (Constants.isDevice) {
            // Ask permissions for notifications
            return Permissions.askAsync(
                Permissions.NOTIFICATIONS,
                Permissions.USER_FACING_NOTIFICATIONS,
            // Then retrieve the the Push token
            ).then(() => Notifications.getExpoPushTokenAsync());
        }
        
        return new Promise.resolve();
    }

    register = name => {
        this.registerPushNotifications()
            .then(push_token => axios.put(BACKEND_ENDPOINT + 'devices', {
                name,
                push_token: Constants.isDevice ? push_token : '000000000000000000',
                device_uuid: Constants.installationId,
            }))
            .then(() => this.setState({
                name,
                registered: true,
            }))
            .catch(AsyncErrorHandler);
    }

    render() {
        if (!this.state.initialised) {
            return (
                <View style={styles.spinner}>
                    <ActivityIndicator />
                </View>
            );
        }

        if (!this.state.registered) {
            return <NamePrompt onNameSelected={this.register} />
        }

        return (
            <React.Fragment>
                <TabNavigator navigation={this.props.navigation} screenProps={{ name: this.state.name }} />
                <NotificationOverlay />
            </React.Fragment>
        );
    }
}

export default createAppContainer(Remote);