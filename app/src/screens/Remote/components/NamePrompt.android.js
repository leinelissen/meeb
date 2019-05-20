import React, { Component } from 'react';
import { TextInput, Button, View, StyleSheet, Text } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirecton: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

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
                    value={this.state.name}
                    onChangeText={this.handleNameChange}
                />
                <Button 
                    title="submit" 
                    onPress={this.submit} 
                    disabled={!this.state.name.length}
                />
            </View>
        )
    }
}

export default NamePrompt;