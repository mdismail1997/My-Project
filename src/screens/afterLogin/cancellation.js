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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import IconFontisto from 'react-native-vector-icons/dist/Fontisto';
import IconMaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';

export default function Cancellation(props) {
  const [name, setName] = useState('');

  const [focusName, setFocusName] = useState(false);
  const [showHide, setShowHide] = useState(false);
  const [totalcharge, setTotalcharge] = useState('');
  const [reasoncancel, setReason] = useState('');

  const onFocusTextInputName = () => {
    setFocusName(true);
  };

  const onBlurTextInputName = () => {
    setFocusName(false);
  };

  useEffect(() => {
    const ridecharge = props.route.params.charge;
    console.log('++++++++============111', ridecharge);
    setTotalcharge(ridecharge);
    //  cancelRide()
  }, []);

  const cancelRide = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token.data.data.token);
    const userToken = token.data.data.token;
    const dataRide = JSON.parse(await AsyncStorage.getItem('data_ride'));
    console.log('dataaaaaaaaaaaaaaaaa', dataRide.data.booking_id);
    //const charge = JSON.parse(await AsyncStorage.getItem('rideCharge'))
    console.log('++++++++============', totalcharge);
    const data = {
      id: dataRide.data.booking_id,
      amount: totalcharge,
      reason: reasoncancel,
    };
    console.log('cancel ride data:::::::', data);
    await axios({
      method: 'post',
      url: 'https://kabou.us/api/rider/cancel-ride',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      data: data,
    })
      .then(function (response) {
        console.log('driver cancel:::::::::::::::::', response.data);
        //fetchPrice()
        // AsyncStorage.setItem('waiting_time', JSON.stringify(response.data.data.value))
        props.navigation.navigate('bookingStep2');
      })
      .catch(function (error) {
        console.log(error);
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
                marginTop: 10,
                alignItems: 'center',
                padding: allPadding,
              }}>
              <Text style={styles.headerText}>Cancellation</Text>
              <View style={styles.twoTextContainer}>
                <Text style={styles.subBoldText}>10% deduction</Text>
                <Text style={styles.subText}>from registered card</Text>
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
                  multiline={true}
                  placeholderTextColor={'#000'}
                  value={reasoncancel}
                  onBlur={() => onBlurTextInputName()}
                  onFocus={() => onFocusTextInputName()}
                  onChangeText={text => setReason(text)}
                />
              </View>
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => cancelRide()}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Continue</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <Text
                  style={[styles.subText, {fontSize: 18, marginVertical: 30}]}>
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
    width: '100%',
    height: calcH(0.3),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    borderRadius: calcW(0.03),
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBorder: {
    width: '100%',
    height: calcH(0.3),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: calcW(0.03),
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerText: {
    fontSize: 24,
    color: colors.textHeader,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  subText: {
    marginHorizontal: calcW(0.01),
    fontSize: 16,
    color: colors.subHeader,
    textAlign: 'center',
  },
  textInput: {
    fontSize: 16,
    height: calcH(0.3),
    marginVertical: 10,
    flex: 1,
    paddingLeft: calcH(0.02),
    // marginBottom: calcH(0.2),
    color: '#000',
    marginTop: calcH(0.05),
    // marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
    // backgroundColor: '#000'
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonTextStyle: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
  },

  twoTextContainer: {
    flexDirection: 'row',
    height: calcH(0.08),
  },
  subBoldText: {
    fontWeight: '500',
    fontSize: 16,
    color: colors.subHeader,
    textAlign: 'center',
  },
});
