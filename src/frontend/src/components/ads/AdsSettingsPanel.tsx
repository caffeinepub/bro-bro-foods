import { useState, useEffect } from 'react';
import { Settings, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { loadAdsSettings, saveAdsSettings, validateAdsSettings, type AdsOwnerSettings } from '@/lib/adsOwnerSettings';
import { isCapacitorEnvironment } from '@/lib/runtimeEnvironment';

/**
 * AdsSettingsPanel Component
 * 
 * Owner-accessible settings panel for configuring Google AdSense.
 * Persists settings to localStorage and triggers runtime refresh.
 */
export default function AdsSettingsPanel() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<AdsOwnerSettings>(loadAdsSettings);
  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isCapacitor = isCapacitorEnvironment();

  // Load settings when dialog opens
  useEffect(() => {
    if (open) {
      setSettings(loadAdsSettings());
      setErrors([]);
      setSaveSuccess(false);
    }
  }, [open]);

  const handleSave = () => {
    setIsSaving(true);
    setErrors([]);
    setSaveSuccess(false);

    // Validate settings
    const validation = validateAdsSettings(settings);
    if (!validation.valid) {
      setErrors(validation.errors);
      setIsSaving(false);
      return;
    }

    try {
      // Save to localStorage
      saveAdsSettings(settings);
      setSaveSuccess(true);

      // Close dialog after short delay
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    } catch (error) {
      setErrors(['Failed to save settings. Please try again.']);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Settings size={16} />
          Ad Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Google AdSense Settings</DialogTitle>
          <DialogDescription>
            Configure your AdSense account to start earning from ads. All settings are stored locally.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Enable Ads Toggle */}
          <div className="flex items-center justify-between">
            <Label htmlFor="enabled" className="flex flex-col gap-1">
              <span>Enable Ads</span>
              <span className="text-xs text-muted-foreground font-normal">
                Turn ads on or off globally
              </span>
            </Label>
            <Switch
              id="enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, enabled: checked })}
            />
          </div>

          {/* AdSense Client ID */}
          <div className="space-y-2">
            <Label htmlFor="clientId">
              AdSense Client ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="clientId"
              placeholder="ca-pub-XXXXXXXXXXXXXXXXX"
              value={settings.adsenseClientId}
              onChange={(e) => setSettings({ ...settings, adsenseClientId: e.target.value })}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Find this in your AdSense account (starts with "ca-pub-")
            </p>
          </div>

          {/* Top Banner Slot ID */}
          <div className="space-y-2">
            <Label htmlFor="topBannerSlot">
              Top Banner Ad Slot ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="topBannerSlot"
              placeholder="1234567890"
              value={settings.topBannerSlotId}
              onChange={(e) => setSettings({ ...settings, topBannerSlotId: e.target.value })}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Ad slot ID for the banner below the hero section
            </p>
          </div>

          {/* Bottom Banner Slot ID (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="bottomBannerSlot">
              Bottom Banner Ad Slot ID <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Input
              id="bottomBannerSlot"
              placeholder="0987654321"
              value={settings.bottomBannerSlotId}
              onChange={(e) => setSettings({ ...settings, bottomBannerSlotId: e.target.value })}
              disabled={!settings.enabled}
            />
            <p className="text-xs text-muted-foreground">
              Ad slot ID for the banner above the footer
            </p>
          </div>

          {/* Capacitor Override (only show if in Capacitor) */}
          {isCapacitor && (
            <div className="flex items-center justify-between pt-2 border-t">
              <Label htmlFor="enableCapacitor" className="flex flex-col gap-1">
                <span>Enable ads on mobile app</span>
                <span className="text-xs text-muted-foreground font-normal">
                  Override default behavior (ads disabled in app by default)
                </span>
              </Label>
              <Switch
                id="enableCapacitor"
                checked={settings.enableOnCapacitor}
                onCheckedChange={(checked) => setSettings({ ...settings, enableOnCapacitor: checked })}
                disabled={!settings.enabled}
              />
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <ul className="text-sm text-destructive space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Message */}
          {saveSuccess && (
            <div className="bg-success/10 border border-success/20 rounded-md p-3">
              <p className="text-sm text-success">Settings saved successfully! Ads will appear shortly.</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
