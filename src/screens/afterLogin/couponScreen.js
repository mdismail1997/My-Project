import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {ScreenScrollComponent, HeaderComponent} from '../../commonItem';
import colors from '../../utils/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  logoHeight,
  logoWidth,
} from '../../utils/comon';
import LinearGradient from 'react-native-linear-gradient';
import {CouponCard} from '../components/CouponCard';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CouponScreen({navigation}) {
  const [couponList, setCouponList] = useState();

  useEffect(() => {
    const getCouponList = async () => {
      try {
        const token = JSON.parse(await AsyncStorage.getItem('userToken'));
        const response = await axios({
          method: 'GET',
          url: 'https://kabou.us/api/rider/coupon-list',
          headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.data.data.token}`,
          },
        });
        console.log(response.data);
        setCouponList(response.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    navigation.addListener('focus', getCouponList);
    getCouponList();
  }, [navigation]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.topContainer}>
          <LinearGradient
            colors={['#3165CC', '#66CEE9']}
            style={styles.linearGradient}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={styles.headerfullCover}>
                  <Image
                    style={styles.arrowIcon}
                    source={require('../../../assets/images/blue-arrow.png')}
                  />
                  <Text style={styles.instruction}>Coupon</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.textContainer}>
                <Text style={styles.number}>{couponList?.length ?? 0}</Text>
                <Text style={styles.historyText}>All Coupons History</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.lowerContainer}>
            <Text style={styles.lowerHead}>My Coupon</Text>
            <View
              style={[
                styles.cardContainer,
                {flexDirection: 'row', flexWrap: 'wrap'},
              ]}>
              {couponList?.map((el, i) => (
                <CouponCard couponData={el} key={i} />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.buttonAnothercolor,
  },
  linearGradient: {},
  headerContainer: {
    width: calcW(1),
    height: calcH(0.28),
  },
  headerfullCover: {
    width: calcW(1),
    height: calcH(0.1),
    flexDirection: 'row',
    left: calcW(0.05),
    // backgroundColor: colors.primary,
    marginTop: calcH(0.015),
  },
  arrowIcon: {
    alignItems: 'center',
    marginTop: calcW(0.02),
    width: calcW(0.04),
    height: calcH(0.015),
  },
  instruction: {
    left: calcW(0.035),
    fontSize: 18,
    fontWeight: '500',
    color: '#B9D0FF',
  },

  textContainer: {
    justifyContent: 'center',
    width: calcW(1),
    height: calcH(0.12),
    marginBottom: calcH(0.09),
    //  backgroundColor: colors.primary,
  },
  number: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.background,
    textAlign: 'center',
  },
  historyText: {
    fontSize: 22,
    fontWeight: '500',
    color: colors.background,
    textAlign: 'center',
  },
  lowerContainer: {
    marginVertical: calcH(0.05),
    width: calcW(0.9),
    //  backgroundColor: colors.buttonAnothercolor
  },
  lowerHead: {
    fontSize: 20,
    fontWeight: '500',
    color: '#3B4045',
  },
  cardContainer: {
    marginTop: calcH(0.04),
    overflow: 'hidden',
  },
});
