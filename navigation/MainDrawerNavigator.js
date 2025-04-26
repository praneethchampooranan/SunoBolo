import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator(props) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(drawerProps) => <CustomDrawerContent {...drawerProps} user={props?.user} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: 'transparent', width: 300 },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Chat" component={ChatScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
