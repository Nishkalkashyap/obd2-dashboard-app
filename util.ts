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

export const font = {
  black: 'Formula1-Display-Black',
  bold: 'Formula1-Display-Bold',
  regular: 'Formula1-Display-Regular',
  wide: 'Formula1-Display-Wide',
};

export type Colors = typeof colors;
export const colors = {
  primary: {
    color: '#3880ff',
    shade: '#3171e0',
    tint: '#4c8dff',
  },
  secondary: {
    color: '#3dc2ff',
    shade: '#36abe0',
    tint: '#50c8ff',
  },
  tertiary: {
    color: '#5260ff',
    shade: '#4854e0',
    tint: '#6370ff',
  },
  success: {
    color: '#2dd36f',
    shade: '#28ba62',
    tint: '#42d77d',
  },
  warn: {
    color: '#ffc409',
    shade: '#e0ac08',
    tint: '#ffca22',
  },
  danger: {
    color: '#eb445a',
    shade: '#cf3c4f',
    tint: '#ed576b',
  },
  dark: {
    color: '#222428',
    shade: '#1e2023',
    tint: '#383a3e',
  },
  medium: {
    color: '#92949c',
    shade: '#808289',
    tint: '#9d9fa6',
  },
  light: {
    color: '#f4f5f8',
    shade: '#d7d8da',
    tint: '#f5f6f9',
  },
};

export const writePIDsToDevice = (
  pids: string[],
  device: BluetoothDevice,
  delay: number,
) => {
  return pids.reduce((a, b) => {
    return a.then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          device.write(`01${b}\r`).finally(() => {
            resolve();
          });
        }, delay);
      });
    });
  }, Promise.resolve());
};

export function promiseWithTimeout(ms: number, promise: Promise<any>) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('TIMEOUT'));
    }, ms);

    promise
      .then((value: any) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason: any) => {
        clearTimeout(timer);
        reject(reason);
      });
  });
}

// const pp = (pids) => {
//   return pids.reduce((a, b) => {
//     return a.then(() => {
//       return new Promise(resolve => {
//         setTimeout(() => {
//           console.log(b);
//           resolve();
//         }, 100);
//       });
//     });
//   }, Promise.resolve());
// };
