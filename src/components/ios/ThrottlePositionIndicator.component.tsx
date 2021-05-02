import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '../../../util';
import {getColorForBar} from './RPMIndicator.component';
import {SensorItemComponent} from './SensorsList.component';
// import SensorsListComponent from './SensorsList.component';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: colors.primary.color,
    // paddingHorizontal: 50,
    // paddingVertical: 20,
    // borderRadius: 5,
    // transform: [{rotate: '90deg'}],
  },
  barsContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  bar: {
    backgroundColor: colors.primary.color,
    borderWidth: 1,
    borderRadius: 5,
  },
});

const totalNumberOfBars = 50;

function ThrottlePositionIndicatorComponent(props: {
  thickness: number;
  length: number;
  parentStyle: ViewStyle;
  currentThrottle: number;
}) {
  const {thickness, length, parentStyle, currentThrottle} = props;

  const individualBarHeight = Math.round(length / totalNumberOfBars);
  const arr = new Array(totalNumberOfBars).fill(0);

  return (
    <View style={{...styles.container, ...parentStyle}}>
      <SensorItemComponent
        item={{caption: 'TPS', units: '%', value: `${currentThrottle}`}}
        style={{minWidth: '20%', marginRight: 20}}
      />
      <View style={styles.barsContainer}>
        {arr.map((item, index) => (
          <View
            key={index}
            style={{
              ...styles.bar,
              width: individualBarHeight,
              height: thickness,
              // width: thickness,
              // height: individualBarHeight,
              backgroundColor: getColorForBar(index, currentThrottle / 100)[0],
              // shadowColor: getColorForBar(index, currentRpm / maxRpm)[1],
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default ThrottlePositionIndicatorComponent;
