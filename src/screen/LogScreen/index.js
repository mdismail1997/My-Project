import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar, SafeAreaView ,TextInput, Alert} from 'react-native';
import styles from './style'
import {getAndroidDevice} from '../../utils/constants/common'
import { Screen,InputComponent } from '../../components'
import Toast from 'react-native-smart-toast-alert'
import axios from 'axios'
import DeviceInfo from 'react-native-device-info';
//import * as webService from '../../../Services/webService'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Images} from '../../assets/image/index'
function LogScreen({ route, navigation }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [device, setDevice] = useState('')
  const [isloading, setisLoading] = useState(false)



  useEffect(() => {
    getAndroidDevice();
    
  });
 
  const getAndroidDevice = () =>{
    DeviceInfo.getAndroidId().then((androidId) => {
     setDevice(androidId);
    });

  }


  const loginPress= async()=> {
    navigation.navigate('DrawerNavigation')
 
  }

 

  return (
    <Screen>
      <View style={styles.topContainer}>
      <Toast /> 
        <View style={styles.logoContainer}>
          <Image source= {Images.RegScreen}
            style={styles.logoImg}
          />
        </View>
        <Text style={styles.topText}>Log in</Text>
      
        <View style={styles.formContainer}>
           
        <InputComponent
         placeholder="User Name"
         value={email}
         onChangeText={text => setEmail(text)}
         //image={Images.ArrowRight}   
        />

       <InputComponent   
         placeholder="Password "
         value={password}
         onChangeText={text => setPassword(text)}
         secureTextEntry={true}
         image={Images.Ey}
        />
           {/* <View style={styles.forgotContainer}>
             <TouchableOpacity onPress={()=>navigation.navigate('ForgetScreen')}>
             <Text style={styles.forgotText}>Forgot Paasword?</Text>
             </TouchableOpacity>
           </View> */}

           <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} onPress={loginPress}>
                 <Text style={styles.btnText}>Log in</Text>               
              </TouchableOpacity>
           </View>
           <View style={styles.bottomContainer}>
            <Text style={styles.bottomtext}>Didn’t have an account ?</Text>
            </View>
            <View>
                <Text style={styles.bottomtext2} >
                Create Account
                </Text>
            </View>


         

            {/* <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}> */}
           
            {/* </TouchableOpacity> */}
        
         
          <View style={styles.bottomContainer2} >
            <Text style={styles.bottomtext}>
            GETTTING TROUBLE WITH APP ? 
            </Text>
          </View>
          <View >
            <Text style={styles.bottomtext1}>
            CALL ON 6289982261 
            </Text>
          </View>
          

        </View>
      </View>
    </Screen>

  );
}


export default LogScreen
