import React from 'react';
import { AlertIOS } from 'react-native';

function NamePrompt({ onNameSelected }) {
    AlertIOS.prompt('Enter your name', null, onNameSelected);

    return null;
}
export default NamePrompt;