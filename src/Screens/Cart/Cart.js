import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  I18nManager,
  Dimensions
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { GetRequest, PostRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ADMIN_TOKEN, BASE_URL } from '../../Services/Constants';
import Header from '../../Component/Header/Header';
import ButtonWhite from '../../Component/Common/ButtonWhite';
import ButtonWhite1 from '../../Component/Common/ButtonWhite1';
import Loder from '../../Component/Common/Lodar';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import RenderHtml from 'react-native-render-html';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Device, { isTablet } from 'react-native-device-info';
import { Button } from 'react-native-elements';

const { width, height } = Dimensions.get('window');
export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      data: [],
      cartToken: '',
      loder: true,
      valueAdded: '',
      count: 1,
      isTablet: false
    };
  }

  componentDidMount = async () => {
    this.setState({ loder: true });

    this.selectedLng()
    this.cartItemDetails();
    const cart = await AsyncStorage.getItem('cartToken');
    this.setState({ cartToken: cart });
    const isTablet = Device.isTablet();
    console.warn('isTablet', isTablet)
    if (isTablet == true) {
      this.setState({ isTablet: true })
    }
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        const cart = await AsyncStorage.getItem('cartToken');
        this.selectedLng()
        this.setState({ cartToken: cart });
        this.cartItemDetails();
        const isTablet = Device.isTablet();
        console.warn('isTablet', isTablet)
        if (isTablet == true) {
          this.setState({ isTablet: true })
        }
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
    console.warn("selected Language data==>>>", lngData)
  }

  cartItemDetails = () => {
    this.setState({ loder: true });
    GetRequest('carts/mine/items', undefined, {}, 'self')
      .then(response => {
        console.log("item.............",response)
        this.setState({ loder: false });
        let valueAdded1 = 0;

        for (let i = 0; i < response.length; i++) {
          count1 = response[i].price * response[i].qty;
          valueAdded1 += count1;
        }
        this.setState({
          valueAdded: valueAdded1,
        });

        // console.warn('cart details => ', response);
        this.setState({ data: response });
      })
      .catch(error => {
        this.setState({ loder: false });
        console.warn('Profile data error => ', error);
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


  deleteProduct = async id => {
    Alert.alert('', strings.DELETE_CONFIRM, [
      { text: strings.CANCEL },
      {
        text: strings.OK,
        onPress: () => {


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
              // console.warn('Product Delete successful')
              // this.setState({ loder: false })
             
                Alert.alert('', strings.DELETE_SUCCESS, [
                  { text: '' },
                  {
                    text: strings.OK,
                    onPress: () => {
                      this.cartItemDetails();
                    },
                  },
                ]),
       
            )
            .catch(error => {
              // this.setState({ loder: false })
              // console.warn('There was an error!', error);
            });
        },
      },
    ])
  };

  getquantity = async (id, qty) => {
    this.setState({ loder: true })
    const data = {
      cartItem: {
        item_id: id,
        qty: qty,
        quote_id: this.state.cartToken
      }
    }
    PostRequest('carts/mine/items', data, {}, 'self')
      .then(async res => {
        this.setState({ loder: false })
        this.cartItemDetails();
        console.warn("res ", res);
      })
      .catch(error => {
        this.setState({ loder: false })
        console.warn("cart err ", error);
      });
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.loder && <Loder />}

        <Header
          title={strings.CART}
          navigation={this.props.navigation}
          icon="arrowleft"
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ margin: 20, marginTop: 30 }}>
            <Text style={{ fontSize: 18, color: '#000' }}>
              {strings.SUBTOTAL} -{' '}
              <Text style={{ fontFamily: 'Roboto-Bold' }}>
                {strings.AED} {this.state.valueAdded}
              </Text>
            </Text>
            {/* <ButtonWhite1
                handleClick={() =>
                  this.props.navigation.navigate('')
                }
                title={`${strings.VIEW_AND_EDIT_CART}`}
              /> */}
            {this.state.data.length == 0 ? null : (
              <>
              <ButtonWhite
                handleClick={() =>
                  this.props.navigation.navigate('ShippingAddress')
                }
                title={`${strings.PROCEED_TO_BUY} (${this.state.data.length} ${this.state.data.length == '1' ? strings.ITEM : strings.ITEMS})`}
              />  
                <ButtonWhite
                handleClick={() =>
                  this.props.navigation.navigate('ShopingCart')
                }
                title='VIEW AND EDIT CART'
              />  

              </>
            
            )
           

            }

          
           
          
           
          
            {this.state.data.length == 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 100,
                }}>
                <Image
                  source={require('../../Assets/STrolly.png')}
                  style={{ height: 100, width: 100 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: '#000',
                    fontWeight: 'bold',
                    marginTop: 40,
                  }}>
                  {strings.CART_EMPTY}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate('DashBoard');
                  }}>
                  <View
                    style={{
                      backgroundColor: '#000',
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
                      {strings.START_SHOPPING}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={this.state.data}
                renderItem={({ item, index }) => {
                  // console.warn('item', item)
                  return (
                    <View style={{ flexDirection: 'row', marginTop: 30, borderBottomWidth: 0.5, paddingBottom: 15 }}>
                      <View>
                        <Image
                          source={{
                            uri: item.extension_attributes?.image
                              ? item.extension_attributes.image
                              : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                          }}
                          resizeMode="contain"
                          style={{ width: this.state.isTablet == true ? width / 5 : width / 4, height: this.state.isTablet == true ? height / 8 : height / 7, borderRadius: 5, }}
                        />



                        {/* <View style={{ flexDirection: 'row', marginBottom: 10, alignSelf: 'center' }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.getquantity(item.item_id, item.qty - 1)
                              // this.setState({ count: this.state.count - 1 });
                            }}
                            style={{
                              marginTop: 6,
                              width: 25,
                              height: 25,
                              backgroundColor: '#4B4B52',
                              justifyContent: 'center',
                            }}>
                            <Image
                              source={require(`../../Assets/minus.png`)}
                              style={{ width: 13, alignSelf: 'center' }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                          <View
                            style={{
                              marginTop: 6,
                              width: 25,
                              height: 25,
                              backgroundColor: '#4B4B52',
                              marginLeft: 5,
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={{ alignSelf: 'center', color: '#ffffff', fontSize: 13 }}>
                              {item.qty < 1 ? '1' : item.qty}
                            </Text>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              this.getquantity(item.item_id, item.qty + 1)

                            }}
                            style={{
                              marginTop: 6,
                              width: 25,
                              height: 25,
                              backgroundColor: '#4B4B52',
                              marginLeft: 5,
                              justifyContent: 'center',
                            }}>
                            <Image
                              source={require(`../../Assets/plus.png`)}
                              style={{ width: 13, alignSelf: 'center' }}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                        </View> */}

                      </View>
                      <View style={{ marginLeft: 20, }}>
                        <Text
                          style={{
                            color: '#5A5A5F',
                            fontSize: this.state.isTablet == true ? 17 : 15,
                            fontFamily: 'Roboto-bold',
                            width: this.state.isTablet == true ? width / 1.5 : width / 2
                          }} numberOfLines={2}>
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            color: '#000000',
                            fontSize: 12,
                            fontFamily: 'Roboto-Regular',
                            marginTop: 5,
                          }}>
                          {strings.AED} {item.price}
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                            <TouchableOpacity
                              onPress={() => {
                                this.getquantity(item.item_id, item.qty - 1)
                                // this.setState({ count: this.state.count - 1 });
                              }}
                              style={{
                                marginTop: 6,
                                width: 25,
                                height: 25,
                                backgroundColor: '#4B4B52',
                                justifyContent: 'center',
                              }}>
                              <Image
                                source={require(`../../Assets/minus.png`)}
                                style={{ width: 13, alignSelf: 'center' }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                            <View
                              style={{
                                marginTop: 6,
                                width: 25,
                                height: 25,
                                backgroundColor: '#4B4B52',
                                marginLeft: 5,
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={{ alignSelf: 'center', color: '#ffffff', fontSize: 13 }}>
                                {item.qty < 1 ? '1' : item.qty}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                this.getquantity(item.item_id, item.qty + 1)

                              }}
                              style={{
                                marginTop: 6,
                                width: 25,
                                height: 25,
                                backgroundColor: '#4B4B52',
                                marginLeft: 5,
                                justifyContent: 'center',
                              }}>
                              <Image
                                source={require(`../../Assets/plus.png`)}
                                style={{ width: 13, alignSelf: 'center' }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                          <View>
                            <TouchableOpacity
                              onPress={() => {
                                this.deleteProduct(item.item_id);
                              }}
                              style={{
                                borderRadius: 5,
                                alignSelf: 'center',
                                paddingHorizontal: 15,
                                paddingVertical: 5,
                                backgroundColor: '#4B4B52',
                                marginTop: this.state.isTablet == true ? 10 : 15,
                                // marginTop: this.state.isTablet == true ? height / 5.8 : height / 4.9,
                                elevation: 5
                              }}>

                              <Text
                                style={{
                                  color: '#fff',
                                  fontSize: 12,
                                  fontFamily: 'Roboto-Regular',
                                }}>
                                {strings.DELETE}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>

                        {/* <TouchableOpacity style={{ borderWidth: 1, borderRadius: 5, borderColor: "#4B4B52", alignSelf: "flex-start", paddingHorizontal: 15, paddingVertical: 2, marginTop: 10 }}>
                        <Text style={{ color: "#4B4B52", fontSize: 12, fontFamily: "Roboto-Regular" }}>Small</Text>
                      </TouchableOpacity> */}
                        {/* <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <Text style={{ color: "#4B4B52", fontSize: 16, fontFamily: "Roboto-Regular" }}>Color :</Text>
                        <TouchableOpacity style={{ backgroundColor: "#4B4B52", width: 20, height: 20, borderRadius: 20, marginLeft: 5 }}>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: "#F87411", width: 20, height: 20, borderRadius: 20, marginLeft: 5 }}>
                        </TouchableOpacity
                      </View> */}
                        <ScrollView style={{ maxHeight: this.state.isTablet == true ? 50 : height / 1 }}>
                          {/* {item.extension_attributes?.description ? (
                           
                            <View style={{ maxHeight: 83, width: width / 2, marginTop: 5 }}>
                              <RenderHtml
                                contentWidth={this.state.isTablet == true ? width / 1.2 : 100}
                                source={{ html: item.extension_attributes?.description }}
                                tagsStyles={{
                                  h1: { color: '#000' },
                                  h2: { color: '#000' },
                                  h3: { color: '#000' },
                                  h4: { color: '#000' },
                                  h5: { color: '#000' },
                                  p: { color: '#000' },
                                }}

                              />
                            </View>
                          ) : null} */}
                        </ScrollView>
                        {/* <View style={{ flexDirection: 'row', marginTop: 10 }}>
                          <TouchableOpacity
                            onPress={() => {
                              this.deleteProduct(item.item_id);
                            }}
                            style={{
                              borderRadius: 5,
                              alignSelf: 'flex-start',
                              paddingHorizontal: 15,
                              paddingVertical: 3,
                              backgroundColor: '#000',
                            }}>
                            <Text
                              style={{
                                color: '#fff',
                                fontSize: 12,
                                fontFamily: 'Roboto-Regular',
                              }}>
                              {strings.DELETE}
                            </Text> */}
                        {/* </TouchableOpacity>
                        </View> */}
                        {/* <View style={{ position: 'absolute', }}> */}
                        {/* <TouchableOpacity
                          onPress={() => {
                            this.deleteProduct(item.item_id);
                          }}
                          style={{
                            borderRadius: 5,
                            alignSelf: 'flex-start',
                            paddingHorizontal: 15,
                            paddingVertical: 5,
                            backgroundColor: '#4B4B52',
                            // marginTop: this.state.isTablet == true ? height / 5.8 : height / 4.9,
                            elevation: 5
                          }}>

                          <Text
                            style={{
                              color: '#fff',
                              fontSize: 12,
                              fontFamily: 'Roboto-Regular',
                            }}>
                            {strings.DELETE}
                          </Text>
                        </TouchableOpacity> */}

                        {/* </View> */}
                      </View>
                    </View>
                  );
                }}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>

        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
