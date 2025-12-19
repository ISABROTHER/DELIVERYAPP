import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, MapPin, Check } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ProfileSectionCard } from './components/ProfileSectionCard';

const BG = '#F5F7FA';
const TEXT = '#0B1220';
const MUTED = '#6B7280';
const GREEN = '#34B67A';

interface Agent {
  id: string;
  name: string;
  region: string;
  city_town: string;
  address_text: string;
  landmark?: string;
}

export default function FavoritePickupScreen() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [favoriteAgent, setFavoriteAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [prefsResult, agentsResult] = await Promise.all([
        supabase
          .from('user_preferences')
          .select('favorite_agent_id, agents(id, name, region, city_town, address_text, landmark)')
          .eq('user_id', user?.id)
          .maybeSingle(),
        supabase.from('agents').select('*').eq('is_active', true).order('name'),
      ]);

      if (agentsResult.data) {
        setAgents(agentsResult.data);
      }

      if (prefsResult.data?.agents) {
        setFavoriteAgent(prefsResult.data.agents as any);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAgent = async (agent: Agent) => {
    if (!user) return;

    try {
      const { data: existingPrefs } = await supabase
        .from('user_preferences')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingPrefs) {
        await supabase
          .from('user_preferences')
          .update({ favorite_agent_id: agent.id })
          .eq('user_id', user.id);
      } else {
        await supabase
          .from('user_preferences')
          .insert({ user_id: user.id, favorite_agent_id: agent.id });
      }

      setFavoriteAgent(agent);
      setSelecting(false);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={GREEN} />
        </View>
      </SafeAreaView>
    );
  }

  if (selecting) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Pressable
            onPress={() => setSelecting(false)}
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
          >
            <ChevronLeft size={24} color={GREEN} strokeWidth={2.5} />
            <Text style={styles.backLabel}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Select Pickup Point</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {agents.map((agent, index) => (
            <Pressable
              key={agent.id}
              style={({ pressed }) => [
                styles.agentCard,
                favoriteAgent?.id === agent.id && styles.agentCardSelected,
                pressed && styles.agentCardPressed,
              ]}
              onPress={() => handleSelectAgent(agent)}
            >
              <View style={styles.agentHeader}>
                <View style={styles.agentIconWrap}>
                  <MapPin size={20} color={GREEN} strokeWidth={2.5} />
                </View>
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>{agent.name}</Text>
                  <Text style={styles.agentLocation}>
                    {agent.city_town}, {agent.region}
                  </Text>
                </View>
                {favoriteAgent?.id === agent.id && (
                  <View style={styles.checkWrap}>
                    <Check size={20} color={GREEN} strokeWidth={3} />
                  </View>
                )}
              </View>
              <Text style={styles.agentAddress}>{agent.address_text}</Text>
              {agent.landmark && <Text style={styles.agentLandmark}>{agent.landmark}</Text>}
            </Pressable>
          ))}

          <View style={styles.bottomSpace} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <ChevronLeft size={24} color={GREEN} strokeWidth={2.5} />
          <Text style={styles.backLabel}>Profile</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Favorite pickup point</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.description}>
          Choose your preferred pickup location for receiving parcels. This will be your default
          option when creating new shipments.
        </Text>

        <ProfileSectionCard title="Your location">
          {favoriteAgent ? (
            <View style={styles.currentCard}>
              <View style={styles.currentHeader}>
                <View style={styles.currentIconWrap}>
                  <MapPin size={24} color={GREEN} strokeWidth={2.5} />
                </View>
                <View style={styles.currentInfo}>
                  <Text style={styles.currentName}>{favoriteAgent.name}</Text>
                  <Text style={styles.currentLocation}>
                    {favoriteAgent.city_town}, {favoriteAgent.region}
                  </Text>
                </View>
              </View>
              <Text style={styles.currentAddress}>{favoriteAgent.address_text}</Text>
              {favoriteAgent.landmark && (
                <Text style={styles.currentLandmark}>{favoriteAgent.landmark}</Text>
              )}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No favorite pickup point selected</Text>
            </View>
          )}
        </ProfileSectionCard>

        <Pressable
          style={({ pressed }) => [styles.changeButton, pressed && styles.changeButtonPressed]}
          onPress={() => setSelecting(true)}
        >
          <Text style={styles.changeButtonText}>Change favorite</Text>
        </Pressable>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: BG,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  backLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: GREEN,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: TEXT,
    letterSpacing: -0.5,
  },

  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  description: {
    fontSize: 15,
    fontWeight: '600',
    color: MUTED,
    lineHeight: 22,
    marginBottom: 20,
  },

  currentCard: {
    padding: 16,
  },
  currentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  currentIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(52,182,122,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  currentInfo: {
    flex: 1,
  },
  currentName: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 4,
  },
  currentLocation: {
    fontSize: 14,
    fontWeight: '700',
    color: MUTED,
  },
  currentAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
    lineHeight: 20,
    marginBottom: 6,
  },
  currentLandmark: {
    fontSize: 13,
    fontWeight: '600',
    color: MUTED,
    fontStyle: 'italic',
  },

  emptyCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '700',
    color: MUTED,
  },

  changeButton: {
    backgroundColor: GREEN,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: GREEN,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  changeButtonPressed: {
    opacity: 0.8,
  },
  changeButtonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  agentCard: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
    padding: 16,
    marginBottom: 12,
  },
  agentCardSelected: {
    borderColor: GREEN,
    backgroundColor: 'rgba(52,182,122,0.04)',
  },
  agentCardPressed: {
    opacity: 0.6,
  },

  agentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  agentIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(52,182,122,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '800',
    color: TEXT,
    marginBottom: 3,
  },
  agentLocation: {
    fontSize: 13,
    fontWeight: '700',
    color: MUTED,
  },
  agentAddress: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT,
    lineHeight: 20,
    marginBottom: 4,
  },
  agentLandmark: {
    fontSize: 12.5,
    fontWeight: '600',
    color: MUTED,
    fontStyle: 'italic',
  },

  checkWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(52,182,122,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomSpace: {
    height: 40,
  },
});
