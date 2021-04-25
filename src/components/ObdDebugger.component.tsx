import React, {useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {colors, writePIDsToDevice} from '../../util';
import {PIDS} from '../obd/obdInfo';
import {parseOBDCommand} from '../obd/obdParser';
import {IObdResponse} from '../obd/obdTypes';
import {hooks} from '../utils/hooks';

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
  const hostname = hooks.useHostName();
  const [renderValues, setRenderValues] = useState<IObdResponse[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRenderValues(Object.values(aggregateOBDData.current));
      if (hostname) {
        fetch(`http://${hostname}/obd/save-data`, {
          method: 'POST',
          body: JSON.stringify(aggregateOBDData.current),
          headers: {
            'content-type': 'application/json',
          },
        })
          .then(response => {
            console.log(response.status);
          })
          .catch(console.error);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [hostname]);

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
      const {
        ENGINE_COOLANT_TEMPERATURE_SENSOR,
        // ENGINE_RPM,
        // ENGINE_RUNTIME,
        // FUEL_PRESSURE_SENSOR,
        // INTAKE_AIR_TEMPERATURE_SENSOR,
        // INTAKE_MANIFOLD_ABSOLUTE_PRESSURE_SENSOR,
        // MASS_AIR_FLOW_SENSOR,
        THROTTLE_POSITION_SENSOR,
        // VEHICLE_SPEED_SENSOR,
        // SPARK_ADVANCE,
      } = PIDS;

      writePIDsToDevice(
        [
          ENGINE_COOLANT_TEMPERATURE_SENSOR,
          // ENGINE_RPM,
          // ENGINE_RUNTIME,
          // FUEL_PRESSURE_SENSOR,
          // INTAKE_AIR_TEMPERATURE_SENSOR,
          // INTAKE_MANIFOLD_ABSOLUTE_PRESSURE_SENSOR,
          // MASS_AIR_FLOW_SENSOR,
          THROTTLE_POSITION_SENSOR,
          // VEHICLE_SPEED_SENSOR,
          // SPARK_ADVANCE,
        ],
        device,
      )
        .catch(console.error)
        .finally(() => {
          // console.log(`Resolved all promises`);
        });
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
        data={renderValues}
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
