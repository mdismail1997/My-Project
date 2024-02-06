import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar, SafeAreaView ,TextInput, Alert} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../../utils/constants/common'
import ProgressBar from "react-native-animated-progress";
import { Screen,InputComponent } from '../../../components'
import ScrollView from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as webService from '../../../Services/webService'
import {Images} from '../../../assets/image/index'
import Loader from '../../../global/Loader'

function ForgetScreen({ route, navigation }) {

const [email, setEmail] = useState('');
const [emailerror, setEmailError] = useState('');
const[loder,setLoder]=useState(false)
// const [id, setId] = useState('')


const emailPasswordSend = () => {
  console.log("======ForgetPassword=====",email)
  setLoder(true)
  const data = {
    email:email,
  }
  console.log('register data: ', data);
  axios({
    method: 'POST',
    url: webService.Forgot_password,
    data: data,
  })
  .then(res => {
    console.log('regn response: ++++++++++++++++++++++++', res.data);
    setLoder(false);
    //AsyncStorage.setItem('token', JSON.stringify(res.data));
    Alert.alert('Please Check Your Mail');
    navigation.navigate('OtpScreen')
    // Alert.alert('', 'Login Successfully.', [
    //   { text: 'OK' },
    // ]);
    //navigation.replace('DrawerNavigation')


  })
  .catch(err => {
    setLoder(false)
    console.log('err========Forget Password Error=============', err);
    Alert.alert("Please enter correct email");
  });



  // setisLoading(true)
  // if(email == ''){
  //   setisLoading(false)
  //   return Alert.alert('Please enter email to reset password')
  // }
  // const data = {
  //   email: userData.email,
  // };
  // axios({
  //   method: 'POST',
  //   url: webService.apiUrl + 'forgotPassword',
  //   data: data,
  // })
  // .then(response => {
  //   console.log('mainresponse ------------------ ', response);
  //   setisLoading(false);
  //   if(response.data.success === false){
  //     console.log('response.data: ------------------ ', response.data);
  //     Alert.alert(response.data.message);
  //   }else if (response.data.success === true) {
  //     console.log('response.data: ------------------ ', response.data);
  //     let useremail= JSON.parse( response.config.data)
  //     let resEmail = useremail.email
  //     console.log('response email: ',resEmail)
      
  //     Alert.alert( 
        
  //       'cancel',
        
  //       'Please check your email for OTP verification code.',
  //       [
  //         {text: 'Yes', onPress: () =>navigation.navigate('OtpScreen', {data: response})},
  //         {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
  //       ],
  //       {cancelable: false},
       
  //     );
  //   }

  // })
  // .catch(err => {
  //   console.log('response.err ------------------ ', err);
  //   setisLoading(false)
  // })
}


const validation = () => {
  const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (email  === '') {
    setEmailError('Please Enter Register Email');
    Alert.alert("Please Enter Register Email");
    console.log('Email ',emailerror);
  }else if (!email.match(reg)) {
    setEmailError('Please Enter Valid Email' );
    Alert.alert("Please Enter Valid Email");
    console.log('EmailError', emailerror);
  }
  else {
    emailPasswordSend();
  }
};

  return (
    <Screen>
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image source={Images.Logo}
            style={styles.logoImg}
          />
        </View>
        <Text style={styles.topText}>Forgot Password?</Text>
        <Text style={styles.subText}>Enter your email address to reset password</Text>
       
        <View style={styles.formContainer}>
           
        <InputComponent
         placeholder="Email Address"
         value={email}
         onChangeText={text => setEmail(text)}
         image={Images.ArrowRight}
        
        />

           <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} onPress={()=>validation()}>
                 <Text style={styles.btnText}>Send</Text>               
              </TouchableOpacity>
           </View>           
        </View>
      </View>
      {loder && <Loader />}
    </Screen>

  );
}


export default ForgetScreen
