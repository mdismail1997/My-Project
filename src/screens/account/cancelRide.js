import React, {useState, useEffect} from 'react';
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
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
} from '../../utils/comon';

import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';

export default function CancelRide(props) {
  const [focusName, setFocusName] = useState(false);

  const [reasoncancel, setReasoncancel] = useState('');
  const [bookingId, setBookingId] = useState('');

  const onFocusTextInputName = () => {
    setFocusName(true);
  };

  const onBlurTextInputName = () => {
    setFocusName(false);
  };
  // useEffect(()=> {
  //     // const ridecharge = props.route.params.charge
  //     // console.log("++++++++============111",ridecharge);
  //     // setTotalcharge(ridecharge)
  //     cancelRide()

  //    },[])
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      const riderList = JSON.parse(await AsyncStorage.getItem('rider_list'));
      console.log(
        'dataaaaaaaaaaaaaaaaa',
        props.route.params.data.id,
      );
      setBookingId(props.route.params.data.id);
      setReasoncancel('');
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancelRide = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token);

    // const booking_id = riderList.data.data[riderList.data.data.length - 1].id;
    if(reasoncancel.length === 0){
      Toast.show({
        type: 'error',
        text1: 'Cancellation reason required.',
      });
      return false
    }

    const data = {
      id: props.route.params.data.id,
      reason: reasoncancel,
    };
    console.log('cancel ride data:::::::', data);
    await axios({
      method: 'post',
      url: BASE_URL + 'cancel-ride',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: data,
    })
      .then(function (response) {
        console.log('driver cancel:::::::::::::::::', response.data);
        //fetchPrice()
        // AsyncStorage.setItem('waiting_time', JSON.stringify(response.data.data.value))

        Toast.show({
          type: 'success',
          text1: response.data.message,
        });
        props.navigation.navigate('homeScreen');
      })
      .catch(function (error) {
        console.log(error);
        Toast.show({
          type: 'fail',
          text1: error.data.message,
        });
        props.navigation.navigate('homeScreen');
      });
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <View style={styles.viewTwo}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                marginTop: calcH(0.005),
                alignItems: 'center',
                padding: allPadding,
              }}>
              <Text style={styles.headerText}>Cancellation</Text>
              <View style={styles.twoTextContainer}>
                {/* <Text style={styles.subBoldText}>
                $10 deduction
                </Text>
                <Text style={styles.subText}>
                 from register card
                </Text> */}
              </View>
              <View
                style={
                  focusName === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                <TextInput
                  style={styles.textInput}
                  placeholder="Message"
                  value={reasoncancel}
                  onBlur={() => onBlurTextInputName()}
                  onFocus={() => onFocusTextInputName()}
                  onChangeText={text => setReasoncancel(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => cancelRide()}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Continue</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => props.navigation.navigate('acceptRide')}>
                <Text
                  style={[
                    styles.subText,
                    {fontSize: RFValue(20), marginVertical: calcH(0.05)},
                  ]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewOne: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewTwo: {
    flex: 2,
  },
  viewThree: {
    flex: 1,
  },
  inActiveBorder: {
    width: calcW(0.9),
    height: calcH(0.3),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    // borderRadius: allRadius,
    marginVertical: calcH(0.05),
    flexDirection: 'row',
    borderRadius: calcW(0.03),
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBorder: {
    width: calcW(0.9),
    height: calcH(0.3),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: calcW(0.03),
    marginVertical: calcH(0.02),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerText: {
    fontSize: RFValue(24),
    color: colors.textHeader,
    fontWeight: 'bold',
    marginVertical: calcH(0.012),
  },
  subText: {
    marginHorizontal: calcW(0.01),
    fontSize: RFValue(18),
    color: colors.subHeader,
    textAlign: 'center',
  },
  textInput: {
    fontSize: RFValue(18),
    paddingLeft: calcH(0.02),
    marginBottom: calcH(0.2),
    color: '#000',
  },
  buttonStyle: {
    width: calcW(0.9),
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: calcH(0.05),
  },
  buttonTextStyle: {
    fontSize: RFValue(20),
    color: colors.white,
    textAlign: 'center',
  },

  twoTextContainer: {
    flexDirection: 'row',
    height: calcH(0.08),
  },
  subBoldText: {
    fontWeight: '500',
    fontSize: RFValue(18),
    color: colors.subHeader,
    textAlign: 'center',
  },
});
