import { Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AdsSettingsPanel from '@/components/ads/AdsSettingsPanel';

/**
 * OwnerSettingsSection Component
 * 
 * Admin-only section that provides access to owner-level settings including AdSense configuration.
 * This component is only accessible within the admin dashboard after PIN authentication.
 */
export default function OwnerSettingsSection() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          <CardTitle>Owner Settings</CardTitle>
        </div>
        <CardDescription>
          Configure advanced settings for your business including ad monetization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Ad Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure Google AdSense to monetize your website with display ads
              </p>
            </div>
            <AdsSettingsPanel />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
