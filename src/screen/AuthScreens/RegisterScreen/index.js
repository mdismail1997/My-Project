import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity,Button , StatusBar, SafeAreaView ,TextInput, Alert,Pressable} from 'react-native';
import styles from './style'
import axios from 'axios';
import * as webService from '../../../Services/webService'
import { Screen,InputComponent } from '../../../components'
import DatePicker from 'react-native-datepicker';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../global/Loader'
import {Images} from '../../../assets/image/index'

function RegisterScreen({ route, navigation }) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [showDay, setShowDay] = useState('');
    
    const [date, setDate] = useState('09-10-2021');
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState('')
    const [checked, setChecked] = useState(0);
    var gender = ['Male', 'Female'];
    const [isloading , setisLoading] = useState(false)


    const [loder, setLoder] = useState(false);
    const [fullname, setFullName] = useState('');
    const [nameerror, setNameError] = useState('');
    const [emailerror, setEmailError] = useState('');
    const [passworderror, setPasswordError] = useState('');
    const [cpassworderror, setCPasswordError] = useState('');

 
    const registrationPress= async () =>{
      console.log("======Registration===")
      setLoder(true)
    
      const data = {

        
        //   name:"Jonnnhn Doe",
        //   email:"johndoe199@yopmal.com",
        //   password:"P@ss1234",
        //  dob:"1998-07-07",
        //  phone:"7001400624",
        //   lat:"22.5726",
        //   lng:"88.3639",
        //   address:"Kolkata",
        //   gender:"Male"
      
        name: fullname,
        email: email,
        phone: phone,
        password: password,
        dob: showDay,
        address: address,
        gender:"Male",
        lat:"22.5726",
        lng:"88.3639",
      }
      console.log('register data: ', data);
      axios({
        method: 'POST',
        url: webService.register,
        data: data,
      })
      .then(res => {
        console.log('regn response: ++++++++++++++++++++++++', res.data);
        setLoder(false);
       
        Alert.alert('Account Created Successfully.', 'Please verify your account.', [
          { text: 'OK' },
        ]);
        navigation.navigate('LoginScreen')
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
        Alert.alert("Error");
      });
    }
    
    const submit = () => {
      const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      let check =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
  
      if (fullname == '') {
        setNameError('Please Enter Your Name.');
        Alert.alert("Please Enter Your Name.");
        console.log('name', nameerror);
      } else if (email == '') {
        setEmailError('Please Enter the Email Address.');
        Alert.alert("Please Enter the Email Address.");
        console.log('email Error', email);
      } else if (reg.test(email) == false) {
        setEmailError('Please enter a valid email address.');
        Alert.alert("Please enter a valid email address.");
      } 
      // else if (shopurl == '') {
      //   setShopurlError('Please enter shop Name.');
      //   console.log('Shopurl', shopurlerror);
      //}
      //  else if (shopurl.length < 4) {
      //   setShopurlError('shop name should be at least 3 characters');
      //   console.log('Shopurl*******', shopurlerror);
      // }
      else if (password == '') {
        setPasswordError('Please enter the password.');
        Alert.alert("Please enter the password.");
        console.log('password Error*******', password);
      } else if (password.length < 8) {
        setPasswordError('Password should be at least 8 characters long.');
        Alert.alert("Password should be at least 8 characters long.");
      } 
      else if (cpassword == '') {
        setCPasswordError('Please enter the confirm password.');
        Alert.alert("Please enter the confirm password.");
      } 
      else if (password != cpassword) {
        setCPasswordError('Confirm password not matched to password.');
        Alert.alert("Confirm password not matched to password.");
      } else if (!password.match(check)) {
        setPasswordError(
          'Password should be at least 8 characters, atleast one uppercase letter, atleast one lowercase letter, aleast one special character and atleast one digit.',
        );
        Alert.alert("'Password should be at least 8 characters, atleast one uppercase letter, atleast one lowercase letter, aleast one special character and atleast one digit.");
      }
      // else if (isSelected == '') {
      //   setTCerr('Please accept Terms and conditions.')
      // }
  
  
      else {
        registrationPress();
      }
  
    };
  
  
    const conditions = () => {
      let reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
      if (fullname != ' ') {
        setNameError('')
      };
      if (email != ' ' || reg.test(email) === true) {
        setEmailError('')
      };
      // if (shopurl != ' ') {
      //   setShopurlError('')
      // };
  
      if (cpassword != ' ' || password == cpassword) {
        setCPasswordError('')
      };
  
      if (password != ' ' || password.length > 8) {
        setPasswordError('')
      };
      //   if (isSelected != ' ' ) {
      //     setTCerr(' ')
      //  };
    };



  return (

    <Screen>
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image source={Images.Logo}
            style={styles.logoImg}
          />
        </View>
        <Text style={styles.topText}>Create Account</Text>

        
        <View style={styles.formContainer}>
          
        <InputComponent
        placeholder="Name *"
        value={fullname}
        style={{ paddingBottom: 10 }}
        inputContainerStyle={{ paddingBottom: 10 }}
        containerStyle={{ paddingHorizontal: 0, marginBottom: 5 }}
        inputStyle={{ fontSize: 18, fontFamily: 'Roboto-Regular' }}
        leftIconContainerStyle={{ marginLeft: 15 }}
        // leftIcon={
        //   <Image
        //     source={require('../../Assets/name.png')}
        //     style={{ width: 25, height: 25 }}
        //   />
        // }
        onChangeText={text => { setFullName(text), conditions() }}
        errorMessage={nameerror}
      //    placeholder="Name *"
      //    value={fullname}
      //    //onChangeText={text => setName(text)}
      //   image={Images.ArrowRight}

      //  onChangeText={text => { setFullName(text), conditions() }}
      //   errorMessage={nameerror}
        />

       <InputComponent   
         placeholder="Email *"
         value={email}
         onChangeText={text => setEmail(text)}
         image={Images.EmailIcon}
        />

        <InputComponent   
         placeholder="Contact No *"
         value={phone}
         onChangeText={text => setPhone(text)}
         image={Images.EmailIcon}
        />
        <InputComponent   
         placeholder="Address *"
         value={address}
         onChangeText={text => setAddress(text)}
         image={Images.Address}
        />

        <InputComponent   
         placeholder="Password *"
         secureTextEntry={true}
         value={password}
         onChangeText={text => setPassword(text)}
         image={Images.LockIcon}
        />

        <InputComponent   
         placeholder="Confirm Password *"
         secureTextEntry={true}
         value={cpassword}
         onChangeText={text => setCPassword(text)}
         image={Images.LockIcon}
        />
 
 <Pressable onPress={() => setShowDay(date)}>
 <InputComponent  
                                placeholder='Date of Birth'
                                value={showDay}
                                //style={{ paddingBottom: 10 }}
                                //inputContainerStyle={{ paddingBottom: 10 }}
                                //inputStyle={{ fontSize: 18, fontFamily: "Roboto-Regular" }}
                                //leftIconContainerStyle={{ marginLeft: 15 }}
                                //leftIcon={<Image = {Images.Clendar} style={{ width: 22, height: 22 }} />}
                                image={Images.Clendar}
                                onChangeText={date => setShowDay(date)}
                                
                            />
                        </Pressable>

        {/* <DatePicker
                  style={styles.datePickerStyle}
                  date={date}
                  mode="date"
                  placeholder="select date"
                  format="DD/MM/YYYY"
                  minDate="01-01-1900"
                  maxDate="01-01-2000"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      right: -5,
                      top: 4,
                      marginLeft: 0,
                    },
                    dateInput: {
                      borderColor : "gray",
                      alignItems: "flex-start",
                      borderWidth: 0,
                      borderBottomWidth: 1,
                    },
                    placeholderText: {
                      fontSize: 17,
                      color: "gray"
                    },
                    dateText: {
                      fontSize: 17,
                    }
                  }}
                  onDateChange={(date) => {
                    setDate(date);
                  }}
        /> */}


<InputComponent   
         placeholder="Location *"
         value={address}
         onChangeText={text => setLocation(text)}
         image={Images.Address}
        />

<View style={styles.btn}>
        {gender.map((gender, key) => {
          return (
            <View key={gender}>
              {checked == key ? (
                <TouchableOpacity style={styles.btn}>
                  <Image
                    style={styles.img}
                    source={Images.RadioChecked}
                  />
                  <Text>{gender}</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    setChecked(key);
                  }}
                  style={styles.btn}>
                  <Image
                    style={styles.img}
                    source={Images.RadioUnchecked}
                  />
                  <Text>{gender}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
      {/* <Text>{gender[checked]}</Text> */}

      

        <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} 
              // onPress={registrationPress}
              onPress={submit}
              >
                <Text style={styles.btnText}>Sign Up</Text>
              </TouchableOpacity>
        </View>
             <View style={styles.bottomContainer}>
               <Text style={styles.bottomtext}>Already have an account?</Text>
               {/* <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}> */}
               <TouchableOpacity onPress={()=>navigation.navigate('LoginScreen')}>
               <Text style={styles.bottomtext2}> Click here</Text>
               </TouchableOpacity>
             </View>

        </View>
      </View>
      {loder && <Loader />}
    </Screen>

  );
}


export default RegisterScreen
