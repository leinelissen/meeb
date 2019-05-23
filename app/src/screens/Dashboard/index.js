import React, { Component } from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import { ScreenOrientation } from 'expo';
import { OOCSI_CHANNEL } from '../../env';
import OOCSI from '../../lib/OOCSI';
import { Colors } from '../../styles';

import Residents from './components/Residents';
import Message from './components/Message';
import Graphs from './components/Graphs';
import ActionOutput from './components/ActionOutput';

class Dashboard extends Component {
    state = {
        co2: null,
        temperature: null,
        doorIsClosed: null,
        windowIsClosed: null,
    }

    constructor() {
        super();

        // Override screen orientation to be sideways
        ScreenOrientation.allow(ScreenOrientation.Orientation.LANDSCAPE);
    }

    componentDidMount() {
        OOCSI.connect('wss://oocsi.id.tue.nl/ws');
        OOCSI.subscribe(OOCSI_CHANNEL, this.handleOOCSIMessage);
    }

    /**
     * Handle an incoming OOCSI message. We store its results in the state
     *
     * @memberof Dashboard
     */
    handleOOCSIMessage = ({ data }) => {
        // Do a check if all the data is there
        if ("eco2" in data
            && "temperature" in data
            && "doorIsClosed" in data
            && "windowIsClosed" in data) {
                // Then update the state
                this.setState({
                    co2: data.eco2,
                    temperature: data.temperature,
                    doorIsClosed: data.doorIsClosed,
                    windowIsClosed: data.windowIsClosed,
                });
        }
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Message {...this.state} />
                <View style={styles.splitView}>
                    <View style={styles.sideBar}>
                        <Residents co2={this.state.co2} temperature={this.state.temperature} />
                    </View>
                    <View style={styles.main}>
                        <Graphs co2={this.state.co2} temperature={this.state.temperature} />
                        <View style={styles.divider} />
                        <ActionOutput doorIsClosed={this.state.doorIsClosed} windowIsClosed={this.state.windowIsClosed} />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    splitView: {
        flexDirection: 'row',
        flex: 1,
    },
    sideBar: {
        width: '30%',
        borderRightWidth: 1,
        borderRightColor: Colors.grey.light,
    },
    main: {
        justifyContent: 'space-around',
        flex: 1,
    }, 
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.grey.light,
    }
});

export default Dashboard;