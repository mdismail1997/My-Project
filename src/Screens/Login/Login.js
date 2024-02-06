import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  Dimensions,
  Alert,
  I18nManager,
  BackHandler,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { Input } from '@rneui/themed';
import ButtonDark from '../../Component/Common/ButtonDark';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loder from '../../Component/Common/Lodar';
import { PostRequest, PutRequest } from '../../Services/ApiFunctions';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import auth from '@react-native-firebase/auth';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import axios from 'axios';
import { CountryPicker } from "react-native-country-codes-picker";
import RadioButtonRN from 'radio-buttons-react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function Login({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [emailForgot, setEmailForgot] = useState('');
  const [password, setPassword] = useState('');
  const [loder, setLoder] = useState(false);
  const [security, setSecurity] = useState(true);
  const [field, setField] = useState(false);
  const [PasswordForgot, setPasswordForgot] = useState('');


  const [phone, setPhone] = useState('');
  const [showModal1, setShowModal1] = useState(false);



  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);
  const [showModal5, setShowModal5] = useState(false);
  const [showModal8, setShowModal8] = useState(false);
  const [showModal9, setShowModal9] = useState(false);
  const [otp, setOtp] = useState('');




  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+971');
  const [flag, setFlag] = useState('');

  const [forgetPasswordType, setForgetPasswordType] = useState('Mobile');



  const [userinfoemail, setUserInfoEmail] = useState('');
  const [giveninfoname, setUserInfoGivenName] = useState('');
  const [familyinfoname, setUserInfoFamilyName] = useState('');
  const [token, setUserInfoToken] = useState('');
  const [userinfo, setUserInfo] = useState('');








  useEffect(() => {
    setLoder(true)

    GoogleSignin.configure();
    // GoogleSignin.configure({
    //   webClientId:
    //     '786530219411-hh2q7914j2q58o806q4v7nhk53j5snvt.apps.googleusercontent.com',
    //     offlineAccess: false
    // });
    selectedLng()
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);


  const data = [
    {
      label: 'Mobile'
    },
    {
      label: 'Email'
    }
  ];

  const backAction = () => {
    BackHandler.exitApp()
    return true;
  };
  const selectedLng = async () => {
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
    // console.warn("selected Language data==>>>", lngData)
  }

  const loginGmail = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(
        'Social Login Data1111111111111',
        userInfo.user.email,
        userInfo.user.givenName,
        userInfo.user.familyName,
        userInfo.idToken,
      );
      setUserInfoEmail(userInfo.user.email)
      // console.log("pppppppppppppppppp",userInfo.user.email)
      setUserInfoGivenName(userInfo.user.givenName)
      setUserInfoFamilyName(userInfo.user.familyName)
      setUserInfoToken(userInfo.idToken)
      // ({
      //     emailS: userInfo.user.email,
      //     passwordS: userInfo.idToken,
      //     firstnameS: userInfo.user.givenName,
      //     lastnameS: userInfo.user.familyName
      // })

      // loginWithSocial(
      //   userInfo.user.email,
      //   userInfo.user.givenName,
      //   userInfo.user.familyName,
      //   userInfo.idToken,
      // );
      setUserInfo(userInfo)
      SocialLogin(userInfo.user)
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const SocialLogin = async (userInfo) => {
    console.warn("userInfo social login", userInfo);
    setLoder(true);
    const data = {
      data: {
        email: userInfo.email,
      }
    };
    // try {
    // 	let result = await createpost({
    // 		tokenType: "adminAdd",
    // 		url: commonUrl.isSeller, //registration
    // 		body: data,
    // 	});
    // 	console.warn(`result`, result.data);
    // 	if (result.data === false) {
    // 		setLoading(false);
    // 		navigation.navigate("RegistrationScreen", { info: userInfo });
    // 	} else {
    // 		setLoading(false);
    // 		doLogin(userInfo.email);
    // 	}
    // } catch (error) {
    // 	setLoading(false);
    // 	console.log("SocialLogin/registration error", error);
    // 	Toast.show({
    // 		text1: `${error.response.data.message}`,
    // 		type: "error",
    // 	});
    // }

    PostRequest('mpapi/customer/login', data, {}, 'admin')
      .then(async res => {
        setLoder(false);
        console.log('userInfo22222222222222222222222222 => ', res);
        if (res == "email is not exist") {
          setLoder(false);
          loginWithSocial(userinfoemail, giveninfoname, familyinfoname)
          // setShowModal8(!showModal8)
          // navigation.navigate("signup", { info: userInfo });
          loginWithSocial(userinfoemail,giveninfoname,familyinfoname)
        } else {
          setLoder(false);
          await AsyncStorage.setItem('traderToken', res[0].customer_token);
          Alert.alert(strings.LOGIN_SUCCESS, strings.LOGIN_SUCCESS2, [
            { text: strings.CANCEL },
            {
              text: strings.OK,
              onPress: () => loginReset(),
            },
          ]);
        }
      })
      .catch(error => {
        setLoder(false);
        console.warn("SocialLogin/registration error", error.response);
      });
  };


  const loginWithSocial = async () => {
    // console.log("lllllllllllllllllllllll")
    let Test_ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    setLoder(true);

    const mydata = {
      customer: {
        email: userinfoemail,
        firstname: giveninfoname,
        lastname: familyinfoname,
      },
      password: '#Admin123',
      // mobileNumber: countryCode.substring(1) + phone,
      // otp: otp


    };





    console.warn('----------------------------------------------------------------', mydata);
    // PostRequest('mobilelogin/createaccount', data, {}, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/customers`,
      //https://traders-platform.com/rest/V1/mobilelogin/createaccount
      headers: {
        authorization: `Bearer ${Test_ADMIN_TOKEN}`,
      },
      data: mydata,
    })
      .then(async res => {
        setLoder(false);
        console.warn('Login responce1233333333 => ', res.data);
        let password = '#Admin123';
        // let x = res.split(' ');
        // let fullname = x.filter(function (entry) {
        //   return entry.trim() != '';
        // });

        // // if (res.includes('exists') == true) {
        // //   console.warn('fullnamefullname', fullname[3]);
        // //   loginwithPut(emailS, firstnameS, lastnameS, password, fullname[3]);
        // // } else {
        // setShowModal9(!showModal9)
        mySociallogin(userinfoemail, password);
        // console.warn('resresresresresres', 'resresresresresres');

        // }
      })
      .catch(error => {
        setLoder(false);
        console.warn('Login error1 => ', error.response);
      });
  };

  loginwithPut = (emailS, firstnameS, lastnameS, passwordS, id) => {
    setLoder(!loder);
    let data = {
      customer: {
        id: id,
        email: emailS,
        firstname: firstnameS,
        lastname: lastnameS,
        website_id: 1,
      },
      password: passwordS,
    };

    PutRequest(`customers/${id}`, data, {}, 'admin')
      .then(response => {
        console.warn('profile update => ', response);
        setLoder(loder);
        otpSend(emailS, passwordS);
      })
      .catch(error => {
        console.warn('profile upadate error', error);
        setLoder(!loder);
        // Alert.alert('Profile', 'Profile updated faild.', [
        //   { text: 'Cancel' },
        //   { text: 'OK' },
        // ]);
      });
  };

  otpSend = async (emailS, passwordS) => {
    console.warn('Forgot password responce => ', passwordS);
    setLoder(true);
    const params = {
      email: emailS,
      template: 'email_reset',
      websiteId: '1',
    };
    console.warn('Forgot password responce => ', params);

    PutRequest('customers/password/?', {}, params, 'admin')
      .then(async res => {
        setLoder(false);
        console.warn('Forgot password responce => ', res);
        let resToken = JSON.parse(res);
        await AsyncStorage.setItem('traderResToken', resToken.token);
        resetPassword(emailS, passwordS);
        // if (res) {
        //     ({ otpshow: !state.otpshow })
        // }
      })
      .catch(error => {
        setLoder(false);
        console.warn('Forgot password error => ', error);
        // Alert.alert('Forgot password', 'Otp sent faile. Please try again.', [
        //   { text: 'Cancel' },
        //   { text: 'OK' },
        // ]);
      });
  };

  const resetPassword = async (emailS, passwordS) => {
    setLoder(true);

    let AccessToken = await AsyncStorage.getItem('traderResToken');

    const senddata = {
      email: emailS,
      resetToken: AccessToken,
      newPassword: passwordS,
    };

    PostRequest('customers/resetPassword', senddata, {}, 'admin')
      .then(async res => {
        console.warn('change password responce => ', res);
        if (res.message) {
          Alert.alert(strings.CHANGE_PASSWORD, res?.message, [
            { text: strings.CANCEL },
            { text: strings.OK },
          ]);
        } else {
          console.warn('change password responce => ', emailS, passwordS);

          login(emailS, passwordS);
        }
      })
      .catch(error => {
        setLoder(false);
        console.warn('change password error => ', error);
        Alert.alert(strings.CHANGE_PASS_FAIL, strings.LOGIN_FAIL2, [
          { text: strings.CANCEL },
          { text: strings.OK },
        ]);
      });
  };

  const submit = () => {
    let reg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email == '') {
      Alert.alert(strings.LOGIN_1, strings.EMAIL_ERR, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (reg.test(email) == false) {
      Alert.alert(strings.LOGIN_1, strings.VALID_EMAIL, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password == '') {
      Alert.alert(strings.LOGIN_1, strings.ENTER_PASS, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password.length < 8) {
      Alert.alert(strings.LOGIN_1, strings.PASS_ERR, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else {
      login();
    }
  };
  const loginReset = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'drawer' }],
    });
    setEmail('');
    setPassword('');
    setPhone('');
    setOtp('');

  };

  const mySociallogin = async (userinfoemail, password) => {
    if (userinfoemail && password) {
      setLoder(true);
      const params = {
        username: userinfoemail,
        password: password,
      };
      PostRequest('integration/customer/token?', {}, params, 'admin')
        .then(async res => {
          setLoder(false);
          console.warn('Login responce => ', res);
          if (res.message) {
            Alert.alert(strings.LOGIN_1, res?.message, [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
          } else {
            await AsyncStorage.setItem('traderToken', res);
            Alert.alert(strings.LOGIN_SUCCESS, strings.LOGIN_SUCCESS2, [
              { text: strings.CANCEL },
              {
                text: strings.OK,
                onPress: () => loginReset(),
              },
            ]);
          }
        })
        .catch(error => {
          setLoder(false);
          console.log('Login error2 => ', error.response);
          Alert.alert(strings.LOGIN_FAIL, strings.LOGIN_FAIL2,
            [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
        });
    } else {
      setLoder(true);
      const params = {
        username: email,
        password: password,
      };
      PostRequest('integration/customer/token?', {}, params, 'admin')
        .then(async res => {
          setLoder(false);
          console.warn('Login responce => ', res);
          if (res.message) {
            Alert.alert(strings.LOGIN_1, res?.message, [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
          } else {
            await AsyncStorage.setItem('traderToken', res);
            Alert.alert(strings.LOGIN_SUCCESS, strings.LOGIN_SUCCESS2, [
              { text: strings.CANCEL },
              {
                text: strings.OK,
                onPress: () => loginReset(),
              },
            ]);
          }
        })
        .catch(error => {
          setLoder(false);
          console.log('Login error3 => ', error.response);
          Alert.alert(strings.LOGIN_FAIL, strings.LOGIN_FAIL2,
            [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
        });
    }
  };





  const login = async (emailS, passwords) => {
    if (emailS && passwords) {
      setLoder(true);
      const params = {
        username: emailS,
        password: passwords,
      };
      PostRequest('integration/customer/token?', {}, params, 'admin')
        .then(async res => {
          setLoder(false);
          console.warn('Login responce => ', res);
          if (res.message) {
            Alert.alert(strings.LOGIN_1, res?.message, [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
          } else {
            await AsyncStorage.setItem('traderToken', res);
            Alert.alert(strings.LOGIN_SUCCESS, strings.LOGIN_SUCCESS2, [
              { text: strings.CANCEL },
              {
                text: strings.OK,
                onPress: () => loginReset(),
              },
            ]);
          }
        })
        .catch(error => {
          setLoder(false);
          console.log('Login error2 => ', error.response);
          Alert.alert(strings.LOGIN_FAIL, strings.LOGIN_FAIL2,
            [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
        });
    } else {
      setLoder(true);
      const params = {
        username: email,
        password: password,
      };
      PostRequest('integration/customer/token?', {}, params, 'admin')
        .then(async res => {
          setLoder(false);
          console.warn('Login responce => ', res);
          if (res.message) {
            Alert.alert(strings.LOGIN_1, res?.message, [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
          } else {
            await AsyncStorage.setItem('traderToken', res);
            Alert.alert(strings.LOGIN_SUCCESS, strings.LOGIN_SUCCESS2, [
              { text: strings.CANCEL },
              {
                text: strings.OK,
                onPress: () => loginReset(),
              },
            ]);
          }
        })
        .catch(error => {
          setLoder(false);
          console.log('Login error3 => ', error.response);
          Alert.alert(strings.LOGIN_FAIL, strings.LOGIN_FAIL2,
            [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
        });
    }
  };



  const forgot = async () => {
    setLoder(true);
    const params = {
      email: emailForgot,
      template: 'email_reset',
      websiteId: '1',
    };
    PutRequest('customers/password/', {}, params, 'self')
      .then(async res => {
        setLoder(false);
        let resToken = JSON.parse(res);
        console.log('Login responce => ', resToken.token);
        if (res.message) {
          Alert.alert('', res?.message, [
            { text: strings.CANCEL },
            { text: strings.OK },
          ]);
        } else {
          await AsyncStorage.setItem('traderResToken', resToken.token);
          // setField(true);
          setEmailForgot('')
          Alert.alert(
            strings.CHECK_MAIL,
            strings.EMAIL_SENT,
            [{ text: strings.CANCEL },
            { text: strings.OK, onPress: () => setShowModal(!showModal), },]
          );
        }
      })
      .catch(error => {
        setLoder(false);
        console.warn('Login error4 => ', error.response);
        Alert.alert(strings.REGISTERED_MAIL, '', [
          { text: strings.CANCEL },
          { text: strings.OK },
        ]);
      });
  };

  const resetPassword1 = async () => {
    setLoder(true);
    // const params = {
    //     customerId: data?.id
    // }
    let AccessToken = await AsyncStorage.getItem('traderResToken');

    console.log('props', emailForgot, AccessToken, PasswordForgot);
    const senddata = {
      email: emailForgot,
      resetToken: AccessToken,
      newPassword: PasswordForgot,
    };
    PostRequest('customers/resetPassword', senddata, {}, 'self')
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
                  setEmailForgot(''),
                    setPasswordForgot(''),
                    setShowModal(false);
                },
              },
            ],
          );
        }
      })
      .catch(error => {
        setLoder(false);
        console.log('change password error => ', error);
        Alert.alert(strings.CHANGE_PASS_FAIL, strings.LOGIN_FAIL2, [
          { text: strings.CANCEL },
          { text: strings.OK },
        ]);
      });
  };

  //'==========================================================================='
  //'------------------------------Facebook-------------------------------------'

  onFacebookButtonPress = async () => {
    const result = await LoginManager.logInWithPermissions([
      'email',
      'public_profile',
      'openid',
    ]);
    console.warn('User', result);
    if (result.isCancelled) {
      console.warn('User cancelled the login process');
    }

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      console.warn('Something went wrong obtaining access token');
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );


    return auth().signInWithCredential(facebookCredential);


  };

  const mobileLogin = async () => {
    var token = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    setLoder(true);
    let mydata =
    {
      mobileNumber: countryCode.substring(1) + phone,
      websiteId: "1",


    }
    console.log('send Phone number=====', mydata);
    // PostRequest('mobilelogin/createaccountotp', mydata,{}, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/createaccountotp`,
      headers: {
        authorization: `Bearer ${token}`,

      },
      data: mydata,
    })

      .then(response => {
        setLoder(false);
        console.warn('send OTP responce => ', response.data);
        // setShowModal2(!showModal2)
        Alert.alert('', response.data[0].message, [
          { text: '' },
          { text: 'OK', onPress: () => { setShowModal2(!showModal2) } },
        ]);
        if (response.data[0].status == true) {
          setShowModal3(!showModal3)

        }
        else { setShowModal2(!showModal2) }

        //     if (response.data) {
        //     Alert.alert('Your Request Sent Successfully', response.data, [
        //       {text: ''},
        //       {text: 'OK', onPress: () => this.props.navigation.navigate('MyOrder')},
        //     ]);
        //   }

      })
      .catch(error => {
        setLoder(false);
        console.warn('send OTP Error =========2222222222222=>', error.response);
      });
  };

  const SocialmobileLogin = async () => {
    console.log("solcial Login")
    var token = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    setLoder(true);
    let mydata =
    {
      mobileNumber: countryCode.substring(1) + phone,
      websiteId: "1",


    }
    console.log('send Phone number=====', mydata);
    // PostRequest('mobilelogin/createaccountotp', mydata,{}, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/createaccountotp`,
      headers: {
        authorization: `Bearer ${token}`,

      },
      data: mydata,
    })

      .then(response => {
        setLoder(false);
        console.warn('send OTP responce => ', response.data);
        // setShowModal2(!showModal2)
        setShowModal8(!showModal8)
        Alert.alert('', response.data[0].message, [
          { text: '' },
          { text: 'OK', },
        ]);
        if (response.data[0].status == true) {
          setShowModal9(!showModal9)

        }
        else { setShowModal8(!showModal8) }

        //     if (response.data) {
        //     Alert.alert('Your Request Sent Successfully', response.data, [
        //       {text: ''},
        //       {text: 'OK', onPress: () => this.props.navigation.navigate('MyOrder')},
        //     ]);
        //   }

      })
      .catch(error => {
        setLoder(false);
        console.warn('send OTP Error =========2222222222222=>', error.response);
      });
  };





  const createaccountotpverify = async () => {

    let Test_ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    setLoder(true);
    let mydata =
    {
      mobileNumber: countryCode.substring(1) + phone,
      websiteId: "1",
      otp: otp,


    }
    console.log('send Refund data', mydata);
    // PostRequest('mobilelogin/createaccountotpverify', {}, mydata, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/createaccountotpverify`,
      headers: {
        authorization: `Bearer ${Test_ADMIN_TOKEN}`,

      },
      data: mydata,
    })

      .then(response => {
        setLoder(false);
        console.warn('OTP VERIFY responce => ', response.data);
        // setShowModal2(!showModal2)



        if (response.data[0].status == true) {
          Alert.alert('', "Otp Verify Successfully", [
            { text: '' },
            { text: 'OK', onPress: () => { setShowModal3(!showModal2) } },
          ]);



          navigation.navigate('signup',
            {
              phone: countryCode.substring(1) + phone,
              otp: otp,

            }
          )

        }
        else {
          Alert.alert('', response.data[0].message, [
            { text: '' },
            { text: 'OK', onPress: () => { setShowModal3(!showModal2) } },
          ]);
          console.log("Else========")
        }

        //     if (response.data) {
        //     Alert.alert('Your Request Sent Successfully', response.data, [
        //       {text: ''},
        //       {text: 'OK', onPress: () => this.props.navigation.navigate('MyOrder')},
        //     ]);
        //   }

      })
      .catch(error => {
        setLoder(false);
        console.warn('send OTP Error 3333333333333=>', error.response);
      });
  };


  const loginwithOtp = async () => {
    let ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    setLoder(true);
    let mydata =
    {
      mobileNumber: countryCode.substring(1) + phone,
      websiteId: "1",


    }
    console.log('send phone number to login', mydata);
    // PostRequest('mobilelogin/loginotp', {}, mydata, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/loginotp`,
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
            text: 'OK', onPress: () => setShowModal1(!showModal1)
          }
        ]);



        if (response.data[0].status == true) { setShowModal4(!showModal4) }

        else { setShowModal1(!showModal1) }

        //     if (response.data) {
        //     Alert.alert('Your Request Sent Successfully', response.data, [
        //       {text: ''},
        //       {text: 'OK', onPress: () => this.props.navigation.navigate('MyOrder')},
        //     ]);
        //   }

      })
      .catch(error => {
        setLoder(false);
        console.warn('send OTP Error mobilelogin**************************** =>', error.response);
      });
  };
  const loginOTPVerify = async () => {
    let Test_ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    setLoder(true);
    let mydata =
    {
      mobileNumber: countryCode.substring(1) + phone,
      websiteId: "1",
      otp: otp,


    }
    console.log('send mobile number with otp data', mydata);
    // PostRequest('mobilelogin/loginotpverify', {}, mydata, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/loginotpverify`,
      headers: {
        authorization: `Bearer ${Test_ADMIN_TOKEN}`,

      },
      data: mydata,
    })

      .then(async response => {
        setLoder(false);
        console.warn('login with Otp responce => ', response.data);
        // setShowModal2(!showModal2)


        if (response.data[0].status == true) {
          Alert.alert('', "Otp Verify Successfully", [
            { text: '' },
            { text: 'OK', onPress: () => { setShowModal1(!showModal1) } },
          ]);

          await AsyncStorage.setItem('traderToken', response.data[0].token);
          console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", response.data[0].token)
          Alert.alert(strings.LOGIN_SUCCESS, strings.LOGIN_SUCCESS2, [
            { text: strings.CANCEL },
            {
              text: strings.OK,
              onPress: () => loginReset(),
            },
          ]);





        }
        else {
          Alert.alert('', response.data[0].message, [
            { text: '' },
            { text: 'OK', onPress: () => { setShowModal1(!showModal1) } },
          ]);
          console.log("Else========")
        }







        //     if (response.data) {
        //     Alert.alert('Your Request Sent Successfully', response.data, [
        //       {text: ''},
        //       {text: 'OK', onPress: () => this.props.navigation.navigate('MyOrder')},
        //     ]);
        //   }

      })
      .catch(error => {
        setLoder(false);
        console.warn('send OTP Error 111111111=>', error.response);
      });
  };


  const forgotpasswordotp = async () => {
    let ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    console.log('==========', ADMIN_TOKEN);
    setLoder(true);
    let mydata =
    {
      mobileNumber: countryCode.substring(1) + phone,
      websiteId: "1",


    }
    console.log('send phone number to Foget Password', mydata);
    // PostRequest('mobilelogin/loginotp', {}, mydata, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/forgotpasswordotp`,
      headers: {
        authorization: `Bearer ${ADMIN_TOKEN}`,

      },
      data: mydata,
    })

      .then(response => {
        setLoder(false);
        console.warn('Forget password phone number respose => ', response.data);
        // setShowModal2(!showModal2)
        // Alert.alert('', response.data[0].message, [
        //   { text: '' },
        //   {
        //     text: 'OK',
        //   }
        // ]);



        if (response.data[0].status == true) {
          setShowModal(!showModal),
            setShowModal5(!showModal5);
        }

        else {
          Alert.alert('', response.data[0].message, [
            { text: '' },
            { text: 'OK', onPress: () => { setShowModal(!showModal) } },
          ]);
        }

      })
      .catch(error => {
        setLoder(false);
        console.warn('send OTP Error mobilelogin**************************** =>', error.response);
      });
  };




  const getForgotPasswordOTPVerify = async () => {
    let Test_ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    setLoder(true);
    let mydata =
    {
      mobileNumber: countryCode.substring(1) + phone,
      websiteId: "1",
      otp: otp,


    };
    console.log('send Forget password Details', mydata);
    // PostRequest('mobilelogin/loginotpverify', {}, mydata, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/forgotpasswordotpverify`,
      headers: {
        authorization: `Bearer ${Test_ADMIN_TOKEN}`,

      },
      data: mydata,
    })

      .then(async response => {
        setLoder(false);
        console.warn('Forget password Response ', response.data);
        // setShowModal2(!showModal2)


        if (response.data[0].status == true) {
          Alert.alert('', "Otp Verify Successfully", [
            { text: '' },
            { text: 'OK', onPress: () => { setShowModal5(false) } },
          ]);

          console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn", response.data[0])
          navigation.navigate('ForgotPassword', {
            phone: countryCode.substring(1) + phone,
            otp: otp,
          })
          // Alert.alert(strings.LOGIN_SUCCESS, strings.LOGIN_SUCCESS2, [
          //   { text: strings.CANCEL },
          //   {
          //     text: strings.OK,
          //     onPress: () =>,
          //   },
          // ]);







        }
        else {
          Alert.alert('', response.data[0].message, [
            { text: '' },
            { text: 'OK', onPress: () => { setShowModal5(!showModal5) } },
          ]);
          console.log("Else========")
        }







        //     if (response.data) {
        //     Alert.alert('Your Request Sent Successfully', response.data, [
        //       {text: ''},
        //       {text: 'OK', onPress: () => this.props.navigation.navigate('MyOrder')},
        //     ]);
        //   }

      })
      .catch(error => {
        setLoder(false);
        console.warn('send OTP Error 111111111=>', error.response);
      });
  };







  const Socialaccountotpverify = async () => {

    let Test_ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4'
    setLoder(true);
    let mydata =
    {
      mobileNumber: countryCode.substring(1) + phone,
      websiteId: "1",
      otp: otp,


    }
    console.log('send social otp', mydata);
    // PostRequest('mobilelogin/createaccountotpverify', {}, mydata, 'admin')
    await axios({
      method: 'POST',
      url: `https://traders-platform.com/rest/V1/mobilelogin/createaccountotpverify`,
      headers: {
        authorization: `Bearer ${Test_ADMIN_TOKEN}`,

      },
      data: mydata,
    })

      .then(response => {
        setLoder(false);
        console.warn('OTP VERIFY  social responce => ', response.data);
        // setShowModal2(!showModal2)

        setShowModal9(!showModal9)

        if (response.data[0].status == true) {
          Alert.alert('', "Otp Verify Successfully", [
            { text: '' },
            { text: 'OK', },
          ]);
          loginWithSocial(userinfoemail, giveninfoname, familyinfoname)


          // navigation.navigate('signup',
          //   {
          //     phone: countryCode.substring(1) + phone,
          //     otp: otp,

          //   }
          // )

        }
        else {
          Alert.alert('', response.data[0].message, [
            { text: '' },
            { text: 'OK', onPress: () => { setShowModal3(!showModal2) } },
          ]);
          console.log("Else========")
        }

        //     if (response.data) {
        //     Alert.alert('Your Request Sent Successfully', response.data, [
        //       {text: ''},
        //       {text: 'OK', onPress: () => this.props.navigation.navigate('MyOrder')},
        //     ]);
        //   }

      })
      .catch(error => {
        setLoder(false);
        console.warn('send OTP Error 3333333333333=>', error.response);
      });
  };



  
  const checkNumber = () => {
    let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
     if (phone == '') {
      Alert.alert(strings.LOGIN_1, strings.ENTER_PHONE_NO, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } 
     else {
      loginwithOtp();
    }
  };
  

  const checkRegistrationNumber = () => {
    let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
     if (phone == '') {
      Alert.alert(strings.REGISTRATION, strings.ENTER_PHONE_NO, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } 
     else {
      mobileLogin();
    }
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(!showModal)}>
        <Pressable
          onPress={() => { setShowModal(false) }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width - 60,
              borderRadius: 5,
            }}>
            <Feather
              onPress={() => setShowModal(!showModal)}
              style={{
                color: '#676767',
                fontSize: 30,
                alignSelf: 'flex-end',
                marginTop: 10,
                marginRight: 10,
              }}
              name={'x'}
              solid
            />
            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: '#3F4F5F',
                  textAlign: 'center',
                  marginBottom: 30,
                }}>
                {strings.FORGET_YOUR_PASSWORD}
              </Text>

              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: '#3F4F5F',
                  fontSize: 15,
                  marginBottom: 5,
                }}>
                {strings.ENTER_YOUR_EMAIL}

              </Text>
              <RadioButtonRN
                data={data}
                style={{ flexDirection: 'row', textAlign: 'center', marginBottom: 20, }}
                boxStyle={{ width: width * 0.35, paddingHorizontal: 10 }}
                textStyle={{ fontSize: 15, fontFamily: 'Roboto-Regular,', marginLeft: 15 }}
                circleSize={10}
                activeColor={'#00ff40'}
                boxActiveBgColor={'#fff'}
                selectedBtn={(e) => {
                  setForgetPasswordType(e.label),
                    console.log("data-----------", e);
                }
                }
              />
              {forgetPasswordType == 'Mobile'
                ? <>
                  <Input
                    placeholder={strings.MOBILE_NUMBER}
                    inputContainerStyle={{ borderWidth: 1 }}
                    containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
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
                          width: width * 0.26,
                          height: 50,
                          backgroundColor: '#B6B6B4',
                          padding: 10,
                          flexDirection: 'row',
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
                          marginTop: 1.5,
                          marginLeft: 8,


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
                    inputPlaceholder="Enter your Country code"
                    placeholderTextColor='black'
                    // keyboardType='search'
                    // disableBackdrop
                    // inputPlaceholder = { 'Search your country.....'}
                    // lang={'cz'}
                    style={{
                      modal: {
                        height: 500,
                        backgroundColor: '#D0D3D4',
                        color: 'black',
                        // marginTop:15
                      },



                      textInput: {
                        height: 60,
                        borderRadius: 0,
                        color: 'black'
                      },
                      dialCode: {
                        color: 'black'

                      },

                      countryName: {
                        color: 'black'

                      },
                      searchMessageText: {
                        color: 'black'

                      },

                      countryButtonStyles: {
                        height: 80,
                        color: 'black'
                      },
                    }}
                    pickerButtonOnPress={(item) => {
                      console.log("mmmmmmmmmmmmm12233333333", item.dial_code.substring(1))
                      setFlag(item.flag)
                      setCountryCode(item.dial_code);
                      setShow(false);
                      // console.log("mmmmmmmmmmmmm", typeof item.dial_code, item.dial_code)
                    }}
                    onBackdropPress={() => setShow(false)}
                  />



                </>


                :
                <Input
                  placeholder={strings.EMAIL}
                  inputContainerStyle={{ borderWidth: 1 }}
                  containerStyle={{ paddingHorizontal: 0 }}
                  inputStyle={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Regular',
                    color: '#47474B',
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                  placeholderTextColor="#47474B"
                  leftIconContainerStyle={{ marginLeft: 10 }}
                  leftIcon={
                    <Image
                      source={require('../../Assets/gmail.png')}
                      style={{ width: 25, height: 25 }}
                    />
                  }
                  onChangeText={e => setEmailForgot(e)}
                  value={emailForgot}
                />
              }







              {forgetPasswordType == 'Mobile'
                ?

                <ButtonDark
                  handleClick={() => {
                    // field == true ? resetPassword1() : 
                    forgotpasswordotp();
                  }}
                  title={strings.SEND_OTP}
                />

                :

                <ButtonDark
                  handleClick={() => {
                    // field == true ? resetPassword1() : forgot()
                    // forgotpasswordotp();
                    forgot();
                  }}
                  title={strings.SEND_EMAIL}
                />}
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal1}
        onRequestClose={() => setShowModal1(!showModal1)}>
        <Pressable
          onPress={() => { setShowModal1(false) }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width - 60,
              borderRadius: 5,
            }}>
            <Feather
              onPress={() => setShowModal1(!showModal1)}
              style={{
                color: '#676767',
                fontSize: 30,
                alignSelf: 'flex-end',
                marginTop: 10,
                marginRight: 10,
              }}
              name={'x'}
              solid
            />
            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: '#3F4F5F',
                  textAlign: 'center',
                  marginBottom: 30,
                }}>
                {strings.LOGIN_WITH_MOBILE_NUMBER}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: '#3F4F5F',
                  fontSize: 15,
                  marginBottom: 5,
                }}>
                {strings.ENTER_YOUR_PHONE_NUMBER}
              </Text>
              <Input
                placeholder={strings.MOBILE_NUMBER}
                inputContainerStyle={{ borderWidth: 1 }}
                containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
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
                    onPress={() => { setShow(true) }}
                    style={{
                      width: width * 0.26,
                      height: 50,
                      backgroundColor: '#B6B6B4',
                      padding: 10,
                      flexDirection: 'row',
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
                      marginTop: 1.5,
                      marginLeft: 8,


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
                inputPlaceholder="Enter your Country code"
                placeholderTextColor='black'
                // keyboardType='search'
                // style={{
                //     // modal: {
                //     //     // height: 500,
                //     //     backgroundColor: '#D0D3D4'
                //     // },



                //     textInput: {
                //           height: 60,
                //           borderRadius: 0,
                //           color:'black'
                //     },

                //     countryButtonStyles: {
                //           height: 80
                //     },
                //     dialCode: {
                //       color:'black'

                //     },

                //     countryName: {
                //       color:'black'

                //     },
                //     searchMessageText: {
                //       color:'black'

                //     },
                // }}

                style={{
                  modal: {
                    height: 500,
                    backgroundColor: '#D0D3D4',
                    color: 'black',
                    // marginTop:15
                  },

                  textInput: {
                    color: '#000000',
                    // fontFamily: FONTS.PoppinsRegular,
                    fontWeight: '400',
                  },
                  searchMessageText: {
                    color: '#000000',
                    //backgroundColor: 'red',
                    // fontFamily: FONTS.PoppinsRegular,
                    fontWeight: '400',
                  },
                  dialCode: {
                    color: '#000000',
                    // fontFamily: FONTS.PoppinsRegular,
                    fontWeight: '400',
                  },
                  countryName: {
                    color: '#000000',
                    // fontFamily: FONTS.PoppinsRegular,
                    fontWeight: '400',
                  },

                  countryMessageContainer: {
                    color: '#000000',
                    // fontFamily: FONTS.PoppinsRegular,
                    fontWeight: '400',
                  },
                  searchMessageText: {
                    color: '#000000',

                  },
                }}
                pickerButtonOnPress={(item) => {
                  setFlag(item.flag)
                  setCountryCode(item.dial_code);
                  setShow(false);
                  // console.log("mmmmmmmmmmmmm", typeof item.dial_code, item.dial_code)
                }}
                onBackdropPress={() => setShow(false)}
              />
              <ButtonDark
                handleClick={() => {
                  checkNumber()
                  // loginwithOtp();
                }}
                title={strings.SEND_OTP}
              />
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal2}
        onRequestClose={() => setShowModal2(!showModal2)}>
        <View
          onPress={() => { setShowModal2(!showModal2) }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width - 60,
              borderRadius: 5,
            }}>
            <Feather
              onPress={() => setShowModal2(!showModal2)}
              style={{
                color: '#676767',
                fontSize: 30,
                alignSelf: 'flex-end',
                marginTop: 10,
                marginRight: 10,
              }}
              name={'x'}
              solid
            />
            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: '#3F4F5F',
                  textAlign: 'center',
                  marginBottom: 30,
                }}>
                {strings.REGISTRATION}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: '#3F4F5F',
                  fontSize: 15,
                  marginBottom: 5,
                }}>
                {strings.ENTER_YOUR_PHONE_NUMBER}
              </Text>
              <Input
                placeholder={strings.MOBILE_NUMBER}
                inputContainerStyle={{ borderWidth: 1 }}
                containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
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
                      width: width * 0.26,
                      height: 50,
                      backgroundColor: '#B6B6B4',
                      padding: 10,
                      flexDirection: 'row',
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
                      marginTop: 1.5,
                      marginLeft: 8,


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
                inputPlaceholder="Enter your Country code"
                keyboardType='search'
                placeholderTextColor='#000000'
                style={{
                  modal: {
                    height: 500,
                    backgroundColor: '#D0D3D4'
                  },



                  textInput: {
                    height: 60,
                    borderRadius: 0,
                    color: 'black',
                  },

                  countryButtonStyles: {
                    height: 80
                  },
                  dialCode: {
                    color: 'black'

                  },

                  countryName: {
                    color: 'black'

                  },
                  searchMessageText: {
                    color: 'black'

                  },
                }}
                pickerButtonOnPress={(item) => {
                  // console.log("mmmmmmmmmmmmm",  item)
                  setFlag(item.flag)
                  setCountryCode(item.dial_code);
                  setShow(false);

                }}
                onBackdropPress={() => setShow(false)}
              />

              <ButtonDark
                handleClick={() => {
                  checkRegistrationNumber();
                  // mobileLogin();
                }}
                title={strings.SEND_OTP}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal3}
        onRequestClose={() => setShowModal3(!showModal3)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width - 60,
              borderRadius: 5,
            }}>
            <Feather
              onPress={() => setShowModal3(!showModal3)}
              style={{
                color: '#676767',
                fontSize: 30,
                alignSelf: 'flex-end',
                marginTop: 10,
                marginRight: 10,
              }}
              name={'x'}
              solid
            />
            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: '#3F4F5F',
                  textAlign: 'center',
                  marginBottom: 30,
                }}>
                {strings.REGISTRATION}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: '#3F4F5F',
                  fontSize: 15,
                  marginBottom: 5,
                }}>
                {strings.ENTER_YOUR_ONE_TIME_OTP}
              </Text>
              <Input
                placeholder={strings.ENTER_OTP}
                inputContainerStyle={{ borderWidth: 1 }}
                containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
                inputStyle={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Regular',
                  color: '#47474B',
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                }}
                placeholderTextColor="#47474B"
                leftIconContainerStyle={{ marginLeft: 10 }}

                errorStyle={{ display: 'none' }}
                onChangeText={e => setOtp(e)}
                keyboardType="number-pad"
              // value={phone.replace(/\s/g, '')}
              />

              <ButtonDark
                handleClick={() => {
                  createaccountotpverify();
                }}
                title={strings.VERIFY}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal8}
        onRequestClose={() => setShowModal8(!showModal8)}>
        <Pressable
          onPress={() => { setShowModal8(!showModal8) }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width - 60,
              borderRadius: 5,
            }}>
            <Feather
              onPress={() => setShowModal8(!showModal8)}
              style={{
                color: '#676767',
                fontSize: 30,
                alignSelf: 'flex-end',
                marginTop: 10,
                marginRight: 10,
              }}
              name={'x'}
              solid
            />
            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: '#3F4F5F',
                  textAlign: 'center',
                  marginBottom: 30,
                }}>
                Social Login
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: '#3F4F5F',
                  fontSize: 15,
                  marginBottom: 5,
                }}>
                {strings.ENTER_YOUR_PHONE_NUMBER}
              </Text>
              <Input
                placeholder={strings.MOBILE_NUMBER}
                inputContainerStyle={{ borderWidth: 1 }}
                containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
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
                      width: width * 0.26,
                      height: 50,
                      backgroundColor: '#B6B6B4',
                      padding: 10,
                      flexDirection: 'row',
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
                      marginTop: 1.5,
                      marginLeft: 8,


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
                inputPlaceholder="Enter your Country code"
                keyboardType='search'
                placeholderTextColor='#000000'
                style={{
                  modal: {
                    height: 500,
                    backgroundColor: '#D0D3D4'
                  },



                  textInput: {
                    height: 60,
                    borderRadius: 0,
                    color: 'black',
                  },

                  countryButtonStyles: {
                    height: 80
                  },
                  dialCode: {
                    color: 'black'

                  },

                  countryName: {
                    color: 'black'

                  },
                  searchMessageText: {
                    color: 'black'

                  },
                }}
                pickerButtonOnPress={(item) => {
                  // console.log("mmmmmmmmmmmmm",  item)
                  setFlag(item.flag)
                  setCountryCode(item.dial_code);
                  setShow(false);

                }}
                onBackdropPress={() => setShow(false)}
              />

              <ButtonDark
                handleClick={() => {
                  SocialmobileLogin();
                }}
                title={strings.SEND_OTP}
              />
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal9}
        onRequestClose={() => setShowModal9(!showModal9)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width - 60,
              borderRadius: 5,
            }}>
            <Feather
              onPress={() => setShowModal9(!showModal9)}
              style={{
                color: '#676767',
                fontSize: 30,
                alignSelf: 'flex-end',
                marginTop: 10,
                marginRight: 10,
              }}
              name={'x'}
              solid
            />
            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: '#3F4F5F',
                  textAlign: 'center',
                  marginBottom: 30,
                }}>
                Social Login
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: '#3F4F5F',
                  fontSize: 15,
                  marginBottom: 5,
                }}>
                {strings.ENTER_YOUR_ONE_TIME_OTP}
              </Text>
              <Input
                placeholder={strings.ENTER_OTP}
                inputContainerStyle={{ borderWidth: 1 }}
                containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
                inputStyle={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Regular',
                  color: '#47474B',
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                }}
                placeholderTextColor="#47474B"
                leftIconContainerStyle={{ marginLeft: 10 }}

                errorStyle={{ display: 'none' }}
                onChangeText={e => setOtp(e)}
                keyboardType="number-pad"
              // value={phone.replace(/\s/g, '')}
              />

              <ButtonDark
                handleClick={() => {
                  Socialaccountotpverify(userinfoemail, giveninfoname, familyinfoname)
                  // loginWithSocial(userinfoemail,giveninfoname,familyinfoname)

                }}
                title={strings.VERIFY}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal4}
        onRequestClose={() => setShowModal4(!showModal4)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width - 60,
              borderRadius: 5,
            }}>
            <Feather
              onPress={() => setShowModal4(!showModal4)}
              style={{
                color: '#676767',
                fontSize: 30,
                alignSelf: 'flex-end',
                marginTop: 10,
                marginRight: 10,
              }}
              name={'x'}
              solid
            />
            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: '#3F4F5F',
                  textAlign: 'center',
                  marginBottom: 30,
                }}>
                {strings.LOGIN}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: '#3F4F5F',
                  fontSize: 15,
                  marginBottom: 5,
                }}>
                {strings.ENTER_YOUR_ONE_TIME_OTP}
              </Text>
              <Input
                placeholder={strings.ENTER_OTP}
                inputContainerStyle={{ borderWidth: 1 }}
                containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
                inputStyle={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Regular',
                  color: '#47474B',
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                }}
                placeholderTextColor="#47474B"
                leftIconContainerStyle={{ marginLeft: 10 }}

                errorStyle={{ display: 'none' }}
                onChangeText={e => setOtp(e)}
                keyboardType="number-pad"
              // value={phone.replace(/\s/g, '')}
              />

              <ButtonDark
                handleClick={() => {
                  loginOTPVerify();
                }}
                title={strings.VERIFY}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal5}
        onRequestClose={() => setShowModal5(!showModal5)}>
        <Pressable
          onPress={() => { setShowModal5(false) }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              width: width - 60,
              borderRadius: 5,
            }}>
            <Feather
              onPress={() => setShowModal5(!showModal5)}
              style={{
                color: '#676767',
                fontSize: 30,
                alignSelf: 'flex-end',
                marginTop: 10,
                marginRight: 10,
              }}
              name={'x'}
              solid
            />
            <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Bold',
                  color: '#3F4F5F',
                  textAlign: 'center',
                  marginBottom: 30,
                }}>
                {strings.FORGET_YOUR_PASSWORD}
              </Text>
              <Text
                style={{
                  fontFamily: 'Roboto-Regular',
                  color: '#3F4F5F',
                  fontSize: 15,
                  marginBottom: 5,
                }}>
                {strings.ENTER_YOUR_ONE_TIME_OTP}
              </Text>
              <Input
                placeholder={strings.ENTER_OTP}
                inputContainerStyle={{ borderWidth: 1 }}
                containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
                inputStyle={{
                  fontSize: 16,
                  fontFamily: 'Roboto-Regular',
                  color: '#47474B',
                  textAlign: I18nManager.isRTL ? 'right' : 'left',
                }}
                placeholderTextColor="#47474B"
                leftIconContainerStyle={{ marginLeft: 10 }}

                errorStyle={{ display: 'none' }}
                onChangeText={e => setOtp(e)}
                keyboardType="number-pad"
              // value={phone.replace(/\s/g, '')}
              />

              <ButtonDark
                handleClick={() => {
                  getForgotPasswordOTPVerify();
                }}
                title={strings.VERIFY}
              />
            </View>
          </View>
        </Pressable>
      </Modal>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
      // contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}
      >
        <View>
          <Text
            style={{
              marginTop: 100,
              marginBottom: 40,
              textAlign: 'center',
              fontSize: 30,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
            }}>
            {strings.SIGNNOW}
            {/* Sign In Now */}
          </Text>
          <Input
            placeholder={strings.EMAIL}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0 }}
            inputStyle={{
              fontSize: 16,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            leftIconContainerStyle={{ marginLeft: 10 }}
            leftIcon={
              <Image
                source={require('../../Assets/gmail.png')}
                style={{ width: 25, height: 25 }}
              />
            }
            onChangeText={e => setEmail(e)}
            value={email}
          />
          <Input
            placeholder={strings.PASSWORD}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0 }}
            inputStyle={{
              fontSize: 16,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            leftIconContainerStyle={{ marginLeft: 10 }}
            leftIcon={
              <Image
                source={require('../../Assets/password.png')}
                style={{ width: 25, height: 25 }}
              />
            }
            rightIconContainerStyle={{ marginLeft: 5, marginRight: 10 }}
            rightIcon={
              <TouchableOpacity onPress={() => setSecurity(!security)}>
                <Image
                  source={require('../../Assets/eye.png')}
                  style={{ width: 25, height: 25 }}
                />
              </TouchableOpacity>
            }
            secureTextEntry={security}
            onChangeText={e => setPassword(e)}
            value={password}
          />
          <ButtonDark handleClick={() => submit()} title={strings.LOGIN} />


          <TouchableOpacity
            onPress={() => setShowModal1(!showModal1)}
            style={{ alignSelf: 'center' }}>
            <Text
              style={{
                marginVertical: 20,
                fontSize: 16,
                fontFamily: 'Roboto-Regular',
                color: '#4B4B52',
              }}>
              {strings.LOGIN_WITH_MOBILE_NUMBER}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowModal(!showModal)}
            style={{ alignSelf: 'center' }}>
            <Text
              style={{
                // marginVertical: 5,
                fontSize: 16,
                fontFamily: 'Roboto-Regular',
                color: '#4B4B52',
              }}>
              {strings.FORGET_YOUR_PASSWORD}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              borderBottomWidth: 1,
              borderBottomColor: '#CDCDCF',
              position: 'relative',
              marginBottom: 40,
              marginTop: 40,
            }}>
            <Text
              style={{
                fontSize: 16,
                fontFamily: 'Roboto-Regular',
                color: '#4B4B52',
                position: 'absolute',
                top: -12,
                alignSelf: 'center',
                paddingHorizontal: 10,
                backgroundColor: '#fff',
              }}>
              {strings.OR}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginVertical: 20,
            }}>
            <TouchableOpacity
              onPress={() => {
                loginGmail();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#B6B7B9',
                paddingVertical: 10,
                paddingHorizontal: 25,
                marginRight: 20,
                //width:width*0.3,
              }}>
              <Image
                source={require('../../Assets/google.png')}
                style={{ width: 25, height: 25 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Roboto-Regular',
                  color: '#343537',
                  marginLeft: 10,
                }}>
                {strings.GOOGLE}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                onFacebookButtonPress()
                  .then(async (res) => {
                    console.warn(`res fblogin`, res?.additionalUserInfo?.profile);
                    // SocialLogin(userInfo.user)

                    //setFbData(res?.additionalUserInfo?.profile);
                    await SocialLogin(res?.additionalUserInfo?.profile);
                  })
                  .catch((error) => console.warn(`error in fbSignin`, error))
              }
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 2,
                borderWidth: 1,
                borderColor: '#B6B7B9',
                paddingVertical: 10,
                paddingHorizontal: 25,
                //width:width*0.35,
                //backgroundColor:'red'
              }}>
              <Image
                source={require('../../Assets/fb.png')}
                style={{ width: 25, height: 25 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'Roboto-Regular',
                  color: '#343537',
                  marginLeft: 10,
                }}>
                {strings.FACEBOOK}
              </Text>
            </TouchableOpacity>
            

            
            
           
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 40,
            marginBottom: 60,
          }}>
          <Text
            style={{
              color: '#676767',
              fontSize: 18,
              fontFamily: 'Roboto-Regular',
            }}>
            {strings.DONT_HAVE_ACCOUNT_SIGNIN}{' '}
          </Text>
          <TouchableOpacity
            // onPress={() => navigation.navigate('signup')}

            onPress={() => setShowModal2(!showModal2)}
            style={{ alignSelf: 'center' }}>

            <Text
              style={{
                fontSize: 18,
                color: '#515256',
                fontFamily: 'Roboto-Bold',
              }}>
              {strings.SIGNUP}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {loder && <Loder />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
});
