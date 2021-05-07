import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {hooks} from '../../utils/hooks';
import {obdDebuggerStyles} from '../ObdDebugger.component';

function SampleDataComponent(props: {dismissModalHandle: Function}) {
  const {dismissModalHandle} = props;

  hooks.useSampleData();
  return (
    <SafeAreaView>
      <View style={obdDebuggerStyles.navbar}>
        <Text style={obdDebuggerStyles.navbarText}>Running sample data</Text>
        <Text
          style={obdDebuggerStyles.navbarText}
          onPress={() => {
            dismissModalHandle();
          }}>
          Dismiss
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default SampleDataComponent;
