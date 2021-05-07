import React, {useContext} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Svg, Path} from 'react-native-svg';
import {Colors} from '../../../util';
import {ThemeContext} from '../../services/theme-provider.service';
import {hooks} from '../../utils/hooks';

const stylesCreator = (colors: Colors) =>
  StyleSheet.create({
    container: {
      // borderWidth: 1,
      // borderColor: colors.primary.color,
    },
    svgImage: {
      zIndex: 1,
      position: 'absolute',
      top: '0%',
      borderWidth: 1,
      borderColor: colors.backgroundColor,
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
      borderColor: colors.backgroundColor,
    },
  });

const totalNumberOfBars = 50;

export const getColorForBar = (
  index: number,
  rpmRatio: number,
  colors: Colors,
) => {
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

const RPMSvg = (props: {
  color: string;
  width: number;
  height: number;
  style?: ViewStyle;
}) => {
  const {color, width, height, style} = props;

  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 1203 400"
      fill="none"
      style={style}>
      <Path
        d="M1 291C1 291 132.5 51.4999 261.5 15.5C390.5 -20.4999 1202 23 1202 23V1H1V291Z"
        fill={color}
      />
      <Path
        d="M1202 276C1202 276 487 96.9998 324 134C161 171 1 399.5 1 399.5H1202V276Z"
        fill={color}
      />
      <Path
        d="M1 291C1 291 132.5 51.4999 261.5 15.5C390.5 -20.4999 1202 23 1202 23M1 291V399.5M1 291V1H1202V23M1202 23V276M1202 276C1202 276 487 96.9998 324 134C161 171 1 399.5 1 399.5M1202 276V399.5H1"
        stroke={color}
      />
    </Svg>
  );
};

function RPMIndicatorComponent(props: {
  width: number;
  parentStyle?: ViewStyle;
  maxRpm: number;
  currentRpm: number;
}) {
  const theme = useContext(ThemeContext);
  const colors = hooks.useColors(theme);
  const styles = stylesCreator(colors);

  const {width, parentStyle, maxRpm, currentRpm} = props;
  const height = width / 3;

  const individualBarWidth = Math.round(width / totalNumberOfBars);
  const arr = new Array(totalNumberOfBars).fill(0);
  return (
    <View style={{...styles.container, ...parentStyle}}>
      {/* <SvgImage width={width} height={height} style={styles.svgImage} /> */}
      <RPMSvg
        width={width}
        height={height}
        color={colors.backgroundColor}
        style={styles.svgImage}
      />
      <View style={styles.barsContainer}>
        {arr.map((item, index) => (
          <View
            key={index}
            style={{
              ...styles.bar,
              width: individualBarWidth,
              height: height,
              backgroundColor: getColorForBar(
                index,
                currentRpm / maxRpm,
                colors,
              )[0],
              // shadowColor: getColorForBar(index, currentRpm / maxRpm)[1],
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default RPMIndicatorComponent;
