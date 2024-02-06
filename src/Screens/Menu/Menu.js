import React, { Component } from 'react';
import { Image } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  I18nManager
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { GetRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import Loder from '../../Component/Common/Lodar';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      name: '',
      image: '',
      loder: false,
      id:'',
    };
  }

  profileData = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(res => {
        console.log('Profile responce Drawer=======> ', res.id);
        this.setState({ id: res.id });
        this.setState({ name: res?.firstname });
        res?.custom_attributes?.map(item => {
          if (item?.attribute_code == 'avatar') {
            this.setState({ image: item?.value });
          }
        });
      })
      .catch(error => {
        console.log('Profile error => ', error);
      });
  };

  componentDidMount = () => {
    this.profileData();
    this.selectedLng()
    console.log('navigation', this.props);
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        this.profileData();
        this.selectedLng()
      },
    );
  };
  componentWillUnmount() {
    this.willFocusSubscription();
  }

  selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    this.setState({ loder: false })
    // console.warn("selected Language data==>>>", lngData)
  }

  handleChange = (path, val) => {
    this.setState({ active: val });
    this.props.navigation.navigate(path);
  };

  logout = async () => {
    Alert.alert("", strings.LOGOUT_FROM_APP, [
      { text: strings.CANCEL },
      {
        text: strings.OK,
        onPress: () => this.logout2()
      },
    ]);
  };


  logout2 = async () => {
    this.setState({ loder: true });
    setTimeout(async () => {
      this.setState({ loder: false });
      this.props.navigation.navigate('signin');
      await AsyncStorage.removeItem('traderToken');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }, 2000);

  };


  deleteAccount = async () => {
    Alert.alert("", strings.Delete_Your_Account, [
      { text: strings.CANCEL },
      {
        text: strings.OK,
        onPress: () => this.delete2()
      },
    ]);
  };
  delete2 = async () => {
    this.setState({ loder: true });
    let AccessToken = 'xdd48grne8e5keewy39cncxue0w0nhb4';
    console.log("iddddddddddd",this.state.id)
    await axios({
      method: 'delete',
      url: `https://traders-platform.com/rest/V1/customers/27946`,
      headers: {
        authorization: `Bearer ${AccessToken}`,
      },
    })
      .then(async(res) => {
        this.setState({ loder: false });
        console.warn("Delete Account Sussesfuly", res.data);
        this.props.navigation.navigate('signin');
        await AsyncStorage.removeItem('traderToken');

        Alert.alert('','Account Delete Successfully', [
          { text: '' },
          {
            text: strings.OK
          },
        ])
        //setData(res.data.items);
      })
      .catch(error => {
        this.setState({ loder: false });
        console.log('Error error=> ', error.response.message);
      });

    // setTimeout(async () => {
    //   this.setState({ loder: false });
    //   this.props.navigation.navigate('signin');
    //   await AsyncStorage.removeItem('traderToken');
    //   await GoogleSignin.revokeAccess();
    //   await GoogleSignin.signOut();
    // }, 2000);

  };

  render() {
    const { active, image } = this.state;

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 40,
            paddingBottom: 30,
            borderBottomColor: '#C4C4C4',
            borderBottomWidth: 1,
            marginRight: 10,
            marginBottom: 20,
          }}>
          <View style={{ position: 'relative' }}>
            {this.props.image == '' || this.props.image == 0 ? (
              <View
                style={{
                  borderRadius: 100,
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  alignItems: 'center',
                  elevation: 7,
                  backgroundColor: '#ccc',
                }}>
                <FontAwesome5Icon
                  name="user"
                  color={'#fff'}
                  size={25}
                  solid
                />
              </View>
            ) : (
              <View
                style={{
                  borderRadius: 100,
                  elevation: 5,
                  backgroundColor: '#ccc',
                }}>
                <Image
                  source={
                    this.props.image.base64EncodedData
                      ? {
                        uri: `data:${this.props.image.type};base64,${this.props.image.base64EncodedData}`,
                      }
                      : {
                        uri: `https://traders-platform.com/pub/media/customer${this.props.image}`,
                     
                      }
                  }
                  resizeMode="cover"
                  style={{ width: 50, height: 50, borderRadius: 1000 }}
                />
              </View>
            )}
          </View>
          <Text style={{ color: '#fff', fontSize: 22, marginLeft: 20 }}>
            {strings.HI}, {this.state.name}
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>

          <TouchableOpacity onPress={() => this.handleChange('Home', 0)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 0 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SimpleLineIcons
                  style={{ color: '#fff', fontSize: 20 }}
                  name={'home'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.HOME}
                </Text>
              </View>
              {active == 0 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('Account', 1)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 1 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather
                  style={{ color: '#fff', fontSize: 20 }}
                  name={'edit'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.PROFILE}
                </Text>
              </View>
              {active == 1 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.handleChange('changepassword', 2)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 2 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Octicons
                  style={{ color: '#fff', fontSize: 20 }}
                  name={'key'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.CHANGE_PASSWORD}
                </Text>
              </View>
              {active == 2 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginLeft: 10 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('MyOrder', 3)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 3 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../Assets/clipboard.png')}
                  style={{ width: 25, height: 25 }}
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.MYORDER}
                </Text>
              </View>
              {active == 3 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => this.handleChange("MyRewards", 3)}>
                        <View style={[{ marginRight: 20, paddingLeft: 20, flexDirection: "row", paddingVertical: 15, borderRadius: 5, alignItems: "center", justifyContent: "space-between" }, active == 3 && { backgroundColor: "#201F1F" }]}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={require('../../Assets/clipboard.png')} style={{ width: 25, height: 25 }} />
                                <Text style={{ color: "#fff", marginLeft: 15, fontSize: 18 }}>My Rewards</Text>
                            </View>
                            {active == 3 && <FontAwesome style={{ color: '#fff', fontSize: 30, marginRight: 20 }} name={'long-arrow-right'} solid />}
                        </View>
                    </TouchableOpacity> */}

          {/* <TouchableOpacity onPress={() => this.handleChange("Home", 3)}>
                        <View style={[{ marginRight: 20, paddingLeft: 20, flexDirection: "row", paddingVertical: 15, borderRadius: 5, alignItems: "center", justifyContent: "space-between" }, active == 3 && { backgroundColor: "#201F1F" }]}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={require('../../Assets/clipboard.png')} style={{ width: 25, height: 25 }} />
                                <Text style={{ color: "#fff", marginLeft: 15, fontSize: 18 }}>My Earned Points</Text>
                            </View>
                            {active == 3 && <FontAwesome style={{ color: '#fff', fontSize: 30, marginRight: 20 }} name={'long-arrow-right'} solid />}
                        </View>
                    </TouchableOpacity> */}

          {/* <TouchableOpacity onPress={() => this.handleChange("Home", 4)}>
                        <View style={[{ marginRight: 20, paddingLeft: 20, flexDirection: "row", paddingVertical: 15, borderRadius: 5, alignItems: "center", justifyContent: "space-between" }, active == 4 && { backgroundColor: "#201F1F" }]}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={require('../../Assets/card.png')} style={{ width: 20, height: 20 }} />
                                <Text style={{ color: "#fff", marginLeft: 15, fontSize: 18 }}>My Paymentdetails</Text>
                            </View>
                            {active == 4 && <FontAwesome style={{ color: '#fff', fontSize: 30, marginRight: 20 }} name={'long-arrow-right'} solid />}
                        </View>
                    </TouchableOpacity> */}

          <TouchableOpacity onPress={() => this.handleChange('Cart', 5)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 5 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../Assets/cart.png')}
                  style={{ width: 25, height: 25 }}
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.MYCART}
                </Text>
              </View>
              {active == 5 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('Wishlist', 6)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 6 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <AntDesign
                  style={{ color: '#fff', fontSize: 20 }}
                  name={'hearto'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.MYWISH}
                </Text>
              </View>
              {active == 6 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('AllTraders', 13)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 13 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <Entypo
                  style={{ color: '#fff', fontSize: 20 }}
                  name={'users'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.ALLTRAD}
                </Text>
              </View>
              {active == 13 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('ProductsPage', 14)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 14 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <Ionicons
                  style={{ color: '#fff', fontSize: 20 }}
                  name={'ios-logo-buffer'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.PRODUCTS}
                </Text>
              </View>
              {active == 14 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => this.handleChange('ByLaterNotes', 16)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 16 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
       style={{ color: '#fff', fontSize: 20,height:20, width:20}}
        source={require('../../Assets/paylater.png')}
      />
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                {/* <Ionicons
                  style={{ color: '#fff', fontSize: 20 }}
                  name={'ios-logo-buffer'}
                  solid
                /> */}
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18}}>
                  Buy Later
                </Text>
              </View>
              {active == 16 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>


          <TouchableOpacity onPress={() => this.handleChange('StoreCreditRefund', 18)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 18 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
             
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <MaterialCommunityIcons
                style={{ color: '#fff', fontSize: 25 }}
                name={'cash-refund'}
                solid
              />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 16}}>
                {strings.CREDIT_REFUND} 
                </Text>
              </View>
              {active == 18 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginLeft:10 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('UpdateMobileNumber', 17)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 17 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
       style={{ color: '#fff', fontSize: 20,height:20, width:20,tintColor:'white'}}
        source={require('../../Assets/phone-call.png')}
      />
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                {/* <Ionicons
                  style={{ color: '#fff', fontSize: 20 }}
                  name={'ios-logo-buffer'}
                  solid
                /> */}
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 16}}>
                  Update Mobile Number
                </Text>
              </View>
              {active == 17 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30,marginLeft:10 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('ContactUs', 7)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 7 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <AntDesign
                  style={{ color: '#fff', fontSize: 23 }}
                  name={'customerservice'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.CUSTOMERSERV}
                </Text>
              </View>
              {active == 7 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('TC', 8)}> 
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 8 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <AntDesign
                  style={{ color: '#fff', fontSize: 23 }}
                  name={'checksquare'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.TERMS_AND_CONDITIONS}
                </Text>
              </View>
              {active == 8 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30,left:15  }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('FAQ', 9)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 9 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <FontAwesome
                  style={{ color: '#fff', fontSize: 23 }}
                  name={'question-circle'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.FAQ}
                </Text>
              </View>
              {active == 9 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('PrivacyP', 10)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 10 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <MaterialIcons
                  style={{ color: '#fff', fontSize: 25 }}
                  name={'policy'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.PRIVACYPOL}
                </Text>
              </View>
              {active == 10 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('Refund', 15)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 15 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <MaterialCommunityIcons
                  style={{ color: '#fff', fontSize: 25 }}
                  name={'cash-refund'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 15 }}>
                  {strings.REFUND}
                </Text>
              </View>
              {active == 15 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginLeft:10 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.handleChange('AboutUs', 11)}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
                active == 11 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* <Feather style={{ color: '#fff', fontSize: 20 }} name={'edit'} solid /> */}
                <AntDesign
                  style={{ color: '#fff', fontSize: 23 }}
                  name={'infocirlce'}
                  solid
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.ABOUTUS}
                </Text>
              </View>
              {active == 11 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => this.handleChange("Notification", 6)}>
                        <View style={[{ marginRight: 20, paddingLeft: 20, flexDirection: "row", paddingVertical: 15, borderRadius: 5, alignItems: "center", justifyContent: "space-between" }, active == 6 && { backgroundColor: "#201F1F" }]}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image source={require('../../Assets/cart.png')} style={{ width: 25, height: 25 }} />
                                <Text style={{ color: "#fff", marginLeft: 15, fontSize: 18 }}>Notification</Text>
                            </View>
                            {active == 6 && <FontAwesome style={{ color: '#fff', fontSize: 30, marginRight: 20 }} name={'long-arrow-right'} solid />}
                        </View>
                    </TouchableOpacity> */}


         

          <TouchableOpacity onPress={() => this.logout()}>
            <View
              style={[
                {
                  marginRight: 20,
                  paddingLeft: 20,
                  flexDirection: 'row',
                  paddingVertical: 15,
                  borderRadius: 5,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 100,
                },
                active == 12 && { backgroundColor: '#201F1F' },
              ]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  source={require('../../Assets/logout.png')}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={{ color: '#fff', marginLeft: 15, fontSize: 18 }}>
                  {strings.LOGOUT}
                </Text>
              </View>
              {active == 12 && (
                <FontAwesome
                  style={{ color: '#fff', fontSize: 30, marginRight: 20 }}
                  name={'long-arrow-right'}
                  solid
                />
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
        {this.state.loder && <Loder />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingLeft: 20,
    paddingRight: 30,
  },
});
