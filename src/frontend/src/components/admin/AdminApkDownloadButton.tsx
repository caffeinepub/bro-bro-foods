import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Loader2, AlertCircle } from 'lucide-react';
import { 
  checkAdminApkAvailability, 
  downloadAdminApk, 
  getAdminApkUnavailableMessage 
} from '@/lib/apkAvailability';

/**
 * Admin-only APK download button with availability check and clear unavailable messaging
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
          <AlertDescription>{getAdminApkUnavailableMessage()}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
