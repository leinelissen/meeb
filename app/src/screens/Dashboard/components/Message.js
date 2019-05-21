import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../styles';

class Message extends Component {
    getMiepMessage = () => {
        const { 
            temperature,
            co2,
            windowIsOpen,
            windowIsClosed
        } = this.props;
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Miep says: "{this.getMiepMessage()}"</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
    },
    text: {
        fontSize: 25,
    }
});

export default Message;