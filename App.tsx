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
    backgroundColor: '#ffffff',
  },
  navbar: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'dodgerblue',
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  refreshingText: {
    textAlign: 'center',
    fontSize: 18,
  },
  listItem: {
    display: 'flex',
    marginVertical: 5,
    marginHorizontal: 5,
    paddingVertical: 5,
    paddingHorizontal: 5,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'black',
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
      <Text style={styles.navbar}>OBD II</Text>
      {refreshing && <Text style={styles.refreshingText}>Refreshing</Text>}
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
          <View key={item.address} style={styles.listItem}>
            <Text>{item.name}</Text>
            <Text>{item.address}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default App;
