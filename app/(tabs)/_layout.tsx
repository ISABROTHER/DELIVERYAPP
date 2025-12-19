import React from 'react';
import { Tabs } from 'expo-router';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Home, Send, User } from 'lucide-react-native';
import { SendParcelProvider, useSendParcel } from './send/context/SendParcelContext';

const GREEN = '#34B67A';
const INACTIVE = '#8E8E93';
const BAR_BG = 'rgba(255,255,255,0.92)';
const BAR_BORDER = 'rgba(229,229,234,0.9)';

function ModernTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  // We NO LONGER hide the tab bar. The buttons will always be there.
  return (
    <View style={styles.tabBarWrap} accessibilityRole="tablist">
      <View pointerEvents="none" style={styles.tabBarSurface} />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;
          const color = focused ? GREEN : INACTIVE;
          const icon = options.tabBarIcon?.({ focused, color, size: 22 }) ?? null;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) { navigation.navigate(route.name); }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={({ pressed }) => [styles.item, pressed ? styles.itemPressed : null]}
            >
              <View style={[styles.iconCapsule, focused ? styles.iconCapsuleActive : null]}>
                {icon}
              </View>
              <Text style={[styles.label, focused ? styles.labelActive : styles.labelIdle]}>
                {typeof label === 'string' ? label : route.name}
              </Text>
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
      <Tabs
        screenOptions={{ headerShown: false, tabBarActiveTintColor: GREEN, tabBarInactiveTintColor: INACTIVE }}
        tabBar={(props) => <ModernTabBar {...props} />}
      >
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
  itemPressed: { opacity: 0.9 },
  iconCapsule: { width: 46, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  iconCapsuleActive: { backgroundColor: 'rgba(52,182,122,0.14)', borderWidth: 1, borderColor: 'rgba(52,182,122,0.22)' },
  label: { fontSize: 11.5, fontWeight: '800' },
  labelActive: { color: GREEN },
  labelIdle: { color: INACTIVE },
});