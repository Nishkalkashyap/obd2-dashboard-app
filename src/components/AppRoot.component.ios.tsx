import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#aaaaaa',
  },
  text: {
    color: '#000000',
  },
});

function IOSRoot() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Hello World</Text>
    </SafeAreaView>
  );
}

export default IOSRoot;
