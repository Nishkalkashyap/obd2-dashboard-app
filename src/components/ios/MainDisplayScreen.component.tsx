import React, {useContext, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {font} from '../../../util';
import {PIDS} from '../../obd/obdInfo';
import {
  ExtendedThemeColors,
  ThemeContext,
} from '../../services/theme-provider.service';
import {helpers} from '../../utils/helpers';
import {hooks} from '../../utils/hooks';
import DataIndicatorComponent from './DataIndicator.component';
import MapViewComponent from './MapView.component';
import RPMIndicatorComponent from './RPMIndicator.component';
import SensorsListComponent, {
  SensorItemComponent,
} from './SensorsList.component';
import ShiftLightsComponent from './ShiftLights.component';
import ThrottlePositionIndicatorComponent from './ThrottlePositionIndicator.component';
import TimeIndicatorComponent from './TimeIndicator.component';

const sharedStylesCreator = (colors: ExtendedThemeColors) =>
  StyleSheet.create({
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
const stylesCreator = (colors: ExtendedThemeColors) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.backgroundColor,
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
      ...sharedStylesCreator(colors).borderedContainer,
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
      color: colors.textColor,
      fontFamily: font.bold,
    },
    rpmTextCaption: {
      textAlign: 'center',
      fontSize: 26,
      color: colors.textColor,
      fontFamily: font.bold,
    },
    sensorsListContainer: {
      position: 'absolute',
      top: '37%',
      right: '0%',
      width: '50%',
      // ...sharedStyles.textShadow,
      // ...sharedStyles.boxShadow,
    },
    // gearDisplay: {
    //   ...sharedStyles.borderedContainer,
    //   ...sharedStyles.textShadow,
    //   position: 'absolute',
    //   top: '30%',
    //   left: '18%',
    //   fontSize: 360,
    //   textAlign: 'center',
    //   color: colors.light.color,
    //   zIndex: 2,
    //   fontFamily: font.bold,
    // },
    vssDisplay: {
      position: 'absolute',
      top: '50%',
      left: '20%',
      width: '20%',
      paddingHorizontal: 0,
      paddingVertical: 0,
      textAlign: 'center',
      color: colors.textColor,
      zIndex: 2,
      fontFamily: font.bold,
      transform: [{scale: 3}],
    },
    mapDisplay: {
      position: 'absolute',
      top: '37%',
      left: '10%',
      width: '44%',
      height: '44%',
      borderRadius: 5,
    },
    throttleDisplay: {
      position: 'absolute',
      bottom: '0%',
      left: '5%',
    },
  });

function MainDisplayScreenComponent(props: {width: string; height: string}) {
  const {width, height} = props;

  const theme = useContext(ThemeContext);
  const colors = hooks.useColors(theme);
  const styles = stylesCreator(colors);
  const [canShowMap, setCanShowMap] = useState(false);

  const maxRpm = 6000;

  const defaultData = helpers.getSampleData(true);

  const listener = hooks.useDataListener() || defaultData;
  const data = {
    ect: listener[PIDS.ENGINE_COOLANT_TEMPERATURE_SENSOR],
    rpm: listener[PIDS.ENGINE_RPM],
    // engineRuntime: listener[PIDS.ENGINE_RUNTIME], //pending
    fuelPressure: listener[PIDS.FUEL_PRESSURE_SENSOR],
    intakeAirTemperature: listener[PIDS.INTAKE_AIR_TEMPERATURE_SENSOR],
    map: listener[PIDS.INTAKE_MANIFOLD_ABSOLUTE_PRESSURE_SENSOR],
    tps: listener[PIDS.THROTTLE_POSITION_SENSOR],
    vss: listener[PIDS.VEHICLE_SPEED_SENSOR],
    sparkAdvance: listener[PIDS.SPARK_ADVANCE],
  };

  if (data.sparkAdvance) {
    data.sparkAdvance.name = 'sparkadv';
    data.sparkAdvance.unit = 'deg';
  }

  const currentRpm = Math.floor(Number(data.rpm?.value) || 0);
  const sensorsList = [
    data.ect,
    data.fuelPressure,
    data.intakeAirTemperature,
    data.map,
    // data.vss,
    data.sparkAdvance,
  ]
    .filter(item => item?.pid && item.name && item.value)
    .map(item => ({
      caption: item?.name || '',
      value: item?.value || '',
      units: item?.unit || '',
    }));

  if (canShowMap && data.vss) {
    sensorsList.push({
      caption: data.vss.name || '',
      units: data.vss.unit || '',
      value: data.vss.value || '',
    });
  }

  const currentTpsValue = Number.parseFloat(
    Number.parseFloat(data.tps?.value || '0').toPrecision(3),
  );

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
      {canShowMap && <MapViewComponent styles={styles.mapDisplay} />}
      {!canShowMap && (
        <SensorItemComponent
          style={styles.vssDisplay}
          item={{
            caption: `${data.vss?.name}`,
            units: `${data.vss?.unit}`,
            value: `${data.vss?.value}`,
          }}
          onClick={() => {
            setCanShowMap(true);
          }}
        />
      )}
      <TouchableOpacity
        style={styles.rpmTextContainer}
        onPress={() => {
          theme.changeTheme();
        }}>
        <Text style={styles.rpmText}>{currentRpm}</Text>
        <Text
          style={styles.rpmTextCaption}
          onPress={() => {
            theme.changeTheme();
          }}>
          RPM
        </Text>
      </TouchableOpacity>
      <SensorsListComponent
        style={styles.sensorsListContainer}
        list={sensorsList}
        onClick={index => {
          if (index === sensorsList.length - 1) {
            setCanShowMap(!canShowMap);
          }
        }}
      />
      <ThrottlePositionIndicatorComponent
        length={950}
        thickness={50}
        parentStyle={styles.throttleDisplay}
        currentThrottle={currentTpsValue}
      />
    </View>
  );
}

export default MainDisplayScreenComponent;
