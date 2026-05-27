import RNBluetoothClassic, {
  BluetoothDevice as RNBluetoothDevice,
  BluetoothEventSubscription,
} from 'react-native-bluetooth-classic';
import { BluetoothDevice } from '../types/bluetooth';
import { Constants } from '../utils/constants';

class BluetoothService {
  private static instance: BluetoothService;
  private isAccepting: boolean = false;
  
  private constructor() {}

  public static getInstance(): BluetoothService {
    if (!BluetoothService.instance) {
      BluetoothService.instance = new BluetoothService();
    }
    return BluetoothService.instance;
  }

  public async isBluetoothEnabled(): Promise<boolean> {
    try {
      return await RNBluetoothClassic.isBluetoothEnabled();
    } catch (e) {
      console.error('Error checking bluetooth status', e);
      return false;
    }
  }

  public async requestBluetoothEnabled(): Promise<boolean> {
    try {
      return await RNBluetoothClassic.requestBluetoothEnabled();
    } catch (e) {
      console.error('Error requesting bluetooth enable', e);
      return false;
    }
  }

  public async getBondedDevices(): Promise<BluetoothDevice[]> {
    try {
      const devices = await RNBluetoothClassic.getBondedDevices();
      return devices.map(this.mapDevice);
    } catch (e) {
      console.error('Error getting bonded devices', e);
      return [];
    }
  }

  public async startDiscovery(): Promise<BluetoothDevice[]> {
    try {
      const devices = await RNBluetoothClassic.startDiscovery();
      return devices.map(this.mapDevice);
    } catch (e) {
      console.error('Error starting discovery', e);
      return [];
    }
  }

  public async cancelDiscovery(): Promise<boolean> {
    try {
      return await RNBluetoothClassic.cancelDiscovery();
    } catch (e) {
      console.error('Error canceling discovery', e);
      return false;
    }
  }

  /**
   * Connect to a device as CLIENT.
   * The other device must be accepting connections (server mode).
   */
  public async connectToDevice(deviceId: string): Promise<boolean> {
    try {
      const device = await RNBluetoothClassic.connectToDevice(deviceId, {
        delimiter: '\n',
      });
      return !!device;
    } catch (e) {
      console.error('Error connecting to device', e);
      return false;
    }
  }

  /**
   * Start accepting incoming connections as SERVER.
   * This makes the phone listen for incoming Bluetooth connections.
   * Returns the connected device when someone connects.
   */
  public async acceptConnection(): Promise<RNBluetoothDevice | null> {
    if (this.isAccepting) {
      console.log('Already accepting connections');
      return null;
    }

    try {
      this.isAccepting = true;
      console.log('Waiting for incoming Bluetooth connection...');
      // accept() blocks until a device connects or timeout
      const device = await RNBluetoothClassic.accept({ delimiter: '\n' });
      this.isAccepting = false;
      console.log('Device connected via accept:', device?.name);
      return device;
    } catch (e) {
      this.isAccepting = false;
      console.error('Error accepting connection', e);
      return null;
    }
  }

  /**
   * Cancel accepting connections
   */
  public async cancelAccept(): Promise<boolean> {
    try {
      this.isAccepting = false;
      return await RNBluetoothClassic.cancelAccept();
    } catch (e) {
      console.error('Error canceling accept', e);
      return false;
    }
  }

  public async disconnectDevice(deviceId: string): Promise<boolean> {
    try {
      const device = await RNBluetoothClassic.getConnectedDevice(deviceId);
      if (device) {
        return await device.disconnect();
      }
      return true;
    } catch (e) {
      console.error('Error disconnecting from device', e);
      return false;
    }
  }

  public async getConnectedDevice(deviceId: string): Promise<RNBluetoothDevice | null> {
    try {
      return await RNBluetoothClassic.getConnectedDevice(deviceId);
    } catch (e) {
      console.error('Error getting connected device', e);
      return null;
    }
  }

  public async sendMessage(deviceId: string, message: string): Promise<boolean> {
    try {
      const device = await RNBluetoothClassic.getConnectedDevice(deviceId);
      if (device) {
        await device.write(message + '\n');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error sending message', e);
      return false;
    }
  }

  public onDeviceRead(
    deviceId: string,
    callback: (data: string) => void
  ): BluetoothEventSubscription | null {
    try {
      return RNBluetoothClassic.onDeviceRead(deviceId, (event) => {
        callback(event.data);
      });
    } catch (e) {
      console.error('Error setting up read listener', e);
      return null;
    }
  }

  public onDeviceDisconnected(callback: (event: any) => void): BluetoothEventSubscription {
    return RNBluetoothClassic.onDeviceDisconnected(callback);
  }

  private mapDevice(device: RNBluetoothDevice): BluetoothDevice {
    return {
      id: device.address,
      name: device.name,
      address: device.address,
      bonded: device.bonded,
      connected: false
    };
  }
}

export default BluetoothService.getInstance();
