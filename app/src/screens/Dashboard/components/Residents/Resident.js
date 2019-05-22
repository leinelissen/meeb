import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../../styles';

// This is the mapping for the CO2 values. The form for this is 
// [threshold, output]
const co2Mapping = [
    [50, "😁"],
    [250, "😀"],
    [500, "🙂"],
    [1000, "😐"],
    [2000, "🙁"],
    [null, "🙁"]
];

// The mapping for CO2 to points for the mixed result
const co2PointsMapping = [
    [50, 0],
    [250, 1],
    [500, 2],
    [1000, 3],
    [2000, 4],
    [null, 5]
]

// The temperature mapping
const temperatureMapping = [
    [1, "😁"],
    [2, "😀"],
    [3, "🙂"],
    [4, "😐"],
    [5, "🙁"],
    [null, "🙁"]
];

/**
 * Select a result from a mapping using a given value
 *
 * @param {*} value The given value
 * @param {Array[[],[]]} mapping The mapping that we will examine
 * @returns String
 */
function selectMappedValue(value, mapping) {
    // Reduce the given mapping
    // NOTE: A mapping should come in the form of [[threshold, ouput]]
    return mapping.reduce((result, [threshold, output]) => {
        // Check if the result has already been set, if it is, return it again
        if (result !== null) {
            return result;
        // If it has not, we'll check if the value doesn't exceed the threshold.
        // Also check if the threshold is null, in which case we've reached the
        // end of the array
        } else if (value <= threshold || threshold === null) {
            return output;
        }

        // If none of the above is true, return the result to the next iteration
        return result;
    }, null);
}

/**
 * Render an inidividual resident
 *
 * @param {*} { name, latest_preferences }
 * @returns React.Component
 */
function Resident({ name, latest_preferences, co2, temperature }) {
    if (!latest_preferences || !latest_preferences.co2 || !latest_preferences.temperature || !co2 || !temperature) {
        // Disable rendering if there are no preferences yet, so we don't crash
        // the application unneccessarily.
        return null;
    }

    // Set a default emoji, for when any of the logic fails.
    var emoji = "🙂";

    // Split our emoji-selecting logic into three branches. We have simplified
    // the importance slider into three points: < 0.5, 0.5 and > 0.5. This will
    // take into account the temperature, both or the co2 respectively.
    if (latest_preferences.temperature_co2_importance > 0.5) {
        // Determine the difference between the preferred CO2 level and the
        // current level
        const diff = Math.abs(latest_preferences.co2 - co2);

        // Then use this value to select the right emoji
        emoji = selectMappedValue(diff, co2Mapping);
    } else if (latest_preferences.temperature_co2_importance < 0.5) {
        // Calculate the absolute temperature difference
        const diff = Math.abs(latest_preferences.temperature - temperature);

        // Select the correct emoji
        emoji = selectMappedValue(diff, temperatureMapping);
    } else {
        // We calculate temperature "points" by calculating the difference in
        // preferred and actual temperature
        const temperaturePoints = Math.abs(latest_preferences.temperature - temperature);
        
        // We the calculate the CO2 difference...
        const co2Diff = Math.abs(latest_preferences.co2 - co2);
        // ...and throw it into a mapping of its own
        const co2Points = selectMappedValue(co2Diff, co2PointsMapping);

        // The final point amount is the mean of the two
        const totalPoints = (temperaturePoints + co2Points) / 2;

        // We use this to select an emoji
        emoji = selectMappedValue(totalPoints, temperatureMapping);
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.preferences}>
                    {latest_preferences.temperature}°C / {latest_preferences.co2} ppm
                </Text>
            </View>
            <Text style={styles.mood}>{emoji}</Text>
        </View>    
    );
}

const styles = StyleSheet.create({
    name: {
        fontSize: 20,
        marginBottom: 10,
    },
    preferences: {
        fontSize: 20,
        color: Colors.grey.normal,
    },
    mood: {
        fontSize: 24,
    },
    container: {
        marginLeft: 20,
        paddingTop: 15,
        paddingBottom: 15,
        paddingRight: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
        display: 'flex',     
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default Resident;