import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, Text } from 'react-native-paper';
import { Header, Header3, Header5 } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUserToken } from '../../../storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import { countBy } from 'lodash';
export const PatientProfile = (props) => {
  useEffect(() => {
    getdata();
  }, []);
  const [loading, setLoding] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, SetImage] = useState('');
  const [counrtyname, setCountryname] = useState('');
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
        console.warn(response.data);
        setLoding(false);
        setName(response.data.response.name);
        setEmail(response.data.response.email);
        SetImage(response.data.response.profile_image);
        setCountryname(response.data.response.country);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const Logout = async () => {
    await Apis.logout()

      .then((response) => {
        AsyncStorage.removeItem('authtoken');
        console.warn('responsedata=================>', response.data);
        props.navigation.replace('Intro');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getdata();

      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, [props.navigation]);
  return (
    <SafeAreaView style={{ flex: 1, color: '#fff', backgroundColor: '#fff' }}>
      <Header title="Profile" navProps={props.navigation} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView
        style={{ marginTop: 20 }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={{
            marginLeft: 20,
            alignSelf: 'flex-start',
            borderRadius: 55,
            height: 80,
            width: 80,
          }}
          onPress={() => props.navigation.navigate('PatientEditProfile', { counrtyname: counrtyname })}
        >
          <Image
            style={{ borderRadius: 40, height: 80, width: 80 }}
            source={{ uri: image }}
          />

          <TouchableOpacity
            style={{
              height: 35,
              width: 35,
              borderRadius: 20,
              position: 'absolute',
              left: 55,
              top: 45,
            }}
            onPress={() => props.navigation.navigate('PatientEditProfile', { counrtyname: counrtyname })}
          >
            <Image
              source={require('../../../Assets/edit.png')}
              resizeMode={'contain'}
              style={{
                height: '75%',
                width: '75%',
                borderRadius: 10,
                alignSelf: 'center',
                marginTop: 5,
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>

        <Text
          style={{
            marginLeft: 120,
            position: 'absolute',
            fontSize: 10,
            color: '#000',
          }}
        >
          #PT12345
        </Text>
        <View style={{ marginTop: -50 }}>
          <Text
            style={{
              marginLeft: 120,
              position: 'absolute',
              marginTop: 10,
              color: '#000',
              fontSize: 15,
              fontWeight: 'bold',
              width: '60%',
            }}
          >
            {name}
          </Text>

          <Text
            style={{
              marginLeft: 120,
              position: 'absolute',
              marginTop: -10,
              color: '#000',
            }}
          >
            {email}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            borderRadius: 20,
            position: 'absolute',
            alignSelf: 'flex-end',
          }}
          onPress={() => props.navigation.navigate('PatientOverview')}
        >
          <Image
            source={require('../../../Assets/edit1.png')}
            resizeMode={'contain'}
            style={{ height: '85%', width: '85%', borderRadius: 10 }}
          />
        </TouchableOpacity>
        <View style={styles.verticleLin}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
          onPress={() => props.navigation.navigate('Notification')}
        >
          <Image
            source={require('../../../Assets/bellbox.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Notification</Text>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
          onPress={() => props.navigation.navigate('AboutUs')}
        >
          <Image
            source={require('../../../Assets/about.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}>About Us</Text>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
          onPress={() => props.navigation.navigate('PrivacyPolicy')}
        >
          <Image
            source={require('../../../Assets/privacy.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Privacy Policy</Text>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
          onPress={() => props.navigation.navigate('TermsAndCondition')}
        >
          <Image
            source={require('../../../Assets/terms.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Terms and conditions</Text>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
          onPress={() => props.navigation.navigate('GoSettings')}
        >
          <Image
            source={require('../../../Assets/setting.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Settings</Text>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
          // onPress={async () => {
          //   await AsyncStorage.removeItem('authtoken');
          //   await deleteUserToken();
          //   props.navigation.navigate('SelectScreen');
          // }}
          onPress={Logout}
        >
          <Image
            source={require('../../../Assets/logout.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  verticleLine: {
    height: 2,
    width: '90%',
    backgroundColor: '#909090',
    marginLeft: 10,
    marginTop: 10,
    opacity: 0.3,
  },
  verticleLin: {
    height: 2,
    width: '90%',
    backgroundColor: '#909090',
    marginLeft: 10,
    marginTop: 60,
    opacity: 0.3,
  },
  arrowimg: {
    height: 30,
    width: 30,
    borderRadius: 10,
    marginTop: 10,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  text: {
    position: 'absolute',
    marginLeft: 80,
    marginTop: 15,
    color: '#2173A8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 5,
  },
});
