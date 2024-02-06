import { Input } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager
} from 'react-native';
import ButtonDark from '../../Component/Common/ButtonDark';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import { GetRequest, PutRequest } from '../../Services/ApiFunctions';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import { StrictMode } from 'react';
import { CountryPicker } from "react-native-country-codes-picker";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function UpdateMobileNumber({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [data, setData] = useState('');
  const [loder, setLoder] = useState(false);

  const [phone, setPhone] = useState('');
  const [newphone, setNewPhone] = useState('');
  const [show, setShow] = useState(false);

  const [countryCode, setCountryCode] = useState('+971');
  const [flag, setFlag] = useState('');

  const submit = () => {
    if (oldPassword == '') {
      Alert.alert(strings.CHANGE_PASSWORD, strings.ENTER_OLD_PASS, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password == '') {
      Alert.alert(strings.CHANGE_PASSWORD, strings.ENTER_PASS, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password.length < 8) {
      Alert.alert(
        strings.CHANGE_PASSWORD,
        strings.PASS_ERR,
        [{ text: strings.CANCEL },
        { text: strings.OK },],
      );
    } else if (password !== confirmPassword) {
      Alert.alert(
        strings.CHANGE_PASSWORD,
        strings.PASS_NOT_MATCH,
        [{ text: strings.CANCEL },
        { text: strings.OK },],
      );
    } else {
      resetPassword();
    }
  };

  const profileData = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(res => {
        // console.log('Profile responce => ', res);
        setData(res);
      })
      .catch(error => {
        console.log('Profile error => ', error);
        if (error.response.data.message == `The consumer isn't authorized to access %resources.`) {
          Alert.alert(strings.SESSION, '', [
            { text: '' },
            {
              text: strings.OK,
              onPress: () => {
                logout2();
              },
            },
          ])
        }
      });
  };

  const logout2 = async () => {
    setLoder(true)
    setTimeout(async () => {
      setLoder(false);

      navigation.navigate('signin');
      await AsyncStorage.removeItem('traderToken');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }, 2000);

  };

  const resetPassword = async () => {
    setLoder(true);
    const params = {
      customerId: data?.id,
    };
    const senddata = {
      currentPassword: oldPassword,
      newPassword: password,
    };
    PutRequest('customers/me/password?', senddata, params, 'admin')
      .then(async res => {
        setLoder(false);
        console.log('change password responce => ', res);
        if (res.message) {
          Alert.alert(strings.CHANGE_PASSWORD, res?.message, [
            { text: strings.CANCEL },
            { text: strings.OK },
          ]);
        } else {
          Alert.alert(
            strings.CHANGE_PASSWORD,
            strings.CHANGE_PASS_SUCCESS,
            [
              { text: strings.CANCEL },
              {
                text: strings.OK,
                onPress: () => {
                  setOldPassword(''), setPassword(''), setConfirmPassword('');
                },
              },
            ],
          );
        }
      })
      .catch(error => {
        setLoder(false);
        console.warn('change password error => ', error.response);
        Alert.alert(strings.CHANGE_PASS_FAIL, strings.LOGIN_FAIL2, [
          { text: strings.CANCEL },
          { text: strings.OK },
        ]);
      });
  };

  useEffect(() => {
    selectedLng
    profileData();
  }, []);

  selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    setLoder(false)
    console.warn("selected Language data==>>>", lngData)
  }



  const getOtp = async () => {
    let ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    console.log("lllllllllllllllllll",ADMIN_TOKEN)
    setLoder(true);
    let mydata =
    {
    //   mobileNumber: countryCode + phone,
    //   websiteId: "1",
    newMobileNumber:"918961649504",
    websiteId:"1",
    customerId:"28072",
    oldMobileNumber:"919331232345" 

    }
    console.log('send phone number to login', mydata);
    // PostRequest('mobilelogin/loginotp', {}, mydata, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/updatenumber`,
      headers: {
        authorization: `Bearer ${ADMIN_TOKEN}`,

      },
      data: mydata,
    })

      .then(response => {
        setLoder(false);
        console.warn('send OTP responce mobilelogin => ', response.data);
        // setShowModal2(!showModal2)
        Alert.alert('', response.data[0].message, [
          { text: '' },
          {
            text: 'OK',
          }
        ]);



        if (response.data[0].status == true) { setShowModal4(!showModal4) }

        else { setShowModal1(!showModal1) }

       
      })
      .catch(error => {
        setLoder(false);
        console.warn('send OTP Error mobilelogin**************************** =>', error.response);
      });
  };

  

  return (
    <View style={styles.container}>
      <Header title={strings.Mobile_Number_Update} navigation={navigation} icon="back" />
      <View style={{ paddingHorizontal: 30, flex: 1,marginTop:30 }}>
      <Text style={{fontSize:20,fontFamily:'Roboto-Regular',color:'#000'}}>
      {strings.Mobile_Number_Update}
      </Text>

      <Input
                  placeholder={strings.Old_MOBILE_NUMBER}
                  inputContainerStyle={{ borderWidth: 1 }}
                  containerStyle={{ paddingHorizontal: 0, marginBottom: 15 ,marginTop:20}}
                  inputStyle={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Regular',
                    color: '#47474B',
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                  placeholderTextColor="#47474B"
                  leftIconContainerStyle={{ marginLeft: 0 }}
                  leftIcon={


                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      style={{
                        width: 90,
                        height: 50,
                        backgroundColor: '#B6B6B4',
                        padding: 10,
                        flexDirection:'row',
                      }}
                    >
                    <Text style={{
                      // color: 'white',
                      fontSize: 20
                    }}>
                      {flag}
                    </Text>
                      <Text style={{
                        color: '#272727',
                        fontSize: 16,
                        marginTop:1.5,
                        marginLeft:8,


                      }}>
                        {countryCode}
                      </Text>
                    </TouchableOpacity>


                  }
                  errorStyle={{ display: 'none' }}
                  onChangeText={e => setPhone(e)}
                // value={phone.replace(/\s/g, '')}
                />
                <CountryPicker
                show={show}
                // lang={'cz'}
                style={{
                    modal: {
                        height: 500,
                        backgroundColor: '#D0D3D4'
                    },
                   
                    
                   
                    textInput: {
                          height: 60,
                          borderRadius: 0,
                    },
                   
                    countryButtonStyles: {
                          height: 80
                    },
                }}
                pickerButtonOnPress={(item) => {
                  // console.log("mmmmmmmmmmmmm",  item)
                  setFlag(item.flag)
                  setCountryCode(item.dial_code);
                  setShow(false);
                  // console.log("mmmmmmmmmmmmm", typeof item.dial_code, item.dial_code)
                }}
                onBackdropPress={() => setShow(false)}
            />



            <Input
                  placeholder={strings.New_MOBILE_NUMBER}
                  inputContainerStyle={{ borderWidth: 1 }}
                  containerStyle={{ paddingHorizontal: 0, marginBottom: 15 ,marginTop:20}}
                  inputStyle={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Regular',
                    color: '#47474B',
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                  placeholderTextColor="#47474B"
                  leftIconContainerStyle={{ marginLeft: 0 }}
                  leftIcon={


                    <TouchableOpacity
                      onPress={() => setShow(true)}
                      style={{
                        width: 90,
                        height: 50,
                        backgroundColor: '#B6B6B4',
                        padding: 10,
                        flexDirection:'row',
                      }}
                    >
                    <Text style={{
                      // color: 'white',
                      fontSize: 20
                    }}>
                      {flag}
                    </Text>
                      <Text style={{
                        color: '#272727',
                        fontSize: 16,
                        marginTop:1.5,
                        marginLeft:8,


                      }}>
                        {countryCode}
                      </Text>
                    </TouchableOpacity>


                  }
                  errorStyle={{ display: 'none' }}
                  onChangeText={e => setNewPhone(e)}
                // value={phone.replace(/\s/g, '')}
                />
                <CountryPicker
                show={show}
                // lang={'cz'}
                style={{
                    modal: {
                        height: 500,
                        backgroundColor: '#D0D3D4'
                    },
                   
                    
                   
                    textInput: {
                          height: 60,
                          borderRadius: 0,
                    },
                   
                    countryButtonStyles: {
                          height: 80
                    },
                }}
                pickerButtonOnPress={(item) => {
                  // console.log("mmmmmmmmmmmmm",  item)
                  setFlag(item.flag)
                  setCountryCode(item.dial_code);
                  setShow(false);
                  // console.log("mmmmmmmmmmmmm", typeof item.dial_code, item.dial_code)
                }}
                onBackdropPress={() => setShow(false)}
            />
        
        <ButtonDark handleClick={() => getOtp()} title={strings.Get_Otp} />
      </View>
      {loder && <Loder />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
