import React, {useEffect} from 'react';
import AppRoot from './src/components/AppRoot.component';

import KeepAwake from 'react-native-keep-awake';

const App = () => {
  useEffect(() => {
    KeepAwake.activate();
    return () => {
      KeepAwake.deactivate();
    };
  }, []);

  return (
    <>
      <AppRoot />
      <KeepAwake />
    </>
  );
};

export default App;
