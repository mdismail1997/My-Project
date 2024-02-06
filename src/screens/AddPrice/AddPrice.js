import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Text, TextInput, Button, Caption, Snackbar } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import { SuccessfullySubmitModal } from '../../components/Popupmessage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';

export const AddPrice = (props) => {
  const [loading, setLoding] = useState(false);
  const [videofees, setVideofees] = useState();
  const [audiofees, SetAudiofees] = useState();
  const [chatfees, SetChatfees] = useState();
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [isModalVisible, SetIsModalVisible] = useState();
  const [update, setUpdate] = useState('');
  useEffect(() => {
    GetFees();
  }, []);
  const GetFees = async (values) => {
    setLoding(true);
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);

      const Fees = {
        user_id: user_id,
      };
      console.log('Fees----------', Fees);
      const response = await Apis.getfees(Fees);
      setLoding(false);
      console.log(response.data);
      setUpdate(response?.data?.success)
      SetChatfees(response?.data?.response?.fee_chat);
      setVideofees(response?.data?.response?.fee_video);
      SetAudiofees(response?.data?.response?.fee_audio);
      console.log('uid==', response.data.user_id);
    } catch (err) {
      console.error(err);
      setLoding(false);
      setError((dat) => ({
        ...dat,
        iserror: true,
        message: err.response,
      }));
    }
  };

  const AddSchedule = async (values) => {
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);

      const Fees = {
        user_id: user_id,
        fee_video: videofees,
        fee_audio: audiofees,
        fee_chat: chatfees,
      };

      console.log('Fees----------', Fees);

      const response = await Apis.doctorfeesupdate(Fees);

      console.log(response.data);
      if (response.data.success === '0') {
        setError((dat) => ({
          ...dat,
          iserror: true,
          message: response.data.message,
        }));
      } else {
        SetIsModalVisible(true);
      }
      console.log('uid==', response.data.user_id);
    } catch (err) {
      console.error(err.response);
      setError((dat) => ({
        ...dat,
        iserror: true,
        message: err.response,
      }));
    }
  };
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  const handleClose = () => {
    SetIsModalVisible(false);
  };
  if (isModalVisible === false) {
    props.navigation.navigate('Account');
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Consultation Fees" navProps={props.navigation} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656', zIndex: 100 }}
      >
        {error.message}
      </Snackbar>
      <ScrollView>
        {/* <Caption
          style={{ fontSize: 15, color: '#000', marginHorizontal: '7.5%' }}
        >
          Chat Consultation
        </Caption> */}
        <View
          style={{
            marginHorizontal: '7.5%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <TextInput
            mode="outlined"
            label="Chat Consultation"
            placeholder=""
            value={chatfees}
            onChangeText={(text) => SetChatfees(text)}
            style={{ width: '60%', backgroundColor: '#fff' }}
            left={<TextInput.Affix text="$" textStyle={{ color: '#000' }} />}
            keyboardType={'number-pad'}
            maxLength={3}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
          <Text style={{ fontSize: 25, color: '#000' }}> /</Text>

          <Text style={{ fontSize: 14, color: '#000' }}>Per Consultation</Text>
        </View>
        {/* <Caption
          style={{ fontSize: 15, color: '#000', marginHorizontal: '7.5%' }}
        >
          Audio Consultation
        </Caption> */}
        <View
          style={{
            marginHorizontal: '7.5%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <TextInput
            mode="outlined"
            label="Audio Consultation"
            value={audiofees}
            onChangeText={(text) => SetAudiofees(text)}
            style={{ width: '60%', backgroundColor: '#fff' }}
            left={<TextInput.Affix text="$" textStyle={{ color: '#000' }} />}
            keyboardType={'number-pad'}
            maxLength={3}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
          <Text style={{ fontSize: 25, color: '#000' }}> /</Text>

          <Text style={{ fontSize: 14, color: '#000' }}>Per Consultation</Text>
        </View>
        {/* <Caption
          style={{ fontSize: 15, color: '#000', marginHorizontal: '7.5%' }}
        >
          Video Consultation
        </Caption> */}
        <View
          style={{
            marginHorizontal: '7.5%',
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <TextInput
            mode="outlined"
            label="Video Consultation"
            placeholder=""
            value={videofees}
            onChangeText={(text) => setVideofees(text)}
            style={{ width: '60%', backgroundColor: '#fff' }}
            left={<TextInput.Affix text="$" textStyle={{ color: '#000' }} />}
            keyboardType={'number-pad'}
            maxLength={3}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
          <Text style={{ fontSize: 25, color: '#000' }}> /</Text>

          <Text style={{ fontSize: 14, color: '#000' }}>Per Consultation</Text>
        </View>

        <TouchableOpacity onPress={AddSchedule} style={styles.checkborder}>
          <Image
            style={styles.img}
            source={require('../../Assets/googlepay.png')}
          />

          <Text style={styles.text}> {update === '0' ? 'Add' : 'Update'} Fees</Text>
        </TouchableOpacity>
      </ScrollView>
      <SuccessfullySubmitModal
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    borderColor: '#2173A8',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 25,
    borderRadius: 10,
    height: 55,
    width: '85%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    alignSelf: 'center',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  img: {
    width: 35,
    height: 47,
    resizeMode: 'contain',
  },
  text: {
    color: '#2173A8',
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Rubik',
    marginLeft: 10
  },
});
