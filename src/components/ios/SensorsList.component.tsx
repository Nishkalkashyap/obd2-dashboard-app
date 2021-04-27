import React from 'react';
import {StyleSheet, View, ViewStyle, Text} from 'react-native';
import {colors, font} from '../../../util';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flatListItem: {
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minWidth: '50%',
  },
  flatListText: {
    color: colors.light.color,
    fontSize: 90,
    textAlign: 'center',
    fontFamily: font.bold,
  },
  flatListUnits: {
    paddingLeft: 10,
  },
  flatListCaption: {
    color: colors.light.color,
    fontSize: 20,
    textAlign: 'center',
    fontFamily: font.bold,
  },
});

export const SensorItemComponent = (props: {
  item: {caption: string; value: string; units: string};
  style?: ViewStyle;
}) => {
  const {item, style} = props;

  return (
    <View style={{...styles.flatListItem, ...style}} key={item.caption}>
      <Text style={styles.flatListText}>{item.value}</Text>
      <Text style={styles.flatListCaption}>
        {item.caption}
        <Text style={styles.flatListUnits}>{`  (${item.units})`}</Text>
      </Text>
    </View>
  );
};

function SensorsListComponent(props: {
  style?: ViewStyle;
  list: {
    value: string;
    caption: string;
    units: string;
  }[];
}) {
  const {list, style} = props;

  return (
    <View style={{...styles.container, ...style}}>
      {list.map(item => (
        <SensorItemComponent key={item.caption} item={item} />
      ))}
    </View>
  );
}

export default SensorsListComponent;
