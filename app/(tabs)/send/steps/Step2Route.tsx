import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { StepHeader } from '../components/StepHeader';
import { ContinueButton } from '../components/ContinueButton';
import { useSendParcel, Route, Location } from '../context/SendParcelContext';
import { MapPin, Navigation } from 'lucide-react-native';

type Step2RouteProps = {
  onNext: () => void;
};

const GHANA_REGIONS = [
  'Greater Accra',
  'Ashanti',
  'Western',
  'Eastern',
  'Central',
  'Northern',
  'Upper East',
  'Upper West',
  'Volta',
  'Bono',
  'Bono East',
  'Ahafo',
  'Savannah',
  'North East',
  'Oti',
  'Western North',
];

export const Step2Route = ({ onNext }: Step2RouteProps) => {
  const { route, updateRoute } = useSendParcel();

  const [originRegion, setOriginRegion] = useState(route?.origin.region || '');
  const [originCity, setOriginCity] = useState(route?.origin.cityTown || '');
  const [originLandmark, setOriginLandmark] = useState(route?.origin.landmark || '');
  const [showOriginRegions, setShowOriginRegions] = useState(false);

  const [destRegion, setDestRegion] = useState(route?.destination.region || '');
  const [destCity, setDestCity] = useState(route?.destination.cityTown || '');
  const [destLandmark, setDestLandmark] = useState(route?.destination.landmark || '');
  const [showDestRegions, setShowDestRegions] = useState(false);

  const handleContinue = () => {
    if (originRegion && originCity && destRegion && destCity) {
      const routeData: Route = {
        origin: {
          region: originRegion,
          cityTown: originCity,
          landmark: originLandmark || undefined,
        },
        destination: {
          region: destRegion,
          cityTown: destCity,
          landmark: destLandmark || undefined,
        },
      };
      updateRoute(routeData);
      onNext();
    }
  };

  const canContinue = originRegion && originCity && destRegion && destCity;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StepHeader
          title="Route"
          subtitle="Where is the parcel coming from and going to?"
        />

        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <MapPin size={20} color="#34B67A" />
            <Text style={styles.routeTitle}>Origin (From)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Region *</Text>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowOriginRegions(!showOriginRegions)}
            >
              <Text style={[styles.dropdownText, !originRegion && styles.placeholder]}>
                {originRegion || 'Select region'}
              </Text>
            </Pressable>
            {showOriginRegions && (
              <View style={styles.dropdown}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {GHANA_REGIONS.map((region) => (
                    <Pressable
                      key={region}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setOriginRegion(region);
                        setShowOriginRegions(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{region}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City/Town *</Text>
            <TextInput
              style={styles.input}
              value={originCity}
              onChangeText={setOriginCity}
              placeholder="e.g., Accra, Kumasi"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              value={originLandmark}
              onChangeText={setOriginLandmark}
              placeholder="e.g., Near Oxford Street"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <Navigation size={20} color="#34B67A" />
            <Text style={styles.routeTitle}>Destination (To)</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Region *</Text>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setShowDestRegions(!showDestRegions)}
            >
              <Text style={[styles.dropdownText, !destRegion && styles.placeholder]}>
                {destRegion || 'Select region'}
              </Text>
            </Pressable>
            {showDestRegions && (
              <View style={styles.dropdown}>
                <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                  {GHANA_REGIONS.map((region) => (
                    <Pressable
                      key={region}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setDestRegion(region);
                        setShowDestRegions(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{region}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City/Town *</Text>
            <TextInput
              style={styles.input}
              value={destCity}
              onChangeText={setDestCity}
              placeholder="e.g., Takoradi, Tema"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              value={destLandmark}
              onChangeText={setDestLandmark}
              placeholder="e.g., Near Market Circle"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {canContinue && (
          <View style={styles.routeSummary}>
            <Text style={styles.summaryText}>
              From: {originCity}, {originRegion}
            </Text>
            <Text style={styles.summaryArrow}>→</Text>
            <Text style={styles.summaryText}>
              To: {destCity}, {destRegion}
            </Text>
          </View>
        )}
      </ScrollView>

      <ContinueButton onPress={handleContinue} disabled={!canContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  routeCard: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  routeTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0B1220',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1220',
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 12,
    padding: 14,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1220',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.08)',
    maxHeight: 200,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B1220',
  },
  routeSummary: {
    marginHorizontal: 18,
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(52,182,122,0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(52,182,122,0.18)',
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0B1220',
    textAlign: 'center',
  },
  summaryArrow: {
    fontSize: 20,
    fontWeight: '900',
    color: '#34B67A',
    marginVertical: 4,
  },
});
