import React, { useState, useEffect } from 'react';
import * as Apis from '../Services/apis';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Text } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import { useDispatch } from 'react-redux';
import { setTempUserType } from '../../redux';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

const patientImage = require('../../Assets/patient.png')
const doctorImage = require('../../Assets/doctorType.png')

export const SelectScreen = (props) => {
  const [state, setState] = React.useState({ open: false });
  const [email, setEmail] = React.useState('');
  const [password, setPassWord] = React.useState('');
  const onStateChange = ({ open }) => setState({ open });
  const [intro, setIntro] = React.useState();
  const { open } = state;
  const dispatch = useDispatch();
  const [data, setdata] = useState([]);
  const [loading, setLoding] = useState(false);
  const getuser = async () => {
    setLoding(true);
    let intro = await AsyncStorage.getItem('introscreen')
    setIntro(intro)
    const response = await Apis.getuser();
    setdata(response.data.response);
    console.log('user types', response.data.response)
    setLoding(false);
    try {
    } catch (error) {
      console.error(error.response.data);
    }
  };

  useEffect(() => {
    getuser();
  }, []);
  useEffect(() => {
    retrieveData();
    console.log('==>>>', password, email);
  }, [email, password]);
  const retrieveData = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const password = await AsyncStorage.getItem('password');
      const mail = await AsyncStorage.getItem('mail');

      setEmail(mail);
      setPassWord(password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {intro === 'true' ? <Text
        style={{
          marginLeft: 35,
          fontSize: 20,
          //  fontFamily: 'Roboto-Bold',
          color: '#333333',
          width: "85%",
          marginTop: 30,
          paddingVertical: 15
        }}
      >
        User Type</Text> : <Header title="User Type" navProps={props.navigation} />}
      {/* <Header title="User Type" navProps={props.navigation} /> */}
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}


      <ScrollView>
        <Text style={styles.text1}>Select User Type</Text>
        {/* <Text style={styles.text2}>
          It is a long established fact that a reader will be distracted by the
          readable.
        </Text> */}

        {/* {data.map((el, i) => renderData(el.role, i))} */}
        {data.map(item => (
          <TouchableOpacity
            onPress={() => {
              dispatch(setTempUserType(item.role));
              console.log('asyncvalue', email, password);
              props.navigation.navigate('LogIn', {
                email: email,
                password: password,
              });
            }}
            style={[item.role === 'doctor' ? styles.uncheckborder : styles.checkborder]}
          >
            <Image
              style={item.role === 'patient' ? styles.img : styles.setimg}
              source={{ uri: item.img }}
            />
            <View />

            <Text style={[item.role === 'doctor' ? styles.text : styles.settext]}>
              {item.role}
            </Text>
            <Image
              style={item.role === 'patient' ? styles.imgtick : styles.imgtick2}
              source={require('../../Assets/tick.png')}
            />
          </TouchableOpacity>
        ))}
        <Image
          style={{
            width: 150,
            height: 150,
            //  alignSelf: 'center',
            marginTop: 30,
            marginLeft: 50,
          }}
          source={require('../../Assets/selecttype.png')}
        />

        {/* <TouchableOpacity
          style={styles.fab}
          onPress={() => props.navigation.navigate('QuickVerify')}
        >
          <Image
            source={require('../../Assets/quickvisit.png')}
            style={{
              tintColor: '#ffffff',
              alignSelf: 'center',
              marginTop: 25,
              justifyContent: 'space-between',
            }}
          />
        </TouchableOpacity> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#146BCE',
    tintColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  checkborder: {
    borderColor: '#fff',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 25,
    borderRadius: 10,
    height: 55,
    width: '80%',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    //  shadowColor: '#2173A8',
    // shadowOffset: {
    //   width: 20,
    //   height: 20,
    // },
    borderColor: '#ddd',
    borderWidth: 1,
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'center',
    elevation: 5,
  },

  uncheckborder: {
    flexDirection: 'row',
    borderColor: '#ddd',
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 25,
    borderRadius: 10,
    height: 55,
    width: '80%',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    elevation: 5,
  },
  img: {
    width: 25,
    height: 32,
    resizeMode: 'contain',
    right: 5,
    alignSelf: 'center',
    marginLeft: 20,
  },
  setimg: {
    width: 25,
    height: 32,
    resizeMode: 'contain',
    right: 5,
    alignSelf: 'center',
    marginLeft: 20,
    tintColor: '#000',
  },
  text: {
    marginTop: 15,
    color: '#2173A8',
    fontSize: 15,
    marginRight: 60,
  },
  settext: {
    marginTop: 15,
    color: '#000',
    fontSize: 15,
    marginRight: 60,
  },
  imgtick: {
    width: 20,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 20,
  },
  imgtick2: {
    width: 20,
    height: 22,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginRight: 20,
    tintColor: '#000',
  },
  text1: {
    color: '#000',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 30,
  },
  text2: {
    color: '#000',
    fontSize: 15,
    marginTop: 15,
    marginLeft: 30,
  },
});
