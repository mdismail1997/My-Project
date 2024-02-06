import React, { useEffect, useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { GetRequest } from '../../Services/ApiFunctions';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Loder from '../../Component/Common/Lodar';
import Device from 'react-native-device-info';
const { width, height } = Dimensions.get('window');

export default function Header(props) {
  const [profileImg, setProfileImg] = useState('');
  const [cartLen, setCartLen] = useState('');
  const [loder, setLoder] = useState(false);
  const [issTablet, setIsTablet] = useState(false)

  const profileData = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(res => {
        // console.log('Profile responce => ', res);
        res?.custom_attributes?.map(item => {
          if (item?.attribute_code == 'avatar') {
            setProfileImg(item?.value);
          }
        });
      })
      .catch(error => {
        console.log('Profile error => ', error);
      });
  };

  useEffect(() => {
    profileData();
    cartItemDetails();
    const isTablet = Device.isTablet();
    if (isTablet == true) {
      setIsTablet(true)
    }
    // const unsubscribe = props.navigation.addListener('focus', () => {
    //   profileData();
    //   cartItemDetails();
    //   const isTablet = Device.isTablet();
    //   if (isTablet == true) {
    //     setIsTablet(true)
    //   }
    // });

    // return unsubscribe;
  }, []);

  const cartItemDetails = () => {
    setLoder(true)
    GetRequest('carts/mine/items', undefined, {}, 'self')
      .then(response => {
        setLoder(false)
        // console.warn('cart details => ', response.length);
        setCartLen(response.length);
        // let valueAdded1 = 0

        // for (let i = 0; i < response.length; i++) {
        //   count1 = response[i].price * response[i].qty
        //   valueAdded1 += count1
        // }
        // this.setState({
        //   valueAdded: valueAdded1
        // })
        // this.setState({ data: response })
      })
      .catch(error => {
        setLoder(false)

        // console.log('cart data error => ', error.response);
      });
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#5A5A5F',
        paddingHorizontal: 20,
        paddingVertical: Platform.OS === 'ios' ? 7 : 15,
        paddingTop: Platform.OS === 'ios' ? 40 : 15,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {props.icon == 'menu' ? (
          <Ionicons
            onPress={() => props.navigation.openDrawer()}
            name="ios-menu-sharp"
            color={'#fff'}
            size={22}
            solid
          />
        ) : (
          <AntDesign
            onPress={() => props.navigation.goBack()}
            name="arrowleft"
            color={'#fff'}
            size={22}
            solid
          />
        )}
        <Text
          style={{
            color: '#fff',
            fontFamily: 'Roboto-Regular',
            fontSize: 15,
            marginLeft: 10,
          }}>
          {props.title}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('SearchScreen')}>
          <FontAwesome
            name="search"
            style={{ color: '#fff', fontSize: 22, marginRight: 12 }}
            solid
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate('Cart')}>
          <View style={{}}>
            {cartLen == 0
              ?
              null
              :
              (
                <View style={{}}>
                  <Text
                    style={{ marginLeft: 18, marginRight: 10, color: '#000', borderColor: '#fff', alignSelf: 'center', borderWidth: 1, paddingHorizontal: issTablet == true ? 7 : 5, paddingVertical: issTablet == true ? 4 : 0, borderRadius: 15, backgroundColor: '#fff' }}>
                    {cartLen}
                  </Text>
                </View>
              )
            }
            <MaterialCommunityIcons
              name="cart-plus"
              style={{ color: '#fff', fontSize: 23, marginRight: cartLen == 0 ? 15 : 20, marginTop: cartLen == 0 ? 4 : -15 }}//-15
              solid
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { props.navigation.navigate('Account') }}>
          {profileImg == '' || profileImg == 0 ? (
            <View
              style={{
                borderWidth: 2,
                borderColor: '#fff',
                borderRadius: 100,
                justifyContent: 'center',
                width: 30,
                height: 30,
                alignItems: 'center',
                backgroundColor: '#ccc',
              }}>
              <FontAwesome5Icon name="user" color={'#fff'} size={20} solid />
            </View>
          ) : (
            <Image
              source={
                profileImg.base64EncodedData
                  ? {
                    uri: `data:${profileImg.type};base64,${profileImg.base64EncodedData}`,
                  }
                  : {
                    uri: `https://traders-platform.com/pub/media/customer${profileImg}`,
                  }
              }
              resizeMode="cover"
              style={{ width: 30, height: 30, borderRadius: 100 }}
            />
          )}
        </TouchableOpacity>
      </View>
      {loder && <Loder />}

    </View>
  );
}
