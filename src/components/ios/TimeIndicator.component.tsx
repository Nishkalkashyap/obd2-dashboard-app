import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';
import {Colors} from '../../../util';
import {ThemeContext} from '../../services/theme-provider.service';
import {hooks} from '../../utils/hooks';

const stylesCreator = (colors: Colors) =>
  StyleSheet.create({
    text: {
      color: colors.textColor,
      fontSize: 20,
    },
  });

function TimeIndicatorComponent(props: {parentStyles?: ViewStyle}) {
  const theme = useContext(ThemeContext);
  const colors = hooks.useColors(theme);
  const styles = stylesCreator(colors);

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
