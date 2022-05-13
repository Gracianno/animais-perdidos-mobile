import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar } from 'react-native';
import './config/ReactotronConfig';
import { store, persistor } from './store';
import App from './App';

export default function Index() {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <StatusBar batStyle="light-content" backgroundColor="#4B0082" />
                <App />
            </PersistGate>
        </Provider>
    );
}
