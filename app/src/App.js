import React from 'react';
import { Platform } from 'react-native';
import Dashboard from './screens/Dashboard';
import Remote from './screens/Remote';

export default () => {
    return Platform.isPad
        ? <Dashboard />
        : <Remote />;
};