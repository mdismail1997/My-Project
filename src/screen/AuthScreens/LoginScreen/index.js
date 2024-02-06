import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, StatusBar, SafeAreaView ,TextInput, Alert,Dimensions} from 'react-native';
import styles from './style'
import {getAndroidDevice} from '../../../utils/constants/common'
import { Screen,InputComponent } from '../../../components'
//import Toast from 'react-native-smart-toast-alert'
import axios from 'axios'
import DeviceInfo from 'react-native-device-info';
import * as webService from '../../../Services/webService'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Images} from '../../../assets/image/index'
import Loader from '../../../global/Loader'
import { TouchableOpacity } from 'react-native-gesture-handler';
import commonToast from '../../../global/commonToast';
import {IconButton, Toast} from 'native-base';
const width = Dimensions.get('window').width - 20;

function LoginScreen({ route, navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [device, setDevice] = useState('')
  const [loder, setLoder] = useState(false);
  const [emailerror, setEmailError] = useState('');
  const [passworderror, setPasswordError] = useState('');

  const [security, setSecurity] = useState(true);
  useEffect(() => {
    getAndroidDevice();
    
  });
 
  const getAndroidDevice = () =>{
    DeviceInfo.getAndroidId().then((androidId) => {
     setDevice(androidId);
    });

  }

  

  const loginPress= async()=> {  
    console.log("======Login=====",device)
    setLoder(true)
  
    const data = {

      // email:"testing12399@yopmal.com",
      // password:"P@ss1234",
      // deviceToken:"12345678"
    
      email:email,
      password:password,
      deviceToken:device,
    }
    console.log('register data: ', data);
    axios({
      method: 'POST',
      url: webService.login,
      data: data,
    })
    .then(res => {
      console.log('regn response: ++++++++++++++++++++++++', res.data);
      setLoder(false);
      AsyncStorage.setItem('token', JSON.stringify(res.data.token));
    
      Alert.alert('', 'Login Successfully.', [
        { text: 'OK' },
      ]);
      navigation.replace('DrawerNavigation')
 
      // webService.storeData('userData', JSON.stringify(response.data.token));
     
      // navigation.navigate('DrawerNavigation')
      // if(response.data.success === true){
      //   let user_id = response.data.data.data._id;
      //   console.log("user_id: ", response.data.data.token);
      //   navigation.navigate('DrawerNavigation', {id: user_id })
      //   console.log("rseponse success:::::::: ", response.data);
       
      //   AsyncStorage.setItem('user_token', response.data.data.token)
        
      // }
      // else if(response.data.success === false){
      //   Alert.alert(response.data.error.message);
      // }
    })
    .catch(err => {
      setLoder(false)
      console.log('err=====================', err);
      Alert.alert('Invalid Credintial', 'Please check your credintial', [
        { text: 'OK' },
      ]);
      commonToast({
        text: err.data.error,
        position: 'top',
        toastFor: 'error',
      });
      Alert.alert("Error");
    });
  }

 


  const validation = () => {
    // loginPress()
    const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (email ==='') {
     setEmailError('Please Enter Your Email');
    //  Toast.show({
    //       title: 'Please Enter Your Email id',
    //       placement: 'top',
    //       textStyle: {color: 'black', fontWeight: '500', textAlign: 'center',backgroundColor:'red'},
    //       style: {
    //         backgroundColor: '#D99100',
    //         width: '70%',
    //         height: '50%',
    //       },
    //     });
    //      return false;
        console.log('Email ', emailerror);
        Alert.alert("Please Enter Your Email");
    
    
    } 
    else if (!email.match(reg)) {
      setEmailError('Please Enter Your Valid Email' );
      Alert.alert("Please Enter Your Valid Email");
     // console.log('EmailError', emailerror);
    }
    else if (password === '' ) {
      setPasswordError('Please Enter Your Password');
      Alert.alert("Please Enter Your Password");
      //console.log('hhhhhhhhhhhh', passworderror);
    } 
    
    else {
      loginPress();
    }
  };

 
  const conditions = () => {

    let reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
    if (email != '') {
    //setEmailError('')
    setEmailError('Please Enter Your Email');
    // console.log('Email ', emailerror);
    };
  
    if (email != ' ' || reg.test(email) === true) {
      setEmailError('')
    };
  
    if (password != ' ' || password.length > 8) {
       setPasswordError('')
    };
  
  
  
  };
  return (
    <Screen>
      <View style={styles.topContainer}>
      {/* <Toast />  */}
        <View style={styles.logoContainer}>
          <Image source= {Images.Logo}
            style={styles.logoImg}
          />
        </View>
        <Text style={styles.topText}>Sign IN</Text>
      
        <View style={styles.formContainer}>
        {/* <TextInput  
               placeholder= "Email Address *"
               style={styles.inputStyle}
               //onFocus={emailFocus}
               //onBlur={emailBlur}
               //secureTextEntry={secureTextEntry}
               onChangeText={text => {setEmail(text), conditions()}}
               value={email}
               image={Images.ArrowRight} 
               /> */}
           
        <InputComponent
         placeholder="Email Address *"
         value={email}
         onChangeText={text => { setEmail(text), conditions() }}
         image={Images.ArrowRight}  
         errorMessage={emailerror} 
        />

       <InputComponent   
         placeholder="Password *"
         value={password}
         onChangeText={text => { setPassword(text), conditions() }}
         secureTextEntry={security}
         image={Images.LockIcon}
         errorMessage={passworderror}
         
        />
           <View style={styles.forgotContainer}>
             <TouchableOpacity onPress={()=>navigation.navigate('ForgetScreen')}>
             <Text style={styles.forgotText}>Forgot Paasword?</Text>
             </TouchableOpacity>
           </View>

           <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} onPress={validation}>
                 <Text style={styles.btnText}>Login</Text>               
              </TouchableOpacity>
           </View>
             
             <View style={styles.socialBtnContaier}>
                 <TouchableOpacity style={styles.socialBtn}>
                 <Image    
                  source={Images.FacebookIcon}
                  style={styles.socialImg}
                  />
                 </TouchableOpacity>

                 <TouchableOpacity style={styles.socialBtn}>
                 <Image    
                  source={Images.GoogleIcon}
                  style={styles.socialImg}
                  />
                 </TouchableOpacity>
             </View>


             <View style={styles.bottomContainer}>
               <Text style={styles.bottomtext}>Don't have an account?</Text>
               <TouchableOpacity onPress={()=>navigation.navigate('RegisterScreen')}>
               <Text style={styles.bottomtext2}> Click here</Text>
               </TouchableOpacity>
             </View>

        </View>
      </View>
      {loder && <Loader />}
    </Screen>

  );
}


export default LoginScreen
