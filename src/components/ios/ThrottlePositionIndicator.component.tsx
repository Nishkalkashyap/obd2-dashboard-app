import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '../../../util';
import {getColorForBar} from './RPMIndicator.component';
// import SensorsListComponent from './SensorsList.component';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.primary.color,
    paddingHorizontal: 50,
    paddingVertical: 20,
    borderRadius: 5,
  },
  barsContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column-reverse',
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
  width: number;
  height: number;
  parentStyle: ViewStyle;
  currentThrottle: number;
}) {
  const {width, height, parentStyle, currentThrottle} = props;

  const individualBarHeight = Math.round(height / totalNumberOfBars);
  const arr = new Array(totalNumberOfBars).fill(0);

  return (
    <View style={{...styles.container, ...parentStyle}}>
      <View style={styles.barsContainer}>
        {arr.map((item, index) => (
          <View
            key={index}
            style={{
              ...styles.bar,
              width: width,
              height: individualBarHeight,
              backgroundColor: getColorForBar(index, currentThrottle / 100)[0],
              // shadowColor: getColorForBar(index, currentRpm / maxRpm)[1],
            }}
          />
        ))}
      </View>
      {/* <SensorsListComponent
        list={[{caption: 'TPS', units: '%', value: `${currentThrottle}`}]}
      /> */}
    </View>
  );
}

export default ThrottlePositionIndicatorComponent;
