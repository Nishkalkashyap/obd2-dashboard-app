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
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import ObdDebuggerComponent from './ObdDebugger.component';
import {btUtil, colors} from '../../util';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  navbar: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: colors.primaryColor,
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

const AndroidRoot = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [refreshing, setRefreshing] = useState(true);
  const [btDevices, setBtDevices] = useState<BluetoothDevice[]>([]);
  const [
    currentBtDevice,
    setCurrentBtDevice,
  ] = useState<BluetoothDevice | null>(null);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={styles.navbar}>OBD II</Text>
      {refreshing && <Text style={styles.refreshingText}>Refreshing</Text>}
      <Modal animationType="slide" visible={!!currentBtDevice}>
        {currentBtDevice && (
          <ObdDebuggerComponent
            device={currentBtDevice}
            dismissModalHandle={() => {
              setCurrentBtDevice(null);
            }}
          />
        )}
      </Modal>
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
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Stop',
                'Are you sure you want to connect to device?',
                [
                  {
                    text: 'Yes',
                    style: 'default',
                    onPress: () => {
                      setCurrentBtDevice(item);
                    },
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ],
              );
            }}>
            <View key={item.address} style={styles.listItem}>
              <Text>{`Name: ${item.name}`}</Text>
              <Text>{`Address: ${item.address}`}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default AndroidRoot;
