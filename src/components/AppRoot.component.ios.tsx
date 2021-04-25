import React, {useEffect} from 'react';
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
  useEffect(() => {
    const httpBridge = require('react-native-http-bridge');
    httpBridge.start(5561, 'http_server_middleware', (request: any) => {
      if (request.type === 'GET' && request.url === '/obd/get-data') {
        httpBridge.respond(
          request.requestId,
          200,
          'application/json',
          '{"message": "OK"}',
        );
      } else {
        httpBridge.respond(
          request.requestId,
          400,
          'application/json',
          '{"message": "Bad Request"}',
        );
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MainDisplayScreenComponent width={'100%'} height={'100%'} />
    </SafeAreaView>
  );
}

export default IOSRoot;
