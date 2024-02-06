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
import {
  Text,
  TextInput,
  Button,
  Searchbar,
  Paragraph,
} from 'react-native-paper';
import { Header3 } from '../../../components/Header/Header';
import { Header } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { Rating } from 'react-native-ratings';
import * as RNLocalize from 'react-native-localize';
export const SkillListing = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [alldata, setAlldata] = React.useState([]);
  const [dataall, setDataall] = React.useState([]);
  const [datavoice, setDataVoice] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const [msg, setMsg] = React.useState(true);
  const [video, setVideo] = React.useState(false);
  const [voice, setVoice] = React.useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);

  const getavoicehistory = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      specility_id: props.route.params?.id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log(data);
    setLoding(true);
    Apis.skilllisting(data)

      .then((response) => {
        console.log('first', response.data);
        setDataVoice(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getavoicehistory();
      // setUpcoming(true);
      // setCompleted(false);
      console.log('special', props.route.params?.specialistName)
    });
    return unsubscribe;
  }, [props.route.params?.id]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={props.route.params?.specialistName} navProps={props.navigation} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}

      <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>
        {datavoice?.map((el, i) => (
          <View style={styles.uncheckborder}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('DoctorProfile', { id: el.id })
              }
            >
              <Image
                style={styles.imgtick}
                source={{ uri: el.profile_image }}
              />
              {/* // source={el.profile_image} */}
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 100,
                  //  marginTop: 10,
                  // position: 'absolute',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                {el.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  //  marginTop: 25,
                  marginLeft: 100,
                }}
              >
                <Rating
                  fractions={2}
                  startingValue={el.rating ?? 0}
                  imageSize={20}
                  ratingCount={5}
                  readonly={true}
                />
                <View style={{
                  backgroundColor: 'green',
                  width: '12%',
                  alignSelf: 'center',
                  marginLeft: 10,
                }}>
                  <Text
                    style={{
                      color: '#fff',
                      textAlign: 'center',
                      marginRight: 3
                    }}
                  >
                    {/* {el.rating} */} {el.rating_count}
                  </Text>
                </View>

              </View>
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 100,
                  marginTop: 5,
                  fontSize: 10,
                  paddingBottom: 10
                }}
              >
                {el.speciality}
              </Text>
              {/* <View>
                  <Image
                    style={{
                      width: 40,
                      height: 42,
                      resizeMode: 'contain',
                      alignSelf: 'flex-end',
                      marginTop: -50,
                      marginRight: 20,
                    }}
                    source={require('../../../Assets/rightarrow.png')}
                  />
                </View> */}
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({

  uncheckborder: {
    backgroundColor: '#fff',
    // borderColor: '#000',
    // borderWidth: 1,
    alignSelf: 'center',
    elevation: 5,
    // height: 100,
    marginBottom: 10,
    borderRadius: 10,
    width: '90%',

  },
  img: {
    width: 25,
    height: 32,
    resizeMode: 'contain',
    right: 5,
    alignSelf: 'center',
    marginRight: 30,
  },
  text: {
    marginTop: 15,
    color: '#737373',
    fontSize: 15,
    marginRight: 150,
  },
  imgtick: {
    width: 50,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
    marginLeft: 20,
    marginTop: 5,
  },
  imgtick2: {
    width: 30,
    height: 35,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 5,
  },
  text1: {
    color: '#333333',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 100,
    marginLeft: 30,
  },
  text2: {
    color: '#737373',
    fontSize: 15,
    marginTop: 20,
    marginLeft: 30,
  },
  selecttext: { color: '#fff', fontSize: 12 },
  selectnottext: { color: '#2173A8', fontSize: 12 },
});
