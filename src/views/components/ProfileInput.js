import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../conts/colors.js';
import {calcH, fSize} from '../../utils/constants/common.js';

const ProfileInput = ({
  icon,
  textInputStyle,
  passwordIconOnpress,
  width = '100%',
  passwordIcon,
  secureTextEntry,
  ...otherProps
}) => {
  return (
    <View style={[styles.container, {width: width}]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={calcH(0.028)}
          color={COLORS.medium}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.text, {...textInputStyle}]}
        secureTextEntry={secureTextEntry}
        {...otherProps}
        placeholderTextColor={COLORS.placeholder}
      />
      {passwordIcon && (
        <TouchableOpacity onPress={passwordIconOnpress}>
          <MaterialCommunityIcons
            name={passwordIcon}
            size={25}
            color={COLORS.medium}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //backgroundColor: COLORS.blue,
    borderRadius: 5,
    flexDirection: 'row',
    //padding: 5,
    marginVertical: 5,
    //borderWidth: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.profile_bottom_border,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    //borderWidth: 1,
    marginLeft: 10,
  },
  text: {
    color: COLORS.Profile_font_color,
    fontSize: fSize(14),
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
    //textAlign: 'center',
  },
});

export default ProfileInput;
