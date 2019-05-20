import React, { PureComponent } from 'react';
import axios from 'axios';
import { Constants } from 'expo';
import { debounce } from 'lodash';
import { AsyncStorage } from 'react-native';
import {
    Text,
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Picker,
    Slider
} from 'react-native';
import { Colors } from '../../styles';

/**
 * These variables hlep define the range of temperatures that are shown in the
 * slider. They start at TEMPERATURE_START and move with increments of
 * TEMPERATURE_STEP to TEMPERATURE_END
 */
const TEMPERATURE_START = 16;
const TEMPERATURE_END = 25;
const TEMPERATURE_STEP = 0.5;

/**
 * The same thing goes for the CO2 level.
 */
const CO2_START = 400;
const CO2_END = 5000;
const CO2_STEP = 100;

class Preferences extends PureComponent {
    /**
     * The default state
     *
     * @memberof Preferences
     */
    state = {
        // The preferred temperature
        temperature: 21,
        // The preferred CO2 level
        co2: 1000,
        // Whether the CO2 preference is more important than the temperature
        // preference. 0 = Temperature, 1 = CO2
        temperature_co2_importance: 0.5,
    };

    /**
     * Generate the Picker items for the Temperature picker
     *
     * @returns Array
     * @memberof Preferences
     */
    generateTemperatureItems() {
        // Calculate the amount of iterations required
        const iterations = (TEMPERATURE_END - TEMPERATURE_START) / TEMPERATURE_STEP + 1;

        // Construct a new array given the number of iterations
        return [...new Array(iterations)].map((x, i) => 
            <Picker.Item 
                key={i}
                label={`${i * TEMPERATURE_STEP + TEMPERATURE_START} °C`}
                value={i * TEMPERATURE_STEP + TEMPERATURE_START}
            />
        );
    }

    /**
     * Generate the Picker items for the CO2 level picker
     *
     * @returns Array
     * @memberof Preferences
     */
    generateCO2Items() {
        // Calculate the amount of iterations required
        const iterations = (CO2_END - CO2_START) / CO2_STEP + 1;

        // Construct a new array given the number of iterations
        return [...new Array(iterations)].map((x, i) => 
            <Picker.Item 
                key={i}
                label={`${i * CO2_STEP + CO2_START} ppm`}
                value={i * CO2_STEP + CO2_START}
            />
        );
    }

    /**
     * Change the currently preferred temperature
     *
     * @memberof Preferences
     */
    handleChangeTemperature = temperature => this.setState({ temperature });

    /**
     * Change the currently preferred CO2 level
     *
     * @memberof Preferences
     */
    handleChangeCO2 = co2 => this.setState({ co2 });

    /**
     * Change the preferred importance
     *
     * @memberof Preferences
     */
    handleChangePreferenceImportance = temperature_co2_importance => this.setState({ temperature_co2_importance });

    /**
     * Try to retrieve the persisted data from AsyncStorage so that we can use it
     *
     * @memberof Preferences
     */
    componentDidMount() {
        // Try to retrieve state from storage
        AsyncStorage.getItem('preferences_state')
            .then(data => {
                console.log(data);
                // If there is not data, we dont have to do anything
                if (!data) {
                    return;
                }

                // Parse the JSON data
                const state = JSON.parse(data);

                // Set the new state
                return this.setState(state);
            })
            .catch(console.error);
    }

    /**
     * This function is executed whenever the component data is updated. 
     * NOTE: Because the component is a PureComponent, the callback will only be
     * called whenever the state data actually changes. 
     *
     * @memberof Preferences
     */
    componentDidUpdate() {
        debounce(this.savePreferences, 1000);
        AsyncStorage.setItem('preferences_state', JSON.stringify(this.state));
    }

    /**
     * This code writes the preferences to the backend
     *
     * @memberof Preferences
     */
    savePreferences = () => {
        return axios.put(process.env.BACKEND_ENDPOINT + 'preferences', {
            ...this.state,
            device_uuid: Constants.installationId,
        }).catch(console.error);
    }

    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={styles.bottomBorder}>
                        <Text style={styles.heading}>Lianne</Text>
                    </View>
                    <View style={styles.lineBreak} />
                    <View style={styles.bottomBorder}>
                        <Text style={styles.label}>PREFERRED INDOOR TEMPERATURE</Text>
                    </View>
                    <View style={styles.bottomBorder}>
                        <Picker 
                            selectedValue={this.state.temperature}
                            onValueChange={this.handleChangeTemperature}
                        >
                            {this.generateTemperatureItems()}
                        </Picker>
                    </View>
                    <View style={styles.lineBreak} />
                    <View style={styles.bottomBorder}>
                        <Text style={styles.label}>PREFERRED CO₂ LEVEL</Text>
                    </View>
                    <View style={styles.bottomBorder}>
                        <Picker 
                            selectedValue={this.state.co2}
                            onValueChange={this.handleChangeCO2}
                        >
                            {this.generateCO2Items()}
                        </Picker>
                    </View>
                    <View style={styles.lineBreak} />
                    <View style={styles.bottomBorder}>
                        <Text style={styles.label}>PREFERENCE IMPORTANCE</Text>
                    </View>
                    <View style={styles.slider}>
                        <View style={styles.sliderLabels}>
                            <Text>Temperature</Text>
                            <Text>CO₂</Text>
                        </View>
                        <Slider 
                            minimumValue={0} 
                            maximumValue={1} 
                            step={0.1} 
                            minimumTrackTintColor={Colors.blue}
                            value={this.state.temperature_co2_importance}
                            onValueChange={this.handleChangePreferenceImportance}
                        />
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
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
    },
    slider: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
        padding: 20,
        position: 'relative',
    },
    sliderLabels: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    lineBreak: {
        marginBottom: 25,
    }
});

export default Preferences;