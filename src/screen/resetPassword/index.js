import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar, SafeAreaView ,TextInput, Alert} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common';
import ProgressBar from "react-native-animated-progress";
import { Screen,InputComponent } from '../../components'
import ScrollView from 'react-native-gesture-handler'
import axios from 'axios';
import * as webService from '../../Services/webService'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Images } from '../../assets/image/index';

function resetPassword({ route, navigation }) {

const [password, setPassword] = useState('');
const [npassword, setNpassword] = useState('');
const [cpassword, setCpassword] = useState('');

const[loder,setLoder]=useState(false)


// const predata = route.params.item;


// const userData={
//  email: predata.email,
//  user_id: predata.user_id,
//  password: npassword,
 
 
// }
// const handlePassword= ()=> {
//   const prereEmail = predata
//   console.log(predata.email)

//   if(npassword === cpassword){
//     setPassword(npassword)
//     console.log("password: ", npassword);
    
//     // var headers = {
//     //           'Content-Type': 'application/json',
//     //           Authorization: `Bearer ${token}`
//     //       }
    
    
//     axios({
//       method: 'POST',
//       url: webService.apiUrl+ 'resetPassword',
//       data: userData,
//       // headers: headers,
//   })
//   .then(response => {
//       // setisLoading(true);
//       console.log(response);
//       console.log('response change password: ', response.data);
//       if(response.data.success === true){
//           console.log('response change password 222222: ', response.data);
//         Alert.alert('Password updated successfully!');
//         webService.storeData('userData', response.data)
//         navigation.navigate('LoginScreen')
//         // setPassword('')
        
//       }
//   })
//   .catch(err=> {
//       // setisLoading(false)
//       Alert.alert('There was an error, please try again');
//   });
//   }else{
//     Alert.alert("Password doesn't match");
//     console.log("Password doesn't match");
//   }
// }
const changePassword = () => {
  setLoder(true);
  navigation.navigate('LoginScreen')
  // console.log("======Reset Password=====",password)

  // const data = {
  //   email:email,
  // }
  // console.log('register data: ', data);
  // axios({
  //   method: 'POST',
  //   url: webService.Forgot_password,
  //   data: data,
  // })
  //   .then(response => {
  //       setisLoading(false);
  //       // console.log(response.data);
  //       console.log('response change password: ', response.config.data);
  //       if(response.data.success === true){
  //           console.log('response change password 222222: ', response);
  //         Alert.alert('Password updated successfully!');
  //         // navigation.navigate('resetPassword')
          
          
  //       }
  //   })
  //   .catch(err=> {
  //       setisLoading(false)
  //       Alert.alert('There was an error, please try again');
  //   });
}


 

  return (
    <Screen>
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image source={Images.Logo}
            style={styles.logoImg}
          />
        </View>
        <Text style={styles.topText}>Reset Password?</Text>
        {/* <Text style={styles.subText}>Enter your email address to reset password</Text>
        */}
        <View style={styles.formContainer}>
           
        <InputComponent
         placeholder="New password"
         value={npassword}
         onChangeText={text => setNpassword(text)}
        //  image={require('../../assets/icons/arrowRightIcon.png')}
        
        />
        <InputComponent
         placeholder="Confirm password"
         value={cpassword}
         onChangeText={text => setCpassword(text)}
        //  image={require('../../assets/icons/arrowRightIcon.png')}
        
        />

           <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} onPress={()=> changePassword()}>
                 <Text style={styles.btnText}>Submit</Text>               
              </TouchableOpacity>
           </View>           
        </View>
      </View>
    </Screen>

  );
}


export default resetPassword;