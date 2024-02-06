import React, { useState, useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  RefreshControl,
  Button,
  Dimensions,
  Alert,
} from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
import {
  Card,
  Paragraph,
  Title,
  Searchbar,
  Badge,
  Text,
  FAB,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { AdvertiseCard } from '../../../components/AdvertiseCard';
import Carousel from 'react-native-reanimated-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import AutocompleteInput from '../../../components/Autocomplete/Autocomplete';
//import notifee from '@notifee/react-native';
import notifee, { TimestampTrigger, TriggerType } from '@notifee/react-native';
import { onCreateTriggerNotification } from '../../../components/GetNotification/index';
import * as RNLocalize from 'react-native-localize';
const { width, height } = Dimensions.get('window');

export const PatientHome = (props) => {
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getdata();
      getdoctordata();
      getspecializaton();
      FavouriteList();
      getunseennotification()
      // ProfileUpdateCheck();
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, [props.navigation]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [name, setName] = React.useState('');
  const [image, SetImage] = React.useState('');
  const [loading, setLoding] = React.useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [doctordetails, SetDoctorDetails] = React.useState([]);
  const [specialization, SetSpecialization] = React.useState([]);
  const [favouritelist, setFavouriteList] = React.useState([]);
  const [feet, setFeet] = React.useState('');
  const [birthyear, setBirthYear] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [user_id, setUserid] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const [zone, setZone] = React.useState('');
  const [mail, setMail] = React.useState('');
  const [count, SetCount] = React.useState();
  const [unseencount, SetUnseenCount] = React.useState();
  const [counrtyname, setCountryname] = React.useState('');
  const onRefresh = async () => {
    setRefreshing(true);
    getdoctordata();
    getdata();
    getspecializaton();
    setRefreshing(false);
    FavouriteList();
    getunseennotification()
    //ProfileUpdateCheck()
  };
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
        // setName(response.data.response.name);
        setFeet(response.data.response.height);
        setWeight(response.data.response.weight);
        setBirthYear(response.data.response.date_of_year);
        setGender(response.data.response.gender);
        setMail(response.data.response.email);
        setZone(response.data.response.color_code);
        SetImage(response.data.response.profile_image);
        setCountryname(response.data.response.counrty);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getunseennotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      patient_id: user_id,
    };

    setLoding(true);
    await Apis.unseenNotification(data)

      .then((response) => {
        console.warn('unseencount', response.data);
        setLoding(false);
        SetUnseenCount(response.data.response);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getdoctordata = async () => {
    setLoding(true);
    const data = {
      time_zone: RNLocalize.getTimeZone()
    };

    await Apis.doctorlist(data)

      .then((response) => {
        console.warn(';lllllll', response.data);
        SetDoctorDetails(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getspecializaton = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    setLoding(true);
    await Apis.getskill(token)

      .then((response) => {
        console.warn('lllllll', response.data);
        SetCount(response.data.response.count);
        SetSpecialization(response.data.response);
        console.log('new first', response.data.response)
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const { width } = useWindowDimensions();
  const onChangeSearch = (query) => setSearchQuery(query);
  console.log('query========>', count);
  const FavouriteList = async () => {
    setLoding(true);
    await Apis.topdoctor()

      .then((response) => {
        console.warn(response.data);
        setFavouriteList(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error('errrrr', error.response.data);
        setLoding(false);
      });
  };
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
          props.navigation.navigate('ProblemList', {
            mail: mail,
            userid: user_id,
            birthyear: birthyear,
            gender: gender,
          });
        }
        // eslint-disable-next-line prettier/prettier
        else {
          //  Alert.alert('Please update your profile')

          Alert.alert(
            'Select',
            //body
            'Please update your profile',

            [
              {
                text: 'Yes',
                onPress: () =>
                  //  setTimeout(() => {
                  props.navigation.navigate('PatientEditProfile')
                // }, 2500)
              },
              // { text: 'Gallery', onPress: () => GalleryPicker() },
              { text: 'No', onPress: () => null },
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
  console.log(favouritelist);
  console.log("unseencount===>>", unseencount)
  // async function onDisplayNotification() {
  //   // Request permissions (required for iOS)
  //   await notifee.requestPermission();

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });

  //   // Display a notification
  //   await notifee.displayNotification({
  //     title: 'Notification Title',
  //     body: 'Main body content of the notification',
  //     android: {
  //       channelId,
  //       // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
  //       // pressAction is needed if you want the notification to open the app when pressed
  //       pressAction: {
  //         id: 'default',
  //       },
  //     },
  //   });
  // }

  // async function onCreateTriggerNotification() {
  //   const channelId = await notifee.createChannel({
  //     id: 'default',
  //     name: 'Default Channel',
  //   });
  //   const date = new Date(Date.now());

  //   date.setMinutes(20);
  //   const trigger = {
  //     type: TriggerType.TIMESTAMP,
  //     timestamp: Date.now() + 20000,

  //     //  repeatFrequency: RepeatFrequency.WEEKLY,
  //   };

  //   await notifee.createTriggerNotification(
  //     {
  //       id: '123',
  //       title: 'Meeting with Jane',
  //       body: 'Today at 11:20am',
  //       android: {
  //         channelId: channelId,
  //       },
  //     },
  //     trigger
  //   );
  // }
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      {/*<View
        style={{
          flex: 1,
          left: 0,
          position: 'absolute',
          right: 0,
          top: 0,
          zIndex: 1,
        }}
      >
        <AutocompleteInput
          onChangeText={onChangeSearch}
          data={[
            { name: 'shipra', id: 1 },
            { name: 'arnab', id: 2 },
            { name: 'naboneeta', id: 3 },
          ]}
          value={searchQuery}
          flatListProps={{
            keyExtractor: (item, idx) => item.id,
            renderItem: ({ item }) => <Text>{item.name}</Text>,
          }}
        />
        </View>*/}

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, }}>


        <TouchableOpacity
          style={{
            marginLeft: 10,

            borderRadius: 55,
            height: 85,
            width: 85,

            borderColor: '#000',
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => props.navigation.navigate('PatientEditProfile', { counrtyname: counrtyname })}
        >
          <Image
            style={{
              borderRadius: 40,
              height: 80,
              width: 80,
              alignSelf: 'center',
              resizeMode: 'contain'
              // marginTop: -10,
            }}
            source={{ uri: image }}
          />

          <TouchableOpacity
            style={{
              height: 35,
              width: 35,
              borderRadius: 20,
              position: 'absolute',
              left: 60,
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
            marginRight: 5,
            // position: 'absolute',

            marginLeft: 8,
            color: '#000',
            fontSize: 20,
            fontWeight: 'bold',
            width: "52%"
          }}
        >
          {name}

        </Text>
        <View
          style={{
            flexDirection: 'row',


          }}
        >
          <TouchableOpacity
            style={{ width: 30 }}
            onPress={() => props.navigation.navigate('Favourite')}
          >
            <AntDesign name="heart" size={30} color="#2173A8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignSelf: 'flex-end' }}
            onPress={() => props.navigation.navigate('Notification')}
          >
            <MaterialCommunityIcons
              name="bell"
              color="#2173A8"
              size={30}
              solid
              style={{ marginTop: -30, }}
            />
            {/* <Badge
style={{ backgroundColor: '#fff', marginTop: -27 }}
size={15}
>
1
</Badge> */}
            <Badge
              style={{
                backgroundColor: 'red',
                marginTop: -27,
                //flexWrap: 'wrap',
                // alignSelf: 'flex-start',
                //  alignItems: 'flex-start',
                // alignContent: 'flex-start',
                color: '#fff',
                //justifyContent: 'flex-start',
                fontWeight: 'bold',
                // marginRight: "40%"
              }}
              size={15}
            >
              {unseencount}
            </Badge>

          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: 8,
          marginBottom: 20,
          marginLeft: 15,
        }}
      >
        {/* <TouchableOpacity
  onPress={() => props.navigation.navigate('SelectGender')}
  style={{
    elevation: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  }}
>
  <Text style={{ fontSize: 15, color: '#2173A8', marginBottom: 10 }}>
    Quick Visit
  </Text>
</TouchableOpacity> */}
        <FAB
          icon={require('../../../Assets/quickvisit.png')}
          style={styles.fab}
          label="Quick Visit"
          onPress={() => ProfileUpdateCheck()}
          uppercase={false}
        />
      </View>


      <ScrollView
        // style={{ marginTop: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* <View>
          <Button
            title="Create Trigger Notification"
            onPress={() => onCreateTriggerNotification()}
          />
        </View> */}
        <Text
          style={{
            color: '#000',
            marginLeft: 20,
            // marginTop: 10,
            fontSize: RFValue(13),
            fontWeight: 'bold',
          }}
        >
          Specialist
        </Text>
        {/* <TouchableOpacity>
          <Text
            style={{
              color: '#2173A8',
              marginRight: 20,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'right',
              marginTop: -20,
            }}
          >
            See All
          </Text>
        </TouchableOpacity> */}

        <View style={{ marginBottom: 10, flexDirection: 'row' }}>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ marginRight: 20, paddingRight: 20 }}
            showsHorizontalScrollIndicator={false}
          >
            {specialization.map((el, i) => (
              <TouchableOpacity
                onPress={() =>
                  props.navigation.navigate('SkillListing', { id: el.id, specialistName: el.name })
                }
              >
                <Card
                  style={{
                    width: 160,
                    padding: 5,
                    marginLeft: 20,
                    marginTop: 20,
                    backgroundColor: el.color,
                    borderRadius: 10,
                    marginBottom: 10,
                    height: 200,

                  }}
                >
                  <Image
                    source={{ uri: el.image }}
                    style={{
                      width: 60,
                      height: 60,
                      alignSelf: 'center',
                      marginTop: 20,
                      borderRadius: 30,
                    }}
                  />
                  <Card.Content>
                    <Text
                      style={{
                        fontSize: RFValue(12),
                        color: '#fff',
                        textAlign: 'center',
                        width: '105%',
                        marginTop: 20,
                        fontWeight: 'bold',
                      }}
                    >
                      {el.name}
                    </Text>
                    {el.count === 1 || el.count === 0 ? (
                      <Paragraph
                        style={{
                          fontSize: RFValue(12),
                          color: '#fff',
                          textAlign: 'center',
                          marginTop: 10,
                          fontWeight: 'bold',
                        }}
                      >
                        {el.count} Doctor
                      </Paragraph>
                    ) : (
                      <Paragraph
                        style={{
                          fontSize: RFValue(12),
                          color: '#fff',
                          textAlign: 'center',
                          marginTop: 10,
                          fontWeight: 'bold',
                        }}
                      >
                        {el.count} Doctors
                      </Paragraph>
                    )}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text
          style={{
            color: '#000',
            marginLeft: 20,
            //  marginTop: -10,
            fontSize: RFValue(13),
            fontWeight: 'bold',
          }}
        >
          Top Doctor
        </Text>
        {/* <TouchableOpacity>
          <Text
            style={{
              color: '#2173A8',
              marginRight: 20,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'right',
              marginTop: -20,
            }}
          >
            See All
          </Text>
        </TouchableOpacity> */}

        <View style={{ marginBottom: 50 }}>
          <ScrollView
            horizontal={true}
            contentContainerStyle={{ marginRight: 20, paddingRight: 20 }}
            showsHorizontalScrollIndicator={false}
          >
            {favouritelist.map((el, i) => (
              <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={() =>
                  props.navigation.navigate('DoctorProfile', { id: el.id })
                  // props.navigation.navigate('ShowReview')
                }
              >
                <Card
                  style={{
                    width: 155,
                    marginLeft: 20,
                    marginTop: 10,
                    // borderRadius: 5,
                    backgroundColor: '#fff',
                    borderColor: '#ddd',
                    borderWidth: 2,
                    height: 250
                  }}
                >
                  <Card.Cover
                    source={{ uri: el.profile_image }}
                    style={{ height: 190, resizeMode: 'contain', padding: 5 }}
                  />
                  <Card.Content style={{ backgroundColor: '#fff' }}>
                    <Text
                      adjustsFontSizeToFit
                      style={{
                        fontSize: RFValue(12),
                        textAlign: 'center',
                        // backgroundColor: '#fff',
                        color: '#000',
                        marginTop: 5,
                        fontWeight: 'bold'
                      }}
                    >
                      {el.name}
                    </Text>
                    {/* <Paragraph
                  style={{
                    fontSize: 12,
                    //   color: '#000',
                    textAlign: 'center',
                    marginTop: -5,
                   
                  }}
                >
                 {el.speciality}
                </Paragraph> */}
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View>
          <Text
            style={{
              color: '#000',
              marginLeft: 20,
              marginTop: -30,
              fontSize: RFValue(13),
              fontWeight: 'bold',
            }}
          >
            Recommendation
          </Text>
          {/* <TouchableOpacity>
            <Text
              style={{
                color: '#2173A8',
                marginRight: 20,
                fontSize: 14,
                fontWeight: 'bold',
                textAlign: 'right',
                marginTop: -20,
              }}
            >
              See All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uncheckborder}>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('BookAppointment')}
          >
            <Image
              style={styles.imgtick}
              source={require('../../../Assets/doctorbell.png')}
            />

            <Text
              style={{
                color: '#333333',
                marginLeft: 90,
                marginTop: 10,
                position: 'absolute',
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Dr. Stive Simth
            </Text>
            <Text
              style={{
                color: '#333333',
                marginLeft: 92,
                marginTop: 33,
                fontSize: 10,
                position: 'absolute',
              }}
            >
              Dental Specialist
            </Text>
            </TouchableOpacity>*/}

          <Carousel
            // loop
            width={width}
            height={width / 2}
            //   autoPlay={true}
            data={doctordetails}
            // scrollAnimationDuration={1000}
            style={{ marginBottom: 20, marginTop: 10 }}
            snapEnabled
            pagingEnabled
            // eslint-disable-next-line no-console
            onSnapToItem={(index) => console.log('current index:', index)}
            renderItem={({ item, index }) => (
              <AdvertiseCard
                src={{ uri: item.profile_image }}
                name={item.name}
                specialization={item.speciality}
                degree={item.qualification}
                rating={item.rating}
                ratingcount={item.rating_count}
                id={item.id}
                props={props}
              />
            )}
          />
        </View>
      </ScrollView >
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  fab: {
    // position: 'absolute',
    //  margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#146BCE',
    tintColor: '#fff',
    // width
    //marginTop: 10,
  },
  container: {
    justifyContent: 'center',
    padding: 0,
    backgroundColor: '#fff',
    marginLeft: 20,
    width: '47%',
    borderRadius: 10,
    marginTop: 10,
    height: '100%',
  },
  uncheckborder: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    elevation: 10,
    height: 90,
    marginTop: 10,
    borderRadius: 10,
    width: '90%',
    marginBottom: 30,
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
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
  },
  imgtick2: {
    width: 30,
    height: 35,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 5,
  },
});
