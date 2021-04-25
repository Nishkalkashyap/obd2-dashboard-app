import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import SvgImage from '../../assets/images/rpm.svg';

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: 'dodgerblue',
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
    backgroundColor: 'dodgerblue',
    borderWidth: 1,
    borderColor: '#000',
  },
});

const totalNumberOfBars = 50;

function RPMIndicatorComponent(props: {
  width: number;
  parentStyle?: ViewStyle;
}) {
  const {width, parentStyle} = props;
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
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default RPMIndicatorComponent;
