// Shared tier calculation function for consistency across components (based on kills only)
export const calculatePlayerTier = (kills: number, deaths: number) => {
  // Updated tier system with broader kill ranges
  if (kills >= 200) return 'nightmare';    // 200+ kills
  if (kills >= 160) return 'myth';         // 160-199 kills
  if (kills >= 120) return 'legend';       // 120-159 kills
  if (kills >= 90) return 'reaper';        // 90-119 kills
  if (kills >= 60) return 'warlord';       // 60-89 kills
  if (kills >= 40) return 'raider';        // 40-59 kills
  if (kills >= 20) return 'hunter';        // 20-39 kills
  if (kills >= 10) return 'survivor';      // 10-19 kills
  if (kills >= 5) return 'scavenger';      // 5-9 kills
  
  return 'rookie'; // 0-4 kills
};

// Tier styling configuration
export const getTierStyle = (tier: string) => {
  const styles = {
    nightmare: { bg: 'bg-purple-600/20', text: 'text-purple-400', border: 'border-purple-500' },
    myth: { bg: 'bg-red-600/20', text: 'text-red-400', border: 'border-red-500' },
    legend: { bg: 'bg-orange-600/20', text: 'text-orange-400', border: 'border-orange-500' },
    reaper: { bg: 'bg-yellow-600/20', text: 'text-yellow-400', border: 'border-yellow-500' },
    warlord: { bg: 'bg-green-600/20', text: 'text-green-400', border: 'border-green-500' },
    raider: { bg: 'bg-blue-600/20', text: 'text-blue-400', border: 'border-blue-500' },
    hunter: { bg: 'bg-cyan-600/20', text: 'text-cyan-400', border: 'border-cyan-500' },
    survivor: { bg: 'bg-emerald-600/20', text: 'text-emerald-400', border: 'border-emerald-500' },
    scavenger: { bg: 'bg-gray-600/20', text: 'text-gray-400', border: 'border-gray-500' },
    rookie: { bg: 'bg-gray-700/20', text: 'text-gray-500', border: 'border-gray-600' },
  };
  
  return styles[tier as keyof typeof styles] || styles.rookie;
};