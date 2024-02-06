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
import { TextInput, Switch, Paragraph, Text } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { RFValue } from 'react-native-responsive-fontsize';
import * as RNLocalize from 'react-native-localize';
export const NoteList = (props) => {
  const [loading, setLoding] = useState(false);
  const [alldata, setAllData] = useState([]);

  const NoteList = async () => {


    const data = {
      booking_id: props.route.params.booking_id
    };
    console.log('data--------', data);
    setLoding(true);
    await Apis.notelist(data)

      .then((response) => {
        setLoding(false);
        console.warn(response.data);
        setAllData(response.data.data);
        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);

      });
  };



  useEffect(() => {

    NoteList()
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, color: '#fff', backgroundColor: '#fff' }}>
      <Header title="Consultation Notes" navProps={props.navigation} />
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
        // style={{ marginTop: 20 }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        {alldata.map((el, i) => (
          <View
            style={{
              marginTop: 10,
              backgroundColor: 'white',
              width: '90%',
              borderRadius: 15,
              elevation: 2,
              alignSelf: 'center',
              marginBottom: 10,
              borderColor: '#ddd', borderWidth: 1
            }}
          >
            {/* <Image
              source={{ uri: image }}
              style={{ width: 90, height: 90, borderRadius: 15 }}
              resizeMode={'cover'}
            /> */}
            <View
              style={{
                //justifyContent: 'space-around',
                // marginLeft: 5,
                //width: '95%',
                paddingHorizontal: 10
              }}
            >
              <Text
                style={{
                  fontSize: RFValue(13),
                  marginTop: 5,
                  //paddingHorizontal: 7,
                  textAlign: 'center',
                  color: '#000',
                  // width: '100%',
                  fontWeight: 'bold'
                  //  backgroundColor: 'red'
                }}
              >
                {el.date}, {el.day}
              </Text>
              <Text
                style={{
                  fontSize: RFValue(13),
                  // marginTop: 5,
                  paddingVertical: 5,
                  //  textAlign: 'center',
                  color: '#000',
                  // width: '100%',
                  // backgroundColor: 'red'
                }}
              >{el.note}
              </Text>
            </View>
          </View>

        ))}
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
    marginLeft: 20,
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 5,
  },
});
