import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import colors from '../../utils/colors';
import {
  allPadding,
  allRadius,
  calcH,
  calcW,
  buttonHeight,
  textInputHeight,
} from '../../utils/comon';
import {RFValue} from 'react-native-responsive-fontsize';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {RadioButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';
import Hud from '../../utils/hud';
import commonToast from '../../utils/commonToast';
import {Toast} from 'native-base';

const PaymentDetails = ({navigation, route}) => {
  const dataall = route.params.data;
  console.log('waiting Charge: ', dataall);
  // console.log(' stoppage Charge: ', timechargestoppage);
  // console.log('Total price : ', totalCharge);
  const [checked, setChecked] = React.useState('');
  const [focusEmail, setFocusEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [tipsPrice, setTipsPrice] = useState(0);

  const onFocusTextInputEmail = () => {
    setFocusEmail(true);
  };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };
  const tipsAmount = (price, status) => {
    setChecked(status);
    setTipsPrice(price);
    console.log('price===========', price, status);
  };
  const tipsPayment = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    const canSaveCard = JSON.parse(
      await AsyncStorage.getItem('KabouRiderCardSaveStatus'),
    );
    console.log('token=======================', token.data.data.token);
    const finaltoken = token.data.data.token;
    Hud.showHud();
    const data = {
      booking_id: dataall.booking_id,
      tips_amount: tipsPrice,
    };
    console.log('tips data: ', data);
    axios({
      method: 'post',
      url: BASE_URL + 'give-tips',
      headers: {
        Accept: 'application/json',
        authorization: 'Bearer ' + finaltoken,
      },
      data: data,
    })
      .then(response => {
        console.warn('canSaveCard =========>>>', response.data, canSaveCard);
        Hud.hideHud();
        Toast.show({
          placement: 'top',
          title: response.data.message,
        });

        if (response.data.success === true) {
          if (canSaveCard && response.data.data.payment_method) {
            axios
              .post(
                `${BASE_URL}detach-payment`,
                {
                  payment_methode_id: response.data.data.payment_method,
                },
                {
                  headers: {
                    Accept: 'application/json',
                    authorization: 'Bearer ' + finaltoken,
                  },
                },
              )
              .then(res => {
                console.warn('card saved status', res.data);
              })
              .catch(err => {
                console.error('card saved err', err);
              });
          }
          navigation.navigate('invoice', {
            data: dataall,
            tips_amount: tipsPrice,
          });
        }
     
        // setFilePath(response.data.profile_photo)
      })
      .catch(err => {
        console.log('errprofile', err.data.message);
        Hud.hideHud();
        Alert.alert(err.data.message);
      });
  };
  return (
    <SafeAreaView style={styles.topContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.arrowIcon}
            source={require('../../../assets/images/back_arrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.instruction}>Payment Details</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.listingContainer}>
          <Text style={styles.carno}>{dataall.cab_no}</Text>
          <View style={styles.directioncontainer}>
            <View style={styles.firstline}>
              <Image
                style={styles.circleIcon}
                source={require('../../../assets/images/circle.png')}
              />
              <Text style={styles.placeText}>{dataall.pickUpLocation}</Text>
            </View>
            <View style={styles.middleline}>
              <IconMaterialCommunityIcons size={16} name={'dots-vertical'} />
            </View>
            <View style={styles.lastline}>
              <Image
                style={styles.locationIcon}
                source={require('../../../assets/images/location.png')}
              />
              <Text style={styles.placeText}>
                {dataall.destinationLocation}
              </Text>
            </View>
          </View>
          <View style={styles.driverContainer}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.driverImg}
                source={{uri: dataall.driverPhoto}}
              />
            </View>
            <View style={styles.descripContainer}>
              <Text style={styles.title1}>{dataall.cab_no}</Text>
              <Text style={styles.title2}>{dataall.driverName}</Text>
            </View>
          </View>
          <View style={styles.lineStyle} />
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                top: calcH(0.025),
              }}>
              <Text style={styles.costdescription}>Ride cost</Text>
              <Text style={styles.price}>${dataall.total}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                top: calcH(0.031),
              }}>
              <Text style={styles.costdescription}>Waiting time cost</Text>
              <Text style={styles.price}>${dataall.waitingtimecharge}.00</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                top: calcH(0.035),
              }}>
              <Text style={styles.costdescription}>Stoppages time cost</Text>
              <Text style={styles.price}>${dataall.stoppageCharge}.00</Text>
            </View>
          </View>
          <View style={{top: calcH(0.06)}}>
            <Text style={{fontSize: RFValue(16), fontWeight: '700'}}>
              Would you like to tips?
            </Text>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
              <RadioButton
                value="first"
                color={colors.buttonColor}
                uncheckedColor={colors.black}
                status={checked === 'first' ? 'checked' : 'unchecked'}
                onPress={() => tipsAmount(5, 'first')}
              />
              <Text style={styles.tips}>$5</Text>
              <RadioButton
                value="second"
                color={colors.buttonColor}
                uncheckedColor={colors.black}
                status={checked === 'second' ? 'checked' : 'unchecked'}
                onPress={() => tipsAmount(10, 'second')}
              />
              <Text style={styles.tips}>$10</Text>
              <RadioButton
                value="third"
                color={colors.buttonColor}
                uncheckedColor={colors.black}
                status={checked === 'third' ? 'checked' : 'unchecked'}
                onPress={() => tipsAmount(15, 'third')}
              />
              <Text style={styles.tips}>$15</Text>
            </View>
          </View>
          <View
            style={
              focusEmail === true ? styles.activeBorder : styles.inActiveBorder
            }>
            {focusEmail === true ? (
              <Image
                source={require('../../../assets/images/pay.png')}
                style={{
                  width: calcW(0.05),
                  height: calcH(0.03),
                  tintColor: colors.activeBorder,
                }}
                resizeMode={'contain'}
              />
            ) : (
              <Image
                source={require('../../../assets/images/pay.png')}
                style={{
                  width: calcW(0.05),
                  height: calcH(0.03),
                  tintColor: '#000',
                }}
                resizeMode={'contain'}
              />
            )}
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              placeholder="Pay as per your choice"
              placeholderTextColor={'#000'}
              value={tipsPrice}
              onBlur={() => onBlurTextInputEmail()}
              onFocus={() => onFocusTextInputEmail()}
              onChangeText={text => setTipsPrice(text)}
            />
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={{
                width: calcW(0.4),
                height: buttonHeight,
                borderRadius: allRadius,
                backgroundColor: colors.buttonAnothercolor,
                borderColor: colors.buttonColor,
                borderWidth: 1,
                justifyContent: 'center',
              }}
              onPress={() =>
                navigation.navigate('invoice', {
                  data: dataall,
                  tips_amount: tipsPrice,
                })
              }>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: RFValue(15),
                  color: colors.buttonColor,
                  fontWeight: '500',
                }}>
                Skip
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnConfirm}
              onPress={() => tipsPayment()}>
              <Text style={styles.btnconfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.buttonAnothercolor,
    flex: 1,
  },
  headerContainer: {
    width: calcW(0.9),
    height: calcH(0.05),
    flexDirection: 'row',
    marginVertical: calcH(0.03),
    justifyContent: 'flex-start',
  },
  arrowIcon: {
    alignItems: 'center',
    marginTop: calcW(0.02),
    width: calcW(0.04),
    height: calcH(0.015),
    // left: calcW(0.05),
  },
  instruction: {
    left: calcW(0.03),
    fontSize: RFValue(18),
    fontWeight: '500',
    color: colors.textHeader,
  },
  listingContainer: {
    width: calcW(0.9),
    // height: calcH(0.75),
    flex: 1,
    backgroundColor: colors.background,
    padding: allPadding,
  },
  carno: {
    fontSize: RFValue(20),
    fontWeight: '700',
    color: '#000',
  },
  directioncontainer: {
    height: calcH(0.1),
    top: calcH(0.03),
    // backgroundColor : colors.primary
  },
  firstline: {
    flexDirection: 'row',
    height: calcH(0.03),
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor : colors.buttonColor
  },
  circleIcon: {
    width: calcW(0.032),
    height: calcW(0.032),
  },
  locationIcon: {
    width: calcW(0.032),
    height: calcW(0.04),
  },
  lastline: {
    flexDirection: 'row',
    height: calcH(0.03),
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor : colors.buttonColor
  },
  middleline: {
    height: calcH(0.03),
    marginLeft: calcW(-0.007),
  },
  placeText: {
    //marginBottom: calcH(0.1),
    left: calcW(0.04),
    fontSize: 16,
    fontWeight: '400',
    color: '#22272E',
  },
  driverContainer: {
    // height: calcW(0.24),
    // width: calcW(0.7),
    flex: 1,
    paddingVertical: 12,
    flexDirection: 'row',
    marginTop: calcH(0.02),
  },
  imageContainer: {
    // width: calcW(0.2),
    flex: 0.2,
    marginEnd: calcW(0.04),
    justifyContent: 'center',
  },
  driverImg: {
    width: calcW(0.13),
    height: calcW(0.13),
    borderRadius: calcW(0.09),
  },
  descripContainer: {
    // width: calcW(0.4),
    flex: 0.8,
    borderColor: '#000',
    borderWidth: 0,
    padding: 5,
    justifyContent: 'center',
  },
  title1: {
    fontWeight: '900',
    fontSize: RFValue(18),
    color: colors.textHeader,
    right: calcW(0.03),
  },
  title2: {
    fontWeight: '500',
    fontSize: RFValue(15),
    color: colors.textHeader,
    right: calcW(0.03),
  },
  lineStyle: {
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  costdescription: {
    fontSize: RFValue(16),
    fontWeight: '500',
  },
  price: {
    fontSize: RFValue(16),
    fontWeight: '800',
  },
  tips: {
    fontSize: RFValue(18),
    // top: calcH(0.01),
    fontWeight: '700',
  },
  inActiveBorder: {
    width: calcW(0.8),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.08),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
  },
  activeBorder: {
    width: calcW(0.8),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.08),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
  },
  textInput: {
    fontSize: RFValue(16),
    flex: 1,
    paddingLeft: calcW(0.03),
    color: colors.activeBorder,
    height: textInputHeight,
  },
  btnContainer: {
    //alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: calcH(-0.06),
    borderColor: '#000',
    borderWidth: 0,
  },
  btnConfirm: {
    width: calcW(0.4),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
  },
  btnconfirmText: {
    textAlign: 'center',
    fontSize: RFValue(15),
    color: '#fff',
    fontWeight: '500',
  },
});
