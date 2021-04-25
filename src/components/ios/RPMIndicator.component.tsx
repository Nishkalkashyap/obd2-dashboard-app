import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '../../../util';
import SvgImage from '../../assets/images/rpm.svg';

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: colors.primaryColor,
  },
  svgImage: {
    zIndex: 1,
    position: 'absolute',
    top: '0%',
    borderWidth: 20,
    borderColor: '#000',
  },
  barsContainer: {
    position: 'absolute',
    top: '0%',
    zIndex: 0,
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  bar: {
    backgroundColor: colors.primaryColor,
    borderWidth: 1,
    borderColor: '#000',
  },
});

const totalNumberOfBars = 50;

const getColorForBar = (index: number, rpmRatio: number) => {
  const defaultColor = colors.primaryColor;
  const barRatio = index / totalNumberOfBars;

  if (barRatio > rpmRatio) {
    return defaultColor;
  }

  if (index < 0.15 * totalNumberOfBars) {
    return 'teal';
  }
  if (index < 0.65 * totalNumberOfBars) {
    return 'green';
  }
  if (index < 0.8 * totalNumberOfBars) {
    return 'yellow';
  }

  return 'blue';
};

function RPMIndicatorComponent(props: {
  width: number;
  parentStyle?: ViewStyle;
  maxRpm: number;
  currentRpm: number;
}) {
  const {width, parentStyle, maxRpm, currentRpm} = props;
  const height = width / 3;

  const individualBarWidth = Math.round(width / totalNumberOfBars);
  const arr = new Array(totalNumberOfBars).fill(0);
  return (
    <View style={{...styles.container, ...parentStyle}}>
      <SvgImage width={width} height={height} style={styles.svgImage} />
      <View style={styles.barsContainer}>
        {arr.map((item, index) => (
          <View
            key={index}
            style={{
              ...styles.bar,
              width: individualBarWidth,
              height: height,
              backgroundColor: getColorForBar(index, currentRpm / maxRpm),
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default RPMIndicatorComponent;
