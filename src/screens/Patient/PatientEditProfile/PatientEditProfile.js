import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  Keyboard, ActivityIndicator, Dimensions
} from 'react-native';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import React, { useState, useEffect, useRef } from 'react';
import * as Apis from '../../Services/apis';
import { TextInput, Text, Snackbar, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from '../../../components/Header/Header';
import { SuccessfullySubmitModal } from '../../../components/Popupmessage';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
// import { View, Button, Platform, SafeAreaView, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import PhoneInput from 'react-native-phone-number-input';
import { Modal } from 'react-native';
import { removeEmojis } from '../../../components/emojiRegex';
export const PatientEditProfile = (props) => {
  const [loading, setLoding] = useState(false);
  const [loding, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [mobno, setMobno] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [gender, setGender] = useState(null);
  const [dob, setDob] = useState('');
  const [cimage, SetImage] = useState('');
  const [gimage, SetGimage] = useState('');
  const [image, Setimage] = useState('');
  const [profilepic, SetProfilePic] = useState();
  const [isModalVisible, SetIsModalVisible] = useState();
  const [open, setOpen] = useState(false);
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [visible, SetIsVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [counrtyname, setCountryname] = useState('');
  const phoneInput = useRef(null);
  const Height = Dimensions.get('window').height
  const Width = Dimensions.get('window').width
  // const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Others', value: 'Others' },
  ]);
  useEffect(() => {
    getdata();
  }, []);
  const [date, setDate] = useState('09-10-2021');
  const [errmsg, setErrMsg] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const getlocation = async (longitude, latitude) => {
    try {
      const response = await Apis.getlocation(longitude, latitude);
      console.warn('responsse==', response.data);
      setLocation(response.data.results[0].formatted_address);
    } catch (error) {
      console.error(error);
    }
  };
  console.log('location-------->', location);

  const requestLocationPermission = async () => {

    if (Platform.OS === 'ios') {
      getOneTimeLocation();

    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation();
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    setLoading(true)
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');
        console.log('position======', position);

        getlocation(position.coords.longitude, position.coords.latitude);
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);
        setLoading(false)
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };
  console.log('ss-', currentLongitude);
  console.log('lat-----', currentLatitude);
  const showDatePicker = () => {
    setDatePickerVisible(true);
    Keyboard.dismiss();
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (picdate) => {
    // const updateddate = picdate.toISOString();
    // // const svedate = updateddate.split('T')[0].replaceAll('-', '/');
    // console.log('date========>', typeof updateddate);
    // setDob(updateddate.split('T')[0]);
    const updateddate = moment(picdate).format('MM-DD-YYYY')
    console.warn('A date has been picked: ', updateddate);
    //setDate(updateddate.split('T')[0]);
    setDob(updateddate);
    setSelectedDate(picdate);
    hideDatePicker();
  };

  // const getDateOfBirth = () => {
  //   let newDate = new Date(date).toLocaleDateString();
  //   console.log(newDate); // 4/15/2022
  //   return date !== '' ? newDate : '';
  // };
  const getdata = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    setLoding(true);
    await Apis.profileData(data)

      .then((response) => {
        console.log('dob', response.data);
        setLoding(false);
        setName(response.data.response.full_name);
        setEmail(response.data.response.email);
        SetGimage(response.data.response.profile_image);
        setMobno(response.data.response?.phone ?? '');
        setAge(response.data.response?.age ?? '');
        setDob(response.data.response.dob);
        setLocation(response.data.response.address);
        setGender(response.data.response.gender);
        setPhoneNumber(response.data.response.code);
        setCountryname(response.data.response.country);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const Choose = () => {
    Alert.alert(
      'Choose',
      //body
      'Choose Images From',
      [
        { text: 'Camera', onPress: () => Picker() },
        { text: 'Gallery', onPress: () => GalleryPicker() },
        { text: 'Cancel', onPress: () => null },
      ],
      { cancelable: true }
      //clicking out side of alert will not cancel
    );
  };
  const Picker = () => {
    ImagePicker.openCamera({
      borderRadius: 55,
      height: 110,
      width: 110,
      cropping: true,
    }).then((image) => {
      console.log(image);
      SetImage(image.path);
      SetProfilePic({
        name: image.path.split('/').pop(),
        size: image.size,
        uri: image.path,
        type: image.mime,
      });
    });
  };
  const GalleryPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log(image);
      SetGimage(image.path);
      SetProfilePic({
        name: image.path.split('/').pop(),
        size: image.size,
        uri: image.path,
        type: image.mime,
      });
    });
  };
  let fileuri = () => {
    if (cimage) {
      return (

        <Image
          style={{ borderRadius: 55, height: 110, width: 110 }}
          source={{ uri: cimage }}
        />
      );
    } else if (gimage) {
      return (
        <Image
          style={{ borderRadius: 55, height: 110, width: 110 }}
          source={{ uri: gimage }}
        />
      );
    } else if (image) {
      return (
        <Image
          style={{ borderRadius: 55, height: 110, width: 110 }}
          source={{ uri: image }}
        />
      );
    } else {
      return (
        <Image
          style={{ borderRadius: 55, height: 110, width: 110 }}
          source={require('../../../Assets/noimage.png')}
        />
      );
    }
  };


  const Validator = () => {
    let errMsg;
    if (!name || name?.length < 1) {

      errMsg = 'Name field is required';
    }

    else if (!location || location?.length < 1) {

      errMsg = 'Location field is required';
    }

    else if (!age || age?.length < 1) {

      errMsg = 'Age field is required';
    }


    else if (!mobno || mobno === undefined) {
      //console.log('mob', mobno)
      errMsg = 'Mobile No field is required';
    }

    else if (mobno?.length < 10) {
      console.log('mob==', mobno?.length)
      errMsg = 'Please enter valid mobile number';
    }

    else if (!gender || gender?.length < 1) {
      //console.log('mob', mobno)
      errMsg = 'Gender field is required';
    }

    else if (!dob || dob?.length < 1) {
      //console.log('mob', mobno)
      errMsg = 'DOB field is required';
    }
    return errMsg;
  }

  const getProfileupdate = async () => {
    let userid = await AsyncStorage.getItem('userid');
    const authtoken = await AsyncStorage.getItem('authtoken');
    const token = authtoken;
    let user_id = JSON.parse(userid);
    console.log('auth token =====>>>>', token);
    console.log('user id =====>>>>', user_id);
    const formData = new FormData();

    formData.append('user_id', user_id);
    formData.append('name', name);
    formData.append('location', location);
    formData.append('age', age);
    formData.append('phone', mobno);
    formData.append('gender', gender);
    formData.append('dob', dob);
    formData.append('profile_image', profilepic);
    formData.append('code', phoneNumber === '' ? '+91' : phoneNumber);
    formData.append('country', counrtyname === '' ? 'IN' : counrtyname);
    formData.append('latitude', currentLatitude);
    formData.append('longitude', currentLongitude);
    console.log(formData);
    Apis.getprofileupdate(formData, token)
      .then((response) => {
        if (response.data.success === 0) {
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
        } else {
          SetIsModalVisible(true);
        }
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error.response.data);

        //  console.error(error.response);
      });
  };

  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  const handleClose = () => {
    SetIsModalVisible(false);
  };
  if (isModalVisible === false) {
    props.navigation.goBack(null);

  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Edit Profile" navProps={props.navigation} />
      {/* <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: '#d15656',
          bottom: 0,
          zIndex: 1,
        }}
        wrapperStyle={{ position: 'absolute' }}
      >
        {error.message}
      </Snackbar> */}


      <Snackbar
        visible={errmsg !== undefined}
        duration={3000}
        onDismiss={() => {
          setErrMsg(undefined);
        }}
        style={{ backgroundColor: '#d15656', zIndex: 9999 }}
      >
        {errmsg}
      </Snackbar>

      <ScrollView
        style={{}}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView>
          <TouchableOpacity
            style={{
              marginVertical: 30,
              alignSelf: 'center',
              borderRadius: 55,
              height: 110,
              width: 110,
            }}
            onPress={() => { SetIsVisible(true) }}
          >
            {fileuri()}

            <TouchableOpacity
              style={{
                height: 30,
                width: 30,
                borderRadius: 20,
                position: 'absolute',
                left: 90,
                top: 70,
                backgroundColor: 'white',
              }}
              onPress={Choose}
            >
              <Image
                source={require('../../../Assets/edit.png')}
                resizeMode={'contain'}
                style={{
                  height: '95%',
                  width: '95%',
                  borderRadius: 10,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          {loading ? (
            <Spinner
              //visibility of Overlay Loading Spinner
              visible={loading}
              //Text with the Spinner
              textContent={'Loading...'}
              textStyle={{ color: '#fff' }}
            />
          ) : null}
          <TextInput
            label="Name *"
            value={name.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
            onChangeText={(text) => setName(text)}
            mode="outlined"
            //change placeholder
            // placeholder="Dr. Sanjoy Guha"
            // change color code
            // selectionColor="black"
            outlineColor={'#2173A8'}
            maxLength={25}
            //activeOutlineColor="black"
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              backgroundColor: '#fff',
            }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
          <TextInput
            label="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            mode="outlined"
            //change placeholder
            placeholder=""
            // change color code
            // selectionColor="black"
            outlineColor={'#2173A8'}
            // activeOutlineColor={'#2173A8'}
            disabled
            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              backgroundColor: '#fff',
            }}
            theme={{
              colors: {
                disabled: '#2173A8',
                text: '#000',
              },
            }}
          />


          <GooglePlacesAutocomplete
            placeholder='Location *'
            textInputProps={{ value: location, onChangeText: (text) => { setLocation(text) } }}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
              setLocation(data.description);
            }}
            enablePoweredByContainer={false}
            // fetchDetails={true}
            query={{
              key: 'AIzaSyCyJ7Lirxe2ObjpsZbKTgeafLSA9bYSA0M',
              language: 'en',
            }}
            onFail={error => console.error('locationerror', error)}
            //   renderRightButton={() => { <Text>ffffkkkkkkkkkkkkkkkkkkkkkkkkkkkk</Text> }}
            styles={{
              textInputContainer: {
                //backgroundColor: 'grey',
                width: '85%',
                alignSelf: 'center'
              },
              textInput: {
                height: 58,
                color: '#5d5d5d',
                fontSize: 16,
                borderColor: '#2173A8',
                borderWidth: 1
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
              listView: {
                top: 45.5,
                zIndex: 10,
                position: 'absolute',
                // color: 'black',
                // backgroundColor:"white",
                width: '85%',
                alignSelf: 'center',
                borderColor: '#ddd',
                borderWidth: 1
              },
            }}
          />
          <TextInput
            label="Age *"
            value={age.toString()}
            onChangeText={(text) => setAge(text)}
            mode="outlined"
            maxLength={3}
            //change placeholder
            placeholder=""
            // change color code
            textColor="black"
            //selectionColor="black"
            outlineColor={'#2173A8'}
            //activeOutlineColor="black"
            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              backgroundColor: '#fff',
            }}
            // keyboardType={
            //   Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            // }
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            keyboardType="number-pad"
          />
          {/* <TextInput
            label="Mobile No"
            value={mobno.toString()}
            onChangeText={(text) => setMobno(text)}
            mode="outlined"
            //change placeholder
            placeholder=""
            // change color code
            //  selectionColor="black"
            textColor="black"
            outlineColor={'#2173A8'}
            //  activeOutlineColor="black"
            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              backgroundColor: '#fff',
            }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            keyboardType="number-pad"
            maxLength={10}
            left={<TextInput.Affix text="+1" textStyle={{ color: '#000' }} />}
          /> */}
          <PhoneInput
            ref={phoneInput}
            //defaultValue={phoneNumber}
            placeholder='Mobile No *'
            placeholderTextColor='#000'
            defaultCode={props.route.params?.counrtyname}
            layout="second"
            withShadow
            autoFocus
            textInputProps={{ maxLength: 10, value: mobno.toString(), onChangeText: (text) => { setMobno(text) }, }}
            containerStyle={{
              width: '84%',
              height: 55,
              backgroundColor: 'white', alignSelf: 'center', borderColor: '#2173A8', borderWidth: 1, marginBottom: 10,
            }}
            textContainerStyle={{ paddingVertical: 0 }}
            onChangeCountry={text => { setCountryname(text.cca2), console.log('counrtyname--', counrtyname) }}
            onChangeFormattedText={text => {
              setPhoneNumber(text)
              console.log('country', phoneNumber)
            }}
          />
          <View style={{ zIndex: 100 }}>
            <DropDownPicker
              open={open}
              value={gender}
              items={items}
              setOpen={setOpen}
              setValue={setGender}
              placeholder="Gender *"
              setItems={setItems}
              style={{ backgroundColor: '#fff', borderColor: '#2173A8' }}
              labelStyle={{
                width: '84%',
              }}
              containerStyle={{
                marginHorizontal: '8%',
                marginBottom: 10,
                marginTop: 3,
                width: '84%',
              }}
              dropDownContainerStyle={{ backgroundColor: '#fff' }}
            />
          </View>
          {/* <View style={{ flexDirection: 'row', width: '100%' }}>
            <TextInput
              label="Location"
              // value={location}
              // onChangeText={(text) => setLocation(text)}
              mode="outlined"
              //change placeholder
              placeholder=""
              // change color code
              //selectionColor="black"
              textColor="black"
              outlineColor={'#2173A8'}
              // activeOutlineColor="black"
              style={{
                marginHorizontal: '8%',
                marginBottom: 10,
                width: '84%',
                backgroundColor: '#fff',
              }}
              keyboardType={
                Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
              }
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
              right={
                <TextInput.Icon
                  icon={require('../../../Assets/location.png')}
                  onPress={requestLocationPermission}
                  color="#000"
                />
              }
            />
            {loding ? (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  //  backgroundColor: 'red',
                  //  marginTop: 150,
                  position: 'absolute',
                }}>
                <ActivityIndicator size={40} color="#2E4497" />
              </View>
            ) : null}
          </View> */}

          <TouchableOpacity
            style={{ flexDirection: 'row', width: '100%' }}
            onPress={showDatePicker}
          >
            <TextInput
              label="Date Of Birth *"
              mode="outlined"
              value={dob}
              onChangeText={(text) => setDob(text)}
              maxLength={10}
              //change placeholder
              editable={false}
              placeholder="mm-dd-yyyy *"
              // change color code
              // selectionColor="black"
              outlineColor={'#2173A8'}
              // activeOutlineColor="black"
              textColor={'#2173A8'}
              // keyboardType={
              //   Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
              // }
              showSoftInputOnFocus={false}
              onPressIn={showDatePicker}
              style={{
                marginHorizontal: '8%',
                marginBottom: 10,
                width: '84%',
                backgroundColor: '#fff',
              }}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
              right={
                <TextInput.Icon
                  icon={require('../../../Assets/date.png')}
                  onPress={showDatePicker}
                  color="#000"
                />
              }
            />
          </TouchableOpacity>
          <DateTimePickerModal
            date={selectedDate}
            isVisible={datePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()}
          />

          <View
            style={{
              marginTop: 30,
              width: '80%',
              height: 55,
              // change BorderColor
              borderColor: '#fff',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 100,
              backgroundColor: '#2173A8',
            }}
            activeOpacity={0.7}
          >
            <TouchableOpacity onPress={() => {
              const err = Validator();
              if (!err) {
                getProfileupdate();
              } else {
                setErrMsg(err);
              }
            }}>
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 53,
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Rubik',
                  letterSpacing: 0.4,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>

        </KeyboardAvoidingView>
      </ScrollView>
      <SuccessfullySubmitModal
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
      />
      <Modal
        transparent
        animationType="none"

        visible={visible}
      // onRequestClose={() => {
      //   SetIsVisible(!visible);
      // }}
      //  style={{ width: '100%', height: '100%', backgroundColor: 'red' }}

      // animationIn="zoomIn"
      // animationOut="zoomOut"
      >
        <View style={{ height: Height, width: Width, backgroundColor: '#fff' }}>

          <IconButton
            icon="close"
            size={26}
            color="red"
            style={{ alignSelf: 'flex-end' }}
            onPress={() => SetIsVisible(false)}
          />

          {cimage ?


            <Image
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              source={{ uri: cimage }}
            />
            :
            gimage ?

              <Image
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                source={{ uri: gimage }}
              />

              :

              <Image
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                source={require('../../../Assets/noimage.png')}
              />

          }


        </View>

      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#A8E9CA',
  },
  title: {
    textAlign: 'left',
    fontSize: 20,
    fontWeight: 'bold',
  },
  datePickerStyle: {
    width: 230,
  },
  text: {
    textAlign: 'left',
    width: 230,
    fontSize: 16,
    color: '#000',
  },
});
