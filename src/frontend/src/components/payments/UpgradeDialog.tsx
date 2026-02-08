import { useState } from 'react';
import { useUpgradeSubscription } from '@/hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, CreditCard } from 'lucide-react';
import { SubscriptionType } from '@/backend';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function UpgradeDialog() {
  const [open, setOpen] = useState(false);
  const [tier, setTier] = useState<'basic' | 'premium'>('basic');
  const [provider, setProvider] = useState<'payfast' | 'flutterwave'>('payfast');
  const [confirmed, setConfirmed] = useState(false);
  
  const upgradeSubscription = useUpgradeSubscription();

  const handleUpgrade = async () => {
    if (!confirmed) {
      setConfirmed(true);
      return;
    }

    const subscriptionType = tier === 'basic' ? SubscriptionType.basic : SubscriptionType.premium;
    await upgradeSubscription.mutateAsync(subscriptionType);
    setOpen(false);
    setConfirmed(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setConfirmed(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Crown className="h-4 w-4" />
          Upgrade to VIP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2 text-2xl">
            <Crown className="h-6 w-6 text-primary" />
            Upgrade Your Subscription
          </DialogTitle>
          <DialogDescription>
            Choose your VIP tier and payment method to unlock exclusive predictions.
          </DialogDescription>
        </DialogHeader>

        {!confirmed ? (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select VIP Tier</Label>
              <RadioGroup value={tier} onValueChange={(v) => setTier(v as 'basic' | 'premium')}>
                <div className="flex items-center space-x-2 rounded-md border border-border p-4">
                  <RadioGroupItem value="basic" id="basic" />
                  <Label htmlFor="basic" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Basic VIP</div>
                    <div className="text-sm text-muted-foreground">
                      Access to Safe Builder & Value Accumulator
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border border-primary p-4">
                  <RadioGroupItem value="premium" id="premium" />
                  <Label htmlFor="premium" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Premium VIP</div>
                    <div className="text-sm text-muted-foreground">
                      Full access including Odds Train & priority support
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label htmlFor="provider" className="text-base font-semibold">
                Payment Provider
              </Label>
              <Select value={provider} onValueChange={(v) => setProvider(v as 'payfast' | 'flutterwave')}>
                <SelectTrigger id="provider">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payfast">PayFast</SelectItem>
                  <SelectItem value="flutterwave">Flutterwave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <Alert className="my-4">
            <CreditCard className="h-4 w-4" />
            <AlertDescription>
              In a production environment, you would be redirected to {provider === 'payfast' ? 'PayFast' : 'Flutterwave'} to complete your payment for {tier === 'basic' ? 'Basic' : 'Premium'} VIP.
              For this demo, click Confirm to simulate a successful payment.
            </AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade} disabled={upgradeSubscription.isPending}>
            {upgradeSubscription.isPending
              ? 'Processing...'
              : confirmed
              ? 'Confirm Payment'
              : 'Continue to Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
