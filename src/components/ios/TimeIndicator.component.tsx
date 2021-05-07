import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Colors} from '../../../util';
import {ThemeContext} from '../../services/theme-provider.service';

const stylesCreator = (colors: Colors) =>
  StyleSheet.create({
    text: {
      color: colors.light.color,
      fontSize: 20,
    },
  });

function TimeIndicatorComponent(props: {parentStyles?: ViewStyle}) {
  const theme = useContext(ThemeContext);
  const styles = stylesCreator(theme.colors);

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
