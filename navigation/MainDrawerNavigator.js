import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ArchiveChatsScreen from '../screens/ArchiveChatsScreen';
import DataControlScreen from '../screens/DataControlScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function MainDrawerNavigator(props) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(drawerProps) => <CustomDrawerContent {...drawerProps} user={props?.user} setChats={props.setChats} setArchivedChats={props.setArchivedChats} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: 'transparent', width: 300 },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Chat" component={ChatScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="ArchiveChatsScreen" component={ArchiveChatsScreen} />
      <Drawer.Screen name="ArchivedChatViewScreen" component={require('../screens/ArchivedChatViewScreen').default} />
      <Drawer.Screen name="DataControlScreen" component={DataControlScreen} />
    </Drawer.Navigator>
  );
}
