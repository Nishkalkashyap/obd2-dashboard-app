/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {parseOBDCommand} from '../obd/obdParser';
import {IObdResponse} from '../obd/obdTypes';

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
});

function ObdDebuggerComponent(props: {
  device: BluetoothDevice;
  dismissModalHandle: Function;
}) {
  const {device, dismissModalHandle} = props;
  const [connected, setConnected] = useState(false);
  const [obdDataObject, setObdDataObject] = useState<{
    [pid: string]: IObdResponse;
  }>({});

  useEffect(() => {
    if (!connected) {
      return;
    }

    const subscription = device.onDataReceived(data => {
      const parsedObdData = parseOBDCommand(data.data);
      setObdDataObject({
        ...obdDataObject,
        [parsedObdData.pid || '222']: parsedObdData,
      });
    });

    setInterval(() => {
      device.write('0105\r');
    }, 1000);

    return () => {
      subscription.remove();
    };
  }, [connected]);

  useEffect(() => {
    const init = async (): Promise<{dispose: Function}> => {
      const connectionStatus = await device.connect({delimiter: '\r'});
      setConnected(connectionStatus);
      if (connected) {
        return {
          dispose: () => {
            device.disconnect();
          },
        };
      }

      return {
        dispose: () => {},
      };
    };

    let disposable: Function | null = null;
    init()
      .then(value => {
        disposable = value.dispose;
      })
      .catch(console.error);

    return () => {
      if (disposable) {
        disposable();
      }
    };
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.navbar}>
        <Text>{device.name}</Text>
        <Text
          onPress={() => {
            dismissModalHandle();
          }}>
          Dismiss
        </Text>
      </View>
      <FlatList
        data={Object.values(obdDataObject)}
        keyExtractor={devices => devices.pid || ''}
        renderItem={({item}) => (
          <View key={item.pid}>
            <Text>{`${item.name}: ${item.value}${item.unit}`}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default ObdDebuggerComponent;
