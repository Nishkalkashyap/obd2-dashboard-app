import React, {useEffect, useRef, useState} from 'react';
import {FlatList, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {BluetoothDevice} from 'react-native-bluetooth-classic';
import {colors} from '../../util';
import {PIDS} from '../obd/obdInfo';
import {IObdResponse} from '../obd/obdTypes';
import {OBDQueryService} from '../services/obd-query.service';
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

const pidsToReadWithDelay = [
  {
    PID: PIDS.ENGINE_COOLANT_TEMPERATURE_SENSOR,
    delay: 2000,
  },
  {
    PID: PIDS.ENGINE_RPM,
    delay: 100,
  },
  {
    PID: PIDS.ENGINE_RUNTIME,
    delay: 3000,
  },
  {
    PID: PIDS.FUEL_PRESSURE_SENSOR,
    delay: 2000,
  },
  {
    PID: PIDS.INTAKE_AIR_TEMPERATURE_SENSOR,
    delay: 5000,
  },
  {
    PID: PIDS.INTAKE_MANIFOLD_ABSOLUTE_PRESSURE_SENSOR,
    delay: 500,
  },
  {
    PID: PIDS.THROTTLE_POSITION_SENSOR,
    delay: 100,
  },
  {
    PID: PIDS.VEHICLE_SPEED_SENSOR,
    delay: 2000,
  },
  {
    PID: PIDS.SPARK_ADVANCE,
    delay: 1000,
  },
];

// const pidsToRead = [
//   PIDS.ENGINE_COOLANT_TEMPERATURE_SENSOR,
//   PIDS.ENGINE_RPM,
//   PIDS.ENGINE_RUNTIME,
//   PIDS.FUEL_PRESSURE_SENSOR,
//   PIDS.INTAKE_AIR_TEMPERATURE_SENSOR,
//   PIDS.INTAKE_MANIFOLD_ABSOLUTE_PRESSURE_SENSOR,
//   PIDS.MASS_AIR_FLOW_SENSOR,
//   PIDS.THROTTLE_POSITION_SENSOR,
//   PIDS.VEHICLE_SPEED_SENSOR,
//   PIDS.SPARK_ADVANCE,
// ];

// const timePerPid = 30;
// const gracePeriod = 100;
// const totalTimeRequired = pidsToRead.length * timePerPid + gracePeriod;

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
    }, 100);

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

    const obdQueryService = new OBDQueryService(pidsToReadWithDelay, device);
    const subscription = obdQueryService.subscribe(data => {
      aggregateOBDData.current[data.pid || '222'] = data;
    });

    return () => {
      subscription.remove();
    };
  }, [device, connected]);

  // useEffect(() => {
  //   if (!connected) {
  //     return;
  //   }

  //   const subscription = device.onDataReceived(data => {
  //     if (data.data.startsWith('>') || data.data === '\r') {
  //       return;
  //     }

  //     const parsedObdData = parseOBDCommand(data.data);
  //     aggregateOBDData.current[parsedObdData.pid || '222'] = parsedObdData;
  //   });

  //   const interval = setInterval(() => {
  //     writePIDsToDevice(pidsToRead, device, timePerPid)
  //       .catch(console.error)
  //       .finally(() => {
  //         // console.log(`Resolved all promises`);
  //       });
  //   }, totalTimeRequired);

  //   return () => {
  //     clearInterval(interval);
  //     subscription.remove();
  //   };
  // }, [device, connected]);

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
