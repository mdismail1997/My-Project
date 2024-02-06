import { View, Text, SafeAreaView, TextInput, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { styles } from './styles';
import { Header } from '../../components/Header/Header';
import MapView, { Marker, Circle } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import CustomButton from '../../components/CustomButton';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { COLORS, FONT_FAMILY, google_api_key } from '../../utils/Const';
import { hp } from '../../utils/ResponsiveLayout';
import { useDispatch} from 'react-redux';
import { positionChange } from '../../Redux/actions/HomeAction';

const LocationScreen = props => {
  const [distance, setDistance] = useState(0);
  const [location, setLocation] = useState({ lat: '', lng: '' })
  const [address, setAddress] = useState('')

  const dispatch = useDispatch()


  const saveLocation = () =>{
    const details = {
      lat: address ? Number(location.lat) : detailsView?.position?.lat,
      lng: address ? Number(location.lng) : detailsView?.position?.lng,
      // distance: parseInt(distance)
      distance: Math.floor(distance) 
    }
    dispatch(positionChange(details))
    props.navigation.goBack()
  }

  
  const detailsView = props.route.params.details

  const left = (distance * (Dimensions.get('window').width - 60)) / 100 - 15;
  return (
    <SafeAreaView style={styles.container}>

      <Header {...props} title="Location" />
      
      <View style={{ flex: 1 }}>
        <View style={styles.locationContainer}>
          <GooglePlacesAutocomplete
            placeholder="Location"
            minLength={2} // minimum length of text to search
            autoFocus={true}
            returnKeyType={'search'} // Can be left out for default return key
            listViewDisplayed={false} // true/false/undefined
            fetchDetails={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            onPress={(data, details = null) => {
              console.log("====*******data======",data);
              setAddress(data.description);
              setLocation({
                lat: details.geometry.location.lat,
                lng: details.geometry.location.lng,
              });
            }}
            styles={{
              textInput: {
                backgroundColor: COLORS.WHITE,
                // marginTop: hp(16),
                fontFamily: FONT_FAMILY.LATO_REGULAR,
                color: COLORS.BLACK,
                borderColor: COLORS.NICKEL,
                borderWidth: 0,
              },
              listView: {
                position: 'absolute',
                marginTop: hp(55)
              }
            }}
            query={{
              key: google_api_key,
              language: 'en',
              types: 'geocode',
            }}
            debounce={300}
          />
          {/* <TextInput
            placeholder="Location"
            placeholderTextColor={'#737373'}
            style={styles.locationTextInput}
          />
          <Icon name="gps-fixed" color={'#737373'} size={20} /> */}
        </View>
        {/* {console.log("detailsView", detailsView)} */}
        {/* <MapView style={styles.mapStyle} mapType="standard" /> */}
        <MapView
          style={styles.mapStyle}
          mapType='standard'
          region={{
            latitude: address ? Number(location.lat) : detailsView?.position?.lat,
            longitude: address ? Number(location.lng) : detailsView?.position?.lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.1,
          }}>
          <Marker
            coordinate={{
              latitude: address ? Number(location.lat) : detailsView?.position?.lat,
              longitude: address ? Number(location.lng) : detailsView?.position?.lng,
            }}
          />
          {/* {console.log("distanceeeeeeeeeeeeeeeeeeeeeeeeee", distance)} */}
          <Circle
            center={{
              latitude: address ? Number(location.lat) : detailsView?.position?.lat,
              longitude: address ? Number(location.lng) : detailsView?.position?.lng,
            }}
            radius={distance == 0 ? 0 : (distance * 1341.1166)}
             strokeWidth={2}
             strokeColor="#8FCD2D"
            fillColor="#e6e6ff"
            style={{ backgroundColor: '#e6e6ff' }}
          /> 
        </MapView>
      </View>
      <Slider
        style={{ marginTop: 22, height: 14 }}
        minimumTrackTintColor="#8FCD2D"
        thumbTintColor="#8FCD2D"
        maximumTrackTintColor="#D9D9D9"
        minimumValue={0}
        maximumValue={60}
        value={15}
      //  onSlidingStart={(value)=> value * 1.5}
        onValueChange={value => setDistance(value)}
        
      />
      <Text
        style={{
          color: '#000',
          width: 100,
          fontSize: 16,
          marginTop: 8,
          marginLeft: 20
        }}>
        Range: { Math.floor(distance == 0 ? 0 : distance) + ' miles'}
      </Text>

      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
        }}>
        <CustomButton
          title={'Cancel'}
          buttonStyle={{
            width: '46%',
            marginHorizontal: 0,
            backgroundColor: '#F0420B',
          }}
          onPress={()=> props.navigation.navigate('Home')}
        />
        <CustomButton
          title={'Apply'}
          buttonStyle={{ width: '46%', marginHorizontal: 0 }}
          
          onPress={() => saveLocation()}

        />
      </View>
    </SafeAreaView>
  );
};

export default LocationScreen;
