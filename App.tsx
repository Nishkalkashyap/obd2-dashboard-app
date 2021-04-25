import React from 'react';
import {Platform} from 'react-native';
import AndroidRoot from './src/components/AndroidRoot.component';

const App = () => {
  return <>{Platform.OS === 'android' && <AndroidRoot />}</>;
};

export default App;
