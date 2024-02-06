import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  logoHeight,
  logoWidth,
} from '../../utils/comon';
import colors from '../../utils/colors';

const HeaderComponent = ({icon, navigation}) => {
  return (
    <View style={styles.topContainer}>
      <View style={styles.headerContainer}>
        {icon ? (
          <TouchableOpacity
            style={styles.arrowContainer}
            onPress={() => navigation.goBack()}>
            <Image
              style={styles.arrowIcon}
              source={require('../../../assets/images/back_arrow.png')}
            />
          </TouchableOpacity>
        ) : null}
        <Image
          style={styles.headerLogo}
          source={require('../../../assets/images/logo.png')}
        />

        <TouchableOpacity onPress={() => navigation.navigate('notification')}>
          <Image
            style={styles.bellIcon}
            source={require('../../../assets/images/bell.png')}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: allPadding,
  },
  headerContainer: {
    width: calcW(1),
    height: calcH(0.04),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  headerLogo: {
    width: calcW(0.3),
    height: calcW(0.1),
    resizeMode: 'contain',
    // left: calcW(0.06),
    // alignItems: 'flex-start',
  },
  menuIcon: {
    width: calcW(0.05),
    height: calcW(0.05),
  },
  iconSize: {
    width: calcW(0.04),
    height: calcH(0.04),
    resizeMode: 'contain',
  },
  bellIcon: {
    // right: calcW(0.06),
    width: calcW(0.07),
    height: calcW(0.07),
    marginTop: calcW(0.01),
  },
  arrowContainer: {
    justifyContent: 'center',
    width: calcW(0.1),
  },
  arrowIcon: {
    width: calcW(0.06),
    height: calcH(0.015),
  },
});

export default HeaderComponent;
