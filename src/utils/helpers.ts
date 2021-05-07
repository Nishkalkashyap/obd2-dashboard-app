import {PIDS} from '../obd/obdInfo';

export const helpers = {
  getSampleData: (zeroed?: boolean) => ({
    [PIDS.ENGINE_COOLANT_TEMPERATURE_SENSOR]: {
      name: 'temp',
      pid: PIDS.ENGINE_COOLANT_TEMPERATURE_SENSOR,
      unit: 'Celsius',
      value: zeroed ? '0' : Math.floor(Math.random() * 100).toString(),
    },
    [PIDS.ENGINE_RPM]: {
      name: 'rpm',
      pid: PIDS.ENGINE_RPM,
      unit: 'rev/min',
      value: zeroed ? '0' : Math.floor(Math.random() * 6000).toString(),
    },
    [PIDS.ENGINE_RUNTIME]: {
      name: 'runtm',
      pid: PIDS.ENGINE_RPM,
      unit: 'seconds',
      value: zeroed ? '0' : new Date().toLocaleTimeString(),
    },
    [PIDS.FUEL_PRESSURE_SENSOR]: {
      name: 'frp',
      pid: PIDS.ENGINE_RPM,
      unit: 'kPa',
      value: zeroed ? '0' : Math.floor(Math.random() * 800).toString(),
    },
    [PIDS.INTAKE_AIR_TEMPERATURE_SENSOR]: {
      name: 'iat',
      pid: PIDS.INTAKE_AIR_TEMPERATURE_SENSOR,
      unit: 'Celsius',
      value: zeroed ? '0' : Math.floor(Math.random() * 100).toString(),
    },
    [PIDS.INTAKE_MANIFOLD_ABSOLUTE_PRESSURE_SENSOR]: {
      name: 'map',
      pid: PIDS.INTAKE_MANIFOLD_ABSOLUTE_PRESSURE_SENSOR,
      unit: 'kPa',
      value: zeroed ? '0' : Math.floor(Math.random() * 255).toString(),
    },
    [PIDS.THROTTLE_POSITION_SENSOR]: {
      name: 'throttlepos',
      pid: PIDS.THROTTLE_POSITION_SENSOR,
      unit: '%',
      value: zeroed
        ? '0'
        : Math.floor(Math.random() * 100)
            .toString()
            .concat('.702004'),
    },
    [PIDS.VEHICLE_SPEED_SENSOR]: {
      name: 'vss',
      pid: PIDS.VEHICLE_SPEED_SENSOR,
      unit: 'km/h',
      value: zeroed ? '0' : Math.floor(Math.random() * 255).toString(),
    },
    [PIDS.SPARK_ADVANCE]: {
      name: 'sparkadv',
      pid: PIDS.SPARK_ADVANCE,
      unit: 'deg',
      value: zeroed ? '0' : Math.floor(Math.random() * 64).toString(),
    },
  }),
};
