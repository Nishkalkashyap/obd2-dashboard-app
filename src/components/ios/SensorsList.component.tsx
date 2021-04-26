import React from 'react';
import {FlatList, StyleSheet, View, ViewStyle, Text} from 'react-native';
import {colors} from '../../../util';

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: 'red',
  },
  flatList: {
    display: 'flex',
    flexDirection: 'column',
  },
  flatListItem: {
    borderWidth: 1,
    borderColor: colors.primary.color,
    borderRadius: 2,
    marginHorizontal: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minWidth: '15%',
  },
  flatListText: {
    color: colors.light.color,
    fontSize: 50,
    textAlign: 'center',
  },
  flatListUnits: {
    paddingLeft: 10,
    color: colors.light.color,
  },
  flatListCaption: {
    color: colors.primary.color,
    fontSize: 20,
    textAlign: 'center',
  },
});

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
      <FlatList
        horizontal={true}
        style={styles.flatList}
        keyExtractor={item => item.caption}
        data={list}
        renderItem={item => (
          <View style={styles.flatListItem}>
            <Text style={styles.flatListText}>{item.item.value}</Text>
            <Text style={styles.flatListCaption}>
              {item.item.caption}
              <Text style={styles.flatListUnits}>{`(${item.item.units})`}</Text>
            </Text>
          </View>
        )}
      />
    </View>
  );
}

export default SensorsListComponent;
