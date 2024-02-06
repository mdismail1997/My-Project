import React from 'react';
import { TouchableOpacity } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Svg, Path } from 'react-native-svg';
import { View } from 'native-base';

interface HamburgerButtonProps {
  color?: string;
}

export const HamburgerButton: React.FC<HamburgerButtonProps> = ({ color }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <View>
        <Svg fill="none" viewBox="0 0 25 31" height="100%" width="50">
          <Path
            transform="translate(0, 3.5)"
            d="M4 6H20M4 12H12M4 18H20"
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </Svg>
      </View>
    </TouchableOpacity>
  );
};
