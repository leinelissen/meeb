import React, { Component } from 'react';
import { TextInput, Button, View, StyleSheet, Text } from 'react-native';
import { Colors } from '../../../styles';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.normal,
        minWidth: 200,
        margin: 50,
    }
});

class NamePrompt extends Component {
    state = {
        name: null,
    }

    handleNameChange = name => this.setState({ name });

    submit = () => this.props.onNameSelected(this.state.name);

    render() {
        return (
            <View style={styles.container}>
                <Text>Please enter your name:</Text>
                <TextInput 
                    style={styles.input}
                    value={this.state.name}
                    onChangeText={this.handleNameChange}
                />
                <Button 
                    title="submit" 
                    onPress={this.submit} 
                    disabled={!this.state.name || !this.state.name.length}
                />
            </View>
        )
    }
}

export default NamePrompt;