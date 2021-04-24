import React, {useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
} from 'react-native';

import btClassic from 'react-native-bluetooth-classic';
import {requestAccessFineLocationPermission} from './util';

// const styles = StyleSheet.create({});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#aaaaaa',
  };

  useEffect(() => {
    const init = async () => {
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
      const devicesMetadata = devices.map(item => ({
        address: item.address,
        bonded: item.bonded,
        deviceClass: item.deviceClass,
        extra: item.extra,
        id: item.id,
        name: item.name,
        rssi: item.rssi,
      }));
      const obdDevice = devices.find(item => item.name.match(/obd/i));
      if (!obdDevice) {
        throw Error('OBD device not found');
      }
      const obdMetadata = devicesMetadata.find(item => item.name.match(/obd/i));
      console.log(JSON.stringify(obdMetadata, null, 4));

      /**
       * Connect with OBD device and register listeners
       */
      const connected = await obdDevice.connect({delimiter: '\r'});
      console.log(`OBD device connection status: ${connected}`);
      obdDevice.onDataReceived(data => {
        console.log(JSON.stringify(data, null, 4));
      });

      setInterval(() => {
        obdDevice
          .available()
          .then(readResult => {
            console.log(`Read result: ${readResult}`);
            return obdDevice.write('0105\r');
          })
          .then(writeResult => {
            console.log(`Write result: ${writeResult}`);
          })
          .catch(console.error);
      }, 1000);
    };

    init().catch(console.error);
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Text>Hello World</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
