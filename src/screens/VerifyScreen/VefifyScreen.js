import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Modal,
  Portal,
  Snackbar,
  IconButton,
} from 'react-native-paper';
import { ZodIssueCode } from 'zod';
import { Header } from '../../components/Header/Header';
import { forgetPasswordUser } from '../../models/userAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Apis from '../Services/apis';
import { supabase } from '../../supabase/supabaseClient';
import { RFValue } from 'react-native-responsive-fontsize';
import { removeEmojis } from '../../components/emojiRegex';

export const VerifyScreen = (props) => {
  const [visible, setVisible] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [loading, setLoding] = useState(false);
  //const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false), props.navigation.replace('OtpReset');
  };

  const setData = () => {
    props.navigation.navigate('ResetPass'), setVisible(false);
  };

  const setPass = () => {
    props.navigation.navigate('VerifyScreen');
  };
  const [error, setError] = React.useState({ iserror: false, message: '' });
  // const forgotPassword = async () => {
  //   let usertoken = await AsyncStorage.getItem('authtoken');

  //   let token = usertoken;
  //   // let Email = await AsyncStorage.getItem('email');

  //   // let email = JSON.parse(Email);
  //   console.log('token123=', token);

  //   const data = {
  //     email: email,
  //   };
  //   console.log('===', data);
  //   setLoding(true);
  //   await Apis.forgetPassword(data, token)

  //     .then(async (response) => {
  //       console.warn('responsedata=================>', response.data);

  //       props.navigation.navigate('OtpReset');
  //       setLoding(false);
  //       if (response.data.success === 1) {
  //       } else {
  //         setError((data) => ({
  //           ...data,
  //           iserror: true,
  //           message: response.data.message.errors,
  //         }));
  //       }
  //     })

  //     .catch((err) => {
  //       console.error(err.response.data);
  //       setError((dat) => ({
  //         ...dat,
  //         iserror: true,
  //         message: err.response.data.error,
  //       }));
  //     });
  // };

  const forgotPassword = async (values) => {
    if (email === '') {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'The Email field is required.',
      }));
    } else {
      try {
        // const userid = await AsyncStorage.getItem('userid');
        // const user_id = JSON.parse(userid);
        // console.log('user id =====>>>>', user_id);
        const OtpData = {
          email: email,
        };
        setLoding(true);
        // const { error: supabseError, data } =
        //   await supabase.auth.api.resetPasswordForEmail(email);
        // console.log(email);
        // console.log('data===', data);
        // if (supabseError) {
        //   setLoding(false);
        //   console.error('supabaseErr', supabseError);
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: supabseError.message,
        //   }));
        //   return;
        // }
        console.log('OtpData', OtpData);
        const response = await Apis.forgetPassword(OtpData);
        setLoding(false);
        console.log(response.data);
        setVisible(true);
      } catch (err) {
        setLoding(false);
        console.error(err.response.data);
        if (err.response.data.error === 'Email is not registered') {
          setError((data) => ({
            ...data,
            iserror: true,
            message: err.response.data.error,
          }));
        }
      }
    }
  };

  const onDismissSnackBar = () => {
    setError((dat) => ({ ...dat, iserror: false, message: '' }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Verification" navProps={props.navigation} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656', zIndex: 100 }}
        duration={5000}
      >
        {error.message}
      </Snackbar>
      <ScrollView>

        <Text style={styles.headtext}>Verify Email</Text>
        <Text
          style={{
            color: '#737373',
            fontSize: RFValue(15),
            marginTop: 30,
            marginLeft: 30,
          }}
        >
          Enter your registered email address
        </Text>
        <View style={{ marginHorizontal: 30, marginTop: 30 }}>
          <TextInput
            mode="outlined"
            label="Email Id"
            placeholder=""
            value={email.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
            onChangeText={(text) => setEmail(text)}
            outlineColor={'#2173A8'}
            activeOutlineColor={'#2173A8'}
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
        <View style={{ marginHorizontal: 30, marginTop: 40 }}>
          <Button
            style={{ fontSize: RFValue(32) }}
            mode="contained"
            color="#2173A8"
            contentStyle={{ height: 54 }}
            uppercase={false}
            onPress={() => forgotPassword()}
          >
            Submit
          </Button>
        </View>
        <Image
          style={{
            width: 150,
            height: 150,
            alignSelf: 'center',
            marginTop: 90,
          }}
          source={require('../../Assets/verification.png')}
        />

        <View style={{ width: '100%', height: '100%' }}>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={() => setVisible(false)}
              transparent={true}
            >
              <View style={styles.view}>
                <View>
                  <IconButton
                    icon="close"
                    size={26}
                    color="red"
                    style={{
                      alignSelf: 'flex-end',
                      marginTop: '-30%',
                    }}
                    onPress={hideModal}
                  />
                </View>
                <Image
                  style={{
                    width: 150,
                    height: 100,
                    alignSelf: 'center',
                    // marginTop: '-30%',
                  }}
                  source={require('../../Assets/modal.png')}
                />
                <Text style={styles.modaltext}>Please Check Your Email</Text>
              </View>
            </Modal>
          </Portal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headtext: {
    color: '#333333',
    fontSize: RFValue(30),
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 30,
  },
  view: {
    backgroundColor: '#fff',
    height: 320,
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    marginTop: -50,
  },
  styles: {
    width: 150,
    height: 100,
    alignSelf: 'center',
    marginTop: '-30%',
  },
  modaltext: {
    marginTop: 25,
    color: '#333333',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: RFValue(15),
  },
});
