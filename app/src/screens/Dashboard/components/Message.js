import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../../../styles';

class Message extends Component {
    getMiepMessage = () => {
        const { 
            temperature,
            co2,
            doorIsClosed,
            windowIsClosed
        } = this.props;
        
        if (temperature < 18 && co2 < 1000) {
            return windowIsClosed && doorIsClosed
                ? "The air quality is good, however it is quite cold. You might want to adjust the thermostat"
                : "The air quality is good, however it is quite cold. It might be better to close all doors and windows and adjust the thermostat.";
        } else if (temperature < 20 && co2 < 1000) {
            return windowIsClosed && doorIsClosed
                ? "The air quality is good, however it is a bit cold. It might be better to close all doors and windows."
                : "The air quality is good, however it is a bit cold. It might be better to close all doors and windows.";
        } else if (temperature < 22 && co2 < 1000) {
            return !windowIsClosed && doorIsClosed
                ? "The air quality is good, however it is quite warm."
                : "The air quality is good, however it is quite warm. It might be better to open a window.";
        } else if (temperature > 22 && co2 < 1000) {
            return !windowIsClosed && !doorIsClosed
                ? "The temperature is higher than it should be."
                : "The temperature is higher than it should be, you should open some doors and windows.";
        } else if (temperature < 18 && co2 < 2000) {
            return windowIsClosed && doorIsClosed
                ? "Although it is quite cold, you could try to open the doors to other rooms in order to improve the air quality"
                : "Although it is quite cold, you could try to open the doors to other rooms in order to improve the air quality";
        } else if (temperature < 20 && co2 < 2000) {
            return !windowIsClosed && doorIsClosed
                ? "Both the temperature and the air quality would benefit from some fresh air."
                : "The room would benefit from some fresh are, you should open the window.";
        } else if (temperature < 22 && co2 < 2000) {
            return !windowIsClosed && doorIsClosed
                ? "Both the temperatue and the CO2 level are quite high."
                : "Both the temperatue and the CO2 level are quite high, you should really open a window.";
        } else if (temperature > 22 && co2 < 2000) {
            return !windowIsClosed && !doorIsClosed
                ? "The current CO2 level is associated with complaints of drowsiness and poor air."
                : "The current CO2 level is associated with complaints of drowsiness and poor air. Both the door and window should be opened";
        } else if (temperature < 18 && co2 < 5000) {
            return windowIsClosed && doorIsClosed
                ? "Although it is quite cold, you should really try to open inside doors and maybe a small window to improve the air quality "
                : "Although the CO2 level is quite high, for a healthy room temperature it would be better to open only inside doors.";
        } else if (temperature < 20 && co2 < 5000) {
            return !windowIsClosed && doorIsClosed
                ? "The current CO2 level is associated with headaches and sleepiness."
                : "The current CO2 level is associated with headaches and sleepiness. It would be better to open a window.";
        } else if (temperature < 22 && co2 < 5000) {
            return windowIsClosed && doorIsClosed
                ? "Both the temperature and the CO2 level are slightly higher than they should be."
                : "Both the temperature and the CO2 level are slightly higher than they should be, the door and the window should be open";
        } else if (temperature > 22 && co2 < 5000) {
            return !windowIsClosed && !doorIsClosed
                ? "Your inside air quality isn't looking good! Is there anything else you can open?"
                : "Your inside air quality isn't looking good! Try to open as much as possible";
        } else if (temperature < 18 && co2 > 5000) {
            return windowIsClosed && !doorIsClosed
                ? "The measured CO2 level indicate unusual air conditions, the open window should help to lower it."
                : "The measured CO2 level indicate unusual air conditions, you might want to open a window to avoid a headache.";
        } else if (temperature < 20 && co2 > 5000) {
            return !windowIsClosed && !doorIsClosed
                ? "The measured CO2 level indicate unusual air conditions where high levels of other gases also could be present. If it doesn't change quickly you might want to leave the room. "
                : "You have a CO2 problem! Both the window and door should be open";
        } else if (temperature < 22 && co2 > 5000) {
            return !windowIsClosed && !doorIsClosed
                ? "The living conditions in this room are really bad, you should really consider going somewhere else."
                : "The living conditions in this room are really bad, both the window and door should be opened";
        } else if (temperature > 22 && co2 > 5000) {
            return !windowIsClosed && !doorIsClosed
                ? "Your inside air quality is REALLY, REALLY bad! Leave everything open, close the blinds and try to go somewhere else."
                : "Your inside air quality is REALLY, REALLY bad! You should open all doors and windows and try to go somewhere else.";
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