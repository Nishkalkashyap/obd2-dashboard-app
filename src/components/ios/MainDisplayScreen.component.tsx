import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import RPMIndicatorComponent from './RPMIndicator.component';

const sharedStyles = StyleSheet.create({
  borderedContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    borderRadius: 10,
  },
});

const seventyPercentWidth = 0.7 * Dimensions.get('screen').width;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  rpmDisplay: {
    position: 'absolute',
    top: '5%',
    left: '5%',
    width: seventyPercentWidth,
  },
  rpmTextContainer: {
    ...sharedStyles.borderedContainer,
    top: '12%',
    width: '20%',
    height: seventyPercentWidth / 4,
    borderRadius: 5,
    position: 'absolute',
    right: '5%',
    display: 'flex',
    justifyContent: 'center',
  },
  rpmText: {
    textAlign: 'center',
    fontSize: 90,
    color: '#fff',
  },
  rpmTextCaption: {
    textAlign: 'center',
    fontSize: 30,
    color: 'dodgerblue',
  },
  gearDisplay: {
    ...sharedStyles.borderedContainer,
    position: 'absolute',
    top: '35%',
    height: '30%',
    left: '42%',
    width: '16%',
    textAlign: 'center',
    fontSize: 250,
    color: '#ffffff',
    zIndex: 2,
  },
  speedDisplay: {
    ...sharedStyles.borderedContainer,
  },
});

function MainDisplayScreenComponent(props: {width: string; height: string}) {
  const {width, height} = props;

  return (
    <View style={{...styles.container, width, height}}>
      <RPMIndicatorComponent
        width={styles.rpmDisplay.width}
        parentStyle={styles.rpmDisplay}
      />
      <Text style={styles.gearDisplay}>N</Text>
      <View style={styles.rpmTextContainer}>
        <Text style={styles.rpmText}>2300</Text>
        <Text style={styles.rpmTextCaption}>RPM</Text>
      </View>
      {/* <Text style={styles.speedDisplay}>Speed</Text> */}
    </View>
  );
}

export default MainDisplayScreenComponent;
