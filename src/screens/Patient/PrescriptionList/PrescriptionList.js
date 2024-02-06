import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import { Text, TextInput, Button, Searchbar, Drawer } from 'react-native-paper';
import { Header } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
export const PrescriptionList = (props) => {
  useEffect(() => {
    getPrescriptiondetails();
  }, []);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [medicine, setMedicine] = useState('');
  const [loading, setLoding] = useState(false);
  const [alldata, setAlldata] = useState([]);
  const [prescription, SetPrescription] = useState([]);
  const onChangeSearch = (query) => setSearchQuery(query);
  const getPrescriptiondetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      patient_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    setLoding(true);
    await Apis.prescriptionlist(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setAlldata(response.data.response);

        let arr = [];
        for (var i = 0; i <= response.data.response.length; i++) {
          arr.push(response.data.response[i].prescription_path);
          console.warn(arr);
          SetPrescription(arr);
          // console.log('pres----', response.data.response[i].prescription_path);
        }

        // setSelectRoute(response.data.response.route_id);

        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);
      })
      .catch((error) => {
        setLoding(false);
        console.error(error.response);
      });
  };
  console.log('data---->>>>', alldata);
  const data = [
    {
      id: 1,
      img: require('../../../Assets/drstive.png'),
      title: 'Dr.Stive',
      description: '19 May, 2002',
      subtitle: 'Monday, 09.00AM - 09.30AM',
      image: require('../../../Assets/download.png'),
      text: 'Prescription Download',
    },

    {
      id: 2,
      img: require('../../../Assets/dejerome.png'),
      title: 'Dr.Sanjay',
      description: '19 May, 2002',
      subtitle: 'Monday, 09.00AM - 09.30AM',
      image: require('../../../Assets/download.png'),
      text: 'Prescription Download',
    },
  ];

  const renderdata = ({ item, index }) => {
    return (
      <View style={styles.uncheckborder}>
        <Text
          style={{
            color: 'grey',
            marginLeft: 10,
            fontSize: 10,
            marginTop: 10,
          }}
        >
          {item.description}
        </Text>
        <Text
          style={{
            color: 'grey',
            marginLeft: 10,
            fontSize: 10,
          }}
        >
          {item.subtitle}
        </Text>
        <Text
          style={{
            color: '#2173A8',
            marginLeft: 10,
            fontSize: 10,
          }}
        >
          {medicine}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Image
            style={{
              width: 10,
              height: 12,
              resizeMode: 'contain',

              alignSelf: 'center',
              marginLeft: 10,
            }}
            source={item.image}
          />
          <Text
            style={{
              color: '#2173A8',
              marginLeft: 10,
              fontSize: 10,
            }}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  // if (alldata.length <= 0) {
  //   return (
  //     <View>
  //       <Header title="Prescription List" navProps={props.navigation} />
  //       <Text style={{ marginTop: 30, alignSelf: 'center', color: '#000', fontSize: 15 }}>No Prescription List found</Text>
  //     </View>
  //   )
  // }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

      <Header title="Prescription List" navProps={props.navigation} />

      {/* <Searchbar
        style={{
          maxHeight: 50,
          width: '80%',
          marginLeft: 15,
          borderRadius: 10,
          marginTop: 20,
        }}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />

      <View
        style={{
          alignSelf: 'flex-end',
          marginTop: -45,
          width: 40,
          height: 40,
          borderRadius: 10,
          marginRight: 10,
          backgroundColor: '#fff',
        }}
      >
        <Image
          style={styles.imgtick2}
          source={require('../../../Assets/line.png')}
        />
      </View> */}
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView style={{ marginBottom: 20 }}>


        {
          alldata?.length < 1 || alldata == null ?
            (
              <Text style={{ color: '#000', textAlign: 'center', marginTop: 10 }}>No Prescription Available</Text>
            ) :
            alldata.map((el, i) => (
              <View style={styles.uncheckborder}>
                <TouchableOpacity>
                  <Image
                    style={styles.imgtick}
                    source={{ uri: el.profile_image }}
                  />

                  <Text
                    style={{
                      color: '#333333',
                      marginLeft: 90,
                      marginTop: 10,
                      position: 'absolute',
                      fontSize: 15,
                      fontWeight: 'bold',
                      //backgroundColor: 'red'
                    }}
                  >
                    {el.doctor}
                  </Text>

                  <Text
                    style={{
                      marginLeft: 90,
                      marginTop: 35,
                      color: '#737373',
                      fontSize: 10,
                    }}
                  >
                    {el.date}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 90,
                      marginTop: 5,
                      color: '#737373',
                      fontSize: 10,
                    }}
                  >
                    {el.slot_start} - {el.slot_end}
                  </Text>
                  <Text
                    style={{
                      marginLeft: 90,
                      //marginTop: 3,
                      color: '#737373',
                      fontSize: 11,
                    }}
                  >
                    ConsultationType:{' '}
                    <Text
                      style={{
                        marginLeft: 90,
                        marginTop: -3,
                        color: '#2173A8',
                        fontSize: 13,
                      }}
                    >
                      {el.consultation_type}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      //backgroundColor: 'blue',
                      marginTop: -40,
                      marginRight: 10,
                      alignSelf: 'flex-end',
                    }}
                    onPress={() =>
                      props.navigation.navigate('PatientChngMed', {
                        pres_id: el.prescription_id,
                        book_id: el.booking_id,
                      })
                    }
                  >
                    <Image
                      style={{
                        width: 15,
                        height: 15,
                        resizeMode: 'contain',
                        tintColor: '#2173A8',
                        alignSelf: 'center',
                        marginLeft: 10,
                      }}
                      source={require('../../../Assets/chngmedicine.png')}
                    />
                    <Text
                      style={{
                        color: '#2173A8',
                        marginLeft: 5,
                        fontSize: 12,
                      }}
                    >
                      Change Medicine
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 28,
                      marginBottom: 30,
                      marginLeft: 79,

                    }}
                    onPress={() => Linking.openURL(prescription[i])}
                  >
                    <Image
                      style={{
                        width: 10,
                        height: 12,
                        resizeMode: 'contain',

                        alignSelf: 'center',
                        marginLeft: 10,
                      }}
                      source={require('../../../Assets/download.png')}
                    />
                    <Text
                      style={{
                        color: '#2173A8',
                        marginLeft: 10,
                        fontSize: 12,
                      }}
                    >
                      View prescription
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
                <View></View>
              </View>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    borderColor: '#fff',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 20,
    borderRadius: 10,
    height: 90,
    width: '80%',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    elevation: 0,
  },

  uncheckborder: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'center',
    elevation: 0,
    height: 110,
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 1
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
    color: '#000',
    fontSize: 15,
    marginRight: 80,
  },
  imgtick: {
    width: 70,
    height: 80,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
    marginLeft: 5,
    marginTop: 15,
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
});
