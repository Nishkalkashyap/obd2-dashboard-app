import React, {useContext} from 'react';
import {FlatList, StyleSheet, View, ViewStyle} from 'react-native';
import {Colors} from '../../../util';
import {ThemeContext} from '../../services/theme-provider.service';
import {hooks} from '../../utils/hooks';

const stylesCreator = (colors: Colors) =>
  StyleSheet.create({
    listContainer: {},
    light: {
      borderRadius: 200,
      width: 30,
      height: 30,
      marginHorizontal: 10,
      shadowColor: colors.light.color,
      shadowOpacity: 1,
      shadowRadius: 12,
      shadowOffset: {
        height: 0,
        width: 0,
      },
    },
  });

function ShiftLightsComponent(props: {
  maxRpm: number;
  currentRpm: number;
  parentStyles?: ViewStyle;
}) {
  const theme = useContext(ThemeContext);
  const colors = hooks.useColors(theme);
  const styles = stylesCreator(colors);

  const {maxRpm, currentRpm, parentStyles} = props;
  const list = [
    [colors.success.color, colors.success.tint],
    [colors.success.color, colors.success.tint],
    [colors.danger.color, colors.danger.tint],
    [colors.danger.color, colors.danger.tint],
    [colors.danger.color, colors.danger.tint],
    [colors.secondary.color, colors.secondary.tint],
    [colors.secondary.color, colors.secondary.tint],
    [colors.secondary.color, colors.secondary.tint],
  ];
  const rpmRatio = currentRpm / maxRpm;

  return (
    <FlatList
      horizontal={true}
      style={{...styles.listContainer, ...parentStyles}}
      data={list}
      keyExtractor={(item, index) => index.toString()}
      renderItem={item => {
        const canHighlight = item.index / list.length < rpmRatio;

        return (
          <View
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.light,
              backgroundColor: canHighlight
                ? item.item[0]
                : colors.medium.shade,
              shadowColor: canHighlight ? item.item[1] : '#00000000',
            }}
          />
        );
      }}
    />
  );
}

export default ShiftLightsComponent;
