import React, { Component } from 'react';
import axios from 'axios';
import { View } from 'react-native';
import Resident from './Resident';

class Residents extends Component {
    state = {
        residents: []
    }

    componentDidMount() {
        // Do a base fetch for all data
        this.fetchData();

        // Then also refetch the data every 30 seconds, so that it doesnt stray
        // from reality too much
        setInterval(this.fetchData, 5000);
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
                    <Resident {...this.props} {...props} key={props.id} />
                )}
            </View>
        );
    }
}

export default Residents;