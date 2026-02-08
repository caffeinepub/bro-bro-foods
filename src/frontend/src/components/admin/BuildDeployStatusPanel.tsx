import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useLastBuildStatus } from '@/hooks/useLastBuildStatus';

/**
 * Admin-only panel that displays the last build/deploy status
 * Shows build, installation, and deployment success flags with output logs
 */
export default function BuildDeployStatusPanel() {
  const { data: lastBuildStatus, isLoading } = useLastBuildStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Build & Deploy Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading status...</p>
        </CardContent>
      </Card>
    );
  }

  if (!lastBuildStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Build & Deploy Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No build status recorded yet.</p>
        </CardContent>
      </Card>
    );
  }

  const { status, timestamp } = lastBuildStatus;
  const date = new Date(Number(timestamp) / 1000000); // Convert nanoseconds to milliseconds

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Build & Deploy Status
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Last updated: {date.toLocaleString()}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Build Status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {status.buildSucceeded ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <h3 className="font-semibold">Frontend Build</h3>
            <Badge variant={status.buildSucceeded ? 'default' : 'destructive'}>
              {status.buildSucceeded ? 'Success' : 'Failed'}
            </Badge>
          </div>
          {status.buildOutput && (
            <ScrollArea className="h-32 w-full rounded border bg-muted p-3">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {status.buildOutput}
              </pre>
            </ScrollArea>
          )}
        </div>

        <Separator />

        {/* App Installation Status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {status.appInstallationSucceeded ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <h3 className="font-semibold">App Installation</h3>
            <Badge variant={status.appInstallationSucceeded ? 'default' : 'destructive'}>
              {status.appInstallationSucceeded ? 'Success' : 'Failed'}
            </Badge>
          </div>
          {status.appInstallationOutput && (
            <ScrollArea className="h-32 w-full rounded border bg-muted p-3">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {status.appInstallationOutput}
              </pre>
            </ScrollArea>
          )}
        </div>

        <Separator />

        {/* Deploy Status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {status.deploySucceeded ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600" />
            )}
            <h3 className="font-semibold">Deployment</h3>
            <Badge variant={status.deploySucceeded ? 'default' : 'destructive'}>
              {status.deploySucceeded ? 'Success' : 'Failed'}
            </Badge>
          </div>
          {status.deployOutput && (
            <ScrollArea className="h-32 w-full rounded border bg-muted p-3">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {status.deployOutput}
              </pre>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
