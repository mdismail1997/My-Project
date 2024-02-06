/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React, { useEffect } from 'react';
import Selector from '../../../components/MakeAppointment';
import { Header } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import { Paragraph, Snackbar } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { acc } from 'react-native-reanimated';
import * as RNLocalize from 'react-native-localize';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Rating } from 'react-native-ratings';
import { RFValue } from 'react-native-responsive-fontsize';
const InspectionCost = (props) => {
  const HEIGHT = Dimensions.get('screen').height;
  const WIDTH = Dimensions.get('screen').width;
  const [selectedValue, setSelectedValue] = React.useState('');
  const [chipData, setChipData] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const [name, setName] = React.useState('');
  const [about, setAbout] = React.useState('');
  const [image, SetImage] = React.useState('');
  const [rating, SetRating] = React.useState('');
  const [ratingCount, SetRatingcount] = React.useState('');
  const [speciality, SetSpeciality] = React.useState('');
  const [patientcount, SetPatientcount] = React.useState('');
  const [reviewcount, SetReviewcount] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [favourite, SetFavourite] = React.useState(false);
  const [type, setType] = React.useState('');
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [err, setErr] = React.useState({ iserr: false, message: '' });
  const handlePress = (event, value) => {
    setSelectedValue(value);
    console.log('value==', value);
  };
  const getdoctordata = async () => {
    const data = {
      doctor_id: props.route.params?.id,
    };

    // setLoding(true);
    await Apis.doctorprofile(data)

      .then(async (response) => {
        console.warn('doc data=========', response.data);
        setLoding(false);
        setName(response.data.response.name);
        setAbout(response.data.response.about);
        SetSpeciality(response.data.response.speciality);
        SetImage(response.data.response.profile_image);
        SetPatientcount(response.data.response.patient_count);
        SetReviewcount(response.data.response.review_count);
        SetRating(response.data.response.rating);
        setExperience(response.data.response.experience);
        SetRatingcount(response.data.response.rating_count);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const getavailabilitydetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', props.route.params?.id);
    console.log('token123=', token);
    const data = {
      user_id: props.route.params?.id,
      time_zone: RNLocalize.getTimeZone(),
    };

    // setLoding(true);
    await Apis.availabilitydetails(data)

      .then((response) => {
        console.warn('oooooo======', response.data);

        setLoding(false);

        // const day = response.data.response.reduce(
        //   (acc, cur) => ({
        //     ...acc,
        //     [`${cur.day} ${cur.date}`]: {
        //       ...cur,
        //       start_time: [
        //         ...(acc?.[`${cur.day} ${cur.date}`]?.start_time ?? []),
        //         cur.start_time,
        //       ],
        //       end_time: [
        //         ...(acc?.[`${cur.day} ${cur.date}`]?.end_time ?? []),
        //         cur.end_time,
        //       ],
        //       id: [...(acc?.[`${cur.day} ${cur.date}`]?.id ?? []), cur.id],
        //     },
        //   }),
        //   {}
        // );

        console.log('day-------', response.data.response.type);
        const day = response.data.response.reduce(
          (acc, cur) => ({
            ...acc,
            [`${cur.day} ${cur.date} ${cur.start_time} - ${cur.end_time}`]: {
              ...cur,
            },
          }),
          {}
        );

        setChipData(day);
        setType(response.data.response.type);
      })
      .catch((error) => {
        console.error(error);
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

  console.log('select----', favourite);
  console.log('pppp', type);
  useEffect(() => {
    getavailabilitydetails();
    getdoctordata();
    CheckFavourite();
  }, [props.route.params?.id]);

  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setErr((data) => ({ ...data, iserr: false, message: '' }));
  };
  console.log('chipd------', chipData);
  const renderData = ({ item }) => {
    return (
      <View style={{ marginTop: 10, marginLeft: '5%' }}>
        <View
          style={{
            height: 30,
            width: 95,
            borderColor: '#dce7e8',
            borderRadius: 12,
            backgroundColor: 'white',
            elevation: 1,
            justifyContent: 'center',
            borderWidth: 0.5,
          }}
        >
          <Text style={{ alignSelf: 'center', fontSize: 11, color: '#2173A8' }}>
            {item.title}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={name} navProps={props.navigation} />
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
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        // contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: 'white', height: HEIGHT, width: WIDTH }}
      >
        <View
          style={{
            marginTop: 10,
            backgroundColor: 'white',
            width: '90%',
            borderRadius: 15,
            elevation: 5,
            alignSelf: 'center',
            borderColor: '#ddd',
            borderWidth: 1
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: 8 }}>
            <Image
              source={{ uri: image }}
              style={{ width: 80, height: 100, borderRadius: 15, borderWidth: 1, borderColor: '#ddd' }}
              resizeMode={'contain'}
            />
            <View
              style={{
                justifyContent: 'space-around',
                marginLeft: 5,
                width: '70%',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: '#000',
                  fontWeight: 'bold',
                  marginTop: 10,
                  width: '60%'
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
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 2
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
                    width: '12%',

                    textAlign: 'center',
                    marginLeft: 8,
                  }}
                >
                  {/* {el.rating} */} {ratingCount}
                </Paragraph>
              </View>
              <Text style={{
                fontSize: 11, width: '90%', color: '#000', marginBottom: 7, marginTop: 2,
                paddingBottom: 8,
              }}>{speciality}</Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 15, width: '95%' }}>
          <Text
            style={{
              marginLeft: '3.5%',
              color: '#2173A8',
              //  fontWeight: 'bold',
              fontSize: RFValue(18),
            }}
          >
            {' '}
            About Doctor
          </Text>
          <Text
            style={{
              marginLeft: '5.2%',
              color: 'black',
              fontSize: 13,
              marginTop: 8,
              width: "90%",
              //backgroundColor: 'red'
            }}
          >
            {about}
          </Text>
        </View>
        <View
          style={{
            marginTop: 20,
            width: '95%',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <TouchableOpacity
            style={{
              borderColor: '#2173A8',
              height: 130,
              width: '28%',
              borderWidth: 1,
              marginLeft: '5%',
              borderRadius: 25,
            }}
            onPress={() =>
              props.navigation.navigate('DoctorProfile2', { id: props.route.params?.id, })
              // props.navigation.navigate('ShowReview')
            }
          >
            <Image
              source={require('../../../Assets/user.png')}
              style={{
                height: 40,
                width: 40,
                alignSelf: 'center',
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#2173A8',
                alignSelf: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}
            >
              {patientcount}
              {/* 200+ */}
            </Text>
            {patientcount === 0 || patientcount === 1 ? (
              <>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    alignSelf: 'center',
                    marginTop: 5,
                  }}
                >
                  Patient
                </Text>
              </>
            ) : (
              <>
                <Text
                  style={{
                    fontSize: 12,
                    color: 'black',
                    alignSelf: 'center',
                    marginTop: 5,
                  }}
                >
                  Patients
                </Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderColor: '#2173A8',
              height: 130,
              width: '28%',
              borderRadius: 25,
              borderWidth: 1,
            }}
            onPress={() =>
              props.navigation.navigate('DoctorProfile2', { id: props.route.params?.id, })
              // props.navigation.navigate('ShowReview')
            }
          >
            <Image
              source={require('../../../Assets/user2.png')}
              style={{
                height: 40,
                width: 40,
                alignSelf: 'center',
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#2173A8',
                alignSelf: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}
            >
              {experience == '' || experience === null ? 0 : experience}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'black',
                alignSelf: 'center',
                marginTop: 5,
              }}
            >
              Experience
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderColor: '#2173A8',
              height: 130,
              width: '28%',
              borderWidth: 1,
              borderRadius: 25,
            }}
            onPress={() => props.navigation.navigate('ShowReview', {
              id: props.route.params?.id,
              doctorname: name,
            })
            }
          >
            <Image
              source={require('../../../Assets/chaticon.png')}
              style={{
                height: 40,
                width: 40,
                alignSelf: 'center',
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#2173A8',
                alignSelf: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}
            >
              {reviewcount}+
            </Text>
            {reviewcount === 0 || reviewcount === 1 ?
              <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  alignSelf: 'center',
                  marginTop: 5,
                }}
              >
                Review
              </Text>
              : <Text
                style={{
                  fontSize: 12,
                  color: 'black',
                  alignSelf: 'center',
                  marginTop: 5,
                }}
              >
                Reviews
              </Text>}
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 15, marginRight: '5%' }}>
          <Text
            style={{
              color: '#2173A8',
              marginLeft: '5%',
              // fontWeight: 'bold',
              marginBottom: 10,
              fontSize: RFValue(18),
            }}
          >
            Speciality
          </Text>
          {/* <View style={{marginTop:10,marginLeft:"5%"}}>
      <View style={{height:40,width:120,borderColor:"#dce7e8",borderRadius:12,backgroundColor:"white",elevation:10,justifyContent:"center",borderWidth:0.5}}>
        <Text style={{alignSelf:"center",fontSize:11}}>Oral surgary</Text>
      </View>
    </View> */}
          {/* <FlatList
            data={skillData}
            renderItem={renderData}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
          />*/}
          <Text
            style={{
              marginLeft: '5.5%',
              // fontWeight: 'bold',
              color: '#000',

            }}
          >
            {speciality}
          </Text>
        </View>
        {/* <View style={{ position: 'absolute', top: 0, bottom: 0, backgroundColor: 'red', left: 16, width: 1 }} /> */}
        {/*<View style={{ marginTop: 20, marginLeft: '5%' }}>
          <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>
            Working Time
          </Text>

          <Text style={{ color: '#616a6b', fontSize: 12, marginTop: 10 }}>
            Mon-Fri 09:00 AM-02:00 PM
          </Text>
        </View>*/}
        {/* <View
          style={{
            marginVertical: 20,
            marginLeft: '5%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>
            {' '}
            Reviews{' '}
          </Text>
          <TouchableOpacity
            onPress={() => Alert.alert('See Reviews')}
            style={{ marginRight: '5%' }}
          >
            <Text style={{ fontSize: 12, color: '#2173A8' }}>See Reviews</Text>
          </TouchableOpacity>
        </View> */}
        <Text
          style={{
            marginLeft: 18,
            color: '#2173A8',
            fontSize: RFValue(18),
            marginTop: 20,
            // fontWeight: 'bold',
          }}
        >
          Make Appointment
        </Text>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={styles.app}>
            {!Object.keys(chipData).length && (
              <Text style={{ color: '#000', fontWeight: 'bold' }}>
                No Schedule Available
              </Text>
            )}
            {Object.keys(chipData).map((el, i) => (

              <Selector
                key={i}
                title={el}
                type={chipData[el].type}
                date={chipData[el].date}
                day={chipData[el].day}
                endtime={chipData[el].end_time}
                starttime={chipData[el].start_time}
                value={chipData[el]}
                onPress={handlePress}
                selected={selectedValue}
              />
            ))}
          </View>
        </ScrollView>
        {/* <View
          style={{
            //  marginTop: 20,
            width: '85%',
            // height: 55,
            // change BorderColor
            borderColor: '#fff',
            alignSelf: 'center',
            // alignItems: 'center',
            // justifyContent: 'center',
            borderRadius: 10,
            borderWidth: 1,
            //marginBottom: 80,
            backgroundColor: '#2173A8',
          }}
          activeOpacity={0.7}
        > */}
        <TouchableOpacity style={{
          width: '85%',
          borderColor: '#fff',
          alignSelf: 'center',
          borderRadius: 10,
          borderWidth: 1,
          marginTop: 20,
          backgroundColor: '#2173A8',
          opacity: !Object.keys(chipData).length ? 0.7 : 1
        }}
          onPress={() => {
            {
              selectedValue === '' ? alert('Please select time from below schedule.') :
                props.navigation.navigate('Booking', {
                  id: props.route.params?.id,
                  bookingdate: selectedValue.date,
                  bookingslotid: selectedValue.id,
                  type: selectedValue.type.split(', ')
                });
            }
          }
          }
          disabled={!Object.keys(chipData).length}
        >
          <Text
            style={{
              textAlign: 'center',
              lineHeight: 53,
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: 18,
              fontFamily: 'Rubik',
              letterSpacing: 0.4,
            }}
          >
            Book Appointment
          </Text>
        </TouchableOpacity>
        {/* </View> */}
        <View style={{ paddingBottom: 20 }} />
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
    </SafeAreaView >
  );
};

export default InspectionCost;
const styles = StyleSheet.create({
  app: {
    marginHorizontal: 20,

    // maxWidth: 800,
    flexDirection: 'row',
    marginTop: 10,
  },
});
