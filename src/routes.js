import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import {
    createBottomTabNavigator,
    createMaterialTopTabNavigator,
} from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import Icon from 'react-native-vector-icons/MaterialIcons';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

export default (signedIn = false) =>
    createAppContainer(
        createSwitchNavigator(
            {
                Sign: createSwitchNavigator({
                    SignIn,
                    SignUp,
                }),
                App: createMaterialTopTabNavigator(
                    {
                        Posts: {
                            screen: createStackNavigator(
                                {
                                    Dashboard,
                                },
                                {
                                    defaultNavigationOptions: {
                                        headerTransparent: true,
                                        headerTintColor: '#FFF',
                                        headerLeftContainerStyle: {
                                            marginLeft: 20,
                                        },
                                    },
                                }
                            ),
                        },
                        Profile,
                    },
                    {
                        resetOnBlur: true,
                        tabBarOptions: {
                            keyboardHidesTabBar: true,
                            activeTintColor: '#FFF',
                            inactiveTintColor: 'rgba(255, 255, 255, 0.6)',
                            style: {
                                backgroundColor: '#8d41a8',
                            },
                        },
                    }
                ),
            },
            {
                initialRouteName: signedIn ? 'App' : 'Sign',
            }
        )
    );
