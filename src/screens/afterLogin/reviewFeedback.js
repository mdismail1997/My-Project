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
import commonToast from '../../utils/commonToast';
import IconFontisto from 'react-native-vector-icons/dist/Fontisto';
import IconMaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import IconFeather from 'react-native-vector-icons/dist/Feather';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';

export default cancellation = props => {
  const [name, setName] = useState('');

  const [focusName, setFocusName] = useState(false);
  const [showHide, setShowHide] = useState(false);
  const [totalcharge, setTotalcharge] = useState('');
  const [review, setReview] = useState('');
  const [focusstarone, setFocusstarone] = useState(false);
  const [focusstartwo, setFocusstartwo] = useState(false);
  const [focusstarthree, setFocusstarthree] = useState(false);
  const [focusstarfour, setFocusstarfour] = useState(false);
  const [focusstarfive, setFocusstarfive] = useState(false);

  const onFocusTextInputName = () => {
    setFocusName(true);
  };

  const onBlurTextInputName = () => {
    setFocusName(false);
  };

  const reviewRating = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token.data.data.token);
    const userToken = token.data.data.token;
    const dataRide = JSON.parse(await AsyncStorage.getItem('data_ride'));
    console.log('dataaaaaaaaaaaaaaaaa', dataRide.data.booking_id);
    var count = 0;
    if (focusstarone === true) {
      count = count + 1;
    }
    if (focusstartwo === true) {
      count = count + 2;
    }
    if (focusstarthree === true) {
      count = count + 3;
    }
    if (focusstarfour === true) {
      count = count + 4;
    }
    if (focusstarfive === true) {
      count = count + 5;
    }
    console.log('CCCCCCCCCCCC', count);

    const data = {
      booking_id: dataRide.data.booking_id,
      rating: count,
      review: review,
    };
    console.log('*************************', data);
    axios({
      method: 'post',
      url: 'https://kabou.us/api/rider/give-rating-review',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      data: data,
    })
      .then(function (response) {
        console.log('driver review:::::::::::::::::', response.data);
        //fetchPrice()
        // AsyncStorage.setItem('waiting_time', JSON.stringify(response.data.data.value))
        if (response.data.success === true) {
          commonToast({
            text: 'Review Submit Successfully',
            position: 'top',
            toastFor: 'success',
          });
          props.navigation.navigate('bookingStep2');
        }
      })
      .catch(function (error) {
        console.log(error);
        props.navigation.navigate('bookingStep2');
      });
  };
  const startwo = () => {
    setFocusstarone(!focusstarone);
    setFocusstartwo(!focusstartwo);
  };
  const starthree = () => {
    setFocusstarone(!focusstarone);
    setFocusstartwo(!focusstartwo);
    setFocusstarthree(!focusstarthree);
  };

  const starfour = () => {
    setFocusstarone(!focusstarone);
    setFocusstartwo(!focusstartwo);
    setFocusstarthree(!focusstarthree);
    setFocusstarfour(!focusstarfour);
  };

  const starfive = () => {
    setFocusstarone(!focusstarone);
    setFocusstartwo(!focusstartwo);
    setFocusstarthree(!focusstarthree);
    setFocusstarfour(!focusstarfour);
    setFocusstarfive(!focusstarfive);
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
              <Text style={styles.starText}>How many star would you give?</Text>
              <View style={styles.starBox}>
                <TouchableOpacity
                  style={styles.star}
                  onPress={() => setFocusstarone(!focusstarone)}>
                  <Image
                    source={require('../../../assets/images/Vector.png')}
                    style={
                      focusstarone === true
                        ? {tintColor: '#000'}
                        : {tintColor: '#b3b3b3'}
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.star} onPress={() => startwo()}>
                  <Image
                    source={require('../../../assets/images/Vector.png')}
                    style={
                      focusstartwo === true
                        ? {tintColor: '#000'}
                        : {tintColor: '#b3b3b3'}
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.star}
                  onPress={() => starthree()}>
                  <Image
                    source={require('../../../assets/images/Vector.png')}
                    style={
                      focusstarthree === true
                        ? {tintColor: '#000'}
                        : {tintColor: '#b3b3b3'}
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.star}
                  onPress={() => starfour()}>
                  <Image
                    source={require('../../../assets/images/Vector.png')}
                    style={
                      focusstarfour === true
                        ? {tintColor: '#000'}
                        : {tintColor: '#b3b3b3'}
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.star}
                  onPress={() => starfive()}>
                  <Image
                    source={require('../../../assets/images/Vector.png')}
                    style={
                      focusstarfive === true
                        ? {tintColor: '#000'}
                        : {tintColor: '#b3b3b3'}
                    }
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{fontWeight: 'bold', fontSize: 20, right: calcW(0.23)}}>
                Your Feedback
              </Text>
              <View
                style={
                  focusName === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                <TextInput
                  style={styles.textInput}
                  placeholder="Message"
                  value={review}
                  onBlur={() => onBlurTextInputName()}
                  onFocus={() => onFocusTextInputName()}
                  onChangeText={text => setReview(text)}
                />
              </View>
              <TouchableOpacity
                style={{width: '100%'}}
                onPress={() => reviewRating()}>
                <View style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Submit</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    paddingLeft: calcH(0.02),
    marginBottom: calcH(0.2),
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
  starText: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: calcH(0.05),
  },
  starBox: {
    flexDirection: 'row',
    bottom: calcH(0.02),
  },
  star: {
    borderColor: '#000',
    borderWidth: 1,

    //backgroundColor: '#000'
  },
  starActive: {
    borderColor: '#000',
    borderWidth: 0,
    // color: '#000'
  },
});
