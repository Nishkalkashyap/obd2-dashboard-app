import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
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
      <MainDisplayScreenComponent width={'100%'} height={'100%'} />
    </SafeAreaView>
  );
}

export default IOSRoot;
