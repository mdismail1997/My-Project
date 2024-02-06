import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {styles} from './styles';
import {Header} from '../../components/Header/Header';
import MapView, {Circle, Marker} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import CustomButton from '../../components/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import Carousel from 'react-native-snap-carousel';
import {Card, Paragraph, Title} from 'react-native-paper';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {getRecentJobListAction} from '../../Redux/actions/HomeAction';
import {COLORS} from '../../utils/Const';
import { getjobSearchAction } from '../../Redux/actions/JobAction';

const LocationRadiusScreen = props => {
  const [index, setIndex] = React.useState(0);
  const [recentJobList, setRecentJobList] = useState([]);
  const [userData, setUserData] = useState('');


  const dispatch = useDispatch();


  const recentJobs = useSelector(state => state.Home.recentJobs);
  const isLoading = useSelector(state => state.Home.isLoading);
  const jobSearch = useSelector(state => state.Job?.jobSearch);
  const currentLocation = useSelector(state => state.Home.currentLocation);

  console.log("00000000000000", jobSearch)


   //console.log("?????????-CURRENTLOCATION-------",currentLocation.position.lat)
  const detailsView = props.route.params.details;
  const carouselRef = React.createRef();

  //console.log('<<<<<<<<<<details >>>>>>>>>>>>>>&&&&', detailsView);

  



  useEffect(() => {
    
    const createjobDetails = props.navigation.addListener('focus', async () => {
      // getLogin();
      // getCurrentLocation1();
      const user = JSON.parse(await AsyncStorage.getItem('USER'));
      console.log('%%=USER DTA=', user.data);
      const query = {
        page: 1,
        limit: 9,
        userId: user.data._id,
        category: detailsView.search,
        distance: currentLocation.distance,
        lat: currentLocation.position.lat,
        long: currentLocation.position.lng,
      }
      
      console.log("=========================", query);
      dispatch(getjobSearchAction(query));
      setUserData(user.data);

    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      dispatch(getRecentJobListAction());
      //  console.log('details >>>>>>>>>>>>>>&&&&', detailsView);
      // console.log("???????????????????????",createjobDetails)
      if (detailsView.selectedLanguage === 'Price high to low') {
        const sorted_by_name = recentJobs.sort((a, b) => a.salary < b.salary);
        const sorted_by_search = sorted_by_name.filter(
          (item, i) => item.category.name === detailsView.search,
        );
        // console.log(sorted_by_name);
        setRecentJobList(
          sorted_by_search.filter(
            (item, i) =>
              distance(
                item.location.coordinates[1],
                detailsView.locationObject.lat,
                item.location.coordinates[0],
                detailsView.locationObject.lng,
              ) <= detailsView.multiSliderValue[1],
          ),
        );
      } else if (detailsView.selectedLanguage === 'Price low to high') {
        const sorted_by_name = recentJobs.sort((a, b) => a.salary > b.salary);
        const sorted_by_search = sorted_by_name.filter(
          (item, i) => item.category.name === detailsView.search,
        );
        // console.log(sorted_by_name);
        setRecentJobList(
          sorted_by_search.filter(
            (item, i) =>
              distance(
                item.location.coordinates[1],
                detailsView.locationObject.lat,
                item.location.coordinates[0],
                detailsView.locationObject.lng,
              ) <= detailsView.multiSliderValue[1],
          ),
        );
      } else {
        const sorted_by_search = recentJobs.filter(
          (item, i) => item.category.name === detailsView.search,
        );
        setRecentJobList(
          sorted_by_search.filter(
            (item, i) =>
              distance(
                item.location.coordinates[1],
                detailsView.locationObject.lat,
                item.location.coordinates[0],
                detailsView.locationObject.lng,
              ) <= detailsView.multiSliderValue[1],
          ),
        );
      }
    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  const getLogin = async () => {
    let data = await getUserLogin();
  };

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

  const distance = (lat1, lat2, lon1, lon2) => {
    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = (lon1 * Math.PI) / 180;
    lon2 = (lon2 * Math.PI) / 180;
    lat1 = (lat1 * Math.PI) / 180;
    lat2 = (lat2 * Math.PI) / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a =
      Math.pow(Math.sin(dlat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers 6371. Use 3956
    // for miles
    let r = 3956;

    // calculate the result
    return c * r;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header {...props} title="Job Search" />

      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      <View style={{flex: 1}}>
        {}
        <MapView
          style={styles.mapStyle}
          mapType="standard"
          zoomEnabled={true}
          showsMyLocationButton={true}
          region={{
             latitude: recentJobs[index]?.location.coordinates[1],
             longitude: recentJobs[index]?.location.coordinates[0],
            // latitude: 22.57,
            // longitude:88.36,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <Marker
            coordinate={{
               latitude: recentJobs[index]?.location.coordinates[1],
               longitude: recentJobs[index]?.location.coordinates[0],

              // latitude: 22.57,
              // longitude:88.36
            }}>
            <Icon name="location-on" size={60} color={COLORS.YELLOW_GREEN} />
          </Marker>
          <Circle
            center={{
              latitude: recentJobs[index]?.location.coordinates[1],
              longitude: recentJobs[index]?.location.coordinates[0],
              // latitude: 22.57,
              // longitude:88.36
            }}
            radius={0.1 * 1609.34}
            // strokeWidth={2}
            // strokeColor="#3399ff"
            fillColor="rgba(0,0,0,0.1)"
            // style={{backgroundColor: '#e6e6ff'}}
          />
          {/* {console.log(
            '@@@@@@@',
            distance(
              recentJobs[index].location.coordinates[1],
              22.5251352,
              recentJobs[index].location.coordinates[0],
              88.4125502,
            ),
          )} */}
        </MapView>
        {/* </View> */}
        <View style={{backgroundColor: 'rgba(0,0,0,0.1)', padding: 12}}>
          <Text
            style={{color: COLORS.LAPSI_LAZULI, fontWeight: '400'}}
            numberOfLines={1}>
            {detailsView.address}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            marginTop: hp(350),
            flex: 1,
            // marginBottom: hp(15),
          }}>
          {/* {console.log("recent", recentJobs)} */}
          <Carousel
            ref={carouselRef}
            data={recentJobList.filter(
              (item, i) =>
                item.salary >= detailsView.multiSliderValuee[0] &&
                item.salary <= detailsView.multiSliderValuee[1],
            )}
            sliderWidth={wp(400)}
            itemWidth={wp(250)}
            itemHeight={hp(100)}
            style={{
              marginBottom: 10,
              borderColor: '#000',
              borderWidth: 12,
              borderRadius: 12,
            }}
            renderItem={({item, index}) => {
              // <Card.Cover>
              //   <I

              //     style={{width: wp(150), height: hp(160)}}
              //   />
              return (
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('JobDetailsScreen', {
                      details: item,
                    })
                  }>
                    {/* {console.log("item", item)} */}
                  <Card
                    style={{backgroundColor: COLORS.WHITE, borderRadius: 15}}>
                    {/* {console.log('recent', item)} */}
                    <Card.Cover source={{uri: item.profileImage}} />
                    <View
                      style={{
                        backgroundColor: COLORS.YELLOW_GREEN,
                        width: wp(55),
                        height: hp(65),
                        borderRadius: 48,
                        position: 'absolute',
                        margin: 165,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text
                        style={{color: COLORS.WHITE}}>{`$${item.salary===null?0:item.salary}`}</Text>
                    </View>
                    <Card.Content>
                      <Title>{item.title}</Title>
                      <Paragraph numberOfLines={1}>
                        {item.description}
                      </Paragraph>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              );
            }}
            onSnapToItem={index => setIndex(index)}
            useScrollView={true}
            layout={'default'}
            autoplay={false}
            loop={false}
            enableSnap={true}
          />
        </View>
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default LocationRadiusScreen;
