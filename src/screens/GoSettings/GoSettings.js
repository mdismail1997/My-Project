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
import { TextInput } from 'react-native-paper';
import { Header2, Header4 } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUserToken } from '../../storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import { supabase } from '../../supabase/supabaseClient';
export const GoSettings = (props) => {
  const [loading, setLoding] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, color: '#fff', backgroundColor: '#fff' }}>
      <Header4 title="Settings" navProps={props.navigation} />
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
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20, marginTop: 20 }}
          onPress={async () => {
            let userrole = await AsyncStorage.getItem('role');
            if (userrole === 'Patient') {
              props.navigation.navigate('PatientEditProfile', { counrtyname: props.route.params.counrtyname });
            } else {
              props.navigation.navigate('EditProfile');
            }
          }}
        >
          <Image
            source={require('../../Assets/edit.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}>Edit Profile</Text>
          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
          onPress={() => props.navigation.navigate('SettingScreen')}
        >
          <Image
            source={require('../../Assets/password.png')}
            resizeMode={'contain'}
            style={[styles.img, {
              height: 20, width: 20, marginLeft: 30,
              marginTop: 15,
            }]}
          />
          <Text style={styles.text}>Change Password</Text>
          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
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
    height: 25,
    width: 25,
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
