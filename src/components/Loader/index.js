import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {COLORS} from '../../utils/Const';

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        position: 'absolute',
        zIndex: 1,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      }}>
      <ActivityIndicator
        // style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
        size={'large'}
        color={COLORS.YELLOW_GREEN}
      />
    </View>
  );
};

export default Loader;
