import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Pressable,
  I18nManager,
  Platform,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../../Component/Header/Header';
import { GetRequest, PutRequest } from '../../Services/ApiFunctions';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Input } from '@rneui/themed';
import Loder from '../../Component/Common/Lodar';
import ButtonDark from '../../Component/Common/ButtonDark';
import ImageCropPicker from 'react-native-image-crop-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Device from 'react-native-device-info';

export default function Account({ navigation }) {
  const [name, setName] = useState('');
  const [data, setData] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [doa, setDoa] = useState('');
  const [image, setImage] = useState('');
  const [profileImg, setProfileImg] = useState('');
  const [loder, setLoder] = useState(false);
  const [showDobClender, setDobClender] = useState(false);
  const [showDoaClender, setDoaClender] = useState(false);
  const [date, setDate] = useState(new Date());
  const [issTablet, setIsTablet] = useState(false)

  useEffect(() => {
    // const i = await AsyncStorage.getItem('traderToken');
    // console.warn('iii', i)
    const isTablet = Device.isTablet();
    // console.warn('isTablet', isTablet)
    if (isTablet == true) {
      setIsTablet(true)
    }
    selectedLng()
    profileData();
    const unsubscribe = navigation.addListener('focus', () => {
      selectedLng()
      profileData();
      const isTablet = Device.isTablet();
      // console.warn('isTablet', isTablet)
      if (isTablet == true) {
        setIsTablet(true)
      }
    });

    return unsubscribe;
  }, []);

  const profileData = () => {
    setLoder(true);
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(res => {
        setLoder(false);
        console.warn('Profile responce 1111111=> ', res);
        setName(res?.firstname + " " + res?.lastname);
        setEmail(res?.email);
        setData(res);
        setDob(res?.dob);
        res?.custom_attributes?.map(item => {
          if (item?.attribute_code == 'phone_number') {
            setPhone(item?.value);
          } else if (item?.attribute_code == 'avatar') {
            setImage(item?.value);
          }
          if (item?.attribute_code == 'anniversary') {
            setDoa(item?.value);
          }
        });
      })
      .catch(error => {
        setLoder(false);
        console.log('Profile error => ', error.response);

        if (error.response.data.message == `The consumer isn't authorized to access %resources.`) {
          Alert.alert(strings.SESSION, '', [
            { text: '' },
            {
              text: strings.OK,
              onPress: () => {
                logout2();
              },
            },
          ])
        } else {
          Alert.alert(strings.PROFILE, strings.LOGIN_FAIL2, [
            { text: strings.CANCEL },
            { text: strings.OK },
          ]);
        }
      });
  };

  const logout2 = async () => {
    setLoder(true)
    setTimeout(async () => {
      setLoder(false)
      navigation.navigate('signin');
      await AsyncStorage.removeItem('traderToken');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }, 2000);

  };

  const submit = () => {
    let phoneRegExp = /^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/;
    let num = phone.slice(0, 3)

    let reg =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (name == '') {
      Alert.alert(strings.PROFILE, strings.ENTER_NAME, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (email == '') {
      Alert.alert(strings.PROFILE, strings.ENTER_EMAIL_ID, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (reg.test(email) == false) {
      Alert.alert(strings.PROFILE, strings.VALID_EMAIL, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (phone.length !== 0 && phoneRegExp.test(num == '971' ? ('00' + phone) : phone) == false) {
      Alert.alert(strings.PROFILE, strings.ENTER_10DIGIT_NO, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else {
      updateProfile();
    }
  };

  const updateProfile = () => {
    setLoder(true);
    let images = !image.base64EncodedData
      ? [
        {
          attribute_code: 'phone_number',
          value: phone,
        },
        {
          attribute_code: 'anniversary',
          value: doa,
        },
      ]
      : [
        {
          attribute_code: 'avatar',
          value: image,
        },
        {
          attribute_code: 'phone_number',
          value: phone,
        },
        {
          attribute_code: 'anniversary',
          value: doa,
        },
      ];
    let sendData = {
      customer: {
        id: data?.id,
        email: email,
        firstname: name,
        lastname: ' ',
        dob: dob,
        website_id: 1,
        custom_attributes: images,
      },
    };
    // console.warn('fhjfjh', sendData);
    PutRequest(`customers/${data?.id}`, sendData, {}, 'admin')
      .then(res => {
        setLoder(false);
        // console.log('Profile upload responce => ', res);
        Alert.alert(strings.PROFILE, strings.PROFILE_UPDATED_SUCCESS, [
          { text: strings.CANCEL },
          {
            text: strings.OK,
            onPress: () => navigation.push('drawer')
          },
        ]);
      })
      .catch(error => {
        setLoder(false);
        console.log('Profile upload error => ', error.response);
        Alert.alert(strings.PROFILE, strings.SOMETHING_WENT_WRONG, [
          { text: strings.CANCEL },
          { text: strings.OK },
        ]);
      });
  };

  const uploadImage = () => {
    ImageCropPicker.openPicker({
      width: 400,
      height: 400,
      includeBase64: true,
      cropping: true,
    })
      .then(image => {
        let x = image.path.split('/');
        let name = x[x.length - 1];
        let data = {
          base64EncodedData: image.data,
          type: image.mime,
          name: name,
        };
        console.log('image data => ', data);
        setImage(data);
      })
      .catch(error => console.log('image error => ', error));
  };

  const setDateofBirth = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDobClender(Platform.OS === 'ios');
    setDate(currentDate);

    var today = currentDate;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    let sendDate = dd + '-' + mm + '-' + yyyy;
    setDob(sendDate);
  };

  const setDateofAnniversary = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDoaClender(Platform.OS === 'ios');
    setDate(currentDate);

    var today = currentDate;
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    let sendDate = dd + '-' + mm + '-' + yyyy;
    setDoa(sendDate);
  };



  const selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    setLoder(false)
    // console.warn("selected Language data==>>>", lngData)
  }

  return (
    <View style={styles.container}>
      <Header title={strings.ACCOUNT} navigation={navigation} icon="menu" />
      <View
        style={{
          paddingHorizontal: 30,
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              marginTop: 25,
              marginBottom: 50,
              alignItems: 'center',
              position: 'relative',
            }}>
            {image == '' || image == 0 ? (
              <View
                style={{
                  borderWidth: 8,
                  borderColor: '#fff',
                  borderRadius: 100,
                  justifyContent: 'center',
                  width: 128,
                  height: 128,
                  alignItems: 'center',
                  elevation: 7,
                  backgroundColor: '#ccc',
                }}>
                <FontAwesome5Icon name="user" color={'#fff'} size={60} solid />
              </View>
            ) : (
              <View
                style={{
                  borderWidth: 8,
                  borderColor: '#fff',
                  borderRadius: 100,
                  elevation: 5,
                  backgroundColor: '#ccc',
                }}>
                <Image
                  source={
                    image.base64EncodedData
                      ? {
                        uri: `data:${image.type};base64,${image.base64EncodedData}`,
                      }
                      : {
                        uri: `https://traders-platform.com/pub/media/customer${image}`,
                      }
                  }
                  resizeMode="cover"
                  style={{ width: 112, height: 112, borderRadius: 1000 }}
                />
              </View>
            )}
            <TouchableOpacity
              onPress={() => uploadImage()}
              style={{
                width: 45,
                height: 45,
                borderRadius: 50,
                backgroundColor: '#828287',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                right: issTablet == true ? '42%' : '30%',
              }}>
              <MaterialCommunityIcons
                style={{ color: '#FFF', fontSize: 24 }}
                name={'pencil'}
                solid
              />
            </TouchableOpacity>
          </View>
          <Input
            placeholder={strings.NAME}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
            inputStyle={{
              fontSize: 16,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            leftIconContainerStyle={{ marginLeft: 10 }}
            leftIcon={
              <Image
                source={require('../../Assets/account.png')}
                style={{ width: 25, height: 25 }}
              />
            }
            errorStyle={{ display: 'none' }}
            onChangeText={e => setName(e)}
            value={name}
          />
          <Input
            placeholder={strings.EMAIL}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
            inputStyle={{
              fontSize: 16,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            leftIconContainerStyle={{ marginLeft: 10 }}
            leftIcon={
              <Image
                source={require('../../Assets/gmail.png')}
                style={{ width: 25, height: 25 }}
              />
            }
            errorStyle={{ display: 'none' }}
            onChangeText={e => setEmail(e)}
            value={email}
          />
          <Input
            placeholder={strings.MOBILE_NUMBER}
            inputContainerStyle={{ borderWidth: 1 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
            inputStyle={{
              fontSize: 16,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            leftIconContainerStyle={{ marginLeft: 10 }}
            leftIcon={
              <Image
                source={require('../../Assets/phone.png')}
                style={{ width: 25, height: 25 }}
              />
            }
            errorStyle={{ display: 'none' }}
            onChangeText={e => setPhone(e)}
            value={phone.replace(/\s/g, '')}
          />
          <Pressable onPress={() => setDobClender(!showDobClender)}>
            <Input
              placeholder={strings.DATE_OF_BIRTH}
              inputContainerStyle={{ borderWidth: 1 }}
              containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
              inputStyle={{
                fontSize: 16,
                fontFamily: 'Roboto-Regular',
                color: '#47474B',
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              placeholderTextColor="#47474B"
              leftIconContainerStyle={{ marginLeft: 10 }}
              leftIcon={
                <Image
                  source={require('../../Assets/dob.png')}
                  style={{ width: 25, height: 25 }}
                />
              }
              errorStyle={{ display: 'none' }}
              value={dob}
              editable={false}
            />
          </Pressable>
          <Pressable onPress={() => setDoaClender(!showDoaClender)}>
            <Input
              placeholder={strings.DATE_OF_META}
              inputContainerStyle={{ borderWidth: 1 }}
              containerStyle={{ paddingHorizontal: 0, marginBottom: 15 }}
              inputStyle={{
                fontSize: 16,
                fontFamily: 'Roboto-Regular',
                color: '#47474B',
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              placeholderTextColor="#47474B"
              leftIconContainerStyle={{ marginLeft: 10 }}
              leftIcon={
                <Image
                  source={require('../../Assets/reminder.png')}
                  style={{ width: 25, height: 25 }}
                />
              }
              errorStyle={{ display: 'none' }}
              onChangeText={e => setDoa(e)}
              value={doa}
              editable={false}
            />
          </Pressable>
        </ScrollView>
        <View style={{ marginVertical: 10 }}>
          <ButtonDark handleClick={() => submit()} title="UPDATE" />
        </View>
      </View>
      {showDobClender && (
        <DateTimePicker
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          value={date}
          onChange={setDateofBirth}
        />
      )}
      {showDoaClender && (
        <DateTimePicker
          mode="date"
          display="spinner"
          maximumDate={new Date()}
          value={date}
          onChange={setDateofAnniversary}
        />
      )}
      {loder && <Loder />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
