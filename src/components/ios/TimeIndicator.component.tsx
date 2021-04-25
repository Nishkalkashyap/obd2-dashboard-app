import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {colors} from '../../../util';

const styles = StyleSheet.create({
  text: {
    color: colors.light.color,
    fontSize: 20,
  },
});

function TimeIndicatorComponent(props: {parentStyles?: ViewStyle}) {
  const {parentStyles} = props;

  const [date, setDate] = useState(new Date().toLocaleString());

  useEffect(() => {
    const interval = setInterval(() => {
      setDate(new Date().toLocaleString());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View style={parentStyles}>
      <Text style={styles.text}>{date}</Text>
    </View>
  );
}

export default TimeIndicatorComponent;
