const subscription = { remove: jest.fn() };

module.exports = {
  __esModule: true,
  default: {
    isBluetoothEnabled: jest.fn(async () => true),
    requestBluetoothEnabled: jest.fn(async () => true),
    getBondedDevices: jest.fn(async () => []),
    startDiscovery: jest.fn(async () => []),
    connectToDevice: jest.fn(async () => true),
    getConnectedDevice: jest.fn(async () => null),
    disconnectFromDevice: jest.fn(async () => true),
    accept: jest.fn(async () => null),
    cancelAccept: jest.fn(async () => true),
    onBluetoothEnabled: jest.fn(() => subscription),
    onBluetoothDisabled: jest.fn(() => subscription),
    onDeviceDisconnected: jest.fn(() => subscription),
    onDeviceRead: jest.fn(() => subscription),
  },
  onBluetoothEnabled: jest.fn(() => subscription),
  onBluetoothDisabled: jest.fn(() => subscription),
  onDeviceDisconnected: jest.fn(() => subscription),
  onDeviceRead: jest.fn(() => subscription),
};
