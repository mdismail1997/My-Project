import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { Text, TextInput, Button, Snackbar } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import { supabase } from '../../supabase/supabaseClient';
import { removeEmojis } from '../../components/emojiRegex';

export const ResetpassScreen = (props) => {
  const setData = () => {
    props.navigation.navigate('Signup');
  };
  const [password, setPassword] = useState('');
  const [conpassword, setConPassword] = useState('');
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [loginSuccess, setLoginSuccess] = React.useState({
    visible: false,
    message: '',
  });
  const resetpassword = async (values) => {
    if (password === '') {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'The Password field is required',
      }));
      setLoginSuccess({
        visible: false,
        message: '',
      })
    } else if (conpassword === '') {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'The Confirm Password field is required',
      }));
      setLoginSuccess({
        visible: false,
        message: '',
      })
    } else if (password !== conpassword) {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'Password Not Matched',
      }));
      setLoginSuccess({
        visible: false,
        message: '',
      })
    } else {
      try {
        const userid = await AsyncStorage.getItem('userid');
        const user_id = JSON.parse(userid);
        console.log('user id =====>>>>', user_id);
        //const email = 'suvayan.karmakar@brainiuminfotech.com';
        const OtpData = {
          user_id: user_id,
          password: password,
          confirm_password: conpassword,
        };
        if (password === conpassword) {
          // const {
          //   error: supabseError,
          //   user,
          //   session,
          // } = await supabase.auth.api.resetPasswordForEmail(
          //   { password: password }
          //   //email
          // );
          // if (supabseError) {
          //   console.error('supabaseErr', supabseError);
          //   setError((data) => ({
          //     ...data,
          //     iserror: true,
          //     message: 'Supabase failed to change password',
          //   }));
          //   return;
          // }
          console.log('OtpData', OtpData);
          const response = await Apis.resetPassword(OtpData);
          console.log(response.data);
          if (response.data.success === 0) {
            setError((data) => ({
              ...data,
              iserror: true,
              message: response.data.message,
            }));
            setLoginSuccess({
              visible: false,
              message: '',
            })
          }
          else {
            setLoginSuccess({
              visible: true,
              message: 'Password Reset Successfully',
            });
            setError({ iserror: false, message: '' })
            setTimeout(() => {
              props.navigation.replace('LogIn');
            }, 2500);
          }
        }
      } catch (err) {
        console.error(err.response.data);
        if (err.response.data.success === 0) {
          setError((data) => ({
            ...data,
            iserror: true,
            message:
              'Password should have at least one special character, one lower case character, one upper case character, one number & minimum 8 characters',
          }));
          setLoginSuccess({
            visible: false,
            message: '',
          })
        }
      }
    }
  };
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' })),
      setLoginSuccess({ visible: false, message: '' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Reset Password" navProps={props.navigation} />
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656', zIndex: 100 }}
      >
        {error.message}
      </Snackbar>
      <Snackbar
        visible={loginSuccess.visible}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#30D13B', zIndex: 100 }}
        duration={50000}
      >
        {loginSuccess.message}
      </Snackbar>
      <Text style={styles.headtext}>Reset Password</Text>
      <Text style={styles.text}>Create your new password</Text>
      <ScrollView>
        <View style={{ marginHorizontal: 30, marginTop: 30 }}>
          <TextInput
            mode="outlined"
            label="Password"
            placeholder=""
            maxLength={25}
            value={password.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
            outlineColor={'#2173A8'}
            onChangeText={(text) => setPassword(text)}
            style={{ backgroundColor: '#fff' }}
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
        </View>
        <View style={{ marginHorizontal: 30, marginTop: 20 }}>
          <TextInput
            mode="outlined"
            label="Confirm Password"
            placeholder=""
            maxLength={25}
            outlineColor={'#2173A8'}
            value={conpassword.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
            onChangeText={(text) => setConPassword(text)}
            style={{ backgroundColor: '#fff' }}
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
        </View>
        <View style={{ marginHorizontal: 30, marginTop: 30 }}>
          <Button
            style={{ fontSize: 32 }}
            mode="contained"
            color="#2173A8"
            uppercase={false}
            contentStyle={{ height: 54 }}
            onPress={resetpassword}
          >
            Continue
          </Button>
        </View>
        <Image
          source={require('../../Assets/resetpassword.png')}
          style={styles.img}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headtext: {
    color: '#333333',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
    marginLeft: 30,
  },
  text: {
    color: '#737373',
    fontSize: 15,
    marginTop: 20,
    marginLeft: 30,
  },
  img: {
    height: 150,
    width: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 40,
  },
});
