import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  RefreshControl,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {btUtil} from './util';

// import btClassic from 'react-native-bluetooth-classic';
// import {requestAccessFineLocationPermission} from './util';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#aaaaaa',
  },
});

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [refreshing, setRefreshing] = useState(true);
  const [btDevices, setBtDevices] = useState<BluetoothDevice[]>([]);

  useEffect(() => {
    if (refreshing === false) {
      return;
    }

    btUtil
      .getBluetoothDevices()
      .then(devices => {
        setBtDevices(devices);
      })
      .catch(console.error)
      .finally(() => {
        setRefreshing(false);
      });
  }, [refreshing]);

  // useEffect(() => {
  //   const init = async () => {
  //     /**
  //      * Request for permission
  //      */
  //     const granted = await requestAccessFineLocationPermission();
  //     if (!granted) {
  //       throw Error('Bluetooth permission rejected');
  //     }

  //     /**
  //      * Start OBD discovery
  //      */
  //     const devices = await btClassic.startDiscovery();
  //     const devicesMetadata = devices.map(item => ({
  //       address: item.address,
  //       bonded: item.bonded,
  //       deviceClass: item.deviceClass,
  //       extra: item.extra,
  //       id: item.id,
  //       name: item.name,
  //       rssi: item.rssi,
  //     }));
  //     const obdDevice = devices.find(item => item.name.match(/obd/i));
  //     if (!obdDevice) {
  //       throw Error('OBD device not found');
  //     }
  //     const obdMetadata = devicesMetadata.find(item => item.name.match(/obd/i));
  //     console.log(JSON.stringify(obdMetadata, null, 4));

  //     /**
  //      * Connect with OBD device and register listeners
  //      */
  //     const connected = await obdDevice.connect({delimiter: '\r'});
  //     console.log(`OBD device connection status: ${connected}`);
  //     obdDevice.onDataReceived(data => {
  //       console.log(JSON.stringify(data, null, 4));
  //     });

  //     setInterval(() => {
  //       obdDevice
  //         .available()
  //         .then(readResult => {
  //           console.log(`Read result: ${readResult}`);
  //           return obdDevice.write('0105\r');
  //         })
  //         .then(writeResult => {
  //           console.log(`Write result: ${writeResult}`);
  //         })
  //         .catch(console.error);
  //     }, 1000);
  //   };

  //   init().catch(console.error);
  // }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setBtDevices([]);
              setRefreshing(true);
            }}
          />
        }
        data={btDevices}
        keyExtractor={devices => devices.address}
        renderItem={({item}) => (
          <View key={item.address}>
            <Text>{item.name}</Text>
            <Text>{item.address}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default App;
