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
import { setLng, getLng } from '../../Component/lng/changeLng';
import strings from '../../Component/lng/LocalizedStrings';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class MyOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      data: [
        {
          OrderId: '1202356',
          EstimatedDeliveryDate: ' 28/02/2022 - 01/03/2022',
          DeliveryId: '002135',
          TotalAmount: 'INR 286',
          Status: 'Shipped',
        },
        {
          OrderId: '1202355',
          EstimatedDeliveryDate: ' 28/02/2022 - 01/03/2022',
          DeliveryId: '002135',
          TotalAmount: 'INR 135',
          Status: 'Order Processed',
        },
      ],
      cartToken: '',
      count: 0,
      loder: false,
      focus1: true,
      focus2: false,
      focus3: false,
      currentPosition: 0,
      labelsData: [
        { label: 'Cart' },
        { label: 'Delivery Address' },
        { label: 'Order Summary' },
        { label: 'Payment Method' },
        { label: 'Track' },
      ],
      completedOrder: [],
      orderListt: [],
      canceledOrder: [],
      completedOrder1: [],
      orderListt1: [],
      canceledOrder1: [],
    };
  }

  componentDidMount = async () => {
    this.selectedLng()
    this.profileData();
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
    // console.warn("selected Language data==>>>", lngData)
  }

  profileData = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(response => {
        console.warn('profile', response);
        if (response.email) {
          this.setState({ loder: false });
          this.getOrderList(response.email);
        }
      })
      .catch(error => {
        this.setState({ loder: false });
        // console.warn('profile', error);
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

  getOrderList = mail => {
    this.setState({ loder: true });
    GetRequest(
      `orders?searchCriteria[filter_groups][0][filters][0][field]=customer_email&searchCriteria[filter_groups][0][filters][0][value]=${mail}`,
      undefined,
      {},
      'admin',
    )
      .then(response => {
        this.setState({ loder: false });
        response.items.forEach(item => {
          if (
            (item.status == 'pending' || 'processing') &&
            item.status !== 'complete' &&
            item.status !== 'canceled'
          ) {
            this.state.orderListt.push(item);
            var loanTransHistorysort1 = this.state.orderListt
              .sort((a, b) => {
                return (
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
                );
              })
              .reverse();
            this.setState({
              orderListt1: loanTransHistorysort1,
            });

            // console.warn('bfhdsj', this.state.orderListt1);
          }
          if (item.status == 'complete') {
            this.state.completedOrder.push(item);
            var loanTransHistorysort2 = this.state.completedOrder
              .sort((a, b) => {
                return (
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
                );
              })
              .reverse();
            this.setState({
              completedOrder1: loanTransHistorysort2,
            });
          }
          if (item.status == 'canceled') {
            this.state.canceledOrder.push(item);
            var loanTransHistorysort3 = this.state.canceledOrder
              .sort((a, b) => {
                return (
                  new Date(a.created_at).getTime() -
                  new Date(b.created_at).getTime()
                );
              })
              .reverse();
            this.setState({
              canceledOrder1: loanTransHistorysort3,
            });
          }
        });
      })
      .catch(error => {
        this.setState({ loder: false });
        console.log('getOrderList errorrr', error);
      });
  };

  orderList = () => {
    this.setState({ focus3: false, focus1: true, focus2: false });
  };

  PreviousList = () => {
    this.setState({ focus3: false, focus2: true, focus1: false });
  };

  CanceledList = () => {
    this.setState({ focus3: true, focus1: false, focus2: false });
  };
  next = () => {
    this.setState({ currentPosition: this.state.currentPosition + 1 });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={strings.MY_ORDERS}
          navigation={this.props.navigation}
          icon="arrowleft"
        />
        <View
          style={{
            flexDirection: 'row',
            marginLeft: 20,
            marginTop: 30,
            marginRight: 20,
          }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              onPress={() => {
                this.orderList();
              }}>
              <View
                style={{
                  width: 110,
                  backgroundColor:
                    this.state.focus1 == true ? '#FDB833' : '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  borderColor: this.state.focus1 == true ? '#FDB833' : '#000',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    padding: 10,
                    color: this.state.focus1 == true ? '#fff' : '#000',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.UPCOMING}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.PreviousList();
              }}>
              <View
                style={{
                  width: 110,
                  marginLeft: 5,
                  backgroundColor:
                    this.state.focus2 == true ? '#FDB833' : '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  borderColor: this.state.focus2 == true ? '#FDB833' : '#000',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    padding: 10,
                    color: this.state.focus2 == true ? '#fff' : '#000',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.COMPLETED}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.CanceledList();
              }}>
              <View
                style={{
                  width: 110,
                  marginLeft: 5,
                  backgroundColor:
                    this.state.focus3 == true ? '#FDB833' : '#fff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  borderColor: this.state.focus3 == true ? '#FDB833' : '#000',
                  borderWidth: 1,
                }}>
                <Text
                  style={{
                    padding: 10,
                    color: this.state.focus3 == true ? '#fff' : '#000',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.CANCELLED}
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {this.state.focus1 == true ? (
          this.state.orderListt1.length == 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 150,
              }}>
              <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                {strings.NO_ORDERS}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('DashBoard');
                }}>
                <View
                  style={{
                    backgroundColor: '#FDB833',
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
                    {strings.ORDER_SOMETHNG}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 150 }}>
              <FlatList
                data={this.state.orderListt1}
                renderItem={({ item, index }) => {
                  // console.warn('itemmm', item.created_at.slice(0, 10));
                  const strToDate = new Date(item.created_at.slice(0, 10));
                  const newd = strToDate.setDate(strToDate.getDate() + 2);
                  const numDate = new Date(newd);
                  const formattedDate = numDate.toLocaleDateString("en-US")


                  // let date = new Date(item.created_at);
                  // date.setDate(date.getDate() + 2);
                  // console.warn('dat', date)
                  // new Date(currentDate).toISOString().slice(0, 10)
                  // const newdate = new Date(formattedDate).toISOString().slice(0, 10);
                  // console.warn(
                  //   'dat',
                  //   formattedDate
                  // );
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        this.props.navigation.navigate('MyOrder2', {
                          id: item.entity_id,
                          status: item.status,
                          incid:item.increment_id,
                          items: item,
                          date: formattedDate,
                        });
                      }}>
                      <View
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          padding: 10,
                          backgroundColor: '#fff',
                          justifyContent: 'center',
                          borderRadius: 5,
                          borderColor: '#000',
                          borderWidth: 1,
                          marginTop: 20,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            numberOfLines={2}
                            style={{
                              color: '#5A5A5F',
                              fontSize: 14,
                              fontFamily: 'Roboto-bold',
                              fontWeight: 'bold',
                            }}>
                            {strings.ORDER_ID} - {item.increment_id}
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={{
                              color: '#43BC18',
                              fontSize: 10,
                              fontFamily: 'Roboto-bold',
                            }}>
                            {item.status}
                          </Text>
                        </View>
                        <Text
                          numberOfLines={2}
                          style={{
                            color: '#FF141D',
                            fontSize: 10,
                            fontFamily: 'Roboto-bold',
                            marginTop: 5,
                          }}>
                          {strings.DELIVERY_DATE} :{formattedDate}
                        </Text>
                        {/* <Text numberOfLines={2} style={{ color: "#5A5A5F", fontSize: 12, fontFamily: "Roboto-bold", fontWeight: 'bold', marginTop: 5 }}>Delivery Id -</Text> */}
                        <Text
                          numberOfLines={2}
                          style={{
                            color: '#5A5A5F',
                            fontSize: 12,
                            fontFamily: 'Roboto-bold',
                            fontWeight: 'bold',
                            marginTop: 5,
                          }}>
                          {strings.TOTAL_AMT} - {item.store_currency_code}{' '}
                          {item.grand_total}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )
        ) : null}
        {this.state.focus2 == true ? (
          this.state.completedOrder1.length == 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 150,
              }}>
              <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                {strings.NO_PRE_ORDERS}
              </Text>
            </View>
          ) : (
            <View style={{ marginLeft: 20, marginRight: 20 }}>
              <FlatList
                data={this.state.completedOrder1}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity onPress={() => { }}>
                      <View
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          padding: 10,
                          backgroundColor: '#fff',
                          justifyContent: 'center',
                          borderRadius: 5,
                          borderColor: '#000',
                          borderWidth: 1,
                          marginTop: 20,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            numberOfLines={2}
                            style={{
                              color: '#5A5A5F',
                              fontSize: 14,
                              fontFamily: 'Roboto-bold',
                              fontWeight: 'bold',
                            }}>
                            {strings.ORDER_ID} - {item.increment_id}
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={{
                              color: '#43BC18',
                              fontSize: 10,
                              fontFamily: 'Roboto-bold',
                            }}>
                            {item.status}
                          </Text>
                        </View>
                        {/* <Text numberOfLines={2} style={{ color: "#FF141D", fontSize: 10, fontFamily: "Roboto-bold", }}>Estimated Delivery Date - {item.EstimatedDeliveryDate}</Text> */}
                        {/* <Text numberOfLines={2} style={{ color: "#5A5A5F", fontSize: 12, fontFamily: "Roboto-bold", fontWeight: 'bold', marginTop: 5 }}>Delivery Id -{item.DeliveryId}</Text> */}
                        <Text
                          numberOfLines={2}
                          style={{
                            color: '#5A5A5F',
                            fontSize: 12,
                            fontFamily: 'Roboto-bold',
                            fontWeight: 'bold',
                          }}>
                          {strings.TOTAL_AMT} - {item.store_currency_code}{' '}
                          {item.grand_total}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )
        ) : null}
        {this.state.focus3 == true ? (
          this.state.canceledOrder1.length == 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 150,
              }}>
              <Text style={{ fontSize: 18, color: '#000', fontWeight: 'bold' }}>
                {strings.NO_CANCEL_ORDER}
              </Text>
            </View>
          ) : (
            <View style={{ marginLeft: 20, marginRight: 20 }}>
              <FlatList
                data={this.state.canceledOrder1}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity onPress={() => { }}>
                      <View
                        style={{
                          paddingLeft: 20,
                          paddingRight: 20,
                          padding: 10,
                          backgroundColor: '#fff',
                          justifyContent: 'center',
                          borderRadius: 5,
                          borderColor: '#000',
                          borderWidth: 1,
                          marginTop: 20,
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Text
                            numberOfLines={2}
                            style={{
                              color: '#5A5A5F',
                              fontSize: 14,
                              fontFamily: 'Roboto-bold',
                              fontWeight: 'bold',
                            }}>
                            {strings.ORDER_ID} - {item.increment_id}
                          </Text>
                          <Text
                            numberOfLines={2}
                            style={{
                              color: '#43BC18',
                              fontSize: 10,
                              fontFamily: 'Roboto-bold',
                            }}>
                            {item.status}
                          </Text>
                        </View>
                        {/* <Text numberOfLines={2} style={{ color: "#FF141D", fontSize: 10, fontFamily: "Roboto-bold", }}>Estimated Delivery Date - {item.EstimatedDeliveryDate}</Text> */}
                        {/* <Text numberOfLines={2} style={{ color: "#5A5A5F", fontSize: 12, fontFamily: "Roboto-bold", fontWeight: 'bold', marginTop: 5 }}>Delivery Id -{item.DeliveryId}</Text> */}
                        <Text
                          numberOfLines={2}
                          style={{
                            color: '#5A5A5F',
                            fontSize: 12,
                            fontFamily: 'Roboto-bold',
                            fontWeight: 'bold',
                          }}>
                          {strings.TOTAL_AMT} - {item.store_currency_code}{' '}
                          {item.grand_total}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )
        ) : null}
        {this.state.loder && <Loder />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  lblContainer: {
    // marginTop: 40,
    padding: 20,
    // paddingLeft: 5,
    width: 135,
    // alignSelf: 'center'
  },
});
