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
import { ChevronLeft, Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const GREEN = '#34B67A';
const BG = '#E9EDF2';
const TEXT = '#0B1220';
const MUTED = '#6B7280';

export default function SignUpScreen() {
  const { signUp } = useAuth();

  const [name, setName] = useState(''); // UI-only unless you want profile saving wired
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const loopA = Animated.loop(
      Animated.sequence([
        Animated.timing(floatA, { toValue: 1, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(floatA, { toValue: 0, duration: 5200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    const loopB = Animated.loop(
      Animated.sequence([
        Animated.timing(floatB, { toValue: 1, duration: 6400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(floatB, { toValue: 0, duration: 6400, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );

    loopA.start();
    loopB.start();

    return () => {
      loopA.stop();
      loopB.stop();
    };
  }, [enter, floatA, floatB]);

  const handleSignUp = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error: signUpError } = await signUp(email.trim(), password);

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.replace('/(tabs)');
  };

  const pageAnimStyle = {
    opacity: enter,
    transform: [
      {
        translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }),
      },
    ],
  } as const;

  const blobAStyle = {
    transform: [
      { translateX: floatA.interpolate({ inputRange: [0, 1], outputRange: [-18, 26] }) },
      { translateY: floatA.interpolate({ inputRange: [0, 1], outputRange: [-10, 18] }) },
      { scale: floatA.interpolate({ inputRange: [0, 1], outputRange: [1, 1.12] }) },
    ],
    opacity: floatA.interpolate({ inputRange: [0, 1], outputRange: [0.38, 0.56] }),
  } as const;

  const blobBStyle = {
    transform: [
      { translateX: floatB.interpolate({ inputRange: [0, 1], outputRange: [22, -22] }) },
      { translateY: floatB.interpolate({ inputRange: [0, 1], outputRange: [18, -14] }) },
      { scale: floatB.interpolate({ inputRange: [0, 1], outputRange: [1, 1.16] }) },
    ],
    opacity: floatB.interpolate({ inputRange: [0, 1], outputRange: [0.30, 0.46] }),
  } as const;

  return (
    <SafeAreaView style={styles.safe}>
      <View pointerEvents="none" style={styles.bg}>
        <Animated.View style={[styles.blob, styles.blobA, blobAStyle]} />
        <Animated.View style={[styles.blob, styles.blobB, blobBStyle]} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
          <View style={styles.stage}>
            <Animated.View style={[styles.glassCard, pageAnimStyle]}>
              <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
                <ChevronLeft size={18} color={TEXT} />
              </Pressable>

              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Create a new account to get started and enjoy{'\n'}seamless access to our features.
              </Text>

              {error ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              {/* Name */}
              <View style={styles.inputPill}>
                <View style={styles.leftIcon}>
                  <User size={18} color={MUTED} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  placeholderTextColor="rgba(107,114,128,0.85)"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (error) setError(null);
                  }}
                  editable={!loading}
                  returnKeyType="next"
                />
              </View>

              {/* Email */}
              <View style={styles.inputPill}>
                <View style={styles.leftIcon}>
                  <Mail size={18} color={MUTED} />
                </View>
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
                  editable={!loading}
                  returnKeyType="next"
                />
              </View>

              {/* Password */}
              <View style={styles.inputPill}>
                <View style={styles.leftIcon}>
                  <Lock size={18} color={MUTED} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="rgba(107,114,128,0.85)"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t);
                    if (error) setError(null);
                  }}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                  returnKeyType="next"
                />
                <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.rightIcon} hitSlop={10}>
                  {showPassword ? <EyeOff size={18} color={MUTED} /> : <Eye size={18} color={MUTED} />}
                </Pressable>
              </View>

              {/* Confirm */}
              <View style={styles.inputPill}>
                <View style={styles.leftIcon}>
                  <Lock size={18} color={MUTED} />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor="rgba(107,114,128,0.85)"
                  value={confirmPassword}
                  onChangeText={(t) => {
                    setConfirmPassword(t);
                    if (error) setError(null);
                  }}
                  secureTextEntry={!showConfirmPassword}
                  editable={!loading}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    if (!loading) void handleSignUp();
                  }}
                />
                <Pressable onPress={() => setShowConfirmPassword((s) => !s)} style={styles.rightIcon} hitSlop={10}>
                  {showConfirmPassword ? <EyeOff size={18} color={MUTED} /> : <Eye size={18} color={MUTED} />}
                </Pressable>
              </View>

              <Pressable
                onPress={handleSignUp}
                disabled={loading}
                style={({ pressed }) => [
                  styles.primaryBtn,
                  pressed && !loading ? styles.primaryBtnPressed : null,
                  loading ? styles.primaryBtnDisabled : null,
                ]}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryBtnText}>Create Account</Text>}
              </Pressable>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <Pressable hitSlop={8}>
                    <Text style={styles.switchLink}>Sign In here</Text>
                  </Pressable>
                </Link>
              </View>

              <View pointerEvents="none" style={styles.edgeHighlight} />
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safe: { flex: 1, backgroundColor: BG },

  bg: { ...StyleSheet.absoluteFillObject, backgroundColor: BG },
  blob: { position: 'absolute', width: 320, height: 320, borderRadius: 320 },
  blobA: { top: -120, left: -120, backgroundColor: 'rgba(52,182,122,0.22)' },
  blobB: { bottom: -140, right: -120, backgroundColor: 'rgba(59,130,246,0.18)' },

  scroll: { paddingHorizontal: 18, paddingTop: 26, paddingBottom: 26 },
  stage: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    justifyContent: 'center',
    minHeight: 680,
  },

  glassCard: {
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    shadowColor: '#0B1220',
    shadowOpacity: 0.10,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 16 },
    elevation: 3,
    overflow: 'hidden',
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
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: TEXT,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 18,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(107,114,128,0.95)',
    textAlign: 'center',
  },

  errorBox: {
    backgroundColor: 'rgba(255,236,236,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,209,209,0.9)',
    padding: 10,
    borderRadius: 16,
    marginBottom: 12,
  },
  errorText: { color: '#B42318', fontSize: 12, fontWeight: '800' },

  inputPill: {
    height: 52,
    borderRadius: 999,
    backgroundColor: 'rgba(246,247,249,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },
  leftIcon: { width: 26, alignItems: 'flex-start' },
  rightIcon: { paddingLeft: 10, paddingVertical: 8 },
  input: { flex: 1, fontSize: 14, color: TEXT, paddingVertical: 10 },

  primaryBtn: {
    height: 52,
    borderRadius: 999,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B1220',
    shadowOpacity: 0.14,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
    marginTop: 6,
  },
  primaryBtnPressed: { opacity: 0.92 },
  primaryBtnDisabled: { opacity: 0.65 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '900', letterSpacing: 0.2 },

  switchRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 14 },
  switchText: { fontSize: 12.5, color: 'rgba(107,114,128,0.95)', fontWeight: '800' },
  switchLink: { fontSize: 12.5, color: GREEN, fontWeight: '900' },
});
