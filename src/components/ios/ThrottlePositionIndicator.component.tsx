import React, {useContext} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {Colors} from '../../../util';
import {ThemeContext} from '../../services/theme-provider.service';
import {getColorForBar} from './RPMIndicator.component';
import {SensorItemComponent} from './SensorsList.component';
// import SensorsListComponent from './SensorsList.component';

const stylesCreator = (colors: Colors) =>
  StyleSheet.create({
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
  const theme = useContext(ThemeContext);
  const styles = stylesCreator(theme.colors);

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
              backgroundColor: getColorForBar(
                index,
                currentThrottle / 100,
                theme.colors,
              )[0],
              // shadowColor: getColorForBar(index, currentRpm / maxRpm)[1],
            }}
          />
        ))}
      </View>
    </View>
  );
}

export default ThrottlePositionIndicatorComponent;
