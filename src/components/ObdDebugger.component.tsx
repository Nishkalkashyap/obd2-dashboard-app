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

  const getObdObject = () => obdDataObject;

  useEffect(() => {
    if (!connected) {
      return;
    }

    const subscription = device.onDataReceived(data => {
      // console.log(data.data);

      if (data.data.startsWith('>') || data.data === '\r') {
        return;
      }

      const parsedObdData = parseOBDCommand(data.data);
      const currentObject = getObdObject();
      setObdDataObject({
        ...currentObject,
        [parsedObdData.pid || '222']: parsedObdData,
      });
    });

    const interval = setInterval(() => {
      const currentObject = getObdObject();
      console.log(currentObject);

      device
        .write('010B\r')
        .then(() => {
          setTimeout(() => {
            device.write('0105\r');
          }, 100);
        })
        .then(() => {
          setTimeout(() => {
            device.write('010F\r');
          }, 200);
        })
        .catch(console.error);
    }, 1000);

    return () => {
      clearInterval(interval);
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
        keyExtractor={item => item.pid || ''}
        renderItem={({item}) => (
          <View>
            <Text>{`${item.pid}: ${item.value}${item.unit}`}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default ObdDebuggerComponent;
