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

const GREEN = '#34B67A';
const INACTIVE = '#8E8E93';
const BAR_BG = 'rgba(255,255,255,0.92)';
const BAR_BORDER = 'rgba(229,229,234,0.9)';

function ModernTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabBarWrap} accessibilityRole="tablist">
      <View pointerEvents="none" style={styles.tabBarSurface} />

      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const color = focused ? GREEN : INACTIVE;

          const icon =
            options.tabBarIcon?.({
              focused,
              color,
              size: 22,
            }) ?? null;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [styles.item, pressed ? styles.itemPressed : null]}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={typeof label === 'string' ? label : route.name}
            >
              {/* Active highlight capsule behind icon (matches screenshot format) */}
              <View style={[styles.iconCapsule, focused ? styles.iconCapsuleActive : styles.iconCapsuleIdle]}>
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
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: INACTIVE,
      }}
      tabBar={(props) => <ModernTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="send"
        options={{
          title: 'Send',
          tabBarIcon: ({ size, color }) => <Send size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarWrap: {
    position: 'relative',
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: 78, // matches the screenshot “tall enough but not bulky”
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 14 : 12,
  },

  tabBarSurface: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BAR_BG,
    borderTopWidth: 1,
    borderTopColor: BAR_BORDER,

    // subtle lift like modern apps
    shadowColor: '#0B1220',
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemPressed: {
    opacity: 0.92,
  },

  // Icon capsule sizing is the key to screenshot-like spacing
  iconCapsule: {
    width: 46,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  iconCapsuleActive: {
    backgroundColor: 'rgba(52,182,122,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(52,182,122,0.22)',
  },
  iconCapsuleIdle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
  },

  label: {
    fontSize: 11.5,
    fontWeight: '800',
    letterSpacing: 0.1,
  },
  labelActive: {
    color: GREEN,
  },
  labelIdle: {
    color: INACTIVE,
  },
});
 