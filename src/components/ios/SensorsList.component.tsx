import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
} from 'react-native';
import {font} from '../../../util';
import {
  ExtendedThemeColors,
  ThemeContext,
} from '../../services/theme-provider.service';
import {hooks} from '../../utils/hooks';

const stylesCreator = (colors: ExtendedThemeColors) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
    },
    flatListItem: {
      marginVertical: 10,
      paddingHorizontal: 10,
      paddingVertical: 10,
      minWidth: '45%',
    },
    flatListText: {
      color: colors.textColor,
      fontSize: 90,
      textAlign: 'center',
      fontFamily: font.bold,
    },
    flatListUnits: {
      paddingLeft: 10,
    },
    flatListCaption: {
      color: colors.textColor,
      fontSize: 20,
      textAlign: 'center',
      fontFamily: font.bold,
    },
  });

export const SensorItemComponent = (props: {
  item: {caption: string; value: string; units: string};
  style?: ViewStyle;
  onClick?: Function;
}) => {
  const theme = useContext(ThemeContext);
  const colors = hooks.useColors(theme);
  const styles = stylesCreator(colors);

  const {item, style} = props;

  return (
    <TouchableOpacity
      onPress={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
      style={{...styles.flatListItem, ...style}}
      key={item.caption}>
      <Text style={styles.flatListText}>{item.value}</Text>
      <Text style={styles.flatListCaption}>
        {item.caption}
        <Text style={styles.flatListUnits}>{`  (${item.units})`}</Text>
      </Text>
    </TouchableOpacity>
  );
};

function SensorsListComponent(props: {
  style?: ViewStyle;
  list: {
    value: string;
    caption: string;
    units: string;
  }[];
  onClick?: (index: number) => void;
}) {
  const theme = useContext(ThemeContext);
  const colors = hooks.useColors(theme);
  const styles = stylesCreator(colors);

  const {list, style} = props;

  return (
    <View style={{...styles.container, ...style}}>
      {list.map((item, index) => (
        <SensorItemComponent
          key={item.caption}
          item={item}
          onClick={() => {
            if (props.onClick) {
              props.onClick(index);
            }
          }}
        />
      ))}
    </View>
  );
}

export default SensorsListComponent;
