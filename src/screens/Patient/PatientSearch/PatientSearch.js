import { func } from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Platform, ActivityIndicator, RefreshControl,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Searchbar,
  Avatar,
  Caption,
  Card,
  Paragraph,
  Title,
  Menu,
  Checkbox,
  Snackbar,
} from 'react-native-paper';
import { Header2, Header3, Header5 } from '../../../components/Header/Header';
import Autocomplete from 'react-native-autocomplete-input';
import { search } from '../../Services/apis';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import Slider from '@react-native-community/slider';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import { AirbnbRating, Rating } from 'react-native-ratings';
import { RFValue } from 'react-native-responsive-fontsize';
import * as RNLocalize from 'react-native-localize';
export const PatientSearch = (props) => {


  const [searchQuery, setSearchQuery] = useState('');
  const [searchdoctor, setSearchDoctor] = useState([]);
  const [image, SetImage] = useState('');
  const [range, setRange] = useState(0);
  const [visible, setVisible] = useState(false);
  const [pricevisible, setPriceVisible] = useState(false);
  const [loading, setLoding] = React.useState(false);
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [price, setPrice] = useState('');
  const [convisible, setConVisible] = useState(false);
  const [conrange, setConrange] = useState(0);
  const [type, setType] = useState('All');
  const [secondchecked, setSecondchecked] = useState(false);
  const [thirdcheck, setThirdcheck] = useState(false);
  const [showtype, setShowType] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedall, setCheckedAll] = useState(false);
  const [error, setError] = useState({ iserror: false, message: '' });
  const [locationStatus, setLocationStatus] = useState('');
  const [rating, SetRating] = useState(0);
  const [ratingtype, setRatingType] = React.useState(false);
  const [ratingchecked, setRatingChecked] = useState(false);
  const [ratingschecked, setRatingsChecked] = useState(false);
  const [ratingtchecked, setRatingtChecked] = useState(false);
  const [ratingfchecked, setRatingfChecked] = useState(false);
  const [consultationtype, setConsultationType] = useState(false);
  const [consultationchecked, setConsultationChecked] = useState(false);
  const [consultationschecked, setConsultationsChecked] = useState(false);
  const [consultationfchecked, setConsultationfChecked] = useState(false);
  const [showerror, setShowerror] = useState(false);
  const [consultation, setConsultation] = useState(0);
  const [unseencount, SetUnseenCount] = React.useState();
  const [text, setText] = useState([]);
  const [value, setValue] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filteredData, setFiltedData] = useState({
    rating: '',
    keyword: '',
    time_zone: RNLocalize.getTimeZone(),
    long1: '',
    lat1: '',
    consultation: '',
    distance: '',
    type: '',
    price_range: ''

  })
  const [showList, setShowList] = useState(false);
  const getunseennotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    //console.log('user id =====>>>>', user_id);
    //console.log('token123=', token);
    const data = {
      patient_id: user_id,
    };

    setLoding(true);
    await Apis.unseenNotification(data)

      .then((response) => {
        //console.warn('unseencount', response.data);
        setLoding(false);
        SetUnseenCount(response.data.response);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  function query(data, _query) {
    if (!data.length || _query === '') {
      return [];
    }

    const regex = new RegExp(`${_query.trim()}`, 'i');
    return data.filter((item) => item.name.search(regex) >= 0);
  }
  const queriedDoctor = query(text, value);
  function compareTitle(data, title) {
    // console.log('dataaaaa', data);
    let flag = false;
    data?.forEach((el) => {
      if (el?.name.toLowerCase() === title.toLowerCase().trim()) {
        flag = true;
      }
    });
    return flag;
  }
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
          } else {
            setLocationStatus('Permission Denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
  }, []);

  useEffect(() => {
    allDataFunc()
    setShowList(false)
    const unsubscribe = props.navigation.addListener('focus', () => {
      setVisible(false);
      setShowList(false)
      // setSearchDoctor([]);
      setValue('');

      allDataFunc()
    });
    return unsubscribe;
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true),
      setSearchQuery(''),
      allDataFunc(),
      setValue(''),
      closeConsultation();
    setConsultationfChecked(false),
      setConsultationChecked(false)
    setRatingfChecked(false),
      setRatingtChecked(false),
      setRatingsChecked(false),
      setChecked(false),
      setSecondchecked(false),
      setThirdcheck(false)
    setCheckedAll(false),
      setVisible(false)
    setPriceVisible(false),
      //setRatingChecked(false)
      //setLoding(true);
      setTimeout(() => {
        setRefreshing(false);
        //setSearchQuery(''),
        //allDataFunc(), setFiltedData('')
        //setLoding(false);
      }, 2000);
    // wait(3000).then(() => setRefreshing(false));
  }, []);



  const allDataFunc = () => {
    setConsultationfChecked(false),
      setConsultationChecked(false),
      setRatingfChecked(false),
      setRatingtChecked(false),
      setRatingsChecked(false),
      setChecked(false),
      setSecondchecked(false),
      setThirdcheck(false)
    setCheckedAll(false),
      setVisible(false),
      setPriceVisible(false),
      // setValue(''), closeConsultation();
      //console.log("==========All data Function")
      setFiltedData('')
    setSearchQuery('')
    setFiltedData({ ...filteredData, keyword: '' })

    setSearchDoctor([])
    const data1 = {
      rating: '',
      keyword: '',
      time_zone: RNLocalize.getTimeZone(),
      long1: '',
      lat1: '',
      consultation: '',
      distance: '',
      type: '',
      price_range: ''

    }
    console.log("======Data!=======", data1)
    PatientShorting(data1)
  }
  useEffect(() => { }, []);
  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');

        //getting the Longitude from the location json
        const currentLongitude = position.coords.longitude;

        //getting the Latitude from the location json
        const currentLatitude = position.coords.latitude;

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
        //setFiltedData({ ...filteredData, lat1: position.coords.latitude, long1: position.coords.longitude })
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };
  //console.log('lat-----', currentLatitude);

  const debounce = (funct, delay) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => funct.apply(this, args), delay);
    };
  };
  const distancevisible = () => {
    return (
      setVisible(!visible),
      setPriceVisible(false),
      setConVisible(false),
      // locationSearch()
      locationSearch1()
    )
  };
  const Pricevisible = () => {
    return (
      setPriceVisible(true),
      setVisible(false),
      setConVisible(false),
      setShowType(false)
    );
  };
  const AllPricevisible = () => {
    return (
      setVisible(false),
      setShowType(false),
      setPriceVisible(false),
      setConVisible(false)
    );
  };
  const consultationvisible = () => {
    return (
      setConVisible(true),
      setPriceVisible(false),
      setVisible(false),
      ConsultationSearch()
    );
  };

  const onChangeSearch = (query1) => {
    console.log("===== query1==========", query1)
    setSearchQuery(query1);


    const temp1 = filteredData
    temp1.keyword = query1
    setFiltedData(temp1)
    PatientShorting(temp1);



  }
  const onChangeSearch1 = (query) => {
    setSearchQuery(query);
    console.log('first', query)

    const data = {
      keyword: query,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('ddddaaa==', data);
    Apis.search(data)
      .then((response) => {
        console.warn('responsedata=================>', response.data);
        if (response.data.success === '0') {
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
        }
        setSearchDoctor(response.data.response ?? []);
        console.log('first response', response.data.response ?? [])
        SetImage(response.data.response.profile_image);
        if (query === '') {
          setSearchDoctor([]);
        }
      })
      .catch((error) => {
        console.error(error.response);
      });
  };
  //console.log('sss---', searchdoctor);

  const locationSearch1 = (value) => {
    //setFiltedData({ ...filteredData, lat1: position.coords.latitude, long1: position.coords.longitude })

    console.log("========locationSearch1 value========>", value)
    setRange(value)
    const temp1 = filteredData
    temp1.distance = value == (0 || undefined || null) ? '' : `${Math.floor(value * 100)}miles`,
      temp1.lat1 = value == (0 || undefined || null) ? '' : currentLatitude,
      temp1.long1 = value == (0 || undefined || null) ? '' : currentLongitude
    setFiltedData(temp1)
    console.log('===============>', temp1)
    PatientShorting(temp1);

  };

  const locationSearch = async (query) => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      long1: currentLongitude,
      lat1: currentLatitude,
      keyword: searchQuery,
      distance: `${Math.floor(range * 100)}miles`,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log(data);
    setLoding(true);
    Apis.locationsearch(data)

      .then((response) => {
        console.warn(response.data);
        setSearchDoctor(response.data.response ?? []);
        setLoding(false);
      })
      .catch((error) => {
        console.warn(error.response.data);
        setLoding(false);
        setShowerror(true);
        setError((data) => ({
          ...data,
          iserror: true,
          message: error.response.data.errors.keyword,
        }));
      });
  };
  const Sorting = async (consultation) => {
    setConsultation(consultation);
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      keyword: searchQuery,
      counsultation: consultation,
      price_range: '',
      distance: '',
      rating: '',
      type: '',
      time_zone: RNLocalize.getTimeZone(),
      long1: currentLongitude,
      lat1: currentLatitude,
    };
    console.log(data);
    setLoding(true);
    Apis.patientsorting(data)

      .then((response) => {
        console.warn(response.data);
        // if (response.data.success === '0') {
        //   setShowerror(true);
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: response.data.errors,
        //   }));
        // } else {
        //   setShowerror(false);
        setSearchDoctor(response.data.response ?? []);
        // }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data.errors.keyword);
        setLoding(false);
        setShowerror(true);

        setError((data) => ({
          ...data,
          iserror: true,
          message: error.response.data.errors.keyword,
        }));
      });
  };


  const ConsultationSearch = async (consultation1) => {
    console.log("======consultation1======", consultation1)
    //setFiltedData({ ...filteredData, consultation: consultation1 })
    const temp1 = filteredData
    temp1.consultation = consultation1,
      setFiltedData(temp1)
    PatientShorting(temp1);

  };
  const ConsultationSearch1 = async (consultation) => {
    setConsultation(consultation);
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      keyword: searchQuery,
      counsultation: consultation,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log(data);
    setLoding(true);
    Apis.consultationsearch(data)

      .then((response) => {
        console.warn(response.data);
        // if (response.data.success === '0') {
        //   setShowerror(true);
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: response.data.errors,
        //   }));
        // } else {
        //   setShowerror(false);
        setSearchDoctor(response.data.response ?? []);
        // }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data.errors.keyword);
        setLoding(false);
        setShowerror(true);

        setError((data) => ({
          ...data,
          iserror: true,
          message: error.response.data.errors.keyword,
        }));
      });
  };

  const emptyFunc = () => {
    console.log('EmptyFunc=====>', checked)
    if (!checked == '') {
      setPriceVisible(false),
        FeesSearch('', '')
    }
  }

  const FeesSearch = async (type, pric) => {
    console.log("====FeesSearch=====", type)
    setType(type)
    setPrice(pric),
      console.log("====Price=====", type, pric)
    //price_range: Math.floor(price * 100),
    // setFiltedData({ ...filteredData, type: type1 })
    //setPrice(Math.floor(pric * 100))
    var temp1 = filteredData
    temp1.type = type
    if (pric == '') {
      temp1.price_range = pric,
        setFiltedData(temp1)

      PatientShorting(temp1);

    }
    else {
      temp1.price_range = Math.floor(pric * 100),
        // temp1.price_range = value == (0 || undefined || null) ? '' : currentLatitude,
        console.log("=========Temp!========", temp1)
      setFiltedData(temp1)

      PatientShorting(temp1);

    }



  };

  const FeesSearch1 = async (type) => {
    setType(type);
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      type: type,
      time_zone: RNLocalize.getTimeZone(),
      price_range: Math.floor(price * 100),
      keyword: searchQuery,
    };
    console.log(data);
    setLoding(true);
    Apis.feessearch(data)

      .then((response) => {
        console.warn(response.data);
        setSearchDoctor(response.data.response ?? []);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data.errors);
        setLoding(false);
        setShowerror(true)
        setError((data) => ({
          ...data,
          iserror: true,
          message: error.response.data.errors.keyword,
        }));
      });
  };


  const Specialist = async () => {
    Apis.specialistlist()

      .then((response) => {
        console.warn(response.data);
        setText(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
        // setError((data) => ({
        //   ...data,
        //   iserror: true,
        //   message: error.response.data.errors,
        // }));
      });
  };

  const RatingSearch = (rating1) => {
    console.log("rating1", rating1)
    SetRating(rating1);
    // setFiltedData({ ...filteredData, rating: rating1, })
    const temp1 = filteredData
    temp1.rating = rating1,
      console.log("=====temp1=========>", temp1)
    setFiltedData(temp1)
    PatientShorting(temp1);

  }

  const RatingSearch1 = async (rating) => {
    SetRating(rating);
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      rating: rating,
      keyword: searchQuery,
      time_zone: RNLocalize.getTimeZone(),
      // rating: rating,
      // keyword: searchQuery,
      // time_zone: RNLocalize.getTimeZone(),
      // long1: currentLongitude,
      // lat1: currentLatitude,
      // consultation: '',
      // distance: `${Math.floor(range * 100)}miles`,
      // type: '',
      // price_range: ''

    };
    console.warn("========rating data=============>", data);
    setLoding(true);
    Apis.ratingsearch(data)

      .then((response) => {
        console.warn(response.data);
        setSearchDoctor(response.data.response ?? []);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data.errors);
        setLoding(false);
        setShowerror(true);
        setError((data) => ({
          ...data,
          iserror: true,
          message: error.response.data.errors.keyword,
        }));
      });
  };



  const PatientShorting = async (data) => {

    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    //console.log('user id =====>>>>', user_id);
    //console.log('token123=', token);

    console.warn("========rating data=============>", data);

    setLoding(true);
    Apis.patientsorting(data)

      .then((response) => {
        setLoding(false);
        // console.warn("===========Shorting Respone===========", response.data);
        //if(response.data.response != undefined && response.data.response.length !=0){}
        setSearchDoctor(response.data.response);

      })
      .catch((error) => {
        setLoding(false);
        //console.warn(error.response.data);

        setShowerror(true);
        setSearchDoctor([])
        // setError((data) => ({
        //   ...data,
        //   iserror: true,
        //   message: error.response.data.errors,
        // }));
      });
  };


  useEffect(() => {
    Specialist();
    getunseennotification();
  }, [searchQuery]);
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  const openMenu = () => setShowType(true);

  const closeMenu = () => setShowType(false);

  const openRating = () => setRatingType(true);

  const closeRating = () => setRatingType(false);
  const openConsultation = () => setConsultationType(true);

  const closeConsultation = () => setConsultationType(false);


  const myPrice = (price1) => {
    //console.log("========Price=======", typeof price1, price1)
    if (price1 == '' || undefined || null) {
      return (
        <View>
          <Text style={{ color: '#000' }}>
            $ 0
          </Text>
        </View>

      );


    }
    else if (price1 == '0') {
      <View>
        <Text style={{ color: '#000' }}>
          $ 0
        </Text>
      </View>


    }
    else {
      return (
        <View>
          <Text style={{ color: '#000' }}>
            $ {Math.floor(price * 100)}
          </Text>
        </View>


      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header3
        title="Search Doctor"
        navProps={props.navigation}
        unseencount={unseencount?.toString()}
      />
      {showerror ?
        <Snackbar
          visible={error.iserror}
          onDismiss={onDismissSnackBar}
          style={{ backgroundColor: '#d15656', zIndex: 1 }}
        >
          {error.message}
        </Snackbar>
        : null}



      <View style={{ position: 'relative', flex: 1 }}>

        <View style={styles.autocompleteContainer}>
          <Autocomplete
            style={{ color: '#000' }}
            data={
              queriedDoctor?.length >= 1 && compareTitle(queriedDoctor, value)
                ? [] // Close suggestion list in case movie title matches query
                : queriedDoctor
            }
            value={value}
            onChangeText={(_text) => {
              //setShowList(true)
              setShowerror(false);
              setValue(_text);
              // onChangeSearch(_text);
              // setRatingChecked(false);
              // setRatingsChecked(false);
              // setRatingtChecked(false);
              // setRatingfChecked(false);
              // setVisible(false);
              // setChecked(false);
              // setSecondchecked(false);
              // setThirdcheck(false);
              setPriceVisible(false);
              setFiltedData({ ...filteredData, keyword: _text })
              if (_text == '') {
                setShowList(false)
              } else {
                setShowList(true)
              }

              //console.log("=================>", filteredData)
            }}
            onFocus={() => {
              setShowList(true)
              setValue((prevData) => {
                if (prevData.length) {
                  return prevData;
                } else {
                  return ' ';
                }
              });
            }}
            placeholder="Please enter specialization name."
            flatListProps={{
              //   keyboardShouldPersistTaps: 'always',
              keyExtractor: (doctor) => doctor.id,
              renderItem: ({ item: { name } }) => (
                <TouchableOpacity
                  style={{
                    height: 30,
                    marginVertical: 2,
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    setValue(name);
                    onChangeSearch(name);
                    setShowList(false)
                  }}
                >
                  <Text style={styles.itemText}>{name}</Text>
                </TouchableOpacity>
              ),
            }}
            labelStyle={{ color: ' #000' }}
            textStyle={{ color: '#000' }}
            containerStyle={{ height: '100%' }}
            listContainerStyle={{
              backgroundColor: '#fff',
              // borderColor: '#c9c5b9',
              // borderWidth: 1,

              height: '68%',
              paddingBottom: 4
            }}
            listStyle={{ marginBottom: 10 }}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '90%',
            justifyContent: 'space-evenly',
            marginBottom: 10,
            alignSelf: 'center',
            marginTop: 50,
            // position: 'absolute',
            // left: 0,
            // top: 0,
            zIndex: showList ? 0 : 1,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              distancevisible(); setConsultationChecked(false);
              setConsultationfChecked(false);
            }}
            style={
              visible ? styles.unchecklocationcolor : styles.checklocationcolor
            }

          >
            <Text
              style={{
                textAlign: 'center',
                color: visible ? '#fff' : '#000',
                fontSize: RFValue(11),
                fontWeight: 'bold',
              }}
            >
              Location
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openMenu}
            style={checked || secondchecked || thirdcheck ? styles.unchecktypecolor : styles.checktypecolor}
          >
            <Menu
              visible={showtype}
              onDismiss={closeMenu}
              anchor={
                <Button
                  onPress={openMenu}
                  uppercase={false}
                  contentStyle={{ paddingVertical: 3 }}
                  labelStyle={{
                    fontSize: RFValue(11),
                    color: checked || secondchecked || thirdcheck ? '#fff' : '#000',
                    alignSelf: 'center',
                    marginLeft: 15,
                    fontWeight: 'bold',
                  }}
                >
                  Type
                </Button>
              }
            >
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item
                  // onPress={() => {
                  //   AllPricevisible();
                  //   FeesSearch('All');
                  // }}
                  title="All"
                  style={{ marginTop: -10 }}
                />

                <Checkbox
                  //status={checkedall ? 'checked' : 'unchecked'}
                  status={checked == 'All' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    //setCheckedAll(!checkedall);
                    //setCheckedAll(!checkedall);
                    setCheckedAll(true)
                    // setCheckedAll(false)
                    if (checked == 'All') {
                      setPriceVisible(false), closeMenu(), emptyFunc(), setChecked('')
                      // setPriceVisible(false), closeMenu(), emptyFunc(), setChecked('')
                    }
                    else {
                      setPriceVisible(true), closeMenu(),
                        FeesSearch('All', ''), setChecked('All'),
                        AllPricevisible()
                      // setPriceVisible(true),
                      //   closeMenu(),
                      //   FeesSearch('All', ''), setChecked('All')
                      // AllPricevisible()

                    }
                    // AllPricevisible();
                    // FeesSearch('All', '');
                    // setSecondchecked(false), setThirdcheck(false), setChecked(false)
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item

                  title="Audio"
                  style={{ marginTop: -10 }}
                />
                <Checkbox
                  status={checked == 'Audio' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    //setChecked(!checked);
                    setCheckedAll(false)
                    if (checked == 'Audio') {
                      setPriceVisible(false), closeMenu(), emptyFunc(), setChecked('')
                    } else {
                      setPriceVisible(true), closeMenu(),
                        FeesSearch('A', ''), setChecked('Audio')
                    }

                    // {
                    //   checked ? (setPriceVisible(false), closeMenu(), emptyFunc(), setChecked(false)) : (Pricevisible(),
                    //     FeesSearch('A', price), setSecondchecked(false), setThirdcheck(false), setCheckedAll(false)), setChecked(false)
                    // }
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item

                  title="Video"
                  style={{ marginTop: -10 }}
                />
                <Checkbox
                  status={checked == 'Video' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setCheckedAll(false)


                    if (checked == 'Video') {
                      setPriceVisible(false), closeMenu(), emptyFunc(), setChecked('')
                    } else {
                      setPriceVisible(true), closeMenu(),
                        FeesSearch('V', ''), setChecked('Video')
                    }
                    // setSecondchecked(!secondchecked);

                    // console.log('src==============', secondchecked)
                    // {
                    //   secondchecked ? (setPriceVisible(false), closeMenu(), emptyFunc()) : (Pricevisible(),
                    //     FeesSearch('V', price), setChecked(false), setThirdcheck(false), setCheckedAll(false))
                    // }
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item

                  title="Chat"
                  style={{ marginTop: -10 }}
                />
                <Checkbox
                  status={checked == 'Chat' ? 'checked' : 'unchecked'}
                  onPress={() => {
                    // setThirdcheck(!thirdcheck);
                    // {
                    //   thirdcheck ? (setPriceVisible(false), closeMenu(), emptyFunc()) : (Pricevisible(),
                    //     FeesSearch('C', price), setSecondchecked(false), setChecked(false), setCheckedAll(false))
                    // }
                    setCheckedAll(false)
                    if (checked == 'Chat') {
                      setPriceVisible(false), closeMenu(), emptyFunc(), setChecked('')
                    } else {
                      setPriceVisible(true), closeMenu(),
                        FeesSearch('C', ''), setChecked('Chat')
                    }

                  }}
                />
              </View>
            </Menu>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openRating}
            style={
              ratingfchecked ||
                ratingchecked ||
                ratingschecked ||
                ratingtchecked
                ? styles.uncheckratingcolor
                : styles.checkratingcolor
            }

          >
            <Menu
              visible={ratingtype}
              onDismiss={closeRating}
              anchor={
                <Button
                  onPress={openRating}
                  uppercase={false}
                  contentStyle={{ paddingVertical: 6 }}
                  labelStyle={{
                    fontSize: RFValue(10),
                    color: ratingfchecked ||
                      ratingchecked ||
                      ratingschecked ||
                      ratingtchecked
                      ? '#fff' : '#000',

                    fontWeight: 'bold',
                    marginLeft: 4,
                    marginRight: 4,
                  }}
                >
                  Rating
                </Button>
              }
            >
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item
                  // onPress={() => {
                  //   RatingSearch(4);
                  // }}
                  title="4⭐ & above"
                  style={{ marginTop: -10 }}
                />
                <Checkbox
                  status={ratingchecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    // setRatingChecked(!ratingchecked);
                    // RatingSearch(4);
                    if (ratingchecked) {
                      setRatingChecked(!ratingchecked);
                      RatingSearch('');
                    } else {
                      setRatingChecked(!ratingchecked);
                      RatingSearch(4);
                    }
                    setRatingfChecked(false);
                    setRatingsChecked(false);
                    setRatingtChecked(false);
                    setPriceVisible(false);
                    setVisible(false);
                    setConVisible(false);
                    closeRating();
                    // setRatingType(false);
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item
                  // onPress={() => {
                  //   RatingSearch(3);
                  // }}
                  title="3⭐ & above"
                  style={{ marginTop: -10 }}
                />
                <Checkbox
                  status={ratingfchecked ? 'checked' : 'unchecked'}
                  onPress={() => {


                    if (ratingfchecked) {
                      setRatingfChecked(!ratingfchecked);
                      RatingSearch('');
                    } else {
                      setRatingfChecked(!ratingfchecked);
                      RatingSearch(3);
                    }
                    setRatingChecked(false);
                    setRatingsChecked(false);
                    setRatingtChecked(false);
                    setPriceVisible(false);
                    setVisible(false);
                    closeRating();
                    // setRatingType(false);
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item
                  // onPress={() => {
                  //   RatingSearch(2);
                  // }}
                  title="2⭐ & above"
                  style={{ marginTop: -10 }}
                />
                <Checkbox
                  status={ratingschecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    // setRatingsChecked(!ratingschecked);
                    // RatingSearch(2);

                    if (ratingschecked) {
                      setRatingsChecked(!ratingschecked);
                      RatingSearch('');
                    } else {
                      setRatingsChecked(!ratingschecked);
                      RatingSearch(2);
                    }
                    setRatingChecked(false);
                    setRatingfChecked(false);
                    setRatingtChecked(false);
                    setPriceVisible(false);
                    setVisible(false);
                    closeRating();
                    // setRatingType(false);
                  }}
                />
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item
                  // onPress={() => {
                  //   RatingSearch(1);
                  // }}
                  title="1⭐ & above"
                  style={{ marginTop: -10 }}
                />
                <Checkbox
                  status={ratingtchecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    if (ratingtchecked) {
                      setRatingtChecked(!ratingtchecked);
                      RatingSearch('');
                    } else {
                      setRatingtChecked(!ratingtchecked);
                      RatingSearch(1);
                    }
                    setRatingChecked(false);
                    setRatingsChecked(false);
                    setRatingfChecked(false);
                    setPriceVisible(false);
                    setVisible(false);
                    closeRating();
                    // setRatingType(false);
                  }}
                />
              </View>
            </Menu>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openConsultation}
            style={
              consultationchecked ||
                consultationfchecked ||
                consultationschecked
                ? styles.uncheckconsultscolor
                : styles.checkconsultscolor
            }

          >
            <Menu
              visible={consultationtype}
              onDismiss={closeConsultation}
              anchor={
                <Button
                  onPress={openConsultation}
                  uppercase={false}
                  contentStyle={{ paddingVertical: 5 }}
                  labelStyle={{
                    fontSize: RFValue(11),
                    // color: consultationchecked ||
                    //   consultationfchecked ||
                    //   consultationschecked
                    color:
                      consultationchecked ||
                        consultationfchecked
                        ? '#fff' : '#000',

                    fontWeight: 'bold',
                    marginLeft: 4,
                    marginRight: 2,
                  }}
                >
                  Consults
                </Button>
              }
            >
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item
                  onPress={() => {
                    ConsultationSearch("low");
                    closeConsultation();
                    setConsultationChecked(true);
                    setConsultationfChecked(false);
                  }}
                  //   title="1000+ & above"
                  title="Low to High"
                  style={{ marginTop: -10 }}
                />
                {/* <Checkbox
                  status={consultationchecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setConsultationChecked(!consultationchecked);
                    ConsultationSearch(1000);
                    setConsultationfChecked(false);
                    setConsultationsChecked(false);
                    closeConsultation();
                    // setConsultationType(false);
                  }}
                /> */}
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Menu.Item
                  onPress={() => {
                    ConsultationSearch("high");
                    closeConsultation();
                    setConsultationChecked(false);
                    setConsultationfChecked(true);
                  }}
                  // title="500+ & above  "
                  title="High to Low"
                  style={{ marginTop: -10 }}
                />
                {/* <Checkbox
                  status={consultationfchecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setConsultationfChecked(!consultationfchecked);

                    ConsultationSearch(high);
                    setConsultationChecked(false);
                    setConsultationsChecked(false);
                    closeConsultation();
                    // setConsultationType(false);
                  }}
                  style={{ justifyContent: 'flex-end' }}
                /> */}
              </View>
              {/* <View style={{ flexDirection: 'row' }}>
                <Menu.Item
                  onPress={() => {
                    RatingSearch(2);
                  }}
                  title="2⭐ & above"
                  style={{ marginTop: -10 }}
                />
                <Checkbox
                  status={ratingschecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setRatingsChecked(!ratingschecked);
                    RatingSearch(2);
                    setRatingChecked(false);
                    setRatingfChecked(false);
                    setRatingtChecked(false);
                    setRatingType(false);
                  }}
                />
              </View> */}
              {/* <View style={{ flexDirection: 'row' }}>
                <Menu.Item
                  // onPress={() => {
                  //   ConsultationSearch(100);
                  // }}
                  title="100+ & above  "
                  style={{ marginTop: -10 }}
                />
                <Checkbox
                  status={consultationschecked ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setConsultationsChecked(!consultationschecked);

                    ConsultationSearch(100);
                    setConsultationChecked(false);
                    setConsultationfChecked(false);
                    closeConsultation();
                    // setConsultationType(false);
                  }}
                  style={{ marginLeft: 15 }}
                />
              </View> */}
            </Menu>
          </TouchableOpacity>
        </View>
        <View>
          {visible ? (
            <View>
              {/* <Text style={{ marginLeft: 30, fontSize: 16, color: '#000' }}>
                Distance
              </Text> */}
              <Text style={{ marginLeft: 35, fontSize: 16, color: '#000' }}>
                1 mile
              </Text>
              <Text
                style={{
                  marginRight: '15%',
                  fontSize: 16,
                  color: '#000',
                  alignSelf: 'flex-end',
                  marginTop: -20,
                }}
              >
                100 miles
              </Text>
              <Slider
                style={{
                  width: 310,
                  height: 50,
                  marginTop: -13,
                  marginLeft: 25,
                }}
                minimumValue={0}
                maximumValue={1}
                thumbTintColor="#2173A8"
                minimumTrackTintColor="#2173A8"
                maximumTrackTintColor="#2173A8"
                onValueChange={(value) => setRange(value)}
                value={0}
                onSlidingComplete={(value) => {
                  locationSearch1(value)
                }}
                onTouchEnd={() => {
                  //locationSearch1();
                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#2173A8',
                  marginTop: -15,
                }}
              >
                {Math.floor(range * 100)} miles
              </Text>
            </View>
          ) : null}
        </View>
        <View>
          {pricevisible ? (
            <View>
              <Text style={{ marginLeft: 35, fontSize: 16, color: '#2173A8' }}>
                Price
              </Text>
              <Text style={{ marginLeft: 35, fontSize: 16, color: '#000' }}>
                Min
              </Text>
              <Text
                style={{
                  marginRight: '15%',
                  fontSize: 16,
                  color: '#000',
                  alignSelf: 'flex-end',
                  marginTop: -22,
                }}
              >
                Max
              </Text>
              <Slider
                style={{
                  width: 300,
                  height: 50,
                  flexDirection: 'row',
                  marginLeft: 20,
                  marginTop: -20,
                }}



                minimumValue={0}
                maximumValue={1}
                thumbTintColor="#2173A8"
                minimumTrackTintColor="#2173A8"
                maximumTrackTintColor="#2173A8"
                onValueChange={(value) => {
                  // setPrice(value),
                  // console.log("=======value==========", value)
                  //setFiltedData({ ...filteredData, price_range: value })
                }}
                //value={price == '' ? price == '0' ? 1 : 0 : price}
                value={price == '' ? 0 : price}
                onSlidingComplete={(value) => {
                  // console.log("==========onSlidingComplete=========>", value)
                  FeesSearch(type, value)
                }}
                onTouchEnd={() => {


                  //console.log("value=====>", filteredData.price_range)
                  // console.log("=======price==========", price)
                  //FeesSearch(type, filteredData.price_range);



                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: '#000',
                }}
              > {myPrice(price)}

                {/* $ {Math.floor(price * 100)} */}
              </Text>
            </View>
          ) : null}
        </View>


        {searchdoctor.length == 0 || '' || undefined ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 90,
            }}>
            {/* <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }}>
              No doctor available
            </Text> */}

            <View
              style={{
                backgroundColor: '#2173A8',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
                marginVertical: 40,
                paddingVertical: 15,
                paddingHorizontal: 15,
              }}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: 18,
                  fontFamily: 'Roboto-Regular',
                  fontWeight: 'bold',
                }}>
                No doctor available
              </Text>
            </View>

          </View>
        ) : (


          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }

          >
            {searchdoctor.map((el, i) => (
              <Card
                style={{
                  marginTop: 15,

                  width: '85%',
                  alignSelf: 'center',
                  backgroundColor: '#fff',
                }}
                onPress={() =>
                  props.navigation.navigate('DoctorProfile', { id: el.id })
                }
              >
                <Card.Content>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '100%',
                    }}
                    onPress={() =>
                      props.navigation.navigate('DoctorProfile', { id: el.id })
                    }
                  >
                    <View style={{ width: '30%' }}>
                      <Image
                        source={{ uri: el.profile_image }}
                        style={{
                          marginRight: 10,
                          alignSelf: 'flex-start',
                          marginTop: -30,
                          width: 90,
                          height: 90,
                          borderRadius: 90,
                          marginLeft: -10,
                          borderWidth: 1, borderColor: '#ddd',
                          resizeMode: 'contain'
                        }}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.navigate('BookAppointment', {
                            id: el.id,
                          })
                        }
                        // style={{ marginRight: 50 }}
                        style={{
                          alignSelf: 'center',
                          marginTop: 30,
                          marginRight: 20,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="calendar-month-outline"
                          color="#2173A8"
                          size={30}
                          solid
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: -10, marginLeft: "2.5%", width: "66.5%" }}>
                      <Title style={{ color: '#000' }}>{el.name}</Title>
                      {/* <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('BookAppointment', {
                        id: el.id,
                      })
                    }
                    style={{ marginLeft: 40, marginTop: 5 }}
                  >
                    <MaterialCommunityIcons
                      name="calendar-month-outline"
                      color="#000"
                      size={30}
                      solid
                    />
                  </TouchableOpacity> */}

                      <Paragraph
                        style={{
                          color: '#000',
                          marginLeft: "2.7%",
                          // backgroundColor: 'red',
                        }}
                      >
                        {el.speciality}
                      </Paragraph>
                      <Paragraph style={{ color: '#2173A8', marginLeft: "3.2%", }}>About :
                        <Paragraph style={{ color: '#000', marginLeft: '2.7%', textAlign: 'justify' }}>{' '}
                          {el.about.length > 25 ? el.about.substring(0, 20) + '...' : el.about}
                        </Paragraph>
                      </Paragraph>
                      <Paragraph style={{ color: '#2173A8', marginLeft: "3.2%", }}>No of Consultations :
                        <Paragraph
                          style={{
                            color: '#000',
                            flexWrap: 'wrap',
                            marginLeft: '2.5%',
                          }}
                        >
                          {' '}{el.consultation}
                        </Paragraph>
                      </Paragraph>
                      <Paragraph style={{
                        color: '#2173A8', marginLeft: "3.5%",
                        //backgroundColor: 'red',
                      }}>Available Slots :
                        <Paragraph style={{ color: '#000', flexWrap: 'wrap' }}>
                          {' '}  {el.avl_slots}
                        </Paragraph>
                      </Paragraph>
                      {/* <Text
                    style={{ fontSize: 14, color: '#000', fontWeight: 'bold' }}
                  >
                    Fees:
                  </Text> */}
                      <View
                        style={{
                          flexDirection: 'row',
                          marginBottom: 5,
                          flexWrap: 'wrap',
                          marginLeft: '2.5%',
                          alignItems: 'center'
                          // backgroundColor: 'red',
                        }}
                      >
                        <Text style={{ color: '#2173A8', }}>Audio:<Text style={{ color: '#000' }}> ${el.audio_fee}{' '}
                        </Text></Text>

                        <Text style={{ color: '#2173A8', }}>Video:<Text style={{ color: '#000' }}> ${el.video_fee}{' '}
                        </Text></Text>

                        <Text style={{ color: '#2173A8', }}>Chat:<Text style={{ color: '#000' }}> ${el.chat_fee}{' '}
                        </Text></Text>


                        {/* Consultation */}
                      </View>
                      <View
                        style={{
                          marginLeft: "2.5%",
                          alignItems: 'center',
                          flexDirection: 'row',
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
                          backgroundColor: 'green', marginLeft: 15, borderRadius: 3,
                          width: 25, height: 25, alignItems: "center", justifyContent: "center"
                        }}>
                          <Text
                            style={{
                              color: '#fff',
                              textAlign: "center",
                              left: -2
                            }}
                          >
                            {/* {el.rating} */} {el.rating_count}
                          </Text>
                        </View>

                        {/* <Text> (200)</Text> */}
                      </View>
                      {/* 
                  <TouchableOpacity
                    onPress={() =>
                      props.navigation.navigate('BookAppointment', {
                        id: el.id,
                      })
                    }
                  >
                    <MaterialCommunityIcons
                      name="calendar-month-outline"
                      color="#000"
                      size={30}
                      solid
                      style={{ alignSelf: 'center', marginLeft: 50 }}
                    />
                  </TouchableOpacity> */}
                    </View>
                  </TouchableOpacity>
                </Card.Content>
              </Card>
            ))}
            {loading ? (
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  //backgroundColor: 'red',
                  // marginTop: 150,
                  position: 'absolute',
                }}>
                <ActivityIndicator size={40} color="#2E4497" />
              </View>
            ) : null}
          </ScrollView>

        )}
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkconsultscolor: {
    borderColor: '#2173A8',
    borderWidth: 1,
    marginTop: 15,
    borderRadius: 10,
    //  height: 45,
    width: '22%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    // alignSelf: 'flex-end',
    elevation: 5,
  },
  uncheckconsultscolor: {
    borderColor: '#2173A8',
    borderWidth: 1,
    marginTop: 15,
    borderRadius: 10,
    //  height: 45,
    width: '22%',
    backgroundColor: '#2173A8',
    shadowColor: '#2173A8',
    // alignSelf: 'flex-end',
    elevation: 5,
  },
  checkratingcolor: {
    borderColor: '#2173A8',
    borderWidth: 1,
    marginTop: 15,
    borderRadius: 10,
    // height: 45,
    width: '20%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    alignSelf: 'flex-end',
    elevation: 5,
  },
  uncheckratingcolor: {
    borderColor: '#2173A8',
    borderWidth: 1,
    marginTop: 15,
    borderRadius: 10,
    // height: 45,
    width: '20%',
    backgroundColor: '#2173A8',
    shadowColor: '#2173A8',
    alignSelf: 'flex-end',
    elevation: 5,
  },
  checktypecolor: {
    borderColor: '#2173A8',
    borderWidth: 1,
    marginTop: 15,
    borderRadius: 10,
    height: 45,
    width: '20%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    alignSelf: 'flex-end',
    elevation: 5,
  },
  unchecktypecolor: {
    borderColor: '#2173A8',
    borderWidth: 1,
    marginTop: 15,
    borderRadius: 10,
    height: 45,
    width: '20%',
    backgroundColor: '#2173A8',
    shadowColor: '#2173A8',
    alignSelf: 'flex-end',
    elevation: 5,
  },
  checklocationcolor: {
    borderColor: '#2173A8',
    borderWidth: 1,
    marginTop: 15,
    borderRadius: 10,
    height: 45,
    width: '20%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    alignSelf: 'flex-end',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unchecklocationcolor: {
    borderColor: '#2173A8',
    borderWidth: 1,
    marginTop: 15,
    borderRadius: 10,
    height: 45,
    width: '20%',
    backgroundColor: '#2173A8',
    shadowColor: '#2173A8',
    alignSelf: 'flex-end',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',

  },

  checkborder: {
    borderColor: '#fff',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 20,
    borderRadius: 10,
    height: 50,
    width: '80%',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'flex-start',
    elevation: 15,
  },

  root: {
    marginVertical: 10,
  },

  uncheckborder: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',

    marginTop: 20,

    alignSelf: 'center',
    elevation: 5,
    // height: 90,
    borderRadius: 10,
    width: '90%',
    overflow: 'hidden',
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
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
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
  itemText: {
    fontSize: 15,
    margin: 3,
    color: '#000',
  },
  autocompleteContainer: {
    left: 22,
    position: 'absolute',
    right: 22,
    top: 0,
    flex: 1,
    zIndex: 1,

  },
});