import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Chat">
      <Drawer.Screen name="Chat" component={ChatScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
