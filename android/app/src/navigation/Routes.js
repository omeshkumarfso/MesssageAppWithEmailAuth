import React from 'react';
import AuthStack from './AuthStack';
import {NavigationContainer} from '@react-navigation/native';

export default function Routes() {
    return(
        <NavigationContainer>
            < AuthStack />
        </NavigationContainer>
    )
}