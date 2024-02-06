import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Text,
  Platform,
  PermissionsAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Card,
  Paragraph,
  Title,
  Button,
  Searchbar,
  Badge,
  Provider,
  Portal,
  Modal,
  List,
} from 'react-native-paper';
import { getUserLogin, getUserToken } from '../../utils/DataStore';

import CustomButton from '../../components/CustomButton';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { styles } from '../Home/styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import Iicon from 'react-native-vector-icons/dist/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { COLORS, FONT_FAMILY, google_api_key } from '../../utils/Const';
import SearchComp from '../../components/SearchComp';
import { Rating } from 'react-native-ratings';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import { getLocationAddress, getUserProfile } from '../../Services/ApiService';
import {
  getCategoryListAction,
  getExpertiseAction,
  getRecentJobList,
  getRecentJobListAction,
  getSubCategoryListAction,
} from '../../Redux/actions/HomeAction';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { createChatAction, getUserProfileAction } from '../../Redux/actions/ProfileAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Header } from '../../components/Header/Header';
import { getjobSearchAction } from '../../Redux/actions/JobAction';

export const Joblisting = props => {
  const detailsView = props.route.params.details
  const [address, setAddress] = useState('');
  const [addresstext, setAddressText] = useState('');
  const [locationObject, setLocationObject] = useState({});



  const dispatch = useDispatch();

  const [userData, setUserData] = useState('');
  const jobSearch = useSelector(state => state.Job?.jobSearch);
  const isLoading = useSelector(state => state.Home.isLoading);
  const createChat = useSelector(state => state.Profile.createChat);
  const currentLocation = useSelector(state => state.Home.currentLocation);

  console.log("00000000000000", jobSearch)

  useEffect(() => {

    const createjobDetails = props.navigation.addListener('focus', async () => {
      getLogin();
      getCurrentLocation();
      const user = JSON.parse(await AsyncStorage.getItem('USER'));
      console.log('%%==', user.data);
      const query = {
        page: 1,
        limit: 9,
        userId: user.data._id,
        category: detailsView.search,
        distance: currentLocation.distance,
        lat: currentLocation.position.lat,
        long: currentLocation.position.lng,
      }
      //console.log("details ------------------>", props.route.params.details);
      console.log("=========================", query);
      dispatch(getjobSearchAction(query));
      setUserData(user.data);

    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // useEffect(() => {
  //   // console.log(
  //   //   '🚀 ~ file: Home.js ~ line 109 ~ UverHome ~ expertiseList',
  //   //   recentJobs,
  //   // );
  // }, [recentJobs]);

  const getCurrentLocation = () => {
    if (
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      )
    ) {
      Geolocation.getCurrentPosition(info => {
        setLocationObject({
          lat: info.coords.latitude,
          lng: info.coords.longitude,
        });


        if (props.route.params.details.lat) {
          var pos = {
            lat: props.route.params.details.lat,
            lng: props.route.params.details.lng,
            distance: props.route.params.details.distance,
          };
        } else {
          var pos = {
            lat: parseFloat(info.coords.latitude),
            lng: parseFloat(info.coords.longitude),

          };
        }

        Geocoder.geocodePosition(pos)
          .then(json => {
            console.log(json[0]);
            // var addressComponent = json.results[0].address_components;
            setAddress(json[0].formattedAddress);
            setAddressText(json[0])
          })
          .catch(error => console.log(error));
      });
    }
  };

  const getLogin = async () => {
    let data = await getUserLogin();
  };

  const chatCreate = (id) => {
    const value = {
      remoteUserId: id._id
    }
    dispatch(createChatAction(value))
    console.log("chatcreate", createChat);
    if (createChat.success === true) {
      props.navigation.navigate('ChatScreen', {
        details: id,
      })

    }

  }



  const _renderJobList = ({ item, i }) => {
    return (

      <View style={styles.jobItemContainer}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('JobDetailsScreen', { details: item })
          }>
          {/* {console.log('{{{{{{{{', item)} */}
          <Image
            source={{ uri: item.profileImage }}
            style={styles.jobImg}
            resizeMode={'contain'}
          />
          <View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{`$${item.salary === null ? 0 : item.salary}`}</Text>
            </View>
          </View>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.dateText}>
            {moment(item.date).format('ddd, Do MMM, YYYY ')}
          </Text>
          <Text style={styles.dateText}>
            {`${item.start_time.split(':')[0] > 12
              ? `${parseInt(item.start_time.split(':')[0] % 12)}:${parseInt(
                item.start_time.split(':')[1],
              )} p.m`
              : `${item.start_time.split(':')[0]}:${item.start_time.split(':')[1]
              } a.m`
              } - ${item.end_time.split(':')[0] > 12
                ? `${parseInt(item.end_time.split(':')[0] % 12)}:${parseInt(
                  item.end_time.split(':')[1],
                )} p.m`
                : `${item.end_time.split(':')[0]}:${item.end_time.split(':')[1]
                } a.m`
              }`}
          </Text>
          <Text style={styles.descText} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.middleContainer}>
            <TouchableOpacity
              style={{ flexDirection: 'row', width: wp(80) }}
              onPress={() =>
                props.navigation.navigate('FriendProfile', { details: item })
              }>
              <Octicons
                color={COLORS.YELLOW_GREEN}
                size={wp(14)}
                name="person"
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.userText,
                  { color: COLORS.LAPSI_LAZULI },
                ]}>{`${item.employer_id.firstname} ${item.employer_id.lastname}`}</Text>
            </TouchableOpacity>
            <MIcon
              color={COLORS.YELLOW_GREEN}
              size={wp(14)}
              name="clipboard-check-outline"
              style={{ marginLeft: wp(8) }}
            />
            <Text style={styles.userText}>{item.job_type}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // position: 'absolute',
              left: 10,
            }}>
            <Rating
              type="star"
              imageSize={10}
              ratingCount={5}
              startingValue={item.jobrating}
            />
            <Text style={styles.viewText}>{' - ' + '10' + ' View'}</Text>
          </View>
          {/* {console.log(item.employer_id._id)} */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              disabled={item.employer_id._id === userData._id ? true : false}
              onPress={() =>
                chatCreate(item.employer_id)

              }>
              <MIcon
                color={COLORS.YELLOW_GREEN}
                size={wp(14)}
                name="clipboard-check-outline"
                style={{ marginLeft: wp(12) }}
              />
              <Text style={styles.buttonText}>{'Chat'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('JobDetailsScreen', { details: item })

              }
              disabled={item.employer_id._id === userData._id ? true : false}
              style={[
                styles.buttonStyle,
                item.employer_id._id === userData._id
                  ? { backgroundColor: COLORS.NICKEL, marginLeft: wp(14) }
                  : { backgroundColor: COLORS.YELLOW_GREEN, marginLeft: wp(14) },
              ]}>
              <Text style={[styles.buttonText, { color: COLORS.WHITE }]}>
                {'Apply Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>

    );
  };

  // TODO: render expertise list

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        {isLoading && <Loader />}
        <View style={[styles.topContainer]}>
          <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
            <Image
              source={require('../../Assets/back.png')}
              resizeMode="contain"
              style={{ width: wp(24), height: wp(20), marginRight: wp(22) }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{ flexDirection: 'row' }} >
            <Image
              source={require('../../Assets/locationPin/pin.png')}
              style={styles.topIcon}
            />
            {console.log("detailsView", detailsView)}
            <View style={{ marginLeft: wp(14) }}>
              <Text style={styles.locationTitle}>{currentLocation?.locality}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <View style={{ width: wp(200) }}>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {detailsView?.address}
                  </Text>
                </View>
                <Icon name="chevron-down" color={COLORS.BLACK} size={wp(20)} />
              </View>
            </View>
          </TouchableOpacity>

        </View>
        <ScrollView>
          <View
            style={{
              marginVertical: hp(20),
              flexDirection: 'row',
              marginHorizontal: wp(18),
            }}>

          </View>

          {jobSearch?.statusCode == 200 ?
            <View style={styles.jobContainer}>
              
              {jobSearch?.message == "Job Filtered List!" ?
                <View>
                  <FlatList
                    data={jobSearch?.data?.docs}
                    keyExtractor={(item, index) => `${item.id}#${index}`}
                    renderItem={_renderJobList}
                    numColumns={2}
                  />
                </View> :
                <Text style={[
                  styles.searchText,
                  { color: COLORS.LAPSI_LAZULI },
                ]}>{jobSearch?.message}</Text>
              }
            </View> :

            <View style={styles.jobContainer}>
               <ActivityIndicator color = '#8FCD2D' size = "large"/> 
            </View>
          }


           {/* <View style={styles.jobContainer}> 
           {jobSearch?.message == "Job Filtered List!" ? 
              <View>
                <FlatList
                  data={jobSearch?.data?.docs}
                  keyExtractor={(item, index) => `${item.id}#${index}`}
                  renderItem={_renderJobList}
                  numColumns={2}
                />
              </View> :
              <Text style={[
                styles.searchText,
                { color: COLORS.LAPSI_LAZULI },
              ]}>{jobSearch?.message}</Text>
            }
          </View>   */}

        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
};
