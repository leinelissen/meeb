import React, { Component } from 'react';
import axios from 'axios';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../styles';

class Residents extends Component {
    state = {
        residents: []
    }

    componentDidMount() {
        // Do a base fetch for all data
        this.fetchData();

        // Then also refetch the data every 30 seconds, so that it doesnt stray
        // from reality too much
        setInterval(this.fetchData, 30000);
    }

    /**
     * Fetch all the data from the residents from the backend and store in in
     * the state.
     *
     * @memberof Residents
     */
    fetchData = () => {
        return axios.get(process.env.BACKEND_ENDPOINT + 'preferences')
            .then(({ data: residents }) => {
                this.setState({ residents })
            })
            .catch(console.error);
    }

    render() {
        return (
            <View>
                {this.state.residents.map(props =>
                    <Resident {...props} key={props.id} />
                )}
            </View>
        );
    }
}

/**
 * Render an inidividual resident
 *
 * @param {*} { name, latest_preferences }
 * @returns React.Component
 */
function Resident({ name, latest_preferences }) {
    if (!latest_preferences || !latest_preferences.co2 || !latest_preferences.temperature) {
        // Disable rendering if there are no preferences yet, so we don't crash
        // the application unneccessarily.
        return null;
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.preferences}>
                    {latest_preferences.temperature}°C / {latest_preferences.co2} ppm
                </Text>
            </View>
            <Text style={styles.mood}>🙂</Text>
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

export default Residents;