import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

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
  gearDisplay: {
    ...sharedStyles.borderedContainer,
    position: 'relative',
    top: '35%',
    height: '30%',
    left: '42%',
    width: '16%',
    textAlign: 'center',
    fontSize: 250,
    color: '#ffffff',
  },
  speedDisplay: {
    ...sharedStyles.borderedContainer,
  },
});

function MainDisplayScreenComponent(props: {width: string; height: string}) {
  const {width, height} = props;

  return (
    <View style={{...styles.container, width, height}}>
      <Text style={styles.gearDisplay}>N</Text>
      {/* <Text style={styles.speedDisplay}>Speed</Text> */}
    </View>
  );
}

export default MainDisplayScreenComponent;
