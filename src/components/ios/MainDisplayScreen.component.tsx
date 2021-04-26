import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {colors, font} from '../../../util';
import {PIDS} from '../../obd/obdInfo';
import {hooks} from '../../utils/hooks';
import DataIndicatorComponent from './DataIndicator.component';
import RPMIndicatorComponent from './RPMIndicator.component';
import SensorsListComponent from './SensorsList.component';
import ShiftLightsComponent from './ShiftLights.component';
// import ThrottlePositionIndicatorComponent from './ThrottlePositionIndicator.component';
import TimeIndicatorComponent from './TimeIndicator.component';

const sharedStyles = StyleSheet.create({
  borderedContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.primary.color,
    borderRadius: 10,
  },
  boxShadow: {
    shadowColor: colors.primary.tint,
    shadowRadius: 20,
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
  },
  textShadow: {
    textShadowColor: colors.light.color,
    textShadowRadius: 10,
  },
});

const seventyPercentWidth = 0.7 * Dimensions.get('screen').width;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  dataIndicatorContainer: {
    position: 'absolute',
    top: '4%',
    left: '2%',
  },
  shiftLightsContainer: {
    position: 'absolute',
    top: '2%',
    left: '35%',
    width: 500,
    paddingVertical: 20,
  },
  timeIndicator: {
    position: 'absolute',
    top: '2%',
    right: '3%',
    paddingVertical: 20,
  },
  rpmDisplay: {
    position: 'absolute',
    top: '10%',
    left: '5%',
    width: seventyPercentWidth,
  },
  rpmTextContainer: {
    ...sharedStyles.borderedContainer,
    // ...sharedStyles.textShadow,
    // ...sharedStyles.boxShadow,
    position: 'absolute',
    top: '10%',
    right: '3%',
    width: '20%',
    height: seventyPercentWidth / 4,
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  rpmText: {
    textAlign: 'center',
    fontSize: 75,
    color: colors.light.color,
    fontFamily: font.bold,
  },
  rpmTextCaption: {
    textAlign: 'center',
    fontSize: 26,
    color: colors.primary.color,
    fontFamily: font.regular,
  },
  sensorsListContainer: {
    position: 'absolute',
    top: '37%',
    right: '0%',
    width: '50%',
    // ...sharedStyles.textShadow,
    // ...sharedStyles.boxShadow,
  },
  gearDisplay: {
    ...sharedStyles.borderedContainer,
    ...sharedStyles.textShadow,
    position: 'absolute',
    top: '30%',
    left: '18%',
    fontSize: 360,
    textAlign: 'center',
    color: colors.light.color,
    zIndex: 2,
    fontFamily: font.bold,
  },
  throttleDisplay: {
    position: 'absolute',
    top: '35%',
    right: '7%',
  },
  speedDisplay: {
    ...sharedStyles.borderedContainer,
  },
});

function MainDisplayScreenComponent(props: {width: string; height: string}) {
  const {width, height} = props;

  const maxRpm = 6000;

  const listener = hooks.useDataListener();
  const data = {
    ect: listener[PIDS.ENGINE_COOLANT_TEMPERATURE_SENSOR],
    rpm: listener[PIDS.ENGINE_RPM],
    engineRuntime: listener[PIDS.ENGINE_RUNTIME], //pending
    fuelPressure: listener[PIDS.FUEL_PRESSURE_SENSOR],
    intakeAirTemperature: listener[PIDS.INTAKE_AIR_TEMPERATURE_SENSOR],
    map: listener[PIDS.INTAKE_MANIFOLD_ABSOLUTE_PRESSURE_SENSOR],
    tps: listener[PIDS.THROTTLE_POSITION_SENSOR],
    vss: listener[PIDS.VEHICLE_SPEED_SENSOR], //pending
    sparkAdvance: listener[PIDS.SPARK_ADVANCE],
  };

  const currentRpm = Number(data.rpm?.value) || 0;
  const sensorsList = [
    data.ect,
    data.fuelPressure,
    data.intakeAirTemperature,
    data.map,
    data.vss,
    data.sparkAdvance,
  ]
    .filter(item => item?.pid && item.name && item.value)
    .map(item => ({
      caption: item?.name || '',
      value: item?.value || '',
      units: item?.unit || '',
    }));

  return (
    <View style={{...styles.container, width, height}}>
      <DataIndicatorComponent
        data={listener}
        parentStyles={styles.dataIndicatorContainer}
      />
      <ShiftLightsComponent
        maxRpm={maxRpm}
        currentRpm={currentRpm}
        parentStyles={styles.shiftLightsContainer}
      />
      <TimeIndicatorComponent parentStyles={styles.timeIndicator} />
      <RPMIndicatorComponent
        width={styles.rpmDisplay.width}
        parentStyle={styles.rpmDisplay}
        maxRpm={maxRpm}
        currentRpm={currentRpm}
      />
      <Text style={styles.gearDisplay}>N</Text>
      <View style={styles.rpmTextContainer}>
        <Text style={styles.rpmText}>{currentRpm}</Text>
        <Text style={styles.rpmTextCaption}>RPM</Text>
      </View>
      <SensorsListComponent
        style={styles.sensorsListContainer}
        list={sensorsList}
      />
      {/* <ThrottlePositionIndicatorComponent
        height={500}
        width={50}
        parentStyle={styles.throttleDisplay}
        currentThrottle={Number(data.tps?.value || '0')}
      /> */}
      {/* <Text style={styles.speedDisplay}>Speed</Text> */}
    </View>
  );
}

export default MainDisplayScreenComponent;
