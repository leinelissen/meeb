import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../styles';

class Message extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Miep says: ""</Text>
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