import React from 'react';
import {View, Text, TextInput, StyleSheet, I18nManager} from 'react-native';
import COLORS from '../../conts/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {calcH, calcW, fSize, STYLES} from '../../utils/constants/common';

const Input = ({
  label,
  iconName,
  error,
  password,
  lng,
  inputContainer,
  inputStyle,
  containerStyle,
  maxLength = 1000,
  onFocus = () => {},
  onBlur = () => {},
  ...props
}) => {
  const [hidePassword, setHidePassword] = React.useState(password);
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <View
      style={[
        error
          ? {marginBottom: calcH(0.02)}
          : {marginBottom: calcH(0.01), borderWidth: 1},
        {...containerStyle},
      ]}>
      {/* {label && <Text style={style.label}>{label}</Text>} */}
      <View
        style={[
          inputContainer ? style.inputContainer1 : style.inputContainer,
          {
            borderColor: error
              ? COLORS.red
              : isFocused
              ? COLORS.grey
              : COLORS.light,
            alignItems: 'center',
            //backgroundColor: isFocused ? COLORS.grey : COLORS.white,
          },
          {...inputStyle},
        ]}>
        <Icon
          name={iconName}
          style={{
            color: isFocused ? COLORS.focusIconColor : COLORS.iconclr,
            fontSize: fSize(22),
            marginRight: calcH(0.01),
          }}
        />
        <TextInput
          autoCorrect={false}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          placeholderTextColor={COLORS.Profile_font_color}
          secureTextEntry={hidePassword}
          style={{
            color: COLORS.black,
            flex: 1,
            textAlign: I18nManager.isRTL ? 'right' : 'left',
          }}
          maxLength={maxLength}
          {...props}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
            style={{
              color: isFocused ? COLORS.black : COLORS.iconclr,
              fontSize: fSize(22),
            }}
          />
        )}
      </View>
      {error && (
        <Text
          style={{
            marginTop: calcH(0.003),
            color: COLORS.red,
            fontSize: fSize(12),
          }}>
          {error}
        </Text>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  // label: {
  //   marginVertical: calcH(0.01),
  //   fontSize: 16,
  //   color: '#000000',
  // },
  inputContainer: {
    height: calcH(0.075),
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    paddingHorizontal: calcH(0.02),
    borderWidth: 1,
  },
  inputContainer1: {
    height: calcH(0.065),
    //backgroundColor: COLORS.light,
    flexDirection: 'row',
    paddingHorizontal: calcH(0.02),
    //borderWidth: 0.8,
  },
});

export default Input;
