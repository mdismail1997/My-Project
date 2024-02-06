import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity,Alert, StatusBar, SafeAreaView ,TextInput} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import ProgressBar from "react-native-animated-progress";
import { Screen,InputComponent } from '../../../components'
import ScrollView from 'react-native-gesture-handler'
import OTPInputView from '@twotalltotems/react-native-otp-input';
import axios from 'axios';
import {Images} from '../../../assets/image/index'
//import * as webService from '../../Services/webService'

function OtpScreen({ route, navigation }, props) {


const handleText=(text, value)=> {
  setOtp({
    ...otp, 
    [text]: value});
  
}



  return (
    <Screen>
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image source={Images.Logo}
            style={styles.logoImg}
          />
        </View>
        <Text style={styles.topText}>OTP</Text>
        <Text style={styles.subText}>Enter your One Time Password</Text>
       
        <View style={styles.formContainer}> 
           
       <View style={styles.otpContainer}>
               <View style={styles.categoryRow1}>                
                 <TouchableOpacity style={styles.catCard2} >                   
                     <TextInput style={styles.catName}  onChangeText={text => handleText('text1', text)} 
                    // value={otp.text1} 
                     />           
                  </TouchableOpacity>
                                             
                  <TouchableOpacity style={styles.catCard2 } >
                      <TextInput style={styles.catName}  onChangeText={text => handleText('text2', text)} 
                      //value={otp.text2} 
                      />    
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.catCard2} >                   
                      <TextInput style={styles.catName}  onChangeText={text => handleText('text3', text)} 
                      //value={otp.text3} 
                      />                
                  </TouchableOpacity>
                                             
                  <TouchableOpacity style={styles.catCard2 } >
                      <TextInput style={styles.catName}  onChangeText={text => handleText('text4', text)} 
                      //value={otp.text4} 
                      />    
                  </TouchableOpacity>
                  
              </View> 
       </View>

           <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} onPress={()=> navigation.navigate('resetPassword')}>
                 <Text style={styles.btnText}>Submit</Text>               
              </TouchableOpacity>
           </View>           
        </View>
      </View>
    </Screen>

  );
}


export default OtpScreen
