import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import RPMIndicatorComponent from './RPMIndicator.component';

const sharedStyles = StyleSheet.create({
  borderedContainer: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    borderRadius: 10,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  rpmDisplay: {
    position: 'absolute',
    top: '5%',
    left: '5%',
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
      <RPMIndicatorComponent width={1100} parentStyle={styles.rpmDisplay} />
      <Text style={styles.gearDisplay}>N</Text>
      {/* <Text style={styles.speedDisplay}>Speed</Text> */}
    </View>
  );
}

export default MainDisplayScreenComponent;
