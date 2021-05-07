import React from 'react';
import {ViewStyle} from 'react-native';
import MapView from 'react-native-maps';

function MapViewComponent(props: {styles?: ViewStyle}) {
  return (
    <MapView
      showsUserLocation
      followsUserLocation
      // userLocationUpdateInterval={2000} //android only
      loadingEnabled
      showsCompass
      showsBuildings={false}
      showsIndoors={false}
      mapType="mutedStandard"
      style={{width: 300, height: 300, ...props.styles}}
    />
  );
}

export default MapViewComponent;
