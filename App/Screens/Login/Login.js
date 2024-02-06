import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  Modal,
  Platform,
} from 'react-native';
import React, {useState, useRef, useEffect, useContext} from 'react';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';

import {RFValue} from 'react-native-responsive-fontsize';
import {base_url} from '../../Services/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CountryPicker from 'react-native-country-picker-modal';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  Profile,
} from 'react-native-fbsdk-next';

//import RadioForm from 'react-native-simple-radio-button';

import axios from 'axios';
import {ProfileContext} from '../../Services/ProfileProvider';
import CustomRadio from '../Common/CustomRadio';

const {width, height} = Dimensions.get('window');

const Login = props => {
  const {setToken} = useContext(ProfileContext);

  const emailRef = useRef();
  const passwordRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shownEmail, setShownEmail] = useState(false);
  const [shownPassword, setShownPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [shownUserName, setShownUserName] = useState(false);
  const [facebookData, setFacebookData] = useState([]);
  //const [showModal, setShowModal] = useState(true);
  const [errorMsg, setErrorMsg] = useState({
    isValidEmail: true,
    isValidPassword: true,
    isValidUser: true,
    isCountry: true,
  });
  const [countryCode, setCountryCode] = useState(null);
  const [country, setCountry] = useState(null);
  const [withCountryNameButton, setWithCountryNameButton] = useState(false);
  const [withFlag, setWithFlag] = useState(true);
  const [shownCountry, setShownCountry] = useState(false);
  const [currency, setCurrency] = useState('');

  const onSelect = country => {
    setShownCountry(true);
    setCountryCode(country.cca2);
    setCountry(country.name);
    setWithCountryNameButton(true);
    setCurrency(country.currency[0]);
    console.log('Country Details===>', country);
    setErrorMsg({...errorMsg, isCountry: true});
  };

  const [value, setValue] = useState(1);
  var choice = [
    {label: 'User', value: 0},
    {label: 'Celebrity', value: 1},
  ];

  const validateEmail = value => {
    const regExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (regExp.test(value) === false) {
      return false;
    } else {
      return true;
    }
  };

  const emailHandler = value => {
    setShownEmail(true);
    if (value.trim() !== '') {
      setEmail(value.trim());
      setErrorMsg({
        ...errorMsg,
        isValidEmail: true,
      });
    } else {
      setErrorMsg({
        ...errorMsg,
        isValidEmail: false,
      });
    }
  };

  const userHandler = val => {
    setValue(val + 1);

    console.log('Value==>', val);
    if (val === 0) {
      //setUserType('User');
    } else if (val === 1) {
      //setUserType('Celebrity');
    }
  };

  const passwordHandler = value => {
    setShownPassword(true);
    if (value.trim() !== '' || value.trim().length > 8) {
      setPassword(value.trim());
      setErrorMsg({
        ...errorMsg,
        isValidPassword: true,
      });
    } else {
      setErrorMsg({
        ...errorMsg,
        isValidPassword: false,
      });
    }
  };

  const onSignIn = async () => {
    if (!validateEmail(email)) {
      return setErrorMsg({...errorMsg, isValidEmail: false});
    } else if (password.trim().length < 8) {
      return setErrorMsg({...errorMsg, isValidPassword: false});
    } else {
      Hud.showHud();
      const loginData = {
        email: email,
        password: password,
      };
      console.log('login data==>', loginData);
      await axios
        .post(`${base_url}login`, loginData)
        .then(async response => {
          //console.log('login response Data==>', response.data.data);
          console.log('token------------>', response.data.data.token);
          Hud.hideHud();

          if (response.status == 200) {
            AsyncStorage.setItem('token', response.data.data.token);
            AsyncStorage.setItem(
              'userType',
              JSON.stringify(response.data.data.user_type),
            );
            setToken(response.data.data.token);

            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
            props.navigation.replace('MyDrawer');
          } else {
            console.log(response.status);
          }
        })
        .catch(function (error) {
          console.log('error==>', error);
          // Request made and server responded

          Hud.hideHud();
          if (error.response) {
            console.log('response error===>', error.response.data);
            var myobj = error.response.data;
            var firstItem = Object.values(myobj)[0];
            console.log('====>firstItem', firstItem);
            console.log('====>firstItem', typeof firstItem);

            Toast.show({
              type: 'error',
              text1: error.response.data.message,
            });
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Request Error==>', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
    }
  };

  const loginWithFacebook = async () => {
    if (Platform.OS === 'android') {
      LoginManager.setLoginBehavior('web_only');
    }
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
          console.log('==> Login cancelled');
        } else {
          console.log(
            '==> Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          AccessToken.getCurrentAccessToken().then(data => {
            console.log('Facebook data====>', data);
            console.log(
              'Facebook Access data====>',
              data.accessToken.toString(),
            );
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });

          // AccessToken.getCurrentAccessToken().then(data => {
          //   console.log('Facebook data====>', data);
          //   console.log(
          //     'Facebook Access data====>',
          //     data.accessToken.toString(),
          //   );
          //   let accessToken = data.accessToken;
          //   //alert(accessToken.toString());

          //   const responseInfoCallback = (error, result) => {
          //     if (error) {
          //       console.log(error);
          //       alert('Error fetching data: ' + error.toString());
          //     } else {
          //       console.log('Success fetching data: ', result);
          //       //alert('Success fetching data: ' + result.toString());
          //     }
          //   };

          //   const infoRequest = new GraphRequest(
          //     '/me',
          //     {
          //       accessToken: accessToken,
          //       parameters: {
          //         fields: {
          //           string: 'email,name,first_name,middle_name,last_name',
          //         },
          //       },
          //     },
          //     responseInfoCallback,
          //   );

          //   // Start the graph request.
          //   new GraphRequestManager().addRequest(infoRequest).start();
          // });
        }
      },
      function (error) {
        console.log('==> Login fail with error: ' + error);
      },
    );
  };

  const getInfoFromToken = token => {
    console.log('Facebook token===>', token);
    fetch(
      'https://graph.facebook.com/v2.5/me?fields=email,name&access_token=' +
        token,
    )
      .then(response => response.json())
      .then(async json => {
        console.log('facebook data json ====>', json);
        setFacebookData(json);
        //setShowModal(true);
        Hud.showHud();
        const facebookData1 = {
          email: json.email,
        };
        await axios
          .post(`${base_url}checkuser`, facebookData1)
          .then(res => {
            // console.log(res.data.data);

            if (res.status === 200) {
              if (
                res.data.data.length != 0 &&
                res.data.data.length != null &&
                res.data.data.length != undefined
              ) {
                facebookLogin(
                  json.email,
                  json.name,
                  res.data.data[0].username,
                  res.data.data[0].user_type,
                  res.data.data[0].country,
                  res.data.data[0].country_code,
                  res.data.data[0].currency,
                  json.id,
                );
              } else {
                Hud.hideHud();
                setShowModal(true);
              }
            } else {
              console.log('Error during checking user');
            }
          })
          .catch(function (error) {
            console.log('error==>', error);
            // Request made and server responded

            Hud.hideHud();
            if (error.response) {
              console.log('response error===>', error.response.data);
              var myobj = error.response.data;
              var firstItem = Object.values(myobj)[0];
              console.log('====>firstItem', firstItem);

              Toast.show({
                type: 'error',
                text1: error.response.data.message,
              });
            } else if (error.request) {
              // The request was made but no response was received
              console.log('Request Error==>', error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
          });
      })
      .catch(err => {
        console.log('ERROR GETTING DATA FROM FACEBOOK', err);
      });
  };

  const userNameHandler = value => {
    setUserName(value);
    setShownUserName(true);
  };

  const facebookLogin = async (
    email,
    name,
    username,
    user_type,
    country1,
    country_code,
    currency1,
    facebook_id,
  ) => {
    Hud.showHud();
    const facebookLoginData = {
      email: email,
      name: name,
      username: username,
      user_type: user_type,
      facebook_id: facebook_id,
      country: country1,
      country_code: country_code,
      currency: currency1,
      //device_token: deviceToken,
    };
    console.log('data===>', facebookLoginData);

    await axios
      .post(`${base_url}facebooklogin`, facebookLoginData)
      .then(async response => {
        Hud.hideHud();
        if (response.status == 200) {
          AsyncStorage.setItem('token', response.data.data.token);
          AsyncStorage.setItem('userType', JSON.stringify(user_type));
          setToken(response.data.data.token);

          Toast.show({
            type: 'success',
            text1: response.data.message,
          });
          props.navigation.replace('MyDrawer');
        } else {
          console.log('Error during Facebook Login', response.status);
        }
      })
      .catch(function (error) {
        // Request made and server responded

        Hud.hideHud();
        if (error.response) {
          console.log('response error===>', error.response.data);
          Toast.show({
            type: 'error',
            text1: 'This email is already registered using password',
            text2: 'Please use your valid credentials for Login',
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const facebookRegistration = async () => {
    console.log('Facebook Registration');
    if (userName.trim() === '') {
      setErrorMsg({...errorMsg, isValidUser: false});
    } else if (country == null) {
      return setErrorMsg({...errorMsg, isCountry: false});
    } else {
      setShowModal(false);
      facebookLogin(
        facebookData.email,
        facebookData.name,
        userName,
        value,
        country,
        countryCode,
        currency,
        facebookData.id,
      );
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={{flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center'}}>
        <View style={{marginTop: height * 0.1}}>
          <Text style={{fontSize: RFValue(40), fontWeight: 'bold'}}>
            Sign In
          </Text>
        </View>

        <View style={shownEmail ? styles.divisionSelect : styles.division}>
          <View style={styles.input}>
            <TextInput
              ref={emailRef}
              onChangeText={value => emailHandler(value)}
              placeholder="Email"
              //style={[styles.textInput]}
              placeholderTextColor={'#8E7B85'}
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef.current.focus();
              }}
              style={styles.input}
            />
          </View>

          <View
            style={{
              height: height * 0.05,
              width: width * 0.05,
              alignSelf: 'center',
              marginRight: 8,
            }}>
            <Image
              source={require('../../Assets/Icon/reg_message.png')}
              style={
                shownEmail
                  ? {...styles.imagesty, tintColor: 'black'}
                  : styles.imagesty
              }
              resizeMode="contain"
            />
          </View>
        </View>

        {!errorMsg.isValidEmail && (
          <Text
            style={{
              color: 'red',
              fontSize: RFValue(15),
              textAlign: 'center',
              width: '100%',
            }}>
            Please enter valid email
          </Text>
        )}

        <View style={shownPassword ? styles.divisionSelect : styles.division}>
          <View style={styles.input}>
            <TextInput
              ref={passwordRef}
              onChangeText={value => passwordHandler(value)}
              placeholder="Password"
              secureTextEntry={true}
              //style={[styles.textInput]}
              placeholderTextColor={'#8E7B85'}
              style={styles.input}
            />
          </View>

          <View
            style={{
              height: height * 0.03,
              width: width * 0.05,
              alignSelf: 'center',
              marginRight: 10,
            }}>
            <Image
              source={require('../../Assets/Icon/lock.png')}
              style={
                shownPassword
                  ? {...styles.imagesty, tintColor: 'black'}
                  : styles.imagesty
              }
              resizeMode="contain"
            />
          </View>
        </View>

        {!errorMsg.isValidPassword && (
          <Text
            style={{
              color: 'red',
              fontSize: RFValue(15),
              textAlign: 'center',
              width: '100%',
            }}>
            Please enter valid password
          </Text>
        )}

        <TouchableOpacity
          style={{alignSelf: 'center', margin: height * 0.03}}
          onPress={() => props.navigation.navigate('ForgotPassword')}>
          <Text
            style={{
              fontSize: RFValue(20),
              fontWeight: '400',
              color: '#151143',
            }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>

        <View
          style={{width: width * 0.8, height: 50, marginTop: height * 0.03}}>
          <TouchableOpacity
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#E92D87',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => onSignIn()}>
            <Text style={{fontSize: 19, color: '#FFFFFF'}}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={{margin: height * 0.03}}>
          <Text style={{fontSize: 20, color: '#8E8E8E'}}>or</Text>
        </View>

        <TouchableOpacity
          style={{
            // height: '100%',
            // width: '100%',
            width: width * 0.8,
            height: 50,
            backgroundColor: '#EBE0E5',
            borderRadius: 10,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
          onPress={() => {
            loginWithFacebook();
            //setShowModal(true);
          }}>
          <View style={{height: 30, width: 30}}>
            <Image
              source={require('../../Assets/Icon/facebook.png')}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
            />
          </View>

          <Modal
            visible={showModal}
            //visible={true}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={() => {
              setShowModal(false);
            }}>
            <View
              style={{
                backgroundColor: 'rgba(0,0,0,0.7)',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  width: width * 0.9,
                  //height: height * 0.5,
                  alignItems: 'center',
                  //justifyContent: 'center',
                  //marginTop: height * 0.3,
                  borderRadius: 10,
                  alignSelf: 'center',
                  paddingHorizontal: 5,
                  paddingBottom: height * 0.1,
                }}>
                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View />
                  <Text
                    style={{
                      color: '#000',
                      fontSize: RFValue(22),
                      fontWeight: 'bold',
                      // backgroundColor: 'red',
                      alignSelf: 'flex-end',
                    }}>
                    Other Details
                  </Text>

                  <TouchableOpacity
                    style={{
                      height: height * 0.06,
                      width: width * 0.06,
                      alignSelf: 'flex-end',
                    }}
                    onPress={() => setShowModal(false)}>
                    <Image
                      source={require('../../Assets/Icon/close.png')}
                      style={{
                        height: '100%',
                        width: '100%',
                        tintColor: '#000',
                      }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={
                    shownUserName ? styles.divisionSelect : styles.division
                  }>
                  <View style={styles.input}>
                    <TextInput
                      onChangeText={value => userNameHandler(value)}
                      placeholder="UserName"
                      style={[styles.input]}
                      placeholderTextColor={'#8E7B85'}
                      autoCorrect={false}
                    />
                  </View>

                  <View
                    style={{
                      height: height * 0.05,
                      width: width * 0.05,
                      alignSelf: 'center',
                      marginRight: 8,
                    }}>
                    <Image
                      source={require('../../Assets/Icon/name.png')}
                      style={
                        shownUserName
                          ? {...styles.imagesty, tintColor: 'black'}
                          : {...styles.imagesty, tintColor: '#B19DA7'}
                      }
                      resizeMode="contain"
                    />
                  </View>
                </View>
                {!errorMsg.isValidUser && (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: RFValue(15),
                      textAlign: 'center',
                      width: '100%',
                    }}>
                    Please enter unique Username
                  </Text>
                )}

                {shownCountry ? (
                  <TouchableOpacity style={styles.divisionSelect}>
                    <View style={{...styles.input, justifyContent: 'center'}}>
                      <CountryPicker
                        {...{
                          countryCode,
                          withFlag,
                          withCountryNameButton,

                          onSelect,
                        }}
                        visible={shownCountry}
                      />
                    </View>

                    <View
                      style={{
                        height: height * 0.05,
                        width: width * 0.05,
                        alignSelf: 'center',
                        marginRight: 8,
                      }}>
                      <Image
                        source={require('../../Assets/Icon/flag.png')}
                        style={
                          shownCountry
                            ? {...styles.imagesty, tintColor: 'black'}
                            : {...styles.imagesty, tintColor: '#B19DA7'}
                        }
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setShownCountry(true);
                      //onSelect();
                    }}
                    style={styles.division}>
                    <View style={{...styles.input, justifyContent: 'center'}}>
                      {country == null ? (
                        <Text style={{color: '#8E7B85'}}>Country</Text>
                      ) : (
                        <Text style={{color: '#151143'}}>{country}</Text>
                      )}
                    </View>

                    <View
                      style={{
                        height: height * 0.05,
                        width: width * 0.05,
                        alignSelf: 'center',
                        marginRight: 8,
                      }}>
                      <Image
                        source={require('../../Assets/Icon/flag.png')}
                        style={
                          shownCountry
                            ? {...styles.imagesty, tintColor: 'black'}
                            : {...styles.imagesty, tintColor: '#B19DA7'}
                        }
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                )}

                {!errorMsg.isCountry && (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: RFValue(15),
                      textAlign: 'center',
                      width: '100%',
                    }}>
                    Please Select your Country
                  </Text>
                )}

                {/* <View
                  style={{
                    width: width * 0.75,
                    marginTop: height * 0.03,
                    alignSelf: 'center',
                  }}>
                  <Text style={{color: '#8E7B85', fontSize: RFValue(20)}}>
                    User Type
                  </Text>

                  <View style={{marginVertical: height * 0.03}}>
                    <RadioForm
                      radio_props={choice}
                      initial={0}
                      onPress={val => userHandler(val)}
                      buttonSize={12}
                      buttonOuterSize={20}
                      buttonColor={'#EBE0E5'}
                      selectedButtonColor={'#E92D87'}
                      //buttonInnerColor={'#EBE0E5'}
                      labelHorizontal={true}
                      labelStyle={{
                        fontSize: RFValue(20),
                        marginRight: 20,
                        color: '#151143',
                      }}
                      disabled={false}
                      formHorizontal={true}
                    />
                  </View>
                </View> */}
                <View
                  style={{width: width * 0.75, marginVertical: height * 0.03}}>
                  <Text style={{color: '#8E7B85', fontSize: RFValue(20)}}>
                    User Type
                  </Text>

                  <View
                    style={{
                      marginTop: height * 0.01,
                      width: '70%',
                      alignSelf: 'flex-start',
                      //backgroundColor: 'red',
                      //height: 50,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        //width: '40%',
                        alignSelf: 'flex-start',
                        //backgroundColor: 'red',
                        //height: 50,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <CustomRadio
                        status={value === 0}
                        onPress={() => userHandler(0)}
                      />
                      <Text
                        onPress={() => userHandler(0)}
                        style={{fontSize: RFValue(18), alignSelf: 'center'}}>
                        User
                      </Text>
                    </View>

                    <View
                      style={{
                        alignSelf: 'flex-start',
                        //backgroundColor: 'red',
                        //height: 50,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <CustomRadio
                        status={value === 1}
                        onPress={() => userHandler(1)}
                      />

                      <Text
                        onPress={() => userHandler(1)}
                        style={{fontSize: RFValue(18)}}>
                        Celebrity
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    facebookRegistration();
                  }}
                  style={{
                    position: 'absolute',
                    bottom: 15,
                    width: 150,
                    height: 50,
                    backgroundColor: '#E92D87',
                    alignSelf: 'center',
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: '#FFFFFF',
                      //fontFamily: 'Roboto-Medium',
                      fontWeight: '500',
                    }}>
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View>
            <Text style={{fontSize: 17, color: '#000', fontWeight: 'bold'}}>
              Continue with Facebook
            </Text>
          </View>

          <View></View>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            height: height * 0.07,
            width: width * 0.8,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: height * 0.01,
          }}>
          <Text style={{fontSize: RFValue(18), color: '#8A8A8A'}}>
            Don’t have an account?
          </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Registration')}>
            <Text
              style={{
                color: '#E92D87',
                fontSize: RFValue(19),
                fontWeight: 'bold',
                marginLeft: 5,
              }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  division: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.05,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.05,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    color: '#151143',
  },

  icon: {},

  imagesty: {width: '100%', height: '100%'},
});
