import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../../styles';

class Message extends Component {
    getMiepMessage = () => {
        const { 
            temperature,
            co2,
            windowIsOpen,
            windowIsClosed
        } = this.props;

        if (temperature < 18 && co2 < 1000) {
            return "All doors and windows should be closed";
        } else if (temperature < 20 && co2 < 1000) {
            return "It might be good to close all doors and window";
        } else if (temperature < 22 && co2 < 1000) {
            return "A window should be opened";
        } else if (temperature > 22 && co2 < 1000) {
            return "You should open the window and all indoor doors";
        } else if (temperature < 18 && co2 < 2000) {
            return "Try to open the doors to other rooms";
        } else if (temperature < 20 && co2 < 2000) {
            return "The window should be openend";
        } else if (temperature < 22 && co2 < 2000) {
            return "The window should be opened";
        } else if (temperature > 22 && co2 < 2000) {
            return "Both the door and window should be opened";
        } else if (temperature < 18 && co2 < 5000) {
            return "Open the inside doors and the kitchen window";
        } else if (temperature < 20 && co2 < 5000) {
            return "Open the door to outside";
        } else if (temperature < 22 && co2 < 5000) {
            return "Both the door and the window should be open";
        } else if (temperature > 22 && co2 < 5000) {
            return "Your inside air quality isn't looking good! Try to open as much as possible";
        } else if (temperature < 18 && co2 > 5000) {
            return "You might want to open a window to avoid a headache";
        } else if (temperature < 20 && co2 > 5000) {
            return "You have a CO2 problem! Both the window and door should be open";
        } else if (temperature < 22 && co2 > 5000) {
            return "You have a CO2 problem! Both the window and door should be open";
        } else if (temperature > 22 && co2 > 5000) {
            return "Your inside air quality is REALLY, REALLY bad! Open everything! You should also close the blinds";
        }
    }

    render() {
        if (!this.props.co2 || !this.props.temperature) {
            return <ActivityIndicator />;
        }

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