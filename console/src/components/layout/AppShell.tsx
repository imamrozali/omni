import React from 'react';
import { useAppStore } from '@/stores/app.store';
import { Badge } from '@/components/ui/badge';
import { Activity, Server } from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { serverStatus } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1117] text-[#c9d1d9] font-sans antialiased">
      {/* GitHub Top Navigation Bar */}
      <header className="h-14 border-b border-[#30363d] bg-[#161b22] px-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-semibold text-[#f0f6fc]">
            <Server className="h-5 w-5 text-[#58a6ff]" />
            <span>omni</span>
            <span className="text-[#8b949e]">/</span>
            <span className="text-[#f0f6fc]">console</span>
          </div>
          <Badge variant="outline" className="text-xs text-[#8b949e] border-[#30363d]">
            REST Mode
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={serverStatus === 'connected' ? 'success' : 'destructive'}>
            <span className={`mr-1.5 inline-block h-2 w-2 rounded-full ${serverStatus === 'connected' ? 'bg-[#3fb950]' : 'bg-[#f85149]'}`} />
            {serverStatus === 'connected' ? 'Connected' : 'Offline'}
          </Badge>
        </div>
      </header>

      {/* Main Subheader / Tab Bar */}
      <div className="border-b border-[#30363d] bg-[#161b22] px-6 pt-3">
        <div className="flex gap-4 text-sm">
          <a
            href="#overview"
            className="flex items-center gap-2 px-3 py-2 border-b-2 border-[#f78166] text-[#f0f6fc] font-medium text-xs tracking-wide"
          >
            <Activity className="h-4 w-4 text-[#8b949e]" />
            Overview & Health
          </a>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6">{children}</main>

      {/* GitHub Footer */}
      <footer className="border-t border-[#30363d] bg-[#0d1117] py-6 px-6 text-center text-xs text-[#8b949e]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div>Omni Platform &copy; 2026. All rights reserved.</div>
          <div className="flex gap-4">
            <span className="hover:text-[#58a6ff]">Docs</span>
            <span className="hover:text-[#58a6ff]">API Specification</span>
            <span className="hover:text-[#58a6ff]">System Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
