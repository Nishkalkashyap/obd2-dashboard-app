import React, {useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {colors} from '../../util';
import {parseOBDCommand} from '../obd/obdParser';
import {IObdResponse} from '../obd/obdTypes';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: colors.light.color,
  },
  navbar: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: colors.primary.color,
    fontSize: 18,
    color: colors.light.color,
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

  const aggregateOBDData = useRef<{[pid: string]: IObdResponse}>({});

  useEffect(() => {
    const interval = setInterval(() => {
      // make post request here
      // console.log(aggregateOBDData.current);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  /**
   * Register data subscription
   */
  useEffect(() => {
    if (!connected) {
      return;
    }

    const subscription = device.onDataReceived(data => {
      if (data.data.startsWith('>') || data.data === '\r') {
        return;
      }

      const parsedObdData = parseOBDCommand(data.data);
      aggregateOBDData.current[parsedObdData.pid || '222'] = parsedObdData;
    });

    const interval = setInterval(() => {
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
  }, [device, connected]);

  /**
   * Connect to device
   */
  useEffect(() => {
    const init = async (): Promise<{dispose: Function}> => {
      const connectionStatus = await device.connect({delimiter: '\r'});
      setConnected(connectionStatus);
      if (connectionStatus) {
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
  }, [device]);

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
        data={Object.values(aggregateOBDData)}
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
