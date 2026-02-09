export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  icon: string;
}

export function calculateBadges(stats: {
  wins: number;
  totalCompleted: number;
  currentStreak: number;
  successRate: number;
  isVip: boolean;
}): Badge[] {
  const badges: Badge[] = [];

  // Streak badges
  if (stats.currentStreak >= 3) {
    badges.push({
      id: 'streak-3',
      name: 'Hot Streak',
      description: '3+ consecutive wins',
      earned: true,
      icon: '🔥',
    });
  }
  
  if (stats.currentStreak >= 5) {
    badges.push({
      id: 'streak-5',
      name: 'On Fire',
      description: '5+ consecutive wins',
      earned: true,
      icon: '🚀',
    });
  }

  if (stats.currentStreak >= 10) {
    badges.push({
      id: 'streak-10',
      name: 'Unstoppable',
      description: '10+ consecutive wins',
      earned: true,
      icon: '⚡',
    });
  }

  // Accuracy badges
  if (stats.totalCompleted >= 10 && stats.successRate >= 70) {
    badges.push({
      id: 'accuracy-70',
      name: 'Sharp Analyst',
      description: '70%+ success rate (10+ tickets)',
      earned: true,
      icon: '🎯',
    });
  }

  if (stats.totalCompleted >= 20 && stats.successRate >= 80) {
    badges.push({
      id: 'accuracy-80',
      name: 'Expert Predictor',
      description: '80%+ success rate (20+ tickets)',
      earned: true,
      icon: '💎',
    });
  }

  // VIP badge
  if (stats.isVip) {
    badges.push({
      id: 'vip',
      name: 'VIP Member',
      description: 'Active VIP subscription',
      earned: true,
      icon: '👑',
    });
  }

  // Milestone badges
  if (stats.wins >= 10) {
    badges.push({
      id: 'wins-10',
      name: 'Rising Star',
      description: '10+ winning tickets',
      earned: true,
      icon: '⭐',
    });
  }

  if (stats.wins >= 25) {
    badges.push({
      id: 'wins-25',
      name: 'Veteran',
      description: '25+ winning tickets',
      earned: true,
      icon: '🏆',
    });
  }

  if (stats.wins >= 50) {
    badges.push({
      id: 'wins-50',
      name: 'Legend',
      description: '50+ winning tickets',
      earned: true,
      icon: '👑',
    });
  }

  return badges;
}
