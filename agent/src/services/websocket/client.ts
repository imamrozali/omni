export interface WsEnvelope {
  id: string;
  type: string;
  timestamp: number;
  payload: Record<string, unknown>;
}

export type WsMessageHandler = (msg: WsEnvelope) => void;

export class AgentWebSocketClient {
  private socket: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, Set<WsMessageHandler>> = new Map();
  private isConnected: boolean = false;
  private pingIntervalId: number | null = null;

  constructor(url: string = 'ws://localhost:4000/ws') {
    this.url = url;
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.startHeartbeat();
        this.emit('connection.open', {
          id: 'conn-' + Date.now(),
          type: 'connection.open',
          timestamp: Date.now(),
          payload: {},
        });
      };

      this.socket.onmessage = (event) => {
        try {
          const envelope: WsEnvelope = JSON.parse(event.data);
          const typeSet = this.handlers.get(envelope.type);
          if (typeSet) {
            typeSet.forEach((h) => h(envelope));
          }
        } catch {
          // invalid message ignored
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.stopHeartbeat();
        this.emit('connection.close', {
          id: 'conn-' + Date.now(),
          type: 'connection.close',
          timestamp: Date.now(),
          payload: {},
        });
      };

      this.socket.onerror = () => {
        this.isConnected = false;
      };
    } catch {
      this.isConnected = false;
    }
  }

  public disconnect(): void {
    this.stopHeartbeat();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  public send(type: string, payload: Record<string, unknown> = {}): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }
    const message: WsEnvelope = {
      id: 'msg-' + Math.random().toString(36).substring(2, 9),
      type,
      timestamp: Date.now(),
      payload,
    };
    this.socket.send(JSON.stringify(message));
  }

  public on(type: string, handler: WsMessageHandler): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
  }

  public off(type: string, handler: WsMessageHandler): void {
    const typeSet = this.handlers.get(type);
    if (typeSet) {
      typeSet.delete(handler);
    }
  }

  private emit(type: string, msg: WsEnvelope): void {
    const typeSet = this.handlers.get(type);
    if (typeSet) {
      typeSet.forEach((h) => h(msg));
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();
    this.pingIntervalId = window.setInterval(() => {
      this.send('ping');
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.pingIntervalId !== null) {
      clearInterval(this.pingIntervalId);
      this.pingIntervalId = null;
    }
  }

  public getConnected(): boolean {
    return this.isConnected;
  }
}

export const agentWsClient = new AgentWebSocketClient();
