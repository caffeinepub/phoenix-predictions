import { SubscriptionType } from '@/backend';

export function getSubscriptionLabel(type: SubscriptionType): string {
  switch (type) {
    case SubscriptionType.free:
      return 'Free';
    case SubscriptionType.basic:
      return 'Basic VIP';
    case SubscriptionType.premium:
      return 'Premium VIP';
    default:
      return 'Unknown';
  }
}

export function hasVipAccess(type: SubscriptionType): boolean {
  return type === SubscriptionType.basic || type === SubscriptionType.premium;
}
