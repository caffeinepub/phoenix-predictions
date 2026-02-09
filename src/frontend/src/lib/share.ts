export function generateShareText(stats: {
  successRate: number;
  wins: number;
  currentStreak: number;
}): string {
  return `🔥 Phoenix Predictions Stats 🔥

✅ Success Rate: ${stats.successRate}%
🏆 Total Wins: ${stats.wins}
⚡ Current Streak: ${stats.currentStreak}

Join me on Phoenix Predictions for expert sports analysis!
#PhoenixPredictions #WinningStreak`;
}

export function generateShareUrl(userId?: string): string {
  const baseUrl = window.location.origin;
  return userId ? `${baseUrl}/share/streak?user=${userId}` : `${baseUrl}/profile`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
