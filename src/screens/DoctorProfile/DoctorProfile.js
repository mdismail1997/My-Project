import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { Button, Paragraph, Text, Snackbar } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { Header2, Header3, Header4 } from '../../components/Header/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Rating } from 'react-native-ratings';
import { RFValue } from 'react-native-responsive-fontsize';
export const DoctorProfile = (props) => {
  const [loading, setLoding] = useState(false);
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [image, SetImage] = useState('');
  const [speciality, SetSpeciality] = useState('');
  const [rating, SetRating] = useState('');
  const [ratingCount, SetRatingcount] = useState('');
  const [Consultation, SetConsultation] = useState('');
  const [searchdoctor, setSearchDoctor] = useState([]);
  const [favourite, SetFavourite] = React.useState(false);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [err, setErr] = React.useState({ iserr: false, message: '' });
  // console.log('props=============>', props);

  useEffect(() => {
    console.log('id========>', props.route.params?.id);

    const getdoctordata = async () => {
      const data = {
        doctor_id: props.route.params?.id,
      };

      setLoding(true);
      await Apis.doctorprofile(data)

        .then(async (response) => {
          console.warn('doc data=========', response.data);
          setLoding(false);
          setName(response.data.response.name);
          setAbout(response.data.response.about);
          SetSpeciality(response.data.response.speciality);
          SetImage(response.data.response.profile_image);
          SetRating(response.data.response.rating);
          SetConsultation(response.data.response.consultation);
          SetRatingcount(response.data.response.rating_count);
        })
        .catch((error) => {
          console.error(error.response);
          setLoding(false);
        });
    };

    getdoctordata();
    CheckFavourite()
  }, [props.route.params?.id]);
  const ProfileUpdateCheck = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    console.log('jjjj', user_id);
    let token = usertoken;
    const data = {
      user_id: user_id,
    };

    setLoding(true);
    await Apis.profilestatus(data)

      .then((response) => {
        console.warn('updatedata', response.data);
        // eslint-disable-next-line prettier/prettier
        if (response.data.success === '1') {
          props.navigation.navigate('BookAppointment', {
            id: props.route.params?.id,
          })
        }
        // eslint-disable-next-line prettier/prettier
        else {
          //  Alert.alert('Please update your profile')

          Alert.alert(
            'Alert',
            //body
            'Please update your profile',

            [
              {
                text: 'Proceed',
                onPress: () =>
                  //  setTimeout(() => {
                  props.navigation.navigate('PatientEditProfile')
                // }, 2500)
              },
              // { text: 'Gallery', onPress: () => GalleryPicker() },
              { text: 'Not Now', onPress: () => null },
            ],
            { cancelable: true }
            //clicking out side of alert will not cancel
          );
          // onPress={() => {
          //   setShowModal(false),
          //     props.navigation.navigate('ProblemList', {
          //       mail: mail,
          //       userid: user_id,
          //       birthyear: birthyear,
          //       gender: gender,
          //     });
          // }}

        }
        setLoding(false);
      })
      .catch((error) => {
        console.error('errrrr', error.response);
        setLoding(false);
      });
  };
  const AddFavourite = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    const data = {
      doctor_id: props.route.params?.id,
      patient_id: user_id,
    };

    // setLoding(true);
    await Apis.addfauvarite(data)

      .then((response) => {
        console.warn(response.data);
        if (response.data.success === '1') {
          SetFavourite(true);
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
          setErr(() => ({

            iserr: false

          }));
        } else {
          SetFavourite(false);
          setErr((data) => ({
            ...data,
            iserr: true,
            message: response.data.message,
          }));
        }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  const CheckFavourite = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    const data = {
      doctor_id: props.route.params?.id,
      patient_id: user_id,
    };

    // setLoding(true);
    await Apis.checkfauvarite(data)

      .then((response) => {
        console.warn('kkkkoo', response.data);
        if (response.data.success === '1') {
          SetFavourite(true);
        } else {
          SetFavourite(false);
        }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setErr((data) => ({ ...data, iserr: false, message: '' }));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
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
        <Header4 title="Doctor Profile" navProps={props.navigation} />
        {/* <Text
          style={{
            fontSize: 20,
            color: '#2173A8',
            marginTop: 30,
            marginLeft: 20,
          }}
        >
          Doctor Profile
        </Text> */}
        {/* <View
          style={{
            marginLeft: 20,
            marginTop: 20,
            alignSelf: 'center',
            borderRadius: 55,
            height: 80,
            width: 80,
          }}
        >
          <Image
            source={{ uri: image }}
            style={{ height: 80, width: 80, borderRadius: 55 }}
          />
        </View>
        <Text style={{ textAlign: 'center', marginTop: 10 }}> {name}</Text>
        <View> */}
        <View
          style={{
            marginTop: 10,
            //  backgroundColor: 'red',
            width: '90%',
            borderRadius: 15,
            //  elevation: 5,
            alignSelf: 'center',
            borderColor: '#ddd',
            borderWidth: 1
          }}
        >
          <View
            style={{ flexDirection: 'row', alignItems: 'center', margin: 8 }}
          >
            <Image
              source={{ uri: image }}
              style={{ width: 80, height: 100, borderRadius: 15, borderWidth: 1, borderColor: '#ddd' }}
              resizeMode={'contain'}
            />
            <View
              style={{
                justifyContent: 'space-around',
                marginLeft: 25,
                width: '60%',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  marginTop: 5,
                  color: '#000',
                  fontWeight: 'bold',
                }}
              >
                {name}
              </Text>
              <TouchableOpacity
                onPress={() => AddFavourite()}
                style={{ alignItems: 'flex-end' }}
              >
                {favourite ? (
                  <AntDesign
                    name="heart"
                    size={30}
                    color="#2173A8"
                    style={{
                      position: 'absolute',
                      zIndex: 9999,
                      marginTop: -25,
                      marginRight: 10,
                    }}
                  />
                ) : (
                  <AntDesign
                    name="hearto"
                    size={30}
                    color="#2173A8"
                    style={{
                      position: 'absolute',
                      zIndex: 9999,
                      marginTop: -25,
                      marginRight: 20,
                    }}
                  />
                )}
              </TouchableOpacity>

              <View
                style={{
                  height: 20,
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginTop: 4
                }}
              >
                <Rating
                  fractions={2}
                  startingValue={rating ?? 0}
                  imageSize={20}
                  ratingCount={5}
                  readonly={true}
                />
                <Paragraph
                  style={{
                    color: '#fff',
                    backgroundColor: 'green',
                    width: '15%',
                    height: '100%',
                    textAlign: 'center',
                    marginLeft: 5,
                  }}
                >
                  {/* {el.rating} */} {ratingCount}
                </Paragraph>
                {/* <Text> (200)</Text> */}
              </View>

              <Text
                style={{
                  fontSize: 11,
                  width: '90%',
                  color: '#000',
                  marginBottom: 7,
                  paddingBottom: 8,
                  marginTop: 4
                }}
              >
                {speciality}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            marginTop: 20,
            backgroundColor: 'white',
            width: '90%',
            borderRadius: 15,
            elevation: 5,
            alignSelf: 'center',
            borderColor: '#ddd',
            borderWidth: 1,
          }}
        >
          <View>
            <Text
              style={{
                fontSize: RFValue(18),
                color: '#2173A8',
                marginTop: 10,
                marginLeft: 20,
              }}
            >
              About
            </Text>
            <Text
              style={{
                color: '#000',
                marginLeft: 22,
                marginRight: 15,
                //  marginRight: 10,
                marginTop: 10,
              }}
            >
              {about === 'null' ? 'No About' : about}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: RFValue(18),
                color: '#2173A8',
                marginTop: 15,
                marginLeft: 20,
              }}
            >
              Speciality
            </Text>
            <Text
              style={{
                color: '#000',
                marginRight: 10,
                marginTop: 10,
                marginLeft: 22,
              }}
            >
              {speciality}
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: RFValue(18),
                color: '#2173A8',
                marginTop: 10,
                marginLeft: 20,
              }}
            >
              Rating
            </Text>
            <View
              style={{ flexDirection: 'row', marginLeft: 22, marginTop: 10 }}
            >
              <Rating
                fractions={2}
                startingValue={rating ?? 0}
                imageSize={20}
                ratingCount={5}
                readonly={true}
              />
              <Paragraph
                style={{
                  color: '#fff',
                  backgroundColor: 'green',
                  width: '12%',

                  textAlign: 'center',
                  marginLeft: 10,
                }}
              >
                {/* {el.rating} */} {ratingCount}
              </Paragraph>
            </View>
          </View>
          <View style={{ marginBottom: 12 }}>
            <Text
              style={{
                fontSize: RFValue(18),
                color: '#2173A8',
                marginTop: 10,
                marginLeft: 20,
              }}
            >
              No of Consultations
            </Text>
            <Paragraph
              style={{
                marginTop: 5,
                marginLeft: 21,
                color: '#000',
              }}
            >
              <Paragraph style={{ color: 'blue', }}>({Consultation}) </Paragraph>
              {Consultation == 0 || Consultation == 1 ? 'Consultation' : 'Consultations'}
            </Paragraph>
          </View>
        </View>
        {/* <View>
          <Text
            style={{
              fontSize: 20,
              color: '#2173A8',
              marginTop: 10,
              marginLeft: 20,
            }}
          >
            Cost
          </Text>
          <Paragraph
            style={{
              marginLeft: 40,
            }}
          >
            Audio
            <Paragraph style={{ color: 'blue' }}>($200)</Paragraph>
            Vedio
            <Paragraph style={{ color: 'blue' }}>($300)</Paragraph> Chat{' '}
            <Paragraph style={{ color: 'blue' }}>($100)</Paragraph> Consultation
          </Paragraph>
        </View> */}

        <Button
          style={{
            fontSize: 32,
            width: '60%',
            alignSelf: 'center',
            marginTop: 40,
          }}
          mode="contained"
          color="#2173A8"
          uppercase={false}
          contentStyle={{ height: 54 }}
          onPress={() => ProfileUpdateCheck()}
        >
          Book Appointment
        </Button>
        <View style={{ paddingBottom: 15 }} />
      </ScrollView>
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: 'green',
          bottom: 20,
          // zIndex: 10,
        }}
        wrapperStyle={{ position: 'absolute' }}
      >
        {error.message}
      </Snackbar>
      <Snackbar
        visible={err.iserr}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: '#d15656',
          bottom: 20,
          // zIndex: 10,
        }}
        wrapperStyle={{ position: 'absolute' }}
      >
        {err.message}
      </Snackbar>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    backgroundColor: '#FFFFFF',
    elevation: 5,
    height: 90,
    marginTop: 20,
    borderRadius: 20,
    width: '65%',
    marginLeft: 20,
  },

  img: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
  },
  text: {
    marginTop: 10,
    color: '333333',
    fontSize: 20,
    marginRight: 40,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
});
