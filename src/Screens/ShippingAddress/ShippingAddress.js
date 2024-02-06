import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  FlatList,
  Modal,
  Dimensions,
  TextInput,
  Pressable,
  I18nManager,
  Platform
} from 'react-native';
import Header from '../../Component/Header/Header';
import { Input, CheckBox } from 'react-native-elements';
import Loder from '../../Component/Common/Lodar';
import { GetRequest, PostRequest, PutRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { ProgressBar, Colors } from 'react-native-paper';
import { ADMIN_TOKEN, BASE_URL } from '../../Services/Constants';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
import ButtonDark from '../../Component/Common/ButtonDark';
import RNPickerSelect from 'react-native-picker-select';
import { TouchableOpacity } from 'react-native-gesture-handler';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const windowWidth = Dimensions.get('window').width;

export default class ShippingAddress extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalShow: false,
      hno: '',
      sno: '',
      city: '',
      zipcode: '',
      landmark: '',
      tel: '',
      state: '',
      loder: false,
      firstname: '',
      lastname: ' ',
      email: '',
      dob: '',
      alladrs: null,
      currentadrs: {},
      selected: false,
      selectedBilling: false,
      methodData: [],
      modalShow2: false,
      indexx: '',
      item: {},
      index: '',
      indexx: null,
      setoption: '',
      userid: '',
      lastname1: '',
      firstname1: '',
      cartid: '',
      countryid: '',
      countrydrop: [
        { name: 'United Arab Emirates', id: 'AE' },
        { name: 'Saudi Arabia', id: 'SA' },
        { name: 'Qatar', id: 'QA' },
        { name: 'Oman', id: 'OM' },
        { name: 'Kuwait', id: 'KW' },
        { name: 'Bahrain', id: 'BH' },
      ],
      data: [
        { key: '1', value: 'Jammu & Kashmir' },
        { key: '2', value: 'Gujrat' },
        { key: '3', value: 'Maharashtra' },
        { key: '4', value: 'Goa' },
      ],
      selected: '',
      modalShow3: false,
    };
  }

  componentDidMount = async () => {
    this.selectedLng();
    this.profileDetails();
    this.getAllAddress();
    this.getStoreCredit();
    const cartid = await AsyncStorage.getItem('cartToken');
    console.log('Cart ID =====> ', cartid);
    this.setState({ cartid: cartid });
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        this.selectedLng();
        this.profileDetails();
        this.getAllAddress();
        this.getStoreCredit();
        const cartid = await AsyncStorage.getItem('cartToken');
        this.setState({ cartid: cartid });
      },
    );
  };



   getStoreCredit = async () => {
    this.setState({ loder: true });
    // console.log("kkkkkkkkk")
    // const cartid = await AsyncStorage.getItem('cartToken');
    // console.log('Cart ID =====> ', cartid);
    let AccessToken = await AsyncStorage.getItem('traderToken');
    console.log('Token =====> ', AccessToken);
    
    await axios({
      method: 'GET',
      url: `https://traders-platform.com/rest/V1/customers/me/amstorecredit`,
      headers: {
        authorization: `Bearer ${AccessToken}`,
      },
    })
      .then(async res => {
        this.setState({ loder: false });
        console.log('Store Creadit amount-----', res.data.store_credit);
        // setAmount(res.data.store_credit)
        await AsyncStorage.setItem('storeAmount',JSON.stringify(res.data.store_credit.toString()));
      })
      
      .catch(function (error) {
        this.setState({ loder: false });
        if (error.response) {
          // Request made and server responded
          console.log(
            'error in response of  function ==>',
            error.response.data,
          );
          // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error in request', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };

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
    this.setState({ loder: false });
    // console.warn("selected Language data==>>>", lngData)
  }

  shippingMethods = async () => {
    // console.warn('methidddddddd', this.state.alladrs);
    this.setState({ loder: true });
    let data = {
      address: {
        city: this.state.alladrs[0].city,
        country_id: this.state.alladrs[0].country_id,
        email: this.state.email,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        postcode: this.state.alladrs[0].postcode,
        region: this.state.alladrs[0].region.region,
        region_code: this.state.alladrs[0].region.region_code,
        region_id: 0,
        street: [
          this.state.alladrs[0].street[0],
          this.state.alladrs[0].street[1],
        ],
        telephone: this.state.alladrs[0].telephone,
      },
    };
    // console.log('iddddddddddddddddddddddddddddddddd', data);
    PostRequest(
      `carts/${this.state.cartid}/estimate-shipping-methods`,
      data,
      {},
      'admin',
    )
      .then(response => {
        this.setState({ loder: false });
        // console.log('shipping-methods response => ', response);
        this.setState({
          methodData: response,
        });
      })
      .catch(error => {
        this.setState({ loder: false });
        console.warn('shipping-methods err => ', error.response);
      });
  };

  shippingMethods2 = async () => {
    // console.log('shippingMethods2', this.state.alladrs);
    this.setState({ loder: true });
    let data = {
      address: {
        region_id: 0,
        region_code: this.state.alladrs[0].region.region_code,
        country_id: this.state.alladrs[0].country_id,
        street: [
          this.state.alladrs[0].street[0],
          this.state.alladrs[0].street[1],
        ],
        postcode: this.state.alladrs[0].postcode,
        city: this.state.alladrs[0].city,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        customer_id: this.state.alladrs[0].customer_id,
        email: this.state.email,
        telephone: this.state.alladrs[0].telephone,
        same_as_billing: 1,
      },
    };
    PostRequest(`carts/mine/estimate-shipping-methods`, data, {}, 'self')
      .then(response => {
        this.setState({ loder: false });
        // console.warn('shipping-methods22222 => ', response);
        // this.setState({
        //     taxamnt: response.amo
        // })
      })
      .catch(error => {
        this.setState({ loder: false });
        console.warn('shipping-methods err2222 => ', error.response);
      });
  };

  profileDetails = () => {
    this.setState({ loder: true });
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(response => {
        // console.warn('Profile data => ', response);
        if (response) {
          this.setState({ loder: false });
          if (response.email) {
            this.setState({
              userid: response?.id,
              firstname: response?.firstname,
              lastname: response?.lastname,
              email: response?.email,
              dob: response?.dob,
              gender: response?.gender,
              website_id: 1,
            });
          }
        }
      })
      .catch(error => {
        console.log('Profile data error => ', error);
        if (error.response.data.message == `The consumer isn't authorized to access %resources.`) {
          Alert.alert(strings.SESSION, '', [
            { text: '' },
            {
              text: strings.OK,
              onPress: () => {
                this.logout2();
              },
            },
          ])
        }
      });
  };

  logout2 = async () => {
    this.setState({
      loder: true
    })
    setTimeout(async () => {
      this.setState({
        loder: false
      })
      this.props.navigation.navigate('signin');
      await AsyncStorage.removeItem('traderToken');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }, 2000);

  };

  getAllAddress = async () => {
    this.setState({ loder: true });
    await GetRequest('customers/me/shippingAddress', undefined, {}, 'self')
      .then(response => {
        // console.warn('All Addressesssssssssssssssssssssss => ', response);
        if (response.length != 0) {
          this.setState({ loder: false });
          // console.warn(
          //   'fgdsAddressesssssssssssssssssssssssAddressesssssssssssssssssssssssAddressesssssssssssssssssssssssAddressessssssssssssssssssssssshkfj',
          // );
          this.setState({ alladrs: [response] });
          if (this.state.alladrs !== null) {
            this.shippingMethods();
            this.shippingMethods2();
          }
        } else {
          console.warn('fgdshkfj');
        }
        // console.warn('All Addressesssssssssssssssssssssss', this.state.alladrs);
      })
      .catch(error => {
        console.log('All Addresses error => ', error);
      });
  };

  addnewaddress = () => {
    console.warn('11111111111111111111111111111',);

    // this.setState({ loder: true });
    const {
      email,
      firstname,
      lastname,
      countryid,
      firstname1,
      lastname1,
      dob,
      state,
      sno,
      tel,
      gender,
      city,
      hno,
      selected,
      selectedBilling,
      zipcode,
    } = this.state;
    if (
      (firstname1 == '' || lastname1 == '' || state == '' || hno == '' || sno == '' || tel == '' || city == '' || zipcode == '' || countryid == '' || (selectedBilling == false && selected == false))
    ) {
      alert(strings.FILL_ALL_FIELDS);
    } else {
      this.setState({ loder: true });

      let data = {
        customer: {
          email: email,
          firstname: firstname,
          lastname: lastname,
          dob: dob,
          gender: gender,
          website_id: 1,
          addresses: [
            {
              region: {
                region_code: state,
                region: state,
                region_id: 0,
              },
              country_id: countryid,
              street: [hno, sno],
              telephone: tel,
              postcode: zipcode == '' ? alladrs[0].postcode : zipcode,
              city: city,
              firstname: firstname1,
              lastname: lastname1,
              default_shipping: true, // selected,
              default_billing: selectedBilling,
            },
          ],
        },
      };
      console.warn('dataaaaaaaaaaaaaaaaaaaaaaaaa => ', data);
      PutRequest('customers/me', data, {}, 'self')
        .then(res => {
          this.setState({ loder: false });
          this.setState({ modalShow: !this.state.modalShow });
          console.warn('address responce => ', res);
          if (res.id) {
            Alert.alert(strings.ADDRESS, strings.ADDRESS_ADD_SUCCESS, [
              { text: strings.CANCEL },
              {
                text: strings.OK,
                onPress: () => this.getAllAddress()
              },
            ]);
          } else {
            Alert.alert(strings.ADDRESS, res?.message, [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
          }
        })
        .catch(error => {
          this.setState({ loder: false });
          this.setState({ modalShow: !this.state.modalShow });
          console.warn('Address error => ', error.response);
          Alert.alert(strings.ADDRESS_ADD_FAIL, strings.LOGIN_FAIL2, [
            { text: strings.CANCEL },
            { text: strings.OK },
          ]);
        });
    }
  };

  addnewaddress2 = () => {
    console.warn('222222222222222222222222222');
    this.setState({ loder: true });
    const {
      email,
      firstname1,
      firstname,
      countryid,
      lastname,
      lastname1,
      dob,
      state,
      sno,
      tel,
      zipcode,
      city,
      hno,
      selected,
      selectedBilling,
    } = this.state;
    console.warn(
      'dddddd',
      this.state.userid,
      email,
      firstname,
      lastname,
      dob,
      tel,
      '1',
      'TX',
      state,
      'US',
      'fsa,gfa',
      tel,
      '78701',
      city,
      firstname1,
      lastname1,
    );
    if (
      (firstname1 == '' || lastname1 == '' || state == '' || hno == '' || sno == '' || tel == '' || city == '' || zipcode == '' || countryid == '' || (selectedBilling == false && selected == false))
    ) {
      alert(strings.FILL_ALL_FIELDS);
    } else {
      let data = {
        customer: {
          // id: this.state.userid,
          email: email,
          firstname: firstname,
          lastname: 'bhj',
          dob: dob,
          mobile: tel,
          website_id: 1,
          addresses: [
            {
              region: {
                region_code: state,
                region: state,
                region_id: 0,
              },
              country_id: countryid,
              street: [sno, hno],
              telephone: tel,
              postcode: zipcode == '' ? alladrs[0].postcode : zipcode,
              city: city,
              firstname: firstname1,
              lastname: lastname1,
              default_shipping: true,
              default_billing: true,
            },
          ],
        },
      };
      console.warn('dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa => ', data);
      PutRequest(`customers/${this.state.userid}`, data, {}, 'admin')
        .then(res => {
          this.setState({ loder: false });
          this.setState({ modalShow: !this.state.modalShow });
          console.warn('address responce => ', res);
          if (res.id) {
            Alert.alert(strings.ADDRESS, strings.ADDRESS_ADD_SUCCESS, [
              { text: strings.CANCEL },
              {
                text: strings.OK,
                onPress: () => this.getAllAddress()
              },
            ]);
          } else {
            Alert.alert(strings.ADDRESS, res?.message, [
              { text: strings.CANCEL },
              { text: strings.OK },
            ]);
          }
        })
        .catch(error => {
          this.setState({ loder: false });
          this.setState({ modalShow: !this.state.modalShow });
          console.warn('Address error => ', error.response);
          Alert.alert(strings.ADDRESS_ADD_FAIL, strings.LOGIN_FAIL2, [
            { text: strings.CANCEL },
            { text: strings.OK },
          ]);
        });
    }
  };

  onPress = (item, index) => {
    console.warn('item', item);
    this.setState({
      indexx: index,
      item: item,
    });
    if (item.method_code == 'flatrate') {
      this.setState({
        setoption: 1,
      });
    } else if (item.method_code == 'freeshipping') {
      this.setState({
        setoption: 2,
      });
    }
  };

  addShippingMeth = async id => {
    const {
      setoption,
      firstname1,
      methodData,
      dob,
      state,
      sno,
      tel,
      zipcode,
      city,
      hno,
      modalShow2,
      alladrs,
      email,
    } = this.state;
    // console.warn('alllards', alladrs);
    // if (setoption == '') {
    //     alert('Please select shipping method')
    // } else {
    this.setState({
      loder: true,
      modalShow2: false,
    });
    let data = {
      addressInformation: {
        shippingAddress: {
          region: alladrs[0].region.region,
          country_id: 'AE',
          street: [alladrs[0].street[0], alladrs[0].street[1]],
          company: 'Lumos',
          telephone: alladrs[0].telephone,
          postcode: '00000',
          city: alladrs[0].city,
          firstname: alladrs[0].firstname,
          lastname: alladrs[0].lastname,
          email: email,
          prefix: 'address_',
          region_code: alladrs[0].region.region_code,
          sameAsBilling: 1,
        },
        billingAddress: {
          region: alladrs[0].region.region,
          region_id: 0,
          country_id: 'AE',
          street: [alladrs[0].street[0], alladrs[0].street[1]],
          company: 'Lumos',
          telephone: alladrs[0].telephone,
          postcode: '00000',
          city: alladrs[0].city,
          firstname: alladrs[0].firstname,
          lastname: alladrs[0].lastname,
          email: email,
          prefix: 'address_',
          region_code: alladrs[0].region.region_code,
        },
        shipping_method_code: methodData
          ? methodData[0].method_code
          : 'bestway',
        shipping_carrier_code: methodData
          ? methodData[0].carrier_code
          : 'tablerate',
      },
    };
    // console.warn('idddddduuu', JSON.stringify(data));

    await PostRequest('carts/mine/shipping-information', data, {}, 'self')
      .then(res => {
        // console.warn('addShippingMeth,',  res.totals.total_segments);

        // if (this.props.route.params?.itemID && res.totals.items.length !== 1) {
        //     let arr = []
        //     // if()
        //     for (var i = 0; i < res.totals.items.length; i++) {
        //         if (res.totals.items[i].item_id !== this.props.route.params.itemID) {
        //             // arr.push(res.totals.items[i])
        //             this.setState({ loder: true })

        //             const headers = {
        //                 'Authorization': `Bearer ${ADMIN_TOKEN}`,
        //                 'Content-Type': 'application/json',
        //             };
        //             axios.delete(`https://www.trollyy.com/rest/V1/carts/${cart}/items/${res.totals.items[i].item_id}`, { headers })
        //                 .then(() =>
        //                     this.setState({ loder: false }),
        //                     this.props.navigation.navigate('Payment', { method: setoption ? (setoption == 1 ? 'flatrate' : 'freeshipping') : 'flatrate', fromScreen: 'paynow', price: res.totals.subtotal, dprice: res.totals.shipping_amount, length: res.totals.items.length })

        //                 )
        //                 .catch(error => {
        //                     console.warn('There was an error!', error);
        //                 });
        //         }
        //     }
        //     console.warn('arrr', arr)
        // } else {
        this.props.navigation.navigate('Payment', {
          method: methodData ? methodData[0].method_code : 'bestway',
          cmethod: methodData ? methodData[0].carrier_code : 'tablerate',
          fromScreen: 'paynow',
          price: res.totals.subtotal,
          dprice: methodData
            ? methodData[0].amount
            : res.totals.shipping_amount,
          length: res.totals.items.length,
          tax: res.totals.tax_amount,
          code: res.totals.quote_currency_code,
          storeCredit:res.totals.total_segments
        });
        // }
        this.setState({ loder: false });
      })
      .catch(error => {
        console.warn('There was an error!11111111111111', error.response);
      });
    // }
  };

  deleteProduct = async id => {
    this.setState({ loder: true });
    const { cartToken } = this.state;

    const headers = {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    };
    axios
      .delete(
        `https://traders-platform.com/rest/V1/carts/${cartToken}/items/${id}`,
        { headers },
      )
      .then(() =>
        // console.warn('Delete successful')
        this.setState({ loder: false })(
          Alert.alert(strings.DELETE_SUCCESS, '', [
            { text: strings.CANCEL },
            {
              text: strings.OK,
              onPress: () => {
                this.cartItemDetails();
              },
            },
          ]),
        ),
      )
      .catch(error => {
        // console.warn('There was an error!', error);
      });
  };

  checkpin = pin => {
    this.setState({ loder: true });
    console.warn('this.state.zipcodethis.state.zipcode', pin);
    const data = {
      pincode: pin,
    };
    PostRequest('pincode/getpincodedata', data, {}, 'self')
      .then(async res => {
        this.setState({ loder: false, pin: res[0].message });
        console.warn('resss,', res);
        if (res[0].length == 0) {
          alert(strings.PINCODE_NOT_AVAILABLE);
        } else {
          this.addShippingMeth();
        }
      })
      .catch(error => {
        this.setState({ loder: false });
        console.warn('r=err', error.response);
      });
  };

  renderItem = ({ item, index }) => {
    console.warn('methods', this.state.methodData);
    return (
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#C4C4C4',
          paddingVertical: 10,
        }}>
        <RadioButton
          value={item.method_code}
          status={this.state.indexx == index ? 'checked' : 'unchecked'}
          onPress={() => this.onPress(item, index)}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            alignSelf: 'center',
            color: '#000',
          }}
          numberOfLines={1}>
          {item.method_code}
        </Text>
      </View>
    );
  };

  render() {
    const { modalShow, alladrs, modalShow3 } = this.state;
    return (
      <View style={styles.container}>
        <Header
          title={strings.SHIPPING_ADD}
          navigation={this.props.navigation}
          icon="arrowleft"
        />
        <View
          style={{
            padding: 20,
            flex: 1,
            justifyContent: 'space-between',
            paddingBottom: 10,
          }}>
          {alladrs == null ? (
            <View
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#000' }}>
                {strings.NO_ADD}
              </Text>
            </View>
          ) : (
            alladrs.map((adrs, i) => {
              return (
                <View key={i}>
                  <View style={{ flexDirection: 'row' }}>
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: '#000',
                        backgroundColor: '#43BC18',
                        marginRight: 10,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          fontFamily: 'Roboto-Bold',
                          color: '#4B4B52',
                          fontSize: 16,
                        }}>
                        {adrs.firstname} {adrs.lastname}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Roboto-Regular',
                          color: '#4B4B52',
                          fontSize: 15,
                        }}>
                        {adrs.street[0]}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Roboto-Regular',
                          color: '#4B4B52',
                          fontSize: 15,
                        }}>
                        {adrs.city}, {adrs.postcode}, {adrs.region.region}
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Roboto-Regular',
                          color: '#4B4B52',
                          fontSize: 15,
                          marginVertical: 3,
                        }}>
                        {adrs.telephone}
                      </Text>
                    </View>
                  </View>
                  {this.props.route.params?.fromScreen ? null : (
                    <ButtonDark
                      handleClick={() => this.addShippingMeth()}
                      title={strings.DELIVERY_TO_ADD}
                    />
                  )}
                  <ButtonDark
                    handleClick={() => {
                      this.setState({
                        firstname: adrs.firstname,
                        hno: adrs.street[0],
                        sno: adrs.street[0],
                        city: adrs.city,
                        zipcode: adrs.postcode,
                        state: adrs.region.region,
                        tel: adrs.telephone,
                        modalShow: !modalShow,
                      });
                    }}
                    title={strings.EDIT_ADD}
                  />
                </View>
              );
            })
          )}
          {alladrs == null ? (
            <ButtonDark
              handleClick={() => {
                this.setState({ modalShow: !modalShow });
              }}
              title={strings.ADD_NEW_ADD}
            />
          ) : null}
        </View>

        {/* <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ margin: 40 }}>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#000", backgroundColor: "#43BC18", marginRight: 10 }} />
                            <View>
                                <Text style={{ fontFamily: "Roboto-Bold", color: "#4B4B52", fontSize: 16 }}>Joseph Doe</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15 }}>106 B Hazelhurst Dr.#101</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15 }}>Houston - Tx 77043</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15, marginVertical: 3 }}>joocphdemo@gmail.com</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15, marginBottom: 10 }}>+91 8698803569</Text>
                            </View>
                        </View>
                        <Button1 handleClick={() => console.log("me")} title="Delivery to this address" />
                        <Button2 handleClick={() => this.setState({ modalShow: !modalShow })} title="Edit address" />
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#000", marginRight: 10 }} />
                            <View>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15 }}>106 B Hazelhurst Dr.#101</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15 }}>Houston - Tx 77043</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15, marginVertical: 3 }}>joocphdemo@gmail.com</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15, marginBottom: 10 }}>+91 8698803569</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#000", marginRight: 10 }} />
                            <View>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15 }}>106 B Hazelhurst Dr.#101</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15 }}>Houston - Tx 77043</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15, marginVertical: 3 }}>joocphdemo@gmail.com</Text>
                                <Text style={{ fontFamily: "Roboto-Regular", color: "#4B4B52", fontSize: 15, marginBottom: 10 }}>+91 8698803569</Text>
                            </View>
                        </View>
                        
                    </View>
                </ScrollView> */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalShow2}
          onRequestClose={() => this.setState({ modalShow2: false })}>
          <View style={styles.centeredView}>
            <View style={[styles.modalView, { padding: 20 }]}>
              <FlatList
                data={this.state.methodData}
                renderItem={this.renderItem}
                keyExtractor={item => item}
              />
              <ButtonDark
                handleClick={() => this.addShippingMeth}
                title={strings.SUBMIT}
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalShow}
          onRequestClose={() => this.setState({ modalShow: !modalShow })}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Pressable
                  onPress={() => this.setState({ modalShow: !modalShow })}
                  style={{
                    marginHorizontal: 10,
                    marginTop: 20,
                    alignSelf: 'flex-end',
                  }}>
                  <Feather name="x" color={'#000'} size={30} solid />
                </Pressable>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    color: '#3F4F5F',
                    marginBottom: 10,
                  }}>
                  {strings.ADD_NEW_ADD}
                </Text>
                <View style={styles.form}>
                  <Input
                    placeholder={strings.FIRST_NAME}
                    placeholderTextColor="#4B4B52"
                    value={this.state.firstname1}
                    style={{ paddingTop: 0 }}
                    containerStyle={{ paddingHorizontal: 0 }}
                    inputStyle={{
                      fontSize: 18,
                      fontFamily: 'Roboto-Regular',
                      color: '#4B4B52',
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    leftIconContainerStyle={{
                      justifyContent: 'flex-start',
                      paddingTop: 5,
                    }}
                    leftIcon={
                      <Image
                        source={require('../../Assets/name.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    onChangeText={e => this.setState({ firstname1: e })}
                  />
                  <Input
                    placeholder={strings.LAST_NAME}
                    placeholderTextColor="#4B4B52"
                    value={this.state.lastname1}
                    style={{ paddingTop: 0 }}
                    containerStyle={{ paddingHorizontal: 0 }}
                    inputStyle={{
                      fontSize: 18,
                      fontFamily: 'Roboto-Regular',
                      color: '#4B4B52',
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    leftIconContainerStyle={{
                      justifyContent: 'flex-start',
                      paddingTop: 5,
                    }}
                    leftIcon={
                      <Image
                        source={require('../../Assets/name.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    onChangeText={e => this.setState({ lastname1: e })}
                  />
                  <Input
                    placeholder={strings.HOUSE_NO}
                    placeholderTextColor="#4B4B52"
                    style={{ paddingTop: 0 }}
                    value={this.state.hno}
                    containerStyle={{ paddingHorizontal: 0 }}
                    inputStyle={{
                      fontSize: 18,
                      fontFamily: 'Roboto-Regular',
                      color: '#4B4B52',
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    leftIconContainerStyle={{
                      justifyContent: 'flex-start',
                      paddingTop: 5,
                    }}
                    leftIcon={
                      <Image
                        source={require('../../Assets/home.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    onChangeText={e => this.setState({ hno: e })}
                  />
                  <Input
                    placeholder={strings.STREET_NO}
                    placeholderTextColor="#4B4B52"
                    style={{ paddingTop: 0 }}
                    value={this.state.sno}
                    containerStyle={{ paddingHorizontal: 0 }}
                    inputStyle={{
                      fontSize: 18,
                      fontFamily: 'Roboto-Regular',
                      color: '#4B4B52',
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    leftIconContainerStyle={{
                      justifyContent: 'flex-start',
                      paddingTop: 5,
                    }}
                    leftIcon={
                      <Image
                        source={require('../../Assets/road.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    onChangeText={e => this.setState({ sno: e })}
                  />
                  <Input
                    placeholder={strings.CITY}
                    placeholderTextColor="#4B4B52"
                    style={{ paddingTop: 0 }}
                    value={this.state.city}
                    containerStyle={{ paddingHorizontal: 0 }}
                    inputStyle={{
                      fontSize: 18,
                      fontFamily: 'Roboto-Regular',
                      color: '#4B4B52',
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    leftIconContainerStyle={{
                      justifyContent: 'flex-start',
                      paddingTop: 5,
                    }}
                    leftIcon={
                      <Image
                        source={require('../../Assets/city.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    onChangeText={e => this.setState({ city: e })}
                  />
                  <Input
                    placeholder={strings.ZIPCODE}
                    placeholderTextColor="#4B4B52"
                    style={{ paddingTop: 0 }}
                    containerStyle={{ paddingHorizontal: 0 }}
                    value={this.state.zipcode}
                    inputStyle={{
                      fontSize: 18,
                      fontFamily: 'Roboto-Regular',
                      color: '#4B4B52',
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    leftIconContainerStyle={{
                      justifyContent: 'flex-start',
                      paddingTop: 5,
                    }}
                    leftIcon={
                      <Image
                        source={require('../../Assets/user-pin.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    onChangeText={e => this.setState({ zipcode: e })}
                  />
                  {/* <TouchableOpacity onPress={() => { this.setState({ modalShow3: !modalShow3 }) }}> */}
                  <Input
                    placeholder={strings.STATE}
                    placeholderTextColor="#4B4B52"
                    style={{ paddingTop: 0 }}
                    containerStyle={{ paddingHorizontal: 0 }}
                    value={this.state.state}
                    inputStyle={{
                      fontSize: 18,
                      fontFamily: 'Roboto-Regular',
                      color: '#4B4B52',
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    leftIconContainerStyle={{
                      justifyContent: 'flex-start',
                      paddingTop: 5,
                    }}
                    leftIcon={
                      <Image
                        source={require('../../Assets/map.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    onChangeText={e => this.setState({ state: e })}
                  // editable={false}
                  />
                  {/* <Text>ftyft</Text>
                                    </TouchableOpacity> */}

                  <View
                    style={{
                      marginTop: Platform.OS == 'ios' ? 10 : -10,
                      borderBottomWidth: 1,
                      marginBottom: 25,
                      paddingBottom: 10,
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ alignSelf: 'center' }}>
                        <MaterialIcons name="place" color={'#000'} size={25} solid />
                      </View>
                      <View style={{ width: windowWidth / 1.2 }}>
                        <RNPickerSelect
                          style={{
                            placeholder: { color: '#000' },
                            inputIOS: { color: '#000' },
                            inputAndroid: { color: '#000' },
                          }}
                          placeholder={{
                            label: strings.COUNTRY,
                            value: '',
                            color: '#000',
                            fontSize: 18
                          }}
                          // placeholder={'Country'}
                          onValueChange={value => this.setState({ countryid: value })}
                          items={[
                            {
                              value: 'AE',
                              two_letter_abbreviation: 'AE',
                              three_letter_abbreviation: 'ARE',
                              full_name_locale: 'United Arab Emirates',
                              label: 'United Arab Emirates',
                            },
                            {
                              value: 'BH',
                              two_letter_abbreviation: 'BH',
                              three_letter_abbreviation: 'BHR',
                              full_name_locale: 'Bahrain',
                              label: 'Bahrain',
                            },
                            {
                              value: 'KW',
                              two_letter_abbreviation: 'KW',
                              three_letter_abbreviation: 'KWT',
                              full_name_locale: 'Kuwait',
                              label: 'Kuwait',
                            },
                            {
                              value: 'OM',
                              two_letter_abbreviation: 'OM',
                              three_letter_abbreviation: 'OMN',
                              full_name_locale: 'Oman',
                              label: 'Oman',
                            },
                            {
                              value: 'QA',
                              two_letter_abbreviation: 'QA',
                              three_letter_abbreviation: 'QAT',
                              full_name_locale: 'Qatar',
                              label: 'Qatar',
                            },
                            {
                              value: 'SA',
                              two_letter_abbreviation: 'SA',
                              three_letter_abbreviation: 'SAU',
                              full_name_locale: 'Saudi Arabia',
                              label: 'Saudi Arabia',
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>

                  <Input
                    placeholder={strings.TELEPHONE}
                    placeholderTextColor="#4B4B52"
                    style={{ paddingTop: 0 }}
                    containerStyle={{ paddingHorizontal: 0 }}
                    value={this.state.tel}
                    inputStyle={{
                      fontSize: 18,
                      fontFamily: 'Roboto-Regular',
                      color: '#4B4B52',
                      textAlign: I18nManager.isRTL ? 'right' : 'left',
                    }}
                    leftIconContainerStyle={{
                      justifyContent: 'flex-start',
                      paddingTop: 5,
                    }}
                    leftIcon={
                      <Image
                        source={require('../../Assets/call.png')}
                        style={{ width: 20, height: 20 }}
                      />
                    }
                    onChangeText={e => this.setState({ tel: e })}
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                      value={this.state.selected}
                      checked={this.state.selected == false ? false : true}
                      checkedColor="green"
                      onPress={() =>
                        this.setState({ selected: !this.state.selected })
                      }
                      style={{}}
                    />
                    <Text style={{ color: '#000' }}>
                      {strings.DEFAULT_SHIP_ADD}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <CheckBox
                      checkedColor="green"
                      value={this.state.selectedBilling}
                      checked={
                        this.state.selectedBilling == false ? false : true
                      }
                      onPress={() =>
                        this.setState({
                          selectedBilling: !this.state.selectedBilling,
                        })
                      }
                      style={{}}
                    />
                    <Text style={{ color: '#000' }}>
                      {strings.DEFAULT_BILL_ADD}
                    </Text>
                  </View>
                  <ButtonDark
                    handleClick={() => {
                      // alladrs == null ?
                      //     this.addnewaddress2()
                      //     :
                      this.addnewaddress();
                    }}
                    title={strings.SUBMIT}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalShow3}
          onRequestClose={() => this.setState({ modalShow3: !modalShow3 })}>
          <View style={styles.centeredView}>
            <Text>gfdkyagfkadgshku</Text>
          </View>
        </Modal>
        {this.state.loder && <Loder />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fbfbfb' },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalView: { width: windowWidth - 30, backgroundColor: '#fff' },
  form: { marginHorizontal: 40, marginBottom: 20, marginTop: 10 },
});
