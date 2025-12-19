import { supabase } from '@/lib/supabase';
import { Agent } from '../context/SendParcelContext';

export async function fetchNearbyAgents(params: {
  region?: string;
  cityTown?: string;
  method: 'DROPOFF' | 'PICKUP';
}): Promise<Agent[]> {
  try {
    let query = supabase
      .from('agents')
      .select('*')
      .eq('is_active', true);

    if (params.method === 'DROPOFF') {
      query = query.eq('can_dropoff', true);
    } else {
      query = query.eq('can_pickup', true);
    }

    if (params.region) {
      query = query.eq('region', params.region);
    }

    if (params.cityTown) {
      query = query.ilike('city_town', `%${params.cityTown}%`);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map(
      (agent): Agent => ({
        id: agent.id,
        name: agent.name,
        addressText: agent.address_text,
        region: agent.region,
        cityTown: agent.city_town,
        landmark: agent.landmark,
        hours: formatOperatingHours(agent.operating_hours),
        canPickup: agent.can_pickup,
        canDropoff: agent.can_dropoff,
      })
    );
  } catch (error) {
    console.error('Error fetching agents:', error);
    return [];
  }
}

function formatOperatingHours(hours: any): string {
  if (!hours || typeof hours !== 'object') return 'Hours vary';

  const today = new Date()
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toLowerCase();
  const todayHours = hours[today];

  if (!todayHours) return 'Hours vary';
  if (todayHours.toLowerCase() === 'closed') return 'Closed today';

  return `Today: ${todayHours}`;
}

export function calculateDistance(
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
): number | undefined {
  if (!lat1 || !lon1 || !lat2 || !lon2) return undefined;

  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
