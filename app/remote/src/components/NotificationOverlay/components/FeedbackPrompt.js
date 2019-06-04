import React, { Component } from 'react';
import { TextInput, Button, View, StyleSheet, Text } from 'react-native';
import { Colors } from '../../../styles';

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.grey.light,
        borderRadius: 10,
        marginTop: 'auto',
        marginBottom: 'auto'
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
        borderTopWidth: 1,
        borderTopColor: Colors.grey.light,
        width: '100%',
        minHeight: 40,
        padding: 20,

    },
    buttons: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        padding: 10,
        flex: 1,
    },
    buttonBorderRight: {
        borderRightWidth: 1,
        borderRightColor: Colors.grey.light,    
    }
});

class FeedbackPrompt extends Component {
    state = {
        feedback: null,
    }

    /**
     * Placeholder for the input ref, so that we can directly focus the input field
     *
     * @memberof FeedbackPrompt
     */
    input = null;

    /**
     * Handler for input
     *
     * @memberof FeedbackPrompt
     */
    handleFeedbackChange = feedback => this.setState({ feedback });

    /**
     * Handler for the submit button
     *
     * @memberof FeedbackPrompt
     */
    submit = () => this.state.feedback && this.state.feedback.length
        ? this.props.onSubmit(this.state.feedback)
        : this.props.onSkip();

    /**
     * Handler for the skip button
     *
     * @memberof FeedbackPrompt
     */
    skip = () => this.props.onSkip();

    componentDidMount() {
        this.input.focus();
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ padding: 20 }}>
                    <Text style={{ textAlign: 'center' }}>
                        Could you please explain why you cannot follow Meeb’s advice?
                    </Text>
                </View>
                <TextInput 
                    style={styles.input}
                    value={this.state.feedback}
                    onChangeText={this.handleFeedbackChange}
                    onSubmitEditing={this.submit}
                    ref={(input) => this.input = input}
                    returnKeyType="done"
                />
                <View style={styles.buttons}>
                    <View style={[styles.button, styles.buttonBorderRight]}>
                        <Button 
                            title="Skip" 
                            onPress={this.skip} 
                            color={Colors.red}
                        />
                    </View>
                    <View style={styles.button}>
                        <Button 
                            title="Submit" 
                            onPress={this.submit} 
                            disabled={!this.state.feedback || !this.state.feedback.length}
                        />
                    </View>
                </View>
            </View>
        )
    }
}

export default FeedbackPrompt;