import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StorageWidget } from '@/components/storage/StorageWidget';
import { apiClient } from '@/services/api/client';
import { useAppStore } from '@/stores/app.store';
import { RefreshCw, Activity, Server, Clock } from 'lucide-react';

interface HealthData {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
}

export const App: React.FC = () => {
  const { setServerStatus } = useAppStore();
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkHealth = async () => {
    setLoading(true);
    setErrorMsg(null);
    const res = await apiClient.get<HealthData>('/health');
    setLoading(false);
    if (res.success && res.data) {
      setHealthData(res.data);
      setServerStatus('connected');
    } else {
      setErrorMsg(res.error?.message || 'Failed to connect to server');
      setServerStatus('error');
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between border-b border-[#30363d] pb-4">
          <div>
            <h2 className="text-xl font-semibold text-[#f0f6fc]">System Overview & Health</h2>
            <p className="text-xs text-[#8b949e] mt-1">
              Backend runtime monitoring and real-time service status.
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={checkHealth} isLoading={loading}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Status
          </Button>
        </div>

        {/* Storage Space Widget */}
        <StorageWidget serverUrl="http://localhost:4000" />

        {/* Status Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-[#8b949e]">BACKEND STATUS</CardTitle>
              <Activity className="h-4 w-4 text-[#3fb950]" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-[#f0f6fc]">
                {healthData ? (
                  <Badge variant="success">Online</Badge>
                ) : (
                  <Badge variant="destructive">Offline</Badge>
                )}
              </div>
              <p className="text-xs text-[#8b949e] mt-2">
                {healthData ? `Environment: ${healthData.environment}` : errorMsg || 'Unable to connect'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-[#8b949e]">UPTIME</CardTitle>
              <Clock className="h-4 w-4 text-[#58a6ff]" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-[#f0f6fc]">
                {healthData ? `${Math.floor(healthData.uptime)}s` : '0s'}
              </div>
              <p className="text-xs text-[#8b949e] mt-2">Process runtime elapsed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-[#8b949e]">COMMUNICATION</CardTitle>
              <Server className="h-4 w-4 text-[#8b949e]" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-[#f0f6fc]">HTTP / REST</div>
              <p className="text-xs text-[#8b949e] mt-2">Standard Data Plane protocol</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            {healthData ? (
              <div className="divide-y divide-[#30363d] text-xs font-mono">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#8b949e]">STATUS CODE</span>
                  <span className="text-[#3fb950] font-semibold">200 OK</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#8b949e]">SERVER TIME</span>
                  <span className="text-[#c9d1d9]">{healthData.timestamp}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#8b949e]">TARGET ENDPOINT</span>
                  <span className="text-[#58a6ff]">http://localhost:4000/health</span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-[#8b949e]">
                No response from server. Start server with <code className="bg-[#21262d] px-1.5 py-0.5 rounded text-[#f0f6fc]">npm run dev:server</code>.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default App;
