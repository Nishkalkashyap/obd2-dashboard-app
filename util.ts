import {PermissionsAndroid, Platform} from 'react-native';
import btClassic, {BluetoothDevice} from 'react-native-bluetooth-classic';

export const btUtil = {
  getBluetoothDevices: async () => {
    /**
     * Request for permission
     */
    const granted = await requestAccessFineLocationPermission();
    if (!granted) {
      throw Error('Bluetooth permission rejected');
    }

    /**
     * Start OBD discovery
     */
    const devices = await btClassic.startDiscovery();
    return devices;
  },
  connectToDevice: async (device: BluetoothDevice) => {
    const connected = await device.connect({delimiter: '\r'});
    return connected;
  },
};

export async function requestAccessFineLocationPermission() {
  if (Platform.OS === 'ios') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Access fine location required for discovery',
      message:
        'In order to perform discovery, you must enable/allow ' +
        'fine location access.',
      buttonNeutral: 'Ask Me Later"',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export const colors = {
  primaryColor: 'dodgerblue',
  secondaryColor: 'team',
  textColor: '#ffffff',
};
