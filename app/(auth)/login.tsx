import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import { ChevronLeft, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const GREEN = '#34B67A';
const BG = '#E9EDF2';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

export default function LoginScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Entrance + background motion
  const enter = useRef(new Animated.Value(0)).current;
  const floatA = useRef(new Animated.Value(0)).current;
  const floatB = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatA, { toValue: 1, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(floatA, { toValue: 0, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatB, { toValue: 1, duration: 6400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(floatB, { toValue: 0, duration: 6400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, [enter, floatA, floatB]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email.trim(), password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace('/(tabs)');
  };

  const pageAnimStyle = {
    opacity: enter,
    transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }],
  } as const;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Glass background */}
      <View pointerEvents="none" style={styles.bg}>
        <Animated.View
          style={[
            styles.blob,
            styles.blobA,
            {
              transform: [
                { translateX: floatA.interpolate({ inputRange: [0, 1], outputRange: [-18, 26] }) },
                { translateY: floatA.interpolate({ inputRange: [0, 1], outputRange: [-10, 18] }) },
                { scale: floatA.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) },
              ],
              opacity: floatA.interpolate({ inputRange: [0, 1], outputRange: [0.38, 0.56] }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.blob,
            styles.blobB,
            {
              transform: [
                { translateX: floatB.interpolate({ inputRange: [0, 1], outputRange: [22, -22] }) },
                { translateY: floatB.interpolate({ inputRange: [0, 1], outputRange: [18, -14] }) },
                { scale: floatB.interpolate({ inputRange: [0, 1], outputRange: [1, 1.16] }) },
              ],
              opacity: floatB.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.46] }),
            },
          ]}
        />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.glassCard, pageAnimStyle]}>
            <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
              <ChevronLeft size={18} color={TEXT} />
            </Pressable>

            <Text style={styles.title}>Log in</Text>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputPill}>
              <Mail size={18} color={MUTED} />
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="rgba(107,114,128,0.85)"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  if (error) setError(null);
                }}
              />
            </View>

            <View style={styles.inputPill}>
              <Lock size={18} color={MUTED} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(107,114,128,0.85)"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  if (error) setError(null);
                }}
                onSubmitEditing={handleLogin}
                returnKeyType="done"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                {showPassword ? <EyeOff size={18} color={MUTED} /> : <Eye size={18} color={MUTED} />}
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.primaryBtn,
                pressed && !loading ? styles.primaryBtnPressed : null,
                loading ? styles.primaryBtnDisabled : null,
              ]}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryBtnText}>Login</Text>}
            </Pressable>

            <View style={styles.switchRow}>
              <Text style={styles.switchText}>Don’t have an account? </Text>
              <Link href="/(auth)/signup">
                <Text style={styles.switchLink}>Sign Up</Text>
              </Link>
            </View>

            <View pointerEvents="none" style={styles.edgeHighlight} />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  bg: { ...StyleSheet.absoluteFillObject },
  blob: { position: 'absolute', width: 320, height: 320, borderRadius: 320 },
  blobA: { top: -120, left: -120, backgroundColor: 'rgba(52,182,122,0.22)' },
  blobB: { bottom: -140, right: -120, backgroundColor: 'rgba(59,130,246,0.18)' },

  scroll: { padding: 24, justifyContent: 'center', flexGrow: 1 },

  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 14 },
  },

  edgeHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 46,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },

  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  title: { fontSize: 30, fontWeight: '900', textAlign: 'center', color: TEXT, marginBottom: 20 },

  errorBox: {
    backgroundColor: 'rgba(255,236,236,0.9)',
    padding: 10,
    borderRadius: 14,
    marginBottom: 12,
  },
  errorText: { color: '#B42318', fontWeight: '800', fontSize: 12 },

  inputPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(246,247,249,0.55)',
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  input: { flex: 1, marginLeft: 8, fontSize: 14, color: TEXT },

  primaryBtn: {
    backgroundColor: GREEN,
    height: 52,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryBtnPressed: { opacity: 0.9 },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#FFF', fontWeight: '900', fontSize: 15 },

  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  switchText: { color: MUTED, fontWeight: '700', fontSize: 12.5 },
  switchLink: { color: GREEN, fontWeight: '900', fontSize: 12.5 },
});
