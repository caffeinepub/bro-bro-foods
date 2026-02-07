import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Loader2, AlertCircle } from 'lucide-react';

const ADMIN_APK_URL = 'https://meaningful-coffee-oyw-draft.caffeine.xyz/downloads/bro-bro-foods-admin.apk';
const ADMIN_APK_UNAVAILABLE_MESSAGE = 'Admin app is being prepared. Please check back later.';

/**
 * Check if admin APK is available
 */
async function checkAdminApkAvailability(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(ADMIN_APK_URL, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Initiate admin APK download
 */
function downloadAdminApk(): void {
  const link = document.createElement('a');
  link.href = ADMIN_APK_URL;
  link.download = 'bro-bro-foods-admin.apk';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Admin-only APK download button with availability check
 */
export default function AdminApkDownloadButton() {
  const [isChecking, setIsChecking] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const handleDownloadClick = async () => {
    setIsChecking(true);
    setShowUnavailable(false);

    try {
      const isAvailable = await checkAdminApkAvailability();

      if (isAvailable) {
        downloadAdminApk();
      } else {
        setShowUnavailable(true);
      }
    } catch (error) {
      setShowUnavailable(true);
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleDownloadClick}
        disabled={isChecking}
        variant="outline"
        className="w-full"
      >
        {isChecking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Download Admin App
          </>
        )}
      </Button>

      {showUnavailable && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{ADMIN_APK_UNAVAILABLE_MESSAGE}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
