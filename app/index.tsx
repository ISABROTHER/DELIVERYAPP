import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function Index() {
  const { user, loading } = useAuth();

  // Show a loading spinner while checking for a session
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1F7A4E" />
      </View>
    );
  }

  /**
   * TESTING STAGE GUEST ACCESS
   * We redirect to (tabs) regardless of whether 'user' is null or not.
   * To restore registration/login later, change this back to:
   * return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
   */
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
});