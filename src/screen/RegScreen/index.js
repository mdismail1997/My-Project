import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Button, StatusBar, SafeAreaView, TextInput, Alert, Pressable } from 'react-native';
import styles from './style'
import axios from 'axios';
//import * as webService from '../../../Services/webService'
import { Screen, InputComponent } from '../../components'
import DatePicker from 'react-native-datepicker';
import RadioGroup from 'react-native-radio-buttons-group';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Images } from '../../assets/image'

function RegScreen({ route, navigation }) {

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
  const [isloading, setisLoading] = useState(false)

  const userData = {
    name: name,
    email: email,
    phone: phone,
    password: password,
    cpassword: cpassword,
    date: date,
    address: address,
    checked: checked,

  }
  const registrationPress = async () => {
    setisLoading(true)
    // const testForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;   
    const testForEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+.com/;

    const testForPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;


    if (email === '') {
      Alert.alert('Please enter email', '#FF0000')
      return false;
    } else if (!testForEmail.test(email)) {
      Alert.alert('Please enter valid email', '#FF0000')
      return false;
    }
    if (password === '') {
      Alert.alert('Please enter password', '#FF0000')
      return false;
    }
    let data = webService.registerUser(userData)
    console.log(userData.phone)
    // const data = {email: email, password: password ,name : name  ,dob:date ,gender: gender[checked]  , phone: phone , lat:22.5726, lng: 88.3639,address: address};
    // console.log(data);
    let newData = {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      cpassword: userData.cpassword,
      date: userData.date,
      address: userData.address,
      checked: userData.checked
    }
    console.log('register data: ', newData);
    axios({
      method: 'POST',
      url: webService.apiUrl + 'registration',
      data: newData,
    })
      .then(response => {
        console.log('regn response: ++++++++++++++++++++++++', response.data);
        // webService.storeData('userData', JSON.stringify(response.data.token));
        setisLoading(true);
        // navigation.navigate('DrawerNavigation')
        if (response.data.success === true) {
          let user_id = response.data.data.data._id;
          console.log("user_id: ", response.data.data.token);
          navigation.navigate('DrawerNavigation', { id: user_id })
          console.log("rseponse success:::::::: ", response.data);

          AsyncStorage.setItem('user_token', response.data.data.token)

        }
        else if (response.data.success === false) {
          Alert.alert(response.data.error.message);
        }
      })
      .catch(err => {
        setisLoading(false)

        console.log('err=====================', err);
        Alert.alert("email already exist");
      });
  }

  return (

    <Screen>
      <View style={styles.topContainer}>
        <View style={styles.logoContainer}>
          <Image source={Images.RegScreen}
            style={styles.logoImg}
          />
        </View>
        <Text style={styles.topText}>Create Account</Text>


        <View style={styles.formContainer}>

          <InputComponent
            placeholder="User Name"
            value={name}
            onChangeText={text => setName(text)}
          //image={Images.ArrowRight}
          />


          <InputComponent
            placeholder="Phone No"
            value={phone}
            onChangeText={text => setPhone(text)}
          //image={Images.EmailIcon}
          />


          <InputComponent
            placeholder="Password"
            secureTextEntry={true}
            value={password}
            onChangeText={text => setPassword(text)}
            image={Images.Ey}
          />

          <InputComponent
            placeholder="Renter Password "
            secureTextEntry={true}
            value={cpassword}
            onChangeText={text => setCPassword(text)}
          //image={Images.LockIcon}
          />








          {/* <Text>{gender[checked]}</Text> */}



          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.btnSubContainer} onPress={registrationPress}>
              <Text style={styles.btnText}>Create</Text>
            </TouchableOpacity>
          </View>




          <View style={styles.bottomContainer}>
            <Text style={styles.bottomtext}>Already have an account?</Text>
            
         

            {/* <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}> */}
            <Text style={styles.bottomtext2}> Login</Text>
            {/* </TouchableOpacity> */}
        
          </View>
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


export default RegScreen
