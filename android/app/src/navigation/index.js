import * as React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import Routes from './Routes';
import { AuthProvider } from './AuthProvider';

export default function Index() {
    return(
        <PaperProvider>
            <AuthProvider>
                < Routes />
            </AuthProvider>
        </PaperProvider>
    )
}