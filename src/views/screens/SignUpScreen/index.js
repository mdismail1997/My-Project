import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Keyboard,
  ScrollView,
  Modal,
  I18nManager,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';

import COLORS from '../../../conts/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import {
  businessURLRegExp,
  calcH,
  calcW,
  fSize,
  passwordRegExp,
  phoneRegExp,
  STORAGE_KEY,
  STYLES,
} from '../../../utils/constants/common';

import CheckBox from '@react-native-community/checkbox';
import Toast from 'react-native-toast-message';
import RenderHtml from 'react-native-render-html';

import {AuthContext} from '../../components/context';

import {
  createformdata,
  createGet,
  createpost,
} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';

import strings from '../../components/lng/LocalizedStrings';
import {setLng, getLng} from '../../components/lng/changeLng';
import {FONTS} from '../../../conts/theme.js';
import styles from './style.js';
import {Pressable} from 'react-native';
import mmkv from '../../../utils/constants/mmkv/index.js';

const RegistrationScreen = ({navigation, route}) => {
  const [inputs, setInputs] = React.useState({
    email: '',
    fullname: '',
    phone: '',
    password: '',
    confirm_password: '',
    business: '',
    business_valid: false,
    mobile: '',
    from_route: false,
  });

  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const routeInfo = route?.params?.info;

  const {signIn} = React.useContext(AuthContext);

  //console.log("routeInfo", routeInfo);

  React.useEffect(() => {
    if (routeInfo != undefined) {
      handleOnchange(routeInfo.name, 'fullname');
      handleOnchange(routeInfo.email, 'email');
      handleOnchange(true, 'from_route');
    }
  }, []);
  //console.log("inputs", inputs);
  React.useEffect(() => {
    selectedLng();
  }, []);

  const getTnC = async () => {
    setLoading(true);
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: commonUrl.TERMS_AND_CONDITIONS,
      });
      if (result.status === 200) {
        setTermsAndConditions(result?.data.content);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTnC = () => {
    setModalVisible(true);
    getTnC();
  };

  const selectedLng = async () => {
    const lngData = await getLng();
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      await I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      await I18nManager.forceRTL(true);
    }
    console.log('selected Language data==>>>', lngData);
    setLoading(false);
  };

  const validate = async () => {
    await checkNameAvailable();
    Keyboard.dismiss();
    let isValid = true;

    if (!inputs.fullname) {
      handleError('Please enter name', 'fullname');
      isValid = false;
    } else if (fullName.length < 2) {
      handleError('Please enter your full name', 'fullname');
      isValid = false;
    }
    if (!inputs.business) {
      handleError('Please enter business name', 'business');
      isValid = false;
    }
    // else if (!inputs.business.toLocaleLowerCase().match(businessURLRegExp)) {
    //   handleError('Please enter a valid URL. ex. www.business.com', 'business');
    //   isValid = false;
    // }
    else if (inputs.business.length < 3) {
      handleError('Business name should be at least 3 characters', 'business');
      isValid = false;
    } else if (inputs.business_valid == false) {
      handleError(
        'Shop name is already exist, please add a seperate name',
        'business',
      );
      isValid = false;
    } else if (inputs.business_valid == true) {
      handleError(null, 'business');
      //isValid = true;
    }
    if (!inputs.email) {
      handleError('Please enter email', 'email');
      isValid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError('Please input a valid email', 'email');
      isValid = false;
    }
    if (!inputs.mobile.match(phoneRegExp)) {
      handleError('Please enter correct UAE mobile number', 'mobile');
      isValid = false;
    }
    if (!inputs.from_route) {
      if (!inputs.password) {
        handleError('Please enter your password:', 'password');
        isValid = false;
      } else if (!inputs.password.match(passwordRegExp)) {
        handleError(
          'Minimum eight characters, at least one letter, one number and one special character:',
          'password',
        );
        isValid = false;
      }

      if (inputs.password != inputs.confirm_password) {
        handleError(
          'Password and Conform Password not match',
          'confirm_password',
        );
        isValid = false;
      }
    }

    if (isValid && !isSelected) {
      Toast.show({
        text1: `Please accept ${strings.TERMS_AND_CONDITIONS}`,
        type: 'error',
      });
    }
    if (isValid && isSelected && inputs.business_valid) {
      console.log('Normal signup');
      register();
    }
    // if (isValid && isSelected && inputs.business_valid && inputs.from_route) {
    // 	console.log("From route signup");
    // 	register();
    // }
  };

  const fullName = inputs.fullname.trim().split(' ');

  const SocialLogin = async routeInfo => {
    setLoading(true);
    const password = '#Admin123.1';
    const data = {
      customerDetails: {
        email: routeInfo.email,
        firstname: routeInfo.givenName,
        lastname: routeInfo.familyName,
        password: password,
      },
    };
    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: commonUrl.SocialLogin, //registration
        body: data,
      });
      //console.log(`result`, result.data);
      if (result.status === 200) {
        setLoading(false);
        let x = result.data.split(' ');
        let id = x.filter(function (entry) {
          return entry.trim() != '';
        });
        console.log('id/fullname3', id[3]);
        if (result.data.includes('exists') == false) {
          //await loginwithPut(data.customerDetails, id[3]);
          //register();
        } else {
          await doLogin(userInfo.user.email, password);
        }
      } else {
        setLoading(false);
        setToastMsg('Oops Somthing Wrong!');
      }
    } catch (error) {
      setLoading(false);
      console.log('SocialLogin/registration error', error);
      Toast.show({
        text1: `${error.response.data.message}`,
        type: 'error',
      });
    }
  };

  const doLogin = async (email, password) => {
    setLoading(true);
    if (email && password) {
      console.log('email', email);
      console.log('password', password);
      try {
        let result = await createformdata({
          tokenType: 'admin',
          url: `${
            commonUrl.generateToken
          }?username=${email.trim()}&password=${password}`,
          body: {},
        });
        console.log('dologin data', result.data);
        if (result.status === 200) {
          console.log('token ==> ', result.data);
          mmkv.store(STORAGE_KEY.CUSTOMER_TOKEN, result.data);
          await getUserDetails();
          Toast.show({
            text1: `Login Successful.`,
            type: 'success',
            position: 'bottom',
          });
        }
      } catch (error) {
        console.log('error', error);
        setLoading(false);
        Toast.show({
          text1: `Invalid Email id/Password.`,
          text2: `or your account is disabled temporarily.`,
          type: 'error',
        });
      }
    }
  };

  const getUserDetails = async () => {
    try {
      let result = await createGet({
        tokenType: 'self',
        url: commonUrl.customerDetails,
      });
      if (result.status === 200) {
        mmkv.store(STORAGE_KEY.CUSTOMER_DETAILS, {
          ...result.data,
          loggedIn: true,
        });

        signIn({...result.data, loggedIn: true});
        //navigation.navigate('HomeScreen');
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
      console.log(error.response.data.message);
    } finally {
      //setLoading(false);
    }
  };

  const register = async () => {
    const password = 'Admin123@123';
    setLoading(true);

    const data = {
      customer: {
        email: inputs.email.trim(),
        firstname: fullName[0].trim(),
        lastname: fullName[fullName.length - 1].trim(),
        group_id: '4',
        //created_in: inputs.business,
        custom_attributes: [
          {
            attribute_code: 'phone_number',
            value: inputs.mobile.trim(),
          },
          {
            attribute_code: 'shopurl',
            value: inputs.business.trim(),
          },
        ],
      },
      password: inputs.from_route ? password : inputs.password,
    };
    console.log('register data', data);
    try {
      let result = await createpost({
        tokenType: 'admin',
        url: commonUrl.registartion,
        body: data,
      });
      console.log(`result registartion`, result);
      if (result.status == 200) {
        const data1 = {
          data: {
            seller_id: result.data?.id,
            seller_url: result.data?.custom_attributes[1]?.value,
          },
        };
        //console.log("data", data1);
        let result1 = await createpost({
          tokenType: 'adminAdd',
          url: commonUrl.vendorCustomerAssign,
          body: data1,
        });
        if (result1.status === 200 && !inputs.from_route) {
          setLoading(false);
          navigation.navigate('LoginScreen');
          Toast.show({
            text1: `Account created successfully.`,
            text2: `Please login now`,
            type: 'success',
          });
        }
        if (result1.status === 200 && inputs.from_route) {
          console.log('result1.status === 200 && inputs.from_route');
          setLoading(false);
          await doLogin(data.customer.email, data.password);
          // Toast.show({
          // 	text1: `Account created successfully.`,

          // 	type: "success",
          // });
        }
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'info',
      });
      console.log(`register error`, error);
    }
  };

  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };
  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  const checkNameAvailable = async () => {
    const data = {
      data: {
        seller_url: inputs.business,
      },
    };
    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: commonUrl.sellerVerify,
        body: data,
      });
      if (
        result.data == 'Shop name is already exist, please add a seperate url'
      ) {
        handleOnchange(false, 'business_valid');
        handleError(
          'Shop name is already exist, please add a seperate name',
          'business',
        );
      } else {
        handleOnchange(true, 'business_valid');
        handleError(null, 'business');
      }
      //console.log("result.data", result.data);
    } catch (error) {
      console.log('error in checkNameAvailable', error);
    }
  };

  //console.log("inputsbusiness_valid", inputs.business_valid);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (inputs.business.length > 2) checkNameAvailable();
    }, 2000);
    return () => clearInterval(timer);
  }, [inputs.business]);

  React.useEffect(() => {
    if (isSelected) handleTnC();
  }, [isSelected]);

  const {width} = Dimensions.get('window');

  const renderModal = () => {
    return (
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.outsideModal}
          onPress={event => {
            if (event.target == event.currentTarget) {
              setModalVisible(false);
            }
          }}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderContent}>
                <Text style={styles.headerText}>
                  {strings.TERMS_AND_CONDITIONS}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalHeaderCloseText}>❌</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <ScrollView>
                <RenderHtml
                  contentWidth={width}
                  source={{html: termsAndConditions}}
                  tagsStyles={{
                    body: {
                      whiteSpace: 'normal',
                      color: 'black',
                    },
                  }}
                />
              </ScrollView>
            </View>
          </View>
        </Pressable>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      <Loader visible={loading} />
      <ScrollView
        keyboardShouldPersistTaps={'handled'}
        contentContainerStyle={{
          paddingTop: calcW(0.15),
          paddingHorizontal: calcH(0.025),
        }}>
        <Text
          style={{
            color: COLORS.black,
            fontSize: calcW(0.07),
            textAlign: 'center',
          }}>
          {strings.SIGNUP}
        </Text>

        <View style={{marginVertical: calcW(0.025), paddingTop: calcH(0.025)}}>
          <Input
            onChangeText={text => handleOnchange(text, 'fullname')}
            onFocus={() => handleError(null, 'fullname')}
            iconName="account-outline"
            placeholder={strings.ENTER_NAME}
            error={errors.fullname}
            value={inputs.fullname}
            maxLength={25}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'business')}
            onFocus={() => handleError(null, 'business')}
            iconName="diving-scuba-tank"
            placeholder={strings.BUSINESS_NAME}
            error={errors.business}
            maxLength={20}
          />

          <Input
            onChangeText={text => handleOnchange(text, 'email')}
            onFocus={() => handleError(null, 'email')}
            iconName="email-outline"
            placeholder={strings.ENTER_EMAIL_ID}
            error={errors.email}
            value={inputs.email}
            maxLength={80}
          />

          <Input
            keyboardType="numeric"
            onChangeText={text => handleOnchange(text, 'mobile')}
            onFocus={() => handleError(null, 'mobile')}
            iconName="phone-outline"
            placeholder={strings.MOBILE_NUMBER}
            error={errors.mobile}
            maxLength={15}
          />
          {inputs.from_route ? null : (
            <>
              <Input
                onChangeText={text => handleOnchange(text, 'password')}
                onFocus={() => handleError(null, 'password')}
                iconName="lock-outline"
                placeholder={strings.PASSWORD}
                error={errors.password}
                password
                maxLength={25}
              />
              <Input
                onChangeText={text => handleOnchange(text, 'confirm_password')}
                onFocus={() => handleError(null, 'confirm_password')}
                iconName="lock-outline"
                placeholder={strings.CONFIRM_PASSWORD}
                error={errors.confirm_password}
                maxLength={25}
                password
              />
            </>
          )}
          <View
            style={{
              flexDirection: 'row',
              marginTop: calcH(0.008),
              paddingLeft: calcH(0.07),
              alignItems: 'center',
              // borderWidth: 1,
            }}>
            <CheckBox
              value={isSelected}
              onValueChange={val => setIsSelected(val)}
              tintColors={true ? '#000' : '#555a'}
              style={{
                alignSelf: 'center',
              }}
            />
            <TouchableOpacity onPress={handleTnC}>
              <Text
                style={{
                  margin: 6,
                  fontSize: 16,
                  fontWeight: '500',
                  ...FONTS.OpenSans_Reg,
                  color: COLORS.black,
                }}>
                {strings.TERMS_AND_CONDITIONS}
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            title={strings.SIGNUP}
            bgColor={COLORS.BlackTie}
            onPress={validate}
          />
          <Text
            onPress={() => navigation.replace('LoginScreen')}
            style={{
              color: COLORS.black,
              textAlign: 'center',
              fontSize: 16,
              marginTop: calcH(0.05),
            }}>
            {strings.ALREADY_HAVE_ACCOUNT_LOGIN}
          </Text>
        </View>
        {renderModal()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
