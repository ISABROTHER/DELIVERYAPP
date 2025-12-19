import React, { useState, useEffect } from 'react';
import { Tabs } from 'expo-router';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  Keyboard,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Send, User } from 'lucide-react-native';
import { SendParcelProvider, useSendParcel } from './send/context/SendParcelContext';

const GREEN = '#34B67A';
const INACTIVE = '#8E8E93';
const BAR_BG = 'rgba(255,255,255,0.92)';
const BAR_BORDER = 'rgba(229,229,234,0.9)';

function ModernTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { currentStep } = useSendParcel();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const focusedRoute = state.routes[state.index];
  const focusedRouteName = focusedRoute.name;

  useEffect(() => {
    const showSub = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide', () => setKeyboardVisible(false));
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  // Hide tab bar if keyboard is up OR if we are past Step 1 in the Send flow
  if (isKeyboardVisible || (focusedRouteName === 'send' && currentStep > 1)) {
    return null;
  }

  return (
    <View style={styles.tabBarWrap}>
      <View pointerEvents="none" style={styles.tabBarSurface} />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const color = focused ? GREEN : INACTIVE;
          const icon = options.tabBarIcon?.({ focused, color, size: 22 }) ?? null;

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.item}
            >
              <View style={[styles.iconCapsule, focused && styles.iconCapsuleActive]}>{icon}</View>
              <Text style={[styles.label, { color }]}>{typeof label === 'string' ? label : route.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <SendParcelProvider>
      <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <ModernTabBar {...props} />}>
        <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home size={22} color={color} /> }} />
        <Tabs.Screen name="send" options={{ title: 'Send', tabBarIcon: ({ color }) => <Send size={22} color={color} /> }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <User size={22} color={color} /> }} />
      </Tabs>
    </SendParcelProvider>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: { height: 78, paddingTop: 8, paddingBottom: Platform.OS === 'ios' ? 14 : 12 },
  tabBarSurface: { ...StyleSheet.absoluteFillObject, backgroundColor: BAR_BG, borderTopWidth: 1, borderTopColor: BAR_BORDER },
  row: { flex: 1, flexDirection: 'row' },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconCapsule: { width: 46, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  iconCapsuleActive: { backgroundColor: 'rgba(52,182,122,0.14)', borderWidth: 1, borderColor: 'rgba(52,182,122,0.22)' },
  label: { fontSize: 11.5, fontWeight: '800' },
});