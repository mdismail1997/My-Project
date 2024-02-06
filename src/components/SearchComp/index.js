import { View, Text, StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import { hp, wp } from '../../utils/ResponsiveLayout';
import Icon from 'react-native-vector-icons/EvilIcons';

const SearchComp = props => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={props.title}
        placeholderTextColor={COLORS.NICKEL}
        style={styles.inputStyle}
        value={props.value}
        onChangeText={props.onChangeText}
      />
      {props.icon ? (
        <Icon name="search" color={COLORS.YELLOW_GREEN} size={wp(24)} />
      ) : null}
    </View>
  );
};

export default SearchComp;

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
    flexDirection: 'row',
    paddingHorizontal: wp(20),
    paddingVertical: hp(6),
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    shadowColor: '#000',
    // marginHorizontal: wp(18),
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputStyle: {
    fontSize: wp(12),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
  },
});
