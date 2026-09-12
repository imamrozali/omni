import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StorageWidget } from '@/components/storage/StorageWidget';
import { agentWsClient } from '@/services/websocket/client';
import { useAgentStore } from '@/stores/agent.store';
import { Monitor, Wifi, Cpu, Play, Terminal } from 'lucide-react';

export const App: React.FC = () => {
  const { wsStatus, setWsStatus, systemInfo, setSystemInfo } = useAgentStore();

  useEffect(() => {
    // Listen to WebSocket events
    agentWsClient.on('connection.open', () => setWsStatus('connected'));
    agentWsClient.on('connection.close', () => setWsStatus('disconnected'));

    // Connect WebSocket
    setWsStatus('connecting');
    agentWsClient.connect();

    // Fetch Rust system info via Tauri IPC if available
    if (window.__TAURI_INTERNALS__) {
      import('@tauri-apps/api/core').then(({ invoke }) => {
        invoke<{ os_name: string; arch: string }>('get_sys_info')
          .then((info) => setSystemInfo({ osName: info.os_name, arch: info.arch }))
          .catch(() => setSystemInfo({ osName: 'macOS (Web Fallback)', arch: 'arm64' }));
      });
    } else {
      setSystemInfo({ osName: 'macOS (Web Mode)', arch: 'arm64' });
    }

    return () => {
      agentWsClient.disconnect();
    };
  }, [setWsStatus, setSystemInfo]);

  const handleSendPing = () => {
    agentWsClient.send('ping', { text: 'Hello from Agent React UI' });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans antialiased flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 font-semibold text-[#f0f6fc]">
          <Terminal className="h-5 w-5 text-[#58a6ff]" />
          <span>omni</span>
          <span className="text-[#8b949e]">/</span>
          <span className="text-[#f0f6fc]">agent</span>
        </div>

        <Badge variant={wsStatus === 'connected' ? 'success' : 'destructive'}>
          <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${wsStatus === 'connected' ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
          {wsStatus === 'connected' ? 'WS Connected' : wsStatus === 'connecting' ? 'Connecting...' : 'WS Offline'}
        </Badge>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">
        {/* Page Title */}
        <div className="border-b border-[#30363d] pb-4">
          <h2 className="text-xl font-semibold text-[#f0f6fc]">Desktop Agent Status</h2>
          <p className="text-xs text-[#8b949e] mt-1">
            Native Tauri 2 + Rust backend runtime interface.
          </p>
        </div>

        {/* Storage Capacity Monitoring */}
        <StorageWidget serverUrl="http://localhost:4000" />

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-[#8b949e]">ENVIRONMENT</CardTitle>
              <Cpu className="h-4 w-4 text-[#58a6ff]" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-[#f0f6fc]">{systemInfo?.osName || 'Detecting...'}</div>
              <p className="text-xs text-[#8b949e] mt-1">Architecture: {systemInfo?.arch || 'arm64'}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-semibold text-[#8b949e]">WEBSOCKET GATEWAY</CardTitle>
              <Wifi className="h-4 w-4 text-[#3fb950]" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-[#f0f6fc]">ws://localhost:4000/ws</div>
              <p className="text-xs text-[#8b949e] mt-1">Real-time bi-directional protocol</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Button onClick={handleSendPing} disabled={wsStatus !== 'connected'}>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Send Ping to Server
              </Button>
              <Button variant="secondary" onClick={() => agentWsClient.connect()}>
                <Monitor className="h-3.5 w-3.5 mr-1.5" />
                Reconnect WebSocket
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363d] bg-[#0d1117] py-4 px-6 text-center text-xs text-[#8b949e]">
        Omni Agent v0.1.0 &bull; Desktop Client
      </footer>
    </div>
  );
};

export default App;
