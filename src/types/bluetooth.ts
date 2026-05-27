export interface BluetoothDevice {
  id: string;
  name: string | null;
  address: string;
  bonded: boolean;
  connected?: boolean;
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTING = 'DISCONNECTING',
  ERROR = 'ERROR'
}
