import React, {useEffect, useState,useContext} from 'react';
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
  LogBox,
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
import {getUserLogin, getUserToken} from '../../utils/DataStore';

import CustomButton from '../../components/CustomButton';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {Picker} from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import {styles} from './styles';
import Icon from 'react-native-vector-icons/EvilIcons';
import Iicon from 'react-native-vector-icons/dist/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import {COLORS, FONT_FAMILY, google_api_key} from '../../utils/Const';
import SearchComp from '../../components/SearchComp';
import {Rating} from 'react-native-ratings';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import {getLocationAddress, getUserProfile} from '../../Services/ApiService';


import {
  getCategoryListAction,
  getExpertiseAction,
  getRecentJobList,
  getRecentJobListAction,
  getSubCategoryListAction,
} from '../../Redux/actions/HomeAction';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../components/Loader';
import {
  createChatAction,
  getUserProfileAction,
} from '../../Redux/actions/ProfileAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {Header} from '../../components/Header/Header';
import {changeLocation} from '../../Redux/actions/HomeAction';
import socketService from '../../utils/socketService'

export const UverHome = props => {
  // const detailsView = props.route.params.details
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisibles, setDatePickerVisibilitys] = useState(false);
  const [date, setdate] = useState();
  const [data, setdata] = useState();
  const [multiSliderValue, setMultiSliderValue] = useState([0, 100]);
  const [multiSliderValuee, setMultiSliderValuee] = useState([0, 100]);
  const [address, setAddress] = useState('');
  const [addresstext, setAddressText] = useState('');
  const [locationObject, setLocationObject] = useState({});
  const [distance, setDistance] = useState(0);

  const dispatch = useDispatch();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const showDatePickers = () => {
    setDatePickerVisibilitys(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const hideDatePickers = () => {
    setDatePickerVisibilitys(false);
  };

  const handleConfirm = date => {
    let dateformate = moment(new Date(date)).format('DD-MM-YYYY');
    setdate(dateformate);
    hideDatePicker();
  };
  const handleConfirms = data => {
    let dateformate = moment(new Date(data)).format('DD-MM-YYYY');
    setdata(dateformate);
    hideDatePickers();
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const [selectedLanguages, setSelectedLanguages] = useState();
  const [categoryData, setCategoryData] = useState();
  const [userData, setUserData] = useState('');
  const [search, setSearch] = useState('');
  const [searchtext, setSearchtext] = useState(false);
  const [locationtap, setLocationTap] = useState(false);
  const hideModal = () => setModalVisible(false);
  const [avgrating, setavgRating] =useState(0);
  const containerStyle = {backgroundColor: 'white', padding: 12, flex: 1};

  const categoryList = useSelector(state => state.Home.categoryList);
  const recentJobs = useSelector(state => state.Home.recentJobs);
  const isLoading = useSelector(state => state.Home.isLoading);
  const expertiseList = useSelector(state => state.Home.expertiseList);
  const createChat = useSelector(state => state.Profile.createChat);
  const currentLocation = useSelector(state => state.Home.currentLocation);
  const positionChange = useSelector(state => state.Home.currentLatlng);
   const userdata = useSelector(state => state.Profile.userData);

    console.log('-------userdata---////------', userdata?.data?.rating);
  // console.log('>>>>>>-positionChange-', positionChange);


  const getRating = async () => {
    setavgRating(avgRatingCalculator(userdata?.data?.rating))
 
  }


  useEffect(() => {
    getRating();
   // socketService.initializeSocket()
  }, [userdata]);






  useEffect(() => {
    getCurrentLocation1()
  }, [positionChange])


  useEffect(() => {
    dispatch(getUserProfileAction());
  }, []);




  useEffect(() => {
    LogBox.ignoreLogs([
      'VirtualizedLists should never be nested',
      'Found screens with the same name nested inside one another',
    ]);
    LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
    LogBox.ignoreAllLogs();
    const createjobDetails = props.navigation.addListener('focus', async () => {
      getLogin();
      //getCurrentLocation1()
      // getCurrentLocation();
      dispatch(getCategoryListAction());
      dispatch(getRecentJobListAction());
      dispatch(getExpertiseAction());
      const user = JSON.parse(await AsyncStorage.getItem('USER'));
      setUserData(user.data);
    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCategoryData(categoryList?.filter((item, i) => i >= 0 && i <= 5));
    // console.log('category list: ', categoryList);
  }, [categoryList]);
  useEffect(() => {}, [recentJobs]);
  useEffect(() => {
    // console.log(
    //   '🚀 ~ file: Home.js ~ line 109 ~ UverHome ~ expertiseList',
    //   recentJobs,
    // );
  }, [recentJobs]);

  const getCurrentLocation1=()=>{
    if(positionChange==''){
      getCurrentLocation()
    }else{
      var pos = {
        lat: parseFloat(positionChange.lat),
        lng: parseFloat(positionChange.lng),
      };
      saveAddress(pos,positionChange.distance)
    }
  }

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
        var pos = {
          lat: parseFloat(info.coords.latitude),
          lng: parseFloat(info.coords.longitude),
        };
        saveAddress(pos,15)
      });
    }
  };

  const saveAddress=(pos,dist)=>{
    console.log('======>',pos)
    Geocoder.geocodePosition(pos)
    .then(json => {
      dispatch(changeLocation({...json[0], distance:dist}));
      // var addressComponent = json.results[0].address_components;
      setAddress(json[0].formattedAddress);
      setAddressText(json[0]);
    })
    .catch(error => {
      console.log(error);
    });
  }

  const getLogin = async () => {
    let data = await getUserLogin();
  };

  const [searchQuery, setSearchQuery] = React.useState('');
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = value => {
    setExpanded(!expanded);
    setSelectedLanguages(value);
  };

  const onChangeSearch = query => setSearchQuery(query);

  const multiSliderValuesChange = values => {
    setMultiSliderValue(values);
  };
  const multiSliderValuesChangee = values => {
    setMultiSliderValuee(values);
  };

  const chatCreate = id => {
    const value = {
      remoteUserId: id._id,
    };
    dispatch(createChatAction(value));
    if (createChat.success === true) {
      props.navigation.navigate('ChatScreen', {
        details: id,
      });
    }
  };
  const selectCat = value => {
    // console.log("??????????", locationObject);

    props.navigation.navigate('LocationRadius', {
      details: {
        search: value,
        multiSliderValue,
        multiSliderValuee,
        selectedLanguage,
        selectedLanguages,
        address,
        locationObject,
      },
    });
  };


  const avgRatingCalculator = (ratings)=>{
    if(ratings.length===0){
        return 0
    }
    const sum = ratings.reduce((total, rating) => total + rating.rate, 0);
    const avg = sum / ratings.length;  
    return avg.toFixed(1);
    }



  const _renderCategoryList = ({item, index}) => {
    return (
      <View style={{margin: 4}}>
        <TouchableOpacity
          style={styles.categoryContainer}
          onPress={() => selectCat(item.name)}>
          <Image source={{uri: item.icon}} style={styles.categoryIcon} />
          <Text numberOfLines={1} style={styles.categoryTitle}>
            {item.name}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const _renderJobList = ({item, i}) => {
    return (
      <View style={styles.jobItemContainer}>
        <TouchableOpacity
       // style={{backgroundColor:'blue'}}
          onPress={() =>
            props.navigation.navigate('JobDetailsScreen', {details: item})
          }>
          {console.log('{{{{{{{{', item)}
          <Image
            source={{uri: item.profileImage}}
            style={styles.jobImg}
            resizeMode={'contain'}
          />
          <View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{`$${
                item.salary === null ? 0 : item.salary
              }`}</Text>
            </View>
          </View>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.dateText}>
            {moment(item.date).format('ddd, Do MMM, YYYY ')}
          </Text>
          <Text style={styles.dateText}>
            {`${
              item.start_time.split(':')[0] > 12
                ? `${parseInt(item.start_time.split(':')[0] % 12)}:${parseInt(
                    item.start_time.split(':')[1],
                  )} p.m`
                : `${item.start_time.split(':')[0]}:${
                    item.start_time.split(':')[1]
                  } a.m`
            } - ${
              item.end_time.split(':')[0] > 12
                ? `${parseInt(item.end_time.split(':')[0] % 12)}:${parseInt(
                    item.end_time.split(':')[1],
                  )} p.m`
                : `${item.end_time.split(':')[0]}:${
                    item.end_time.split(':')[1]
                  } a.m`
            }`}
          </Text>
          <Text style={styles.descText} numberOfLines={1}>
            {item.description}
          </Text>
          <View style={styles.middleContainer}>
            <TouchableOpacity
              style={{flexDirection: 'row', width: wp(80)}}
              onPress={() =>
                props.navigation.navigate('FriendProfile', {details: item})
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
                  {color: COLORS.LAPSI_LAZULI},
                ]}>{`${item.employer_id?.firstname} ${item.employer_id?.lastname}`}</Text>
            </TouchableOpacity>
            <MIcon
              color={COLORS.YELLOW_GREEN}
              size={wp(14)}
              name="clipboard-check-outline"
              style={{marginLeft: wp(8)}}
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
              startingValue={avgrating}
              readonly
            />
            <Text style={styles.viewText}> {avgrating} - {userdata?.data?.rating?userdata?.data?.rating?.length +' '+ 'Review':0 + ' '+ 'Review'}</Text>
          </View>
          {/* {console.log(item.employer_id._id)} */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonStyle}
              disabled={item.employer_id?._id === userData._id ? true : false}
              onPress={() => chatCreate(item.employer_id)}>
              <MIcon
                color={COLORS.YELLOW_GREEN}
                size={wp(14)}
                name="clipboard-check-outline"
                style={{marginLeft: wp(12)}}
              />
              <Text style={styles.buttonText}>{'Chat'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('JobDetailsScreen', {details: item})
              }
              disabled={item.employer_id?._id === userData._id ? true : false}
              style={[
                styles.buttonStyle,
                item.employer_id?._id === userData._id
                  ? {backgroundColor: COLORS.NICKEL, marginLeft: wp(14)}
                  : {backgroundColor: COLORS.YELLOW_GREEN, marginLeft: wp(14)},
              ]}>
              <Text style={[styles.buttonText, {color: COLORS.WHITE}]}>
                {'Apply Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // TODO: render expertise list
  const _renderExpertiseItem = ({item, index}) => {
    return (
      <View style={{margin: 4}}>
        <View style={styles.expertiseContainer}>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('ExpertiseDetails', {details: item})
            }>
            <View>
              <Image
                source={{uri: item.profileimage}}
                style={styles.expertiseImg}
              />
              <View style={styles.expertisePriceContainer}>
                <Text style={styles.expertisePriceText}>
                  {`$${item?.expectedCost?.value}/${item?.expectedCost?.type}`}
                </Text>
              </View>
            </View>

            <View>
              <Text style={styles.expertiseName}>
                {item.firstname + ' ' + item.lastname}
              </Text>
              <Text numberOfLines={1} style={styles.expertiseType}>
                {item?.occupation?.map((e, i) => {
                  return i > 0 ? ', ' + e?.category?.name : e?.category?.name;
                })}
              </Text>
              <Rating
                type="star"
                imageSize={10}
                ratingCount={5}
                startingValue={3}
                style={{
                  alignItems: 'flex-start',
                  marginLeft: 8,
                  marginTop: 12,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: wp(8),
                  marginTop: hp(6),
                }}>
                <FeatherIcon
                  name="phone-call"
                  size={14}
                  color={COLORS.YELLOW_GREEN}
                />
                <Text style={[styles.expertiseType, {marginTop: 0}]}>
                  {item?.phone_number}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: wp(8),
                  marginTop: hp(4),
                }}>
                <FeatherIcon
                  name="mail"
                  size={14}
                  color={COLORS.YELLOW_GREEN}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.expertiseType, {marginBottom: 10}]}>
                  {item?.email}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const _renderExpertise = () => {
    return (
      <FlatList
        data={expertiseList.data}
        keyExtractor={(item, index) => `${item._id}#${index}`}
        renderItem={_renderExpertiseItem}
        horizontal
        ItemSeparatorComponent={() => {
          return <View style={{width: wp(4)}} />;
        }}
      />
    );
  };
  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <>
        {search == item.name.substring(0, search.length) ? (
          <Text
            style={{padding: 18, color: COLORS.NICKEL, paddingTop: 1}}
            onPress={() => {
              [setSearch(item.name), setSearchtext(false)];
            }}>
            {' '}
            {item.name.toUpperCase()}
          </Text>
        ) : null}
      </>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          // backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  return (
    <Provider>
      <SafeAreaView style={styles.container}>
        {isLoading && <Loader />}
        <View style={[styles.topContainer, {justifyContent: 'space-between'}]}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() =>
              props.navigation.navigate('Location', {details: addresstext})
            }>
            <Image
              source={require('../../Assets/locationPin/pin.png')}
              style={styles.topIcon}
            />
            <View style={{marginLeft: wp(14)}}>
              <Text style={styles.locationTitle}>{addresstext?.locality}</Text>
              <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                <View style={{width: wp(200)}}>
                  <Text style={styles.addressText} numberOfLines={1}>
                    {address}
                  </Text>
                </View>
                <Icon name="chevron-down" color={COLORS.BLACK} size={wp(20)} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Notification')}>
            <Image
              source={require('../../Assets/bell/bell.png')}
              style={[styles.topIcon, {right: 0}]}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: hp(15),
            marginHorizontal: wp(18),
          }}>
          <Text
            style={{
              fontSize: wp(20),
              fontFamily: FONT_FAMILY.LATO_REGULAR,
              fontWeight: '600',
              fontSize: hp(14),
              color: COLORS.YELLOW_GREEN,
            }}>
            Search for jobs with '
            <Text
              style={{
                fontFamily: FONT_FAMILY.LATO_REGULAR,
                fontWeight: '600',
                fontSize: hp(14),
                color: COLORS.LAPSI_LAZULI,
              }}>
              {positionChange ? positionChange.distance:15}
            </Text>
            ' miles of{' '}
            <Text
              style={{
                fontFamily: FONT_FAMILY.LATO_REGULAR,
                fontWeight: '600',
                fontSize: hp(14),
                color: COLORS.LAPSI_LAZULI,
              }}>
              {currentLocation?.locality}, {currentLocation?.adminArea},{' '}
              {currentLocation?.countryCode}
            </Text>
          </Text>
        </View>
        <View style={styles.searchContainer}>
          <View
            style={{
              // flex: 1,
              flexDirection: 'row',
              paddingHorizontal: wp(20),
              paddingVertical: hp(6),
              backgroundColor: COLORS.WHITE,
              borderRadius: 10,
              shadowColor: '#000',
              // marginHorizontal: wp(18),
              alignItems: 'center',
              justifyContent: 'space-between',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              width: '100%',
              marginRight: wp(12),
            }}>
            <TextInput
              style={{
                width: '70%',
                fontSize: wp(15),
                color: COLORS.BLACK,
                fontFamily: FONT_FAMILY.LATO_REGULAR,
              }}
              value={search}
              onChangeText={text => [setSearch(text), setSearchtext(true)]}
              placeholder="Type here..."

              // icon={'icon'}
            />
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('Joblisting', {
                  details: {
                    search,
                    multiSliderValue,
                    multiSliderValuee,
                    selectedLanguage,
                    selectedLanguages,
                    address,
                    locationObject,
                    
                  },
                })
              }>
              <Icon name="search" color={COLORS.YELLOW_GREEN} size={wp(24)} />
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.filterContainer}
            activeOpacity={0.8}>
            <Image
              style={styles.filterIcon}
              source={require('../../Assets/searchside.png')}
            />
          </TouchableOpacity> */}
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={hideModal}
              contentContainerStyle={containerStyle}>
              <View style={{flex: 1}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                    padding: 8,
                  }}>
                  <TouchableOpacity onPress={hideModal}>
                    <Image
                      source={require('../../Assets/back.png')}
                      resizeMode="contain"
                      style={{width: wp(24), height: wp(20)}}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      marginLeft: wp(22),
                      fontSize: wp(18),
                      fontFamily: FONT_FAMILY.LATO_REGULAR,
                      color: COLORS.DARK_CHARCOAL,
                      flex: 1,
                    }}>
                    Filter
                  </Text>
                  <TouchableOpacity onPress={props.onpress}>
                    <Image
                      style={{
                        width: wp(25),
                        height: hp(25),
                        resizeMode: 'contain',
                      }}
                      source={props.Icon}
                    />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  keyboardShouldPersistTaps={'always'}
                  style={{flex: 1}}
                  showsVerticalScrollIndicator={false}>
                  <View style={{flex: 1}}>
                    {locationtap === false ? (
                      <View style={styles.meninputviewCSS}>
                        <TextInput
                          style={styles.inputtextCSS}
                          placeholder="Location"
                          placeholderTextColor="#737373"
                          keyboardType="default"
                          returnKeyType="done"
                          value={address}
                          onPressIn={() => setLocationTap(true)}
                        />
                        <TouchableOpacity onPress={() => setLocationTap(true)}>
                          <Image
                            source={require('../../Assets/Vector.png')}
                            style={{
                              width: wp(20),
                              height: hp(22),
                              alignSelf: 'center',
                              right: 30,
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <GooglePlacesAutocomplete
                        placeholder="Location"
                        minLength={2} // minimum length of text to search
                        autoFocus={true}
                        returnKeyType={'search'} // Can be left out for default return key
                        listViewDisplayed={false} // true/false/undefined
                        fetchDetails={true}
                        nearbyPlacesAPI="GooglePlacesSearch"
                        onPress={(data, details = null) => {
                          setAddress(data.description);
                          // setLocation({
                          //   lat: details.geometry.location.lat,
                          //   lng: details.geometry.location.lng,
                          // });
                        }}
                        styles={{
                          textInput: {
                            backgroundColor: COLORS.WHITE,
                            // marginTop: hp(16),
                            fontFamily: FONT_FAMILY.LATO_REGULAR,
                            color: COLORS.BLACK,
                            borderColor: COLORS.NICKEL,
                            borderWidth: 1,
                          },
                        }}
                        query={{
                          key: google_api_key,
                          language: 'en',
                          types: 'address',
                        }}
                        debounce={300}
                      />
                    )}

                    <Text style={{...styles.distancecss}}>Distance</Text>
                    <View
                      style={{
                        height: hp(50),
                        marginTop: hp(6),
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '90%',
                        }}>
                        <Text style={{color: COLORS.NICKEL, fontWeight: '500'}}>
                          {multiSliderValue[0]}
                        </Text>
                        <Text style={{color: COLORS.NICKEL, fontWeight: '500'}}>
                          {multiSliderValue[1]}
                        </Text>
                      </View>
                      <MultiSlider
                        markerStyle={{
                          ...Platform.select({
                            ios: {
                              height: hp(32),
                              width: wp(30),
                              shadowColor: '#000000',
                              shadowOffset: {
                                width: 0,
                                height: hp(3),
                              },
                              shadowRadius: 1,
                              shadowOpacity: 0.1,
                            },
                            android: {
                              height: hp(18),
                              width: wp(16),
                              borderRadius: 50,
                              backgroundColor: COLORS.YELLOW_GREEN,
                            },
                          }),
                        }}
                        pressedMarkerStyle={{
                          ...Platform.select({
                            android: {
                              height: hp(18),
                              width: wp(16),
                              borderRadius: 20,
                              backgroundColor: COLORS.YELLOW_GREEN,
                            },
                          }),
                        }}
                        selectedStyle={{
                          backgroundColor: COLORS.YELLOW_GREEN,
                        }}
                        trackStyle={{
                          backgroundColor: COLORS.DARKGREY,
                          height: hp(4),
                        }}
                        touchDimensions={{
                          height: hp(40),
                          width: wp(40),
                          borderRadius: 20,
                          slipDisplacement: 40,
                        }}
                        values={[multiSliderValue[0], multiSliderValue[1]]}
                        sliderLength={wp(300)}
                        onValuesChange={multiSliderValuesChange}
                        min={0}
                        max={100}
                        allowOverlap={false}
                        minMarkerOverlapDistance={10}
                        enabledOne={false}
                      />
                      {/* <Text>{multiSliderValue[0]}</Text>
                  <Text style={{ marginLeft: 'auto' }}>
                    {multiSliderValue[1]}
                  </Text> */}
                    </View>
                    <View style={{marginTop: hp(16)}}>
                      <Text style={styles.textcomCSS}>Sort </Text>
                      <View
                        style={[styles.textInputViewCss, {marginTop: hp(16)}]}>
                        <Picker
                          selectedValue={selectedLanguage}
                          onValueChange={(itemValue, itemIndex) =>
                            setSelectedLanguage(itemValue)
                          }>
                          <Picker.Item
                            label="Price high to low"
                            value="Price high to low"
                            style={styles.pickertextclass}
                          />
                          <Picker.Item
                            label="Price low to high"
                            value="Price low to high"
                            style={styles.pickertextclass}
                          />
                          <Picker.Item
                            label="Posted date"
                            value="Posted date"
                            style={styles.pickertextclass}
                          />
                        </Picker>
                      </View>
                    </View>
                    <View style={{marginTop: hp(16)}}>
                      <Text style={styles.textcomCSS}>Filter By</Text>
                      <View
                        style={[styles.textInputViewCss, {marginTop: hp(16)}]}>
                        <List.Accordion
                          title="Category"
                          expanded={!expanded}
                          onPress={handlePress}>
                          <List.Item
                            title="Category"
                            onPress={() => handlePress('Category')}
                          />
                        </List.Accordion>
                      </View>
                    </View>
                    <Text style={styles.distancecss}>Price</Text>
                    <View
                      style={{
                        height: hp(50),
                        marginTop: hp(6),
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          width: '90%',
                        }}>
                        <Text style={{color: COLORS.NICKEL, fontWeight: '500'}}>
                          {`$${multiSliderValuee[0]}`}
                        </Text>
                        <Text style={{color: COLORS.NICKEL, fontWeight: '500'}}>
                          {`$${multiSliderValuee[1]}`}
                        </Text>
                      </View>
                      <MultiSlider
                        markerStyle={{
                          ...Platform.select({
                            ios: {
                              height: hp(32),
                              width: wp(30),
                              shadowColor: '#000000',
                              shadowOffset: {
                                width: 0,
                                height: hp(3),
                              },
                              shadowRadius: 1,
                              shadowOpacity: 0.1,
                            },
                            android: {
                              height: hp(18),
                              width: wp(16),
                              borderRadius: 50,
                              backgroundColor: COLORS.YELLOW_GREEN,
                            },
                          }),
                        }}
                        pressedMarkerStyle={{
                          ...Platform.select({
                            android: {
                              height: hp(18),
                              width: wp(16),
                              borderRadius: 20,
                              backgroundColor: COLORS.YELLOW_GREEN,
                            },
                          }),
                        }}
                        selectedStyle={{
                          backgroundColor: COLORS.YELLOW_GREEN,
                        }}
                        trackStyle={{
                          backgroundColor: COLORS.DARKGREY,
                          height: hp(4),
                        }}
                        touchDimensions={{
                          height: hp(40),
                          width: wp(40),
                          borderRadius: 20,
                          slipDisplacement: 40,
                        }}
                        values={[multiSliderValuee[0], multiSliderValuee[1]]}
                        sliderLength={wp(300)}
                        onValuesChange={multiSliderValuesChangee}
                        min={0}
                        max={1000}
                        allowOverlap={false}
                        minMarkerOverlapDistance={10}
                      />
                      {/* <Text>{multiSliderValuee[0]}</Text>
                  <Text style={{ marginLeft: 'auto' }}>
                    {multiSliderValuee[1]}
                  </Text> */}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'space-between',
                        marginVertical: hp(20),
                      }}>
                      <View style={{width: '48%'}}>
                        <CustomButton
                          title="Continue"
                          buttonStyle={{
                            marginTop: hp(4),
                            marginHorizontal: wp(0),
                          }}
                          // disable={!checked}
                          onPress={() =>
                            props.navigation.navigate('LocationRadius', {
                              details: {
                                search,
                                multiSliderValue,
                                multiSliderValuee,
                                selectedLanguage,
                                selectedLanguages,
                                address,
                                locationObject,
                              },
                            })
                          }
                        />
                      </View>
                      <View style={{width: '48%'}}>
                        <CustomButton
                          title="Cancel"
                          buttonStyle={{
                            marginTop: hp(4),
                            marginHorizontal: wp(0),
                            backgroundColor: '#F0420B',
                          }}
                          // disable={!checked}
                          onPress={hideModal}
                        />
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>
            </Modal>
          </Portal>
        </View>
        {searchtext ? (
          <FlatList
            // style={{backgroundColor: '#000'}}
            data={categoryList}
            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={ItemSeparatorView}
            renderItem={ItemView}
          />
        ) : null}
        <ScrollView>
          <View
            style={{
              marginVertical: hp(20),
              flexDirection: 'row',
              marginHorizontal: wp(18),
            }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <FlatList
                data={categoryData}
                keyExtractor={(item, index) => `${item.id}#${index}`}
                renderItem={_renderCategoryList}
                horizontal
                ItemSeparatorComponent={() => {
                  return <View style={{width: wp(4)}} />;
                }}
              />
              <View
                style={{width: wp(4), marginStart: wp(5), marginEnd: wp(85)}}>
                <View style={{margin: 4}}>
                  <TouchableOpacity
                    onPress={() => props.navigation.navigate('CategoryListing')}
                    style={[
                      styles.categoryContainer,
                      {backgroundColor: COLORS.YELLOW_GREEN},
                    ]}>
                    <Iicon name={'arrow-redo'} size={35} color={COLORS.WHITE} />
                    <Text
                      numberOfLines={1}
                      style={[styles.categoryTitle, {color: COLORS.WHITE}]}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
          <View style={styles.jobContainer}>
            <Text style={styles.recentJobTitle}>Recent Jobs</Text>
            <View>
              <FlatList
                data={recentJobs?.filter((item, i) => i >= 0 && i <= 5)}
                keyExtractor={(item, index) => `${item.id}#${index}`}
                renderItem={_renderJobList}
                numColumns={2}
              />
              <TouchableOpacity
                style={[styles.buttonStyle, {width: wp(100), left: wp(230),marginBottom:wp(30)}]}
                onPress={() => props.navigation.navigate('RecentJobListing')}>
                <Text style={styles.buttonText}>{'View All'}</Text>

                <MIcon
                  name="arrow-right-thin"
                  size={wp(14)}
                  color={COLORS.YELLOW_GREEN}
                  style={{marginRight: wp(5)}}
                />
              </TouchableOpacity>
            </View>
            {/* {_renderJobList()} */}
          </View>
          {/* <View style={{marginTop: hp(4), marginHorizontal: wp(14)}}>
            <Text style={styles.recentJobTitle}>Expertise</Text>
            {_renderExpertise()}
            <View style={{top: hp(15), marginBottom: hp(25)}}>
              <TouchableOpacity
                style={[styles.buttonStyle, {width: wp(100), left: wp(230)}]}>
                <Text style={styles.buttonText}>{'View All'}</Text>

                <MIcon
                  name="arrow-right-thin"
                  size={wp(14)}
                  color={COLORS.YELLOW_GREEN}
                  style={{marginRight: wp(5)}}
                />
              </TouchableOpacity>
            </View>
          </View> */}

          <View />
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
};
