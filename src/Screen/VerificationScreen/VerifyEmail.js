import {Formik} from 'formik';
import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import {User} from '../../models/userAuth';
import {Text, TextInput, Button, HelperText} from 'react-native-paper';
import {ZodIssueCode} from 'zod';
import {Header} from '../../components/Header/Header';
import axios from 'axios';

const validateHandler = values => {
  let formikErrors = {};
  try {
    User.parse(values);
  } catch (e) {
    const {errors} = e;
    errors.forEach(subError => {
      const path = subError.path.join('.');
      let {message} = subError;
      if (
        path === 'Email Id' &&
        subError.code === ZodIssueCode.invalid_string
      ) {
        message = 'Invalid Email Id';
      }

      formikErrors = {...formikErrors, [path]: message};
    });
  }
  // console.log('formikErrors', formikErrors);
  return formikErrors;
};
const VerifyEmailApi = async () => {
  // setLoad(true)
  // setIsloder(true)
  try {
    const res = await axios({
      method: 'POST',
      url: 'https://nodeserver.mydevfactory.com:6098/api/users/forgot-pass',
      data: {
        email: email,
      },
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    console.log('resRegister++++++++', res);
    console.log('id----------', res.data.data._id);
    if (res.data.success == true) {
      try {
        await AsyncStorage.setItem('tokenId', res.data.data._id);
      } catch (error) {
        // Error saving data
      }
      navigation.navigate('VerifyOtp');
    }
    return res;
  } catch (error) {
    console.log('error', error);
    // handleNaviagte("error")
  }
};
export const VerifyEmail = props => {
  const [Email, setEmail] = useState('');
  const setData = () => {
    props.navigation.navigate('');
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: 22}}>
        <Header title="VerifyEmail" navProps={props.navigation} />
        <View style={{marginTop: 101}}>
          <Text style={styles.verifytextCSS}>Verify email</Text>
          <Text style={styles.emailtextCSS}>
            Enter your register Email address
          </Text>
        </View>
        <Formik
          initialValues={{Email: ''}}
          onSubmit={setData}
          validate={validateHandler}>
          {({
            handleChange,
            handleBlur,
            values,
            touched,
            errors,
            isSubmitting,
          }) => (
            <>
              <View style={{marginTop: 50}}>
                <TextInput
                  style={{height: 60}}
                  // error={touched.email === true && errors.email !== undefined}
                  mode="outlined"
                  label="Email Id"
                  placeholder=""
                  onChangeText={value => setEmail(value)}
                  value={Email}
                  onBlur={handleBlur('Email Id')}
                />
                {/* <Image source={require('../../Assets/lock.png')} style={{width:20,height:20}} /> */}
                {/* <HelperText
                  type="error"
                  visible={touched.Old Password === true && errors.Old Password !== undefined}
                >
                  {errors.Old Password}
          </HelperText> */}
              </View>
              <View style={{marginTop: 20}}>
                <Button
                  style={{fontSize: 32}}
                  mode="contained"
                  color="#8FCD2D"
                  uppercase={false}
                  contentStyle={{height: 54}}
                  labelStyle={{color: '#fff', fontSize: 16}}
                  // onPress={() => props.navigation.navigate("VerifyOtp")}
                  onPress={() => {
                    VerifyEmailApi();
                  }}
                  // onPress={setData}
                >
                  Submit
                </Button>
              </View>
            </>
          )}
        </Formik>
        <View style={{alignItems: 'center', marginTop: 81}}>
          <Image
            source={require('../../Assets/removebg.png')}
            style={styles.imagefingerCSS}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  head: {
    color: '#333333',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 30,
  },
  imagefingerCSS: {
    width: 176,
    height: 176,
    resizeMode: 'contain',
  },
  verifytextCSS: {
    color: '#000',
    fontSize: 35,
    fontWeight: '700',
    fontFamily: 'Lato',
  },
  emailtextCSS: {
    color: '#737373',
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'Lato',
    marginTop: 12,
  },
});
