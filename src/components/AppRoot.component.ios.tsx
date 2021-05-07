import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {ThemeContext, ThemeProvider} from '../services/theme-provider.service';
import MainDisplayScreenComponent from './ios/MainDisplayScreen.component';

const styles = StyleSheet.create({
  container: {
    // display: 'flex',
    // flex: 1,
    // backgroundColor: '#aaaaaa',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});

function IOSRoot() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemeContext.Provider value={new ThemeProvider()}>
        <MainDisplayScreenComponent width={'100%'} height={'100%'} />
      </ThemeContext.Provider>
    </SafeAreaView>
  );
}

export default IOSRoot;
