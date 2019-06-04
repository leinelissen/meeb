import React, { Component } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, Button, ScrollView } from 'react-native';
import axios from 'axios';
import { Constants } from 'expo';
import { Colors } from '../../styles';
import { BACKEND_ENDPOINT } from '../../env';
import AsyncErrorHandler from '../../helpers/AsyncErrorHandler';

class Feedback extends Component {
    /**
     * The default state
     *
     * @memberof Feedback
     */
    state = {
        // The message that is currently being composed
        message: null,
    }

    /**
     * Update the state with the new message
     *
     * @memberof Feedback
     */
    handleChangeMessage = message => this.setState({ message });

    /**
     * Send the feedback to the backend
     *
     * @memberof Feedback
     */
    sendFeedback = () => {
        // Send message
        return axios.put(BACKEND_ENDPOINT + 'feedback', {
            ...this.state,
            device_uuid: Constants.installationId,
        })
        .then(data => console.log(JSON.stringify(data)))
        // Clear state
        .then(() => this.setState({ message: null }))
        .catch(AsyncErrorHandler);
    }

    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.bottomBorder}>
                        <Text style={styles.heading}>{this.props.screenProps.name}</Text>
                    </View>
                    <View style={styles.question}>
                        <Text>How did you feel about the indoor air quality today?</Text>
                    </View>
                    <View style={styles.bottomBorder}>
                        <TextInput 
                            style={styles.input}
                            value={this.state.message}
                            onChangeText={this.handleChangeMessage}
                            placeholder="Type your message..."
                            multiline
                            editable
                        />
                    </View>
                    <View style={styles.button}>
                        <Button title="Send" onPress={this.sendFeedback} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    heading: {
        fontSize: 20,
        padding: 20,
    },
    label: {
        fontSize: 10,
        color: Colors.grey.normal,
        padding: 10,
        paddingLeft: 20,
    },
    question: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
    },
    input: {
        minHeight: 100,
        padding: 20,
        marginTop: 20,
    },
    button: {
        marginTop: 20,
    }
});

export default Feedback;