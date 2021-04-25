import React from 'react';
import {FlatList, StyleSheet, View, ViewStyle} from 'react-native';

const styles = StyleSheet.create({
  listContainer: {},
  light: {
    borderRadius: 200,
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },
});

function ShiftLightsComponent(props: {
  maxRpm: number;
  currentRpm: number;
  parentStyles?: ViewStyle;
}) {
  const {maxRpm, currentRpm, parentStyles} = props;
  const list = ['green', 'green', 'red', 'red', 'red', 'blue', 'blue', 'blue'];
  const rpmRatio = currentRpm / maxRpm;

  return (
    <FlatList
      horizontal={true}
      style={{...styles.listContainer, ...parentStyles}}
      data={list}
      keyExtractor={(item, index) => index.toString()}
      renderItem={item => (
        <View
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            ...styles.light,
            backgroundColor:
              item.index / list.length < rpmRatio ? item.item : '#ffffff22',
          }}
        />
      )}
    />
  );
}

export default ShiftLightsComponent;
