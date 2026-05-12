import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/useAuthStore';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import EventsScreen from '../screens/Events/EventsScreen';
import EventEditScreen from '../screens/Events/EventEditScreen';
import DiscoverScreen from '../screens/Discover/DiscoverScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import RelationScreen from '../screens/Relation/RelationScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: '首页' }} />
      <Tab.Screen name="Events" component={EventsScreen} options={{ title: '纪念日' }} />
      <Tab.Screen name="Discover" component={DiscoverScreen} options={{ title: '发现' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '我的' }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="EventEdit" component={EventEditScreen} options={{ headerShown: true, title: '编辑纪念日' }} />
            <Stack.Screen name="Relation" component={RelationScreen} options={{ headerShown: true, title: '绑定伴侣' }} />
            <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: true, title: '通知中心' }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
