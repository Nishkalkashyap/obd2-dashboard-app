import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../../util';
import RPMIndicatorComponent from './RPMIndicator.component';
import SensorsListComponent from './SensorsList.component';
import ShiftLightsComponent from './ShiftLights.component';

const sharedStyles = StyleSheet.create({
  borderedContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: colors.primary.color,
    borderRadius: 10,
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
  shiftLightsContainer: {
    position: 'absolute',
    top: '2%',
    left: '35%',
    width: 500,
    paddingVertical: 20,
  },
  rpmDisplay: {
    position: 'absolute',
    top: '8%',
    left: '5%',
    width: seventyPercentWidth,
  },
  rpmTextContainer: {
    ...sharedStyles.borderedContainer,
    position: 'absolute',
    top: '15%',
    right: '5%',
    width: '20%',
    height: seventyPercentWidth / 4,
    borderRadius: 5,
    display: 'flex',
    justifyContent: 'center',
  },
  rpmText: {
    textAlign: 'center',
    fontSize: 90,
    color: colors.light.color,
  },
  rpmTextCaption: {
    textAlign: 'center',
    fontSize: 30,
    color: colors.primary.color,
  },
  sensorsListContainer: {
    position: 'absolute',
    // top: '50%',
    bottom: '0%',
    right: '5%',
    width: '20%',
    // height: '50%',
  },
  gearDisplay: {
    ...sharedStyles.borderedContainer,
    ...sharedStyles.textShadow,
    position: 'absolute',
    top: '30%',
    height: '40%',
    left: '16%',
    width: '24%',
    fontSize: 360,
    // top: '35%',
    // height: '30%',
    // left: '42%',
    // width: '16%',
    // fontSize: 250,
    textAlign: 'center',
    color: colors.light.color,
    zIndex: 2,
  },
  speedDisplay: {
    ...sharedStyles.borderedContainer,
  },
});

function MainDisplayScreenComponent(props: {width: string; height: string}) {
  const {width, height} = props;

  const maxRpm = 6000;
  const currentRpm = 5900;
  return (
    <View style={{...styles.container, width, height}}>
      <ShiftLightsComponent
        maxRpm={maxRpm}
        currentRpm={currentRpm}
        parentStyles={styles.shiftLightsContainer}
      />
      <RPMIndicatorComponent
        width={styles.rpmDisplay.width}
        parentStyle={styles.rpmDisplay}
        maxRpm={maxRpm}
        currentRpm={currentRpm}
      />
      <Text style={styles.gearDisplay}>N</Text>
      <View style={styles.rpmTextContainer}>
        <Text style={styles.rpmText}>2300</Text>
        <Text style={styles.rpmTextCaption}>RPM</Text>
      </View>
      <SensorsListComponent
        style={styles.sensorsListContainer}
        list={[
          {caption: 'water temp1', value: '23', units: 'celsius'},
          {caption: 'water temp2', value: '23', units: 'celsius'},
          {caption: 'water temp3', value: '23', units: 'celsius'},
        ]}
      />
      {/* <Text style={styles.speedDisplay}>Speed</Text> */}
    </View>
  );
}

export default MainDisplayScreenComponent;
