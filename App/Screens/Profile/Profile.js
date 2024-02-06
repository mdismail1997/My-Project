import React, {useState, useRef, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import DropDownPicker from 'react-native-dropdown-picker';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {getApicall, postApiCall} from '../../Services/Network';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import axios from 'axios';
import {base_url} from '../../Services/constants';
import CountryPicker from 'react-native-country-picker-modal';
import Hud from '../Common/Hud';
//import {RadioButton} from 'react-native-paper';
//import RadioForm from 'react-native-simple-radio-button';

import CustomRadio from '../Common/CustomRadio';

const {width, height} = Dimensions.get('window');

const Profile = props => {
  useEffect(() => {
    handleProfile();
  }, []);
  const nameRef = useRef();
  const emailRef = useRef();
  const phoneRef = useRef();
  const countryRef = useRef();
  const bioRef = useRef();

  const [userType, setUserType] = useState('');
  //const [userType, setUserType] = useState('user');
  const [imageModal, setImageModal] = useState(false);

  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  //const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');

  const [open, setOpen] = useState(false);

  const [items, setItems] = useState([
    {label: 'Male', value: 'Male'},
    {label: 'Female', value: 'Female'},
  ]);

  const [value, setValue] = useState(null);
  var choice = [
    {label: 'Private', value: 0},
    {label: 'Public', value: 1},
  ];

  const [shownName, setShownName] = useState(false);
  const [shownEmail, setShownEmail] = useState(false);
  const [shownPhone, setShownPhone] = useState(false);
  const [shownBio, setShownBio] = useState(false);
  const [shownGender, setShownGender] = useState(false);

  const [profile, setProfile] = useState('');

  const [country, setCountry] = useState(null);

  const [profileimage, setProfileImage] = useState(
    'https://embodiedfacilitator.com/wp-content/uploads/2018/05/human-icon-png-1901.png',
  );

  const [sendImage, setSendImage] = useState('');

  const nameHandler = value => {
    setName(value);
    setShownName(true);
    // console.log(name);
  };

  const emailHandler = value => {
    setEmail(value);
    setShownEmail(true);
    //console.log(email);
  };

  const phoneHandler = value => {
    setPhone(value);
    setShownPhone(true);
    //console.log(phone);
  };

  const bioHandler = value => {
    setBio(value);
    setShownBio(true);
    //console.log(bio);
  };

  const genderHandler = value => {
    setGender(value);
    setShownGender(true);
    console.log(gender);
  };

  const onCamera = () => {
    ImagePicker.openCamera({
      width: 1100,
      height: 1000,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        // console.log('Image==>', image);
        //console.log(image.path);

        setProfileImage(image.path);
        setSendImage(image);
        setImageModal(false);
      })
      .catch(error => {
        console.log('User cancelled image selection from the Camera');
        console.log('Image Cancel error===>', error);
      });
  };

  const onGallery = () => {
    ImagePicker.openPicker({
      width: 1100,
      height: 1000,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        console.log('Image==>', image);
        //console.log(image.path);
        //console.log('image.uri==>', image.uri);

        setProfileImage(image.path);
        setSendImage(image);
        setImageModal(false);
      })
      .catch(error => {
        console.log('User cancelled image selection from the gallery');
        console.log('Image Cancel error===>', error);
      });
  };

  const handleProfile = async () => {
    Hud.showHud();
    await getApicall('profile', {}, {})
      .then(response => {
        Hud.hideHud();
        //console.log(response.data.data);
        //console.log(response.status);
        if (response.status == 200) {
          setProfile(response.data.data);
          setName(response.data.data.name);
          setEmail(response.data.data.email);
          setPhone(response.data.data.mobile_number);
          setGender(response.data.data.gender);
          setUserType(response.data.data.user_type);
          setUserName(response.data.data.username);
          setBio(response.data.data.bio);
          setCountry(response.data.data.country);
          setValue(response.data.data.profile_state);
          if (
            response.data.data.profile_image != null &&
            response.data.data.profile_image != undefined
          ) {
            setProfileImage(response.data.data.profile_image);
          } else {
            setProfileImage(
              'https://embodiedfacilitator.com/wp-content/uploads/2018/05/human-icon-png-1901.png',
            );
          }
          // setValue(response.data.data.profile_state);
          console.log('profile==>', profile);
          //imageHandle(response.data.data.image)
        } else {
          console.log('error');
          Hud.hideHud();
        }
      })
      .catch(function (error) {
        //setLoading(false);
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('error in response for header==>', error.response.data);
          // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };

  let handleSave = async () => {
    if (name === '') {
      Toast.show({
        type: 'error',
        text1: 'Plese Enter Valid Name',
      });
    } else if (email === '') {
      Toast.show({
        type: 'error',
        text1: 'Plese Enter Valid Email Address',
      });
    } else if (phone === '') {
      Toast.show({
        type: 'error',
        text1: 'Plese Enter Valid Phone Number',
      });
    } else if (country === '' || country === null || country === undefined) {
      Toast.show({
        type: 'error',
        text1: 'Plese Enter Your Country',
      });
    } else if (gender === '' || gender === null || gender === undefined) {
      Toast.show({
        type: 'error',
        text1: 'Plese Enter Your Gender',
      });
    } else {
      Hud.showHud();
      const data = new FormData();
      data.append('name', name);
      data.append('username', userName);
      data.append('email', email);
      data.append('mobile_number', phone);
      data.append('country', country);
      data.append('gender', gender);
      data.append('bio', bio);
      data.append('profile_image', {
        //uri: profileimage,
        uri:
          Platform.OS == 'ios'
            ? profileimage?.replace('file://', '/')
            : profileimage,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      console.log('Form Data===>', data);
      const AccessToken = await AsyncStorage.getItem('token');

      try {
        let res = await fetch(base_url + `profileedit`, {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data; ',
            Authorization: `Bearer ${AccessToken}`,
          },
        });
        let responseJson = await res.json().then(response => {
          console.log('responseJson===>', response);
          //AsyncStorage.setItem('profile', JSON.stringify(response.data.data));

          //ToastAndroid.show(response.message, ToastAndroid.SHORT);
          Hud.hideHud();
          if (response.success === true) {
            Toast.show({
              type: 'success',
              text1: 'Profile has been updated',
            });
            props.navigation.navigate('Home');
          } else {
            Toast.show({
              type: 'error',
              text1: 'Profile has not been updated',
            });
          }
        });
      } catch {
        //console.log('Error during update profile');
        //ToastAndroid.show('Error during update profile', ToastAndroid.SHORT);
        Toast.show({
          type: 'error',
          text1: 'Error during update profile',
        });
      } finally {
        // setLoading(false);
        Hud.hideHud();
      }
    }
    //  if (responseJson.status == 1) {
    //    alert('Upload Successful');
    //  }
  };

  const userHandler = async val => {
    console.log('Profile type==>', typeof val);

    const profileType = {profile_state: val};
    Hud.showHud();
    await postApiCall('celebritychangeprofile', profileType, {})
      .then(response => {
        console.log('=======>', response.data);
        if (response.status == 200) {
          setValue(val);

          Toast.show({
            type: 'success',
            text1: response.data.message,
          });
          Hud.hideHud();
        } else {
          Hud.hideHud();
          console.log('error===>response.data.data.user_type is not 1 or 2');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('error in response for header==>', error.response.data);
          // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar
        backgroundColor="#ffffff"
        barStyle="dark-content"
        translucent={false}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width * 0.9,
          marginTop: height * 0.01,
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Image
            source={require('../../Assets/Icon/back.png')}
            style={{
              height: 18,
              width: 10,
              tintColor: 'black',
              marginLeft: 10,
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: '#000',
            fontWeight: '500',
            fontSize: RFValue(25),
            //fontFamily: 'Roboto-Medium',
          }}>
          Profile
        </Text>

        <View
          style={{
            height: 18,
            width: 20,
          }}
        />
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          marginLeft: 0,
          borderWidth: 0,
          borderColor: 'blue',
          width: '100%',
          justifyContent: 'center',
          //marginTop: 30,
          alignItems: 'center',
        }}>
        <View
          style={{
            width: width * 0.8,
            alignItems: 'center',
            marginTop: height * 0.01,
          }}>
          <View
            style={{
              height: 110,
              width: 110,
              //width: width * 0.34,
              //height: height * 0.2,
              borderRadius: 110,
              //marginLeft: 20,
              alignItems: 'center',
            }}>
            <Image
              source={{uri: profileimage}}
              //source={require('../../Assets/Images/profile.png')}
              style={{height: '100%', width: '100%', borderRadius: 110}}
              resizeMode="cover"
            />
          </View>

          <View
            style={{
              width: width * 0.25,
              alignItems: 'flex-end',
              position: 'absolute',
              top: 85,
            }}>
            <TouchableOpacity
              onPress={() => setImageModal(true)}
              style={{
                width: 35,
                height: 35,
                backgroundColor: '#E92D87',
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 3,
                borderColor: '#fff',
              }}>
              <View style={{height: 15, width: 15}}>
                <Image
                  source={require('../../Assets/Icon/write.png')}
                  style={{height: '100%', width: '100%'}}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{alignItems: 'center', marginTop: height * 0.02}}>
            <Text
              style={{
                fontSize: RFValue(20),
                //fontFamily: 'Roboto-Medium',
                color: '#000',
                fontWeight: '500',
              }}>
              {name}
            </Text>
            <Text
              style={{
                fontSize: RFValue(15),
                //fontFamily: 'Roboto-Medium',
                color: '#8E7B85',
                fontWeight: '500',
              }}>
              {userName}
            </Text>
          </View>
        </View>

        {/* ************************************Modal********************************************************* */}

        <Modal
          visible={imageModal}
          transparent={true}
          animationType="fade"
          statusBarTranslucent={true}
          onRequestClose={() => {
            setImageModal(false);
          }}>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.3)',
              flex: 1,
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#fff',
                width: width * 0.8,
                height: height * 0.3,
                alignItems: 'center',
                //justifyContent: 'center',
                marginTop: height * 0.3,
                borderRadius: 20,
              }}>
              <View
                style={{
                  width: width * 0.75,
                  marginVertical: 10,
                  //backgroundColor: 'red',
                }}>
                <TouchableOpacity
                  style={{
                    height: height * 0.06,
                    width: width * 0.06,
                    alignSelf: 'flex-end',
                  }}
                  onPress={() => setImageModal(false)}>
                  <Image
                    source={require('../../Assets/Icon/close.png')}
                    style={{
                      height: '100%',
                      width: '100%',
                      tintColor: '#E92D87',
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={{fontSize: RFValue(22), color: '#000000'}}>
                  Choose Media
                </Text>
              </View>

              <View
                style={{
                  marginTop: height * 0.05,
                  flexDirection: 'row',
                  width: '85%',
                  justifyContent: 'space-between',
                  position: 'absolute',
                  bottom: '15%',
                }}>
                <View style={{width: width * 0.32, height: 40}}>
                  <TouchableOpacity
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: '#E92D87',
                      borderRadius: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => onCamera()}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#FFFFFF',
                        //fontFamily: 'Roboto-Medium',
                        fontWeight: '500',
                      }}>
                      Launch Camera
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{width: width * 0.32, height: 40}}>
                  <TouchableOpacity
                    style={{
                      height: '100%',
                      width: '100%',
                      backgroundColor: '#E92D87',
                      borderRadius: 40,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={() => onGallery()}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: '#FFFFFF',
                        //fontFamily: 'Roboto-Medium',
                        fontWeight: '500',
                      }}>
                      Open Gallery
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>

        {/* *********************************End of Modal***************************************************** */}

        <View style={shownName ? styles.divisionSelect : styles.division}>
          <View style={styles.input}>
            <TextInput
              value={name}
              ref={nameRef}
              onChangeText={value => nameHandler(value)}
              placeholder="Name"
              //style={[styles.textInput]}
              placeholderTextColor={'#8E7B85'}
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                emailRef.current.focus();
              }}
              style={styles.input}
            />
          </View>

          <View
            style={{
              height: height * 0.05,
              width: width * 0.05,
              alignSelf: 'center',
              marginRight: 8,
            }}>
            <Image
              source={require('../../Assets/Icon/name.png')}
              style={
                shownName
                  ? {...styles.imagesty, tintColor: 'black'}
                  : {...styles.imagesty, tintColor: '#B19DA7'}
              }
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={shownEmail ? styles.divisionSelect : styles.division}>
          <View style={styles.input}>
            <TextInput
              value={email}
              ref={emailRef}
              editable={false}
              onChangeText={value => emailHandler(value)}
              placeholder="Email"
              //style={[styles.textInput]}
              placeholderTextColor={'#8E7B85'}
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => {
                phoneRef.current.focus();
              }}
              style={styles.input}
            />
          </View>

          <View
            style={{
              height: height * 0.05,
              width: width * 0.05,
              alignSelf: 'center',
              marginRight: 8,
            }}>
            <Image
              source={require('../../Assets/Icon/reg_message.png')}
              style={
                shownEmail
                  ? {...styles.imagesty, tintColor: 'black'}
                  : styles.imagesty
              }
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={shownPhone ? styles.divisionSelect : styles.division}>
          <View style={styles.input}>
            <TextInput
              value={phone}
              ref={phoneRef}
              onChangeText={value => phoneHandler(value)}
              placeholder="Phone"
              //style={[styles.textInput]}
              placeholderTextColor={'#8E7B85'}
              autoCorrect={false}
              keyboardType="numeric"
              maxLength={10}
              returnKeyType="next"
              // onSubmitEditing={() => {
              //   countryRef.current.focus();
              // }}
              style={styles.input}
            />
          </View>

          <View
            style={{
              height: height * 0.038,
              width: width * 0.05,
              alignSelf: 'center',
              marginRight: 8,
            }}>
            <Image
              source={require('../../Assets/Icon/mobile.png')}
              style={
                shownPhone
                  ? {...styles.imagesty, tintColor: 'black'}
                  : styles.imagesty
              }
              resizeMode="contain"
            />
          </View>
        </View>
        {/* {shownCountry ? (
          <TouchableOpacity style={styles.divisionSelect}>
            <View style={{...styles.input, justifyContent: 'center'}}>
              <CountryPicker
                {...{
                  countryCode,
                  withFlag,
                  withCountryNameButton,

                  onSelect,
                }}
                visible={shownCountry}
              />
            </View>

            <View
              style={{
                height: height * 0.05,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 8,
              }}>
              <Image
                source={require('../../Assets/Icon/flag.png')}
                style={
                  shownCountry
                    ? {...styles.imagesty, tintColor: 'black'}
                    : {...styles.imagesty, tintColor: '#B19DA7'}
                }
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              setShownCountry(true);
              //onSelect();
            }}
            style={styles.division}>
            <View style={{...styles.input, justifyContent: 'center'}}>
              <Text style={{color: '#151143'}}>{country}</Text>
            </View>

            <View
              style={{
                height: height * 0.05,
                width: width * 0.05,
                alignSelf: 'center',
                marginRight: 8,
              }}>
              <Image
                source={require('../../Assets/Icon/flag.png')}
                style={
                  shownCountry
                    ? {...styles.imagesty, tintColor: 'black'}
                    : {...styles.imagesty, tintColor: '#B19DA7'}
                }
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        )} */}

        {/* <TouchableOpacity
          style={shownCountry ? styles.divisionSelect : styles.division}>
          <View style={{...styles.input, justifyContent: 'center'}}>
            <TextInput
              value={country}
              editable={false}
              ref={countryRef}
              //onChangeText={value => countryHandler(value)}
              placeholder="Country"
              //style={[styles.textInput]}
              placeholderTextColor={'#8E7B85'}
              autoCorrect={false}
              returnKeyType="next"
              style={styles.input}
            />
          </View>

          <View
            style={{
              height: height * 0.05,
              width: width * 0.05,
              alignSelf: 'center',
              marginRight: 8,
            }}>
            <Image
              source={require('../../Assets/Icon/flag.png')}
              style={
                shownCountry
                  ? {...styles.imagesty, tintColor: 'black'}
                  : {...styles.imagesty, tintColor: '#B19DA7'}
              }
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity> */}

        <View style={{alignSelf: 'center'}}>
          <DropDownPicker
            placeholder="Gender"
            placeholderStyle={{color: '#8E7B85'}}
            disableBorderRadius={true}
            open={open}
            value={gender}
            items={items}
            setOpen={setOpen}
            setValue={value => {
              genderHandler(value);
            }}
            setItems={setItems}
            style={shownGender ? styles.divisionSelect : styles.division}
            zIndexInverse={2000}
            listMode="SCROLLVIEW"
            dropDownContainerStyle={{
              //backgroundColor: 'red',
              width: '80%',
              //borderRadius: 20,
            }}
            textStyle={{
              color: '#000',
              fontStyle: 'normal',
              fontWeight: '400',
              textAlign: 'left',
              paddingHorizontal: width / 40,
              fontSize: RFValue(15),
            }}
            // labelStyle={{
            //   fontWeight: 'bold',
            // }}
            //dropDownStyle={{ backgroundColor: 'red' }}
          />
        </View>

        {userType != 1 ? (
          <>
            <View style={shownBio ? styles.divisionSelect : styles.division}>
              <View style={styles.input}>
                <TextInput
                  value={bio}
                  ref={bioRef}
                  onChangeText={value => bioHandler(value)}
                  placeholder="Bio"
                  multiline
                  //style={[styles.textInput]}
                  placeholderTextColor={'#8E7B85'}
                  autoCorrect={false}
                  style={styles.input}
                />
              </View>

              <View
                style={{
                  height: height * 0.05,
                  width: width * 0.05,
                  alignSelf: 'center',
                  marginRight: 8,
                }}>
                <Image
                  source={require('../../Assets/Icon/bio.png')}
                  style={
                    shownBio
                      ? {...styles.imagesty, tintColor: 'black'}
                      : {...styles.imagesty, tintColor: '#B19DA7'}
                  }
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={{width: width * 0.75, marginTop: height * 0.03}}>
              <Text style={{color: '#8E7B85', fontSize: RFValue(20)}}>
                Profile Type
              </Text>

              <View
                style={{
                  marginTop: height * 0.01,
                  width: '60%',
                  alignSelf: 'flex-start',
                  //backgroundColor: 'red',
                  //height: 50,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    width: '40%',
                    alignSelf: 'flex-start',
                    //backgroundColor: 'red',
                    //height: 50,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  {/* <RadioButton
                    value={0}
                    status={value === 0 ? 'checked' : 'unchecked'}
                    onPress={() => userHandler(0)}
                    color="#E92D87"
                    //color='#EBE0E5'
                  /> */}
                  <CustomRadio
                    status={value === 0}
                    onPress={() => userHandler(0)}
                  />
                  <Text
                    onPress={() => userHandler(0)}
                    style={{fontSize: RFValue(18), alignSelf: 'center'}}>
                    Private
                  </Text>
                </View>

                <View
                  style={{
                    width: '40%',
                    alignSelf: 'flex-start',
                    //backgroundColor: 'red',
                    //height: 50,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  {/* <RadioButton
                    value={1}
                    status={value === 1 ? 'checked' : 'unchecked'}
                    onPress={() => userHandler(1)}
                    color="#E92D87"
                  /> */}

                  <CustomRadio
                    status={value === 1}
                    onPress={() => userHandler(1)}
                  />

                  <Text
                    onPress={() => userHandler(1)}
                    style={{fontSize: RFValue(18)}}>
                    Public
                  </Text>
                </View>
                {/* <RadioForm
                  radio_props={choice}
                  initial={value}
                  onPress={val => userHandler(val)}
                  buttonSize={12}
                  buttonOuterSize={20}
                  buttonColor={'#EBE0E5'}
                  selectedButtonColor={'#E92D87'}
                  //buttonInnerColor={'#EBE0E5'}
                  labelHorizontal={true}
                  labelStyle={{
                    fontSize: RFValue(20),
                    marginRight: 20,
                    color: '#151143',
                  }}
                  disabled={false}
                  formHorizontal={true}
                /> */}
              </View>
            </View>
          </>
        ) : null}

        <View style={{width: width * 0.8, height: 50, marginTop: height * 0.1}}>
          <TouchableOpacity
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#E92D87',
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => props.navigation.navigate('ChangePassword')}>
            <Text
              style={{
                fontSize: 19,
                color: '#FFFFFF',
                //fontFamily: 'Roboto-Bold',
                fontWeight: 'bold',
              }}>
              Change Password
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: width * 0.8,
            height: 50,
            marginTop: height * 0.03,
            marginBottom: height * 0.05,
          }}>
          <TouchableOpacity
            onPress={() => handleSave()}
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: '#fff',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#E92D87',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 19,
                color: '#E92D87',
                //fontFamily: 'Roboto-Medium',
                fontWeight: '500',
              }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  division: {
    width: width * 0.8,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.025,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.025,
    paddingLeft: 10,
  },

  input: {
    flex: 1,
    color: '#151143',
  },

  imagesty: {width: '100%', height: '100%'},
});
