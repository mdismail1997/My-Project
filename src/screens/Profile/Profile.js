import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { Header2, Header3, Header4 } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUserToken } from '../../storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import { supabase } from '../../supabase/supabaseClient';
export const Profile = (props) => {
  useEffect(() => {
    getdata();
  }, []);
  const [loading, setLoding] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, SetImage] = useState('');
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
    await Apis.doctorprofileData(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setName(response.data.response.name);
        setEmail(response.data.response.email);
        SetImage(response.data.response.profile_image);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const Logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }
    await Apis.logout()

      .then((response) => {
        AsyncStorage.removeItem('authtoken');
        console.warn('responsedata=================>', response.data);
        props.navigation.replace('SelectScreen');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  return (
    <SafeAreaView style={{ flex: 1, color: '#fff', backgroundColor: '#fff' }}>
      <Header4 title="Profile" navProps={props.navigation} />
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
        style={{}}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={{
            marginLeft: 20,
            alignSelf: 'flex-start',
            borderRadius: 55,
            height: 80,
            width: 80,
          }}
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
            onPress={() => props.navigation.navigate('EditProfile')}
          >
            <Image
              source={require('../../Assets/edit.png')}
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
        </View>

        <Text style={{ marginLeft: 120, position: 'absolute', fontSize: 10 }}>
          #DT0055
        </Text>
        <Text
          style={{
            marginLeft: 120,
            position: 'absolute',
            marginTop: 20,
            color: '#000',
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            marginLeft: 120,
            position: 'absolute',
            marginTop: 40,
            color: '#000',
            width: '60%',
          }}
        >
          {email}
        </Text>
        {/* <TouchableOpacity
          style={{
            height: 45,
            width: 45,
            borderRadius: 20,
            position: 'absolute',
            alignSelf: 'flex-end',
          }}
          onPress={() => props.navigation.navigate('EditProfile')}
        >
          <Image
            source={require('../../Assets/edit1.png')}
            resizeMode={'contain'}
            style={{
              height: '85%',
              width: '85%',
              borderRadius: 10,
              marginTop: 20,
            }}
          />
        </TouchableOpacity> */}
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
        >
          <Image
            source={require('../../Assets/bellbox.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Notification</Text>
          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
        >
          <Image
            source={require('../../Assets/about.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}>About Us</Text>
          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
        >
          <Image
            source={require('../../Assets/privacy.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Privacy Policy</Text>
          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
        >
          <Image
            source={require('../../Assets/terms.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Terms and conditions</Text>
          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
        >
          <Image
            source={require('../../Assets/setting.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Settings</Text>
          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
          onPress={Logout}
        >
          <Image
            source={require('../../Assets/logout.png')}
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
    color: '#333333',
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
