import React, { Component } from 'react';
import { Text, SafeAreaView, StyleSheet, View, TextInput, Button } from 'react-native';
import { Colors } from '../../styles';

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
        console.log(this.state.message);

        // Clear state
        this.setState({ message: null });
    }

    render() {
        return (
            <SafeAreaView>
                <View style={styles.bottomBorder}>
                    <Text style={styles.heading}>Lianne</Text>
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
        height: '60%',
        padding: 20,
        marginTop: 20,
    },
    button: {
        marginTop: 20,
    }
});

export default Feedback;