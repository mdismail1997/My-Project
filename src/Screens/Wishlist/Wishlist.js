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
  I18nManager
} from 'react-native';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import { GetRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartItem from '../../Component/CartItem/CartItem';
import axios from 'axios';
import { setLng, getLng } from '../../Component/lng/changeLng';
import strings from '../../Component/lng/LocalizedStrings';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
export default class Wishlist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      data: [],
      cartToken: '',
      count: 0,
      loder: true,
      reviewLength: '',
      totalPer: [],
      valueAdded: 0,
    };
  }

  componentDidMount = async () => {
    this.selectedLng()
    this.setState({ loder: true });
    this.wishlistList();
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
    this.setState({
      loder: false,
    })
    console.warn("selected Language data==>>>", lngData)
  }

  wishlistList = () => {
    this.setState({ loder: true });

    GetRequest('wishlist', undefined, {}, 'self')
      .then(response => {
        this.setState({ loder: false });
        console.warn('wishlist list', response);
        this.setState({ data: response.items });
      })
      .catch(error => {
        this.setState({ loder: false });
        console.warn('wishlist list err', error);
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

  removeWish = async id => {
    Alert.alert(strings.DELETE_CONFIRM, '', [
      { text: strings.CANCEL },
      {
        text: strings.OK,
        onPress: async () => {
          {
            this.setState({ loder: true });
            let AccessToken = await AsyncStorage.getItem('traderToken');
            let headers =
              AccessToken == null
                ? {
                  'Content-Type': 'application/json',
                }
                : {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${AccessToken}`,
                };
            axios
              .delete(
                `https://traders-platform.com/rest/V1/wishlist/${id}`,
                { headers },
              )
              .then(() => {
                this.setState({ loder: false });
                alert('Product deleted from wishlist successfully');
                this.wishlistList();
              })
              .catch(error => {
                this.setState({ loder: false });
                console.warn('There is an error!', error);
              });
          }
        }
      }])
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={strings.MYWISH}
          navigation={this.props.navigation}
          icon="arrowleft"
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ margin: 20, marginTop: 30 }}>
            {this.state.data.length == 0 ? (
              <>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={require('../../Assets/appstore.png')}
                    style={{ height: 200, width: 200, resizeMode: 'contain' }}
                  />

                </View>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#000',
                    fontWeight: 'bold',
                    alignSelf: 'center',
                    marginTop: 50,
                  }}>
                  {strings.WISH_LIST_EMPTY}
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
              </>
            ) : (
              <FlatList
                data={this.state.data}
                renderItem={({ item, index1 }) => {
                  // console.warn('itme', item);
                  let img = '';
                  {
                    item.product.custom_attributes.map(item => {
                      if (item.attribute_code == 'image') {
                        img = item.value;
                      }
                    });
                  }
                  let description = '';
                  {
                    item.product.custom_attributes.map(item => {
                      if (item.attribute_code == 'short_description') {
                        description = item.value;
                      }
                    });
                  }
                  return (
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ProductDetails', {
                      id: item.product.id,
                      image: img,
                      name: item.product.name,
                      description: description,
                      price: item.product.price,
                      sku: item.product.sku,
                    })}>
                      <View style={{ flexDirection: 'row' }}>
                        <View>
                          <CartItem item={item.product} fromScreen={'wish'} />
                        </View>
                        <View style={{ marginLeft: 15, flex: 1 }}>
                          <Text
                            style={{
                              color: '#5A5A5F',
                              fontSize: 15,
                              fontFamily: 'Roboto-bold',
                            }}>
                            {item.product.name}
                          </Text>
                          <Text
                            style={{
                              color: '#000000',
                              fontSize: 12,
                              fontFamily: 'Roboto-Regular',
                              marginTop: 5,
                            }}>
                            {strings.AED} {item.product.price}
                          </Text>
                          <Text
                            style={{
                              color: '#4B4B52',
                              fontSize: 12,
                              fontFamily: 'Roboto-Regular',
                              marginTop: 15,
                              flexWrap: 'wrap',
                            }}>
                            {' '}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => {
                            this.removeWish(item.id);
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
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>
        </ScrollView>
        {this.state.loder && <Loder />}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});
