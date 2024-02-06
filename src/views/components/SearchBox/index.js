import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  I18nManager,
} from 'react-native';
//import styles from './style';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import strings from '../../components/lng/LocalizedStrings';
import {setLng, getLng} from '../../components/lng/changeLng';
import COLORS from '../../../conts/colors.js';
import {calcH} from '../../../utils/constants/common.js';
import {FONTS} from '../../../conts/theme.js';

const SearchBox = ({
  icon = 'search',
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
        <Fontisto
          name={icon}
          size={calcH(0.025)}
          color={COLORS.header_color}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[styles.TextInput,{
          textAlign:I18nManager.isRTL ? 'right' : 'left'
        }, {...textInputStyle}]}
        secureTextEntry={secureTextEntry}
        {...otherProps}
        placeholderTextColor={COLORS.header_color}
      />
      {passwordIcon && (
        <TouchableOpacity onPress={passwordIconOnpress}>
          <Feather
            name={passwordIcon}
            size={25}
            color={COLORS.light}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    </View>

    // <TouchableOpacity style={styles.container} onPress={onPress}>
    //   <View style={styles.searchIconContainer}>
    //     <Feather name="search" color={'black'} size={20} />
    //   </View>
    //   <Text style={styles.searchText}>{strings.SEARCH}</Text>
    // </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 2,
    flexDirection: 'row',
    //padding: 5,
    marginVertical: 8,
    borderWidth: 1,
    alignItems: 'center',
    height: calcH(0.065),
    shadowColor: COLORS.blue,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  icon: {
    //margin: 10,
    marginHorizontal: calcH(0.022),
    //marginLeft: 20,
  },
  TextInput: {
    flex: 1,
    ...FONTS.Montserrat_med,
    //borderWidth: 1,
    color: COLORS.header_color,
  },
});

export default SearchBox;
