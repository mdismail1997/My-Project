import { Input } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager
} from 'react-native';
import ButtonDark from '../../Component/Common/ButtonDark';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import { GetRequest, PutRequest } from '../../Services/ApiFunctions';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import { StrictMode } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ChangePassword({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [data, setData] = useState('');
  const [loder, setLoder] = useState(false);

  const submit = () => {
    if (oldPassword == '') {
      Alert.alert(strings.CHANGE_PASSWORD, strings.ENTER_OLD_PASS, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password == '') {
      Alert.alert(strings.CHANGE_PASSWORD, strings.ENTER_NEWPASS, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password.length < 8) {
      Alert.alert(
        strings.CHANGE_PASSWORD,
        strings.PASS_ERR,
        [{ text: strings.CANCEL },
        { text: strings.OK },],
      );
    } else if (confirmPassword == '') {
      Alert.alert(
        strings.CHANGE_PASSWORD,
        strings.ENTER_CONPASS,
        [{ text: strings.CANCEL },
        { text: strings.OK },],
      );
    } 
    else if (password !== confirmPassword) {
      Alert.alert(
        strings.CHANGE_PASSWORD,
        strings.PASS_NOT_MATCH,
        [{ text: strings.CANCEL },
        { text: strings.OK },],
      );
    } else {
      resetPassword();
    }
  };

  const profileData = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(res => {
        // console.log('Profile responce => ', res);
        setData(res);
      })
      .catch(error => {
        console.log('Profile error => ', error);
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
        }
      });
  };

  const logout2 = async () => {
    setLoder(true)
    setTimeout(async () => {
      setLoder(false);

      navigation.navigate('signin');
      await AsyncStorage.removeItem('traderToken');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }, 2000);

  };

  const resetPassword = async () => {
    setLoder(true);
    const params = {
      customerId: data?.id,
    };
    const senddata = {
      currentPassword: oldPassword,
      newPassword: password,
    };
    PutRequest('customers/me/password?', senddata, params, 'admin')
      .then(async res => {
        setLoder(false);
        console.log('change password responce => ', res);
        if (res.message) {
          Alert.alert(strings.CHANGE_PASSWORD, res?.message, [
            { text: strings.CANCEL },
            { text: strings.OK , 
              // onPress: () => {
              // navigation.navigate('drawer')}
            },
          ]);
        } else {
          Alert.alert(
            strings.CHANGE_PASSWORD,
            strings.CHANGE_PASS_SUCCESS,
            [
              { text: strings.CANCEL },
              {
                text: strings.OK,
                onPress: () => {
                  // navigation.navigate('drawer');
                  setOldPassword(''), setPassword(''), setConfirmPassword('');
                },
              },
            ],
          );
        }
      })
      .catch(error => {
        setLoder(false);
        console.warn('change password error => ', error.response);
        Alert.alert(strings.CHANGE_PASS_FAIL, strings.LOGIN_FAIL2, [
          { text: strings.CANCEL },
          { text: strings.OK },
        ]);
      });
  };

  useEffect(() => {
    selectedLng
    profileData();
  }, []);

  selectedLng = async () => {
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
    console.warn("selected Language data==>>>", lngData)
  }






//   conditions = () => {
//     const { oldpassword, password, cpassword } = this.state;
//     if (oldpassword == '') {
//         this.setState({ oldpassworderror: '' })
//     }

//     if (password == '' || password.length >= 8) {
//         this.setState({ passworderror: '' })
//     }

//     if (cpassword == '' || password == cpassword) {
//         this.setState({ cpassworderror: '' })
//     }
// }

  return (
    <View style={styles.container}>
    <Header title={strings.CHANGE_PASSWORD} navigation={navigation} icon="back" />
      <View style={{ paddingHorizontal: 30, flex: 1, justifyContent: 'center' }}>
        <Input
          placeholder={strings.OLD_PASS}
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
              source={require('../../Assets/password.png')}
              style={{ width: 25, height: 25 }}
            />
          }
          errorStyle={{ display: 'none' }}
          onChangeText={e => setOldPassword(e)}
          value={oldPassword}
        />
        <Input
          placeholder={strings.NEWPASSWORD}
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
              source={require('../../Assets/password.png')}
              style={{ width: 25, height: 25 }}
            />
          }
          errorStyle={{ display: 'none' }}
          onChangeText={e => setPassword(e)}
          value={password}
        />
        <Input
          placeholder={strings.CONFIRM_PASSWORD}
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
              source={require('../../Assets/password.png')}
              style={{ width: 25, height: 25 }}
            />
          }
          errorStyle={{ display: 'none' }}
          onChangeText={e => setConfirmPassword(e)}
          value={confirmPassword}
        />
        <ButtonDark handleClick={() => submit()} title={strings.UPDATE} />
      </View>
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
