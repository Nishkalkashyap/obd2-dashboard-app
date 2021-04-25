import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '../../../util';
import SvgImage from '../../assets/images/rpm.svg';

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: colors.primary.color,
  },
  svgImage: {
    zIndex: 1,
    position: 'absolute',
    top: '0%',
    borderWidth: 1,
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
    backgroundColor: colors.primary.color,
    borderWidth: 1,
    // shadowOpacity: 1,
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 3,
  },
});

const totalNumberOfBars = 50;

const getColorForBar = (index: number, rpmRatio: number) => {
  const barRatio = index / totalNumberOfBars;

  if (barRatio > rpmRatio) {
    return [colors.primary.color, colors.primary.tint];
  }

  if (index < 0.1 * totalNumberOfBars) {
    return [colors.secondary.shade, colors.secondary.tint];
  }
  if (index < 0.7 * totalNumberOfBars) {
    return [colors.success.shade, colors.success.tint];
  }
  if (index < 0.9 * totalNumberOfBars) {
    return [colors.warn.shade, colors.warn.tint];
  }

  return [colors.tertiary.shade, colors.tertiary.tint];
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
              backgroundColor: getColorForBar(index, currentRpm / maxRpm)[0],
              // shadowColor: getColorForBar(index, currentRpm / maxRpm)[1],
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default RPMIndicatorComponent;
