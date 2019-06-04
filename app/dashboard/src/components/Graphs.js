import React from 'react';
import { ProgressCircle }  from 'react-native-svg-charts'
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { Colors } from '../styles';

const MIN_TEMPERATURE = 0;
const MAX_TEMPERATURE = 35;

const MIN_CO2 = 0;
const MAX_CO2 = 5000;

function Graphs({ co2, temperature }) {
    if(!co2 || !temperature) {
        return <ActivityIndicator />;
    }

    const temperatureProgress = (temperature - MIN_TEMPERATURE) / MAX_TEMPERATURE;
    const co2Progress = Math.min((co2 - MIN_CO2) / MAX_CO2, 1);

    return (
        <View style={styles.container}>
            <View style={styles.dataContainer}>
                <View style={styles.graph}>
                    <ProgressCircle
                        style={{ height: 200, flex: 0, width: 200 }}
                        progress={temperatureProgress}
                        progressColor={Colors.yellow}
                        startAngle={Math.PI * 1.25}
                        endAngle={Math.PI * 2.75}
                    />    
                    <View style={styles.overlay}>
                        <Text style={styles.text}>{temperature}</Text>
                        <Text style={styles.textSmall}>°C</Text>
                    </View>
                </View>
                <Text style={styles.textSmall}>Indoor temperature</Text>
            </View>
            <View style={styles.dataContainer}>
                <View style={styles.graph}>
                    <ProgressCircle
                        style={{ height: 200, flex: 0, width: 200 }}
                        progress={co2Progress}
                        progressColor={co2Progress < 1 ? Colors.blue : Colors.red}
                        startAngle={Math.PI * 1.25}
                        endAngle={Math.PI * 2.75}
                    />    
                    <View style={styles.overlay}>
                        <Text style={styles.text}>{co2}</Text>
                        <Text style={styles.textSmall}>ppm</Text>
                    </View>
                </View>
                <Text style={styles.textSmall}>Indoor CO₂ Level</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexGrow: 1,
        alignItems: 'center',
    },
    dataContainer: {
        alignItems: 'center',
    },
    graph: {
        position: 'relative',
        flex: 0,
        margin: 20,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 72,
        marginBottom: 10,
    },
    textSmall: {
        fontSize: 24,
    }
});

export default Graphs;