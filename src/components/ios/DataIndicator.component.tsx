import React, {useEffect, useState} from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import {colors} from '../../../util';

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    width: 30,
    height: 30,
  },
});

function DataIndicatorComponent(props: {data: any; parentStyles: ViewStyle}) {
  const {data, parentStyles} = props;

  const [blink, setBlink] = useState(false);

  useEffect(() => {
    setBlink(true);
    const timeout = setTimeout(() => {
      setBlink(false);
    }, 50);
    return () => {
      clearTimeout(timeout);
    };
  }, [data]);

  return (
    <View
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        backgroundColor: blink ? colors.tertiary.tint : '#ffffff22',
        ...styles.container,
        ...parentStyles,
      }}
    />
  );
}

export default DataIndicatorComponent;
