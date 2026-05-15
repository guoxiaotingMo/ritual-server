import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import { Theme } from '../theme';
import { ToastProvider } from '../components/Toast';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import EventsScreen from '../screens/Events/EventsScreen';
import EventEditScreen from '../screens/Events/EventEditScreen';
import DiscoverScreen from '../screens/Discover/DiscoverScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import RelationScreen from '../screens/Relation/RelationScreen';
import ProfileEditScreen from '../screens/Profile/ProfileEditScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabItems = [
  { name: 'Home', label: '首页', icon: 'HOME', activeIcon: 'HOME' },
  { name: 'Events', label: '纪念日', icon: 'EVENT', activeIcon: 'EVENT' },
  { name: 'Discover', label: '发现', icon: 'FIND', activeIcon: 'FIND' },
  { name: 'Profile', label: '我的', icon: 'ME', activeIcon: 'ME' },
] as const;

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#FF6B9D',
    background: '#F5F3FF',
    card: '#FFFFFF',
    text: '#1E1B4B',
    border: 'rgba(139, 92, 246, 0.08)',
    notification: '#FF6B9D',
  },
};

const darkHeaderConfig = {
  headerStyle: {
    backgroundColor: '#FFFFFF',
  },
  headerTintColor: '#1E1B4B',
  headerTitleStyle: {
    color: '#1E1B4B',
  },
  headerShadowVisible: false,
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tabItem = tabItems.find((t) => t.name === route.name);
        return {
          headerShown: true,
          headerStyle: {
            backgroundColor: Theme.colors.background,
          },
          headerTitleStyle: {
            color: Theme.colors.text,
            fontWeight: '800',
            fontSize: Theme.fontSize.lg,
          },
          headerTintColor: Theme.colors.text,
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: Theme.colors.borderLight,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
            paddingTop: 4,
          },
          tabBarActiveTintColor: '#FF6B9D',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: {
            fontSize: Theme.fontSize.xs,
            fontWeight: '700',
          },
          tabBarIcon: ({ focused, color, size }) => {
            const iconText = tabItem?.icon || '';
            return (
              <Text style={[styles.tabIcon, { color }]}>
                {iconText}
              </Text>
            );
          },
        };
      }}
    >
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
    <ToastProvider>
      <NavigationContainer theme={CustomDarkTheme}>
        <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: Theme.colors.background,
          },
          headerTitleStyle: {
            color: Theme.colors.text,
            fontWeight: '800',
          },
          headerTintColor: Theme.colors.text,
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: Theme.colors.background,
          },
          animation: 'slide_from_right',
        }}
      >
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="EventEdit"
              component={EventEditScreen}
              options={{
                headerShown: true,
                title: '编辑纪念日',
                headerStyle: {
                  backgroundColor: Theme.colors.background,
                },
                headerTitleStyle: {
                  color: Theme.colors.text,
                  fontWeight: '800',
                },
                headerTintColor: Theme.colors.text,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="Relation"
              component={RelationScreen}
              options={{
                headerShown: true,
                title: '绑定伴侣',
                headerStyle: {
                  backgroundColor: Theme.colors.background,
                },
                headerTitleStyle: {
                  color: Theme.colors.text,
                  fontWeight: '800',
                },
                headerTintColor: Theme.colors.text,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen name="ProfileEdit" component={ProfileEditScreen} options={{ headerTitle: '编辑资料', ...darkHeaderConfig }} />
            <Stack.Screen
              name="Notification"
              component={NotificationScreen}
              options={{
                headerShown: true,
                title: '通知中心',
                headerStyle: {
                  backgroundColor: Theme.colors.background,
                },
                headerTitleStyle: {
                  color: Theme.colors.text,
                  fontWeight: '800',
                },
                headerTintColor: Theme.colors.text,
                headerShadowVisible: false,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  tabIcon: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
