import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  Dimensions,
  TextInput,
  Pressable,
  I18nManager
} from 'react-native';
import Header from '../../Component/Header/Header';
import { Rating } from 'react-native-elements';
import { Input } from 'react-native-elements';
import Loder from '../../Component/Common/Lodar';
import { GetRequest, FetchPostRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { ProgressBar, Colors } from 'react-native-paper';
import { ADMIN_TOKEN, BASE_URL } from '../../Services/Constants';
import axios from 'axios';
import { setLng, getLng } from '../../Component/lng/changeLng';
import strings from '../../Component/lng/LocalizedStrings';

const windowWidth = Dimensions.get('window').width;

export default class CustomerReview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      loder: false,
      data: '',
      image: '',
      smallImg: '',
      smallImg2: '',
      smallImg3: '',
      images: [],
      description: '',
      cartToken: '',
      cartData: {},
      count: 0,
      totalPer: '',
      modalShow: false,
      nickname: '',
      Summary: '',
      review: '',
      review1: '',
      review2: '',
      review3: '',
      reviewLength: '',
      reviewData: [],
      reviewRate: [],
      re: '',
      count1: 0,
      count2: 0,
      count3: 0,
      count4: 0,
      count5: 0,
      Per1: 0,
      Per2: 0,
      Per3: 0,
      Per4: 0,
      Per5: 0,
      // colors: [
      //     { id: 1, color: 'red', no: 5606 },
      //     { id: 1, color: 'red', no: 5606 },
      //     { id: 1, color: 'red', no: 5606 },
      //     { id: 1, color: 'red', no: 5606 },
      //     { id: 1, color: 'red', no: 5606 }
      // ],
      // sizes: [
      //     { id: 1, size: 'M', no: 5613 },
      //     { id: 1, size: 'M', no: 5613 },
      //     { id: 1, size: 'M', no: 5613 },

      // ]
    };
  }

  componentDidMount = async () => {
    console.warn('ds', this.props);
    this.selectedLng()
    const cart = await AsyncStorage.getItem('cartToken');
    this.setState({ cartToken: cart });
    this.getReviews();
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
      loder: false
    })
    console.warn("selected Language data>>", lngData)
  }

  ratingCompleted = rating => {
    console.warn('Rating is: ', rating);
  };

  getReviews = id => {
    if (this.state.modalShow) {
      this.setState({ modalShow: !this.state.modalShow });
    }
    this.setState({ loder: true });
    GetRequest(
      `products/${this.props.route.params.sku}/reviews`,
      undefined,
      {},
      'admin',
    )
      .then(res => {
        this.setState({ loder: false });
        console.warn('review details responce => ', res);
        this.setState({ reviewData: res });
        this.setState({ reviewLength: res.length });
        if (res.length != 0) {
          let total = [];
          res.forEach(element => {
            let count = 0;
            let valueAdded = 0;

            for (let i = 0; i < element.ratings.length; i++) {
              count = parseInt(element.ratings[i].percent);
              valueAdded += count;
            }
            total.push(valueAdded);
          });
          let totalMarks = total.length * 300;
          let count1 = 0;
          let valueAdded1 = 0;
          for (let i = 0; i < total.length; i++) {
            count1 = parseInt(total[i]);
            valueAdded1 += count1;
          }
          let revierPer = ((5 * valueAdded1) / totalMarks).toFixed(1);
          this.setState({ totalPer: revierPer });

          this.state.reviewData.forEach(item => {
            item.ratings.reduce(
              (total, currentItem) => (total = total + currentItem.percent),
              0,
            );
          });
          total.forEach(element => {
            let revierPer2 = ((5 * element) / 300).toFixed(0);
            this.state.reviewRate.push(revierPer2);
          });
          console.warn('revierPer', this.state.reviewRate);

          let count4 = 0;
          for (var i = 0; i < this.state.reviewRate.length; i++) {
            if (this.state.reviewRate[i] == 4) {
              count4 += 1;
            }
          }
          let per4 = count4 / this.state.reviewRate.length;
          this.setState({ count4: count4, Per4: per4 });

          let count3 = 0;
          for (var i = 0; i < this.state.reviewRate.length; i++) {
            if (this.state.reviewRate[i] == 3) {
              count3 += 1;
            }
          }
          let per3 = count3 / this.state.reviewRate.length;
          this.setState({ count3: count3, Per3: per3 });

          let count2 = 0;
          for (var i = 0; i < this.state.reviewRate.length; i++) {
            if (this.state.reviewRate[i] == 2) {
              count2 += 1;
            }
          }
          let per2 = count2 / this.state.reviewRate.length;
          this.setState({ count2: count2, Per2: per2 });

          let count11 = 0;
          for (var i = 0; i < this.state.reviewRate.length; i++) {
            if (this.state.reviewRate[i] == 1) {
              count11 += 1;
            }
          }
          let per1 = count11 / this.state.reviewRate.length;
          this.setState({ count11: count11, Per1: per1 });

          let count5 = 0;
          for (var i = 0; i < this.state.reviewRate.length; i++) {
            if (this.state.reviewRate[i] == 5) {
              count5 += 1;
            }
          }
          let per = count5 / this.state.reviewRate.length;
          this.setState({ count5: count5, Per5: per });
        } else this.setState({ totalPer: 0 });
      })
      .catch(error => {
        this.setState({ loder: false });
        console.warn('Product details error => ', error);
      });
  };

  addReview = async () => {
    console.warn('data', this.props.route.params.id);
    this.setState({ loder: true });
    const data = {
      review: {
        title: this.props.route.params.sku,
        detail: this.state.review,
        nickname: this.state.nickname,
        ratings: [
          {
            rating_name: 'Rating',
            value: 1,
          },
          {
            rating_name: 'Quality',
            value: this.state.review1,
          },
          {
            rating_name: 'Value',
            value: this.state.review2,
          },
          {
            rating_name: 'Price',
            value: this.state.review3,
          },
        ],
        review_entity: 'product',
        review_status: 1,
        entity_pk_value: this.props.route.params.id,
      },
    };
    await FetchPostRequest(`reviews/`, data, {})
      .then(res => {
        this.setState({ loder: false });
        console.warn('reviews ', res);
        if (res) {
          Alert.alert(strings.REVIEW_SUBMIT, '', [
            { text: strings.CANCEL },
            {
              text: strings.OK,
              onPress: () => {
                this.props.navigation.navigate('ProductDetails', {
                  sku: this.props.route.params.sku,
                  id: this.props.route.params.id,
                });
              },
            },
          ]);
        } else {
          Alert.alert(strings.REVIEW_SUBMIT, res?.message, [
            { text: strings.CANCEL },
            { text: strings.OK },
          ]);
        }
      })
      .catch(error => {
        this.setState({ loder: false });
        Alert.alert(strings.REVIEW_SUBMIT_FAILED, '', [
          { text: strings.CANCEL },
          { text: strings.OK },
        ]);
      });
  };

  ratingCompleted1 = rating => {
    this.setState({ review1: rating });
    console.warn('Rating is:1 ', rating);
  };

  ratingCompleted2 = rating => {
    this.setState({ review2: rating });
    console.warn('Rating is:2 ', rating);
  };

  ratingCompleted3 = rating => {
    this.setState({ review3: rating });
    console.warn('Rating is:3 ', rating);
  };

  deleteProduct = async id => {
    this.setState({ loder: true });

    const headers = {
      Authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    };
    axios
      .delete(
        `https://traders-platform.com/rest/V1/reviews/${id}`,
        { headers },
      )
      .then(() =>
        // console.warn('Delete successful')
        this.setState({ loder: false })(
          Alert.alert('Delete successfully', '', [
            { text: strings.CANCEL },
            {
              text: strings.OK,
              onPress: () => {
                this.getReviews();
              },
            },
          ]),
        ),
      )
      .catch(error => {
        console.warn('There was an error!', error);
      });
  };

  render() {
    console.warn('skuuuuuu', this.state.data);
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalShow}
          onRequestClose={() =>
            this.setState({ modalShow: !this.state.modalShow })
          }>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Pressable
                onPress={() =>
                  this.setState({ modalShow: !this.state.modalShow })
                }
                style={{ marginHorizontal: 10, alignSelf: 'flex-end' }}>
                <Feather name="x" color={'#000'} size={30} solid />
              </Pressable>
              <View style={{ alignItems: 'flex-start' }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#676767',
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                  }}>
                  {strings.YOUAREREVIEWING}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#676767',
                    fontSize: 17,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {this.props.route.params.sku}
                </Text>
                <Text
                  style={{
                    marginTop: 20,
                    color: '#676767',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.YOURRATING}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Text
                    style={{
                      color: '#676767',
                      fontSize: 15,
                      fontFamily: 'Roboto-Regular',
                      fontWeight: 'bold',
                    }}>
                    {strings.QUANTITY}
                  </Text>
                  <View style={{ marginLeft: 20 }}>
                    <Rating
                      type="custom"
                      ratingColor="#e95f42"
                      ratingBackgroundColor="#ddd"
                      tintColor="#FFF"
                      // fractions={1.1}
                      startingValue={0}
                      imageSize={20}
                      onFinishRating={this.ratingCompleted1}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Text
                    style={{
                      color: '#676767',
                      fontSize: 15,
                      fontFamily: 'Roboto-Regular',
                      fontWeight: 'bold',
                    }}>
                    {strings.VALUE}
                  </Text>
                  <View style={{ marginLeft: 20 }}>
                    <Rating
                      type="custom"
                      ratingColor="#e95f42"
                      ratingBackgroundColor="#ddd"
                      tintColor="#FFF"
                      // fractions={1.1}
                      startingValue={0}
                      imageSize={20}
                      onFinishRating={this.ratingCompleted2}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <Text
                    style={{
                      color: '#676767',
                      fontSize: 15,
                      fontFamily: 'Roboto-Regular',
                      fontWeight: 'bold',
                    }}>
                    {strings.PRICE}
                  </Text>
                  <View style={{ marginLeft: 20 }}>
                    <Rating
                      type="custom"
                      ratingColor="#e95f42"
                      ratingBackgroundColor="#ddd"
                      tintColor="#FFF"
                      // fractions={1.1}
                      startingValue={0}
                      imageSize={20}
                      onFinishRating={this.ratingCompleted3}
                    />
                  </View>
                </View>

                <Text
                  style={{
                    marginTop: 20,
                    color: '#676767',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.NICKNAME}
                </Text>
                <Input
                  value={this.state.nickname}
                  inputContainerStyle={{
                    borderBottomWidth: 0.3,
                    marginTop: 5,
                    borderColor: '#676767',
                    borderWidth: 0.3,
                  }}
                  containerStyle={{ paddingHorizontal: 0 }}
                  inputStyle={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Regular',
                    paddingVertical: -1,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                  errorStyle={{ display: 'none' }}
                  onChangeText={e => {
                    this.setState({ nickname: e });
                  }}
                />

                <Text
                  style={{
                    marginTop: 20,
                    color: '#676767',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.SUMMARY}
                </Text>
                <Input
                  value={this.state.Summary}
                  inputContainerStyle={{
                    borderBottomWidth: 0.3,
                    marginTop: 5,
                    borderColor: '#676767',
                    borderWidth: 0.3,
                  }}
                  containerStyle={{ paddingHorizontal: 0 }}
                  inputStyle={{
                    fontSize: 16,
                    fontFamily: 'Roboto-Regular',
                    paddingVertical: -1,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                  errorStyle={{ display: 'none' }}
                  onChangeText={e => {
                    this.setState({ Summary: e });
                  }}
                />

                <Text
                  style={{
                    marginTop: 20,
                    color: '#676767',
                    fontSize: 15,
                    fontFamily: 'Roboto-Regular',
                    fontWeight: 'bold',
                  }}>
                  {strings.REVIEW}
                </Text>
                {/* <Input
                                    inputContainerStyle={{ borderBottomWidth: 0.3, marginTop: 5, borderColor: "#676767", borderWidth: 0.3, height: 100 }}
                                    containerStyle={{ paddingHorizontal: 0 }}
                                    inputStyle={{ fontSize: 16, fontFamily: "Roboto-Regular", }}
                                    errorStyle={{ display: "none" }}
                                    onChangeText={(e) => { }}
                                /> */}
                <TextInput
                  value={this.state.review}
                  multiline={true}
                  numberOfLines={10}
                  onChangeText={text => this.setState({ review: text })}
                  style={{
                    borderBottomWidth: 0.3,
                    marginTop: 5,
                    borderColor: '#676767',
                    borderWidth: 0.3,
                    height: 100,
                    width: windowWidth - 90,
                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                  }}
                />
                <TouchableOpacity
                  style={{ width: 150, alignSelf: 'center' }}
                  onPress={() => this.addReview()}>
                  <View
                    style={{
                      backgroundColor: '#676767',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      marginVertical: 10,
                      paddingVertical: 7,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 15,
                        fontFamily: 'Roboto-Regular',
                        letterSpacing: 2,
                        fontWeight: 'bold',
                      }}>
                      {strings.SUBMITREVIEW}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Header
          title={strings.CUSTOMER_REVIEW}
          navigation={this.props.navigation}
          icon="arrowleft"
        />
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <View
            style={{
              marginBottom: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                marginTop: 10,
                marginBottom: 5,
                alignItems: 'flex-start',
                flexDirection: 'row',
              }}>
              <Rating
                type="custom"
                ratingColor="#F87411"
                ratingBackgroundColor="#ddd"
                tintColor="#FFF"
                // fractions={1.1}
                startingValue={this.props.route.params.totalPer}
                imageSize={20}
                readonly
              />

              {/* <Text style={{ color: '#F87411', marginLeft: 10 }}>{this.props.route.params.reviewLength} {this.props.route.params.reviewLength == 1 ? 'review' : 'reviews'} </Text> */}
              <Text style={{ marginLeft: 10, fontSize: 11, alignSelf: 'center' }}>
                {this.props.route.params.totalPer} {strings.OUT_OF_5}{' '}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                this.setState({ modalShow: !this.state.modalShow });
              }}>
              {/* <Text style={{ marginTop: 10, fontSize: 13, }}>Write a review </Text> */}
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 11 }}>
            {this.props.route.params.reviewLength} {strings.GLOBAL_RATINGS}{' '}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
              height: 110,
            }}>
            <View>
              <Text style={{ marginTop: 3, fontSize: 13 }}>5 star </Text>
              <Text style={{ marginTop: 3, fontSize: 13 }}>4 star </Text>
              <Text style={{ marginTop: 3, fontSize: 13 }}>3 star </Text>
              <Text style={{ marginTop: 3, fontSize: 13 }}>2 star </Text>
              <Text style={{ marginTop: 3, fontSize: 13 }}>1 star </Text>
            </View>
            <View style={{}}>
              <ProgressBar
                progress={this.state.Per5}
                color="#F87411"
                style={{ height: 10, width: 220, marginTop: 10, borderRadius: 5 }}
              />
              <ProgressBar
                progress={this.state.Per4}
                color="#F87411"
                style={{ height: 10, width: 220, marginTop: 10, borderRadius: 5 }}
              />
              <ProgressBar
                progress={this.state.Per3}
                color="#F87411"
                style={{ height: 10, width: 220, marginTop: 10, borderRadius: 5 }}
              />
              <ProgressBar
                progress={this.state.Per2}
                color="#F87411"
                style={{ height: 10, width: 220, marginTop: 10, borderRadius: 5 }}
              />
              <ProgressBar
                progress={this.state.Per1}
                color="#F87411"
                style={{ height: 10, width: 220, marginTop: 10, borderRadius: 5 }}
              />
            </View>
            <View>
              <Text style={{ marginTop: 3, fontSize: 13 }}>
                {this.state.Per5.toFixed(2) * 100}%
              </Text>
              <Text style={{ marginTop: 3, fontSize: 13 }}>
                {this.state.Per4.toFixed(2) * 100}%
              </Text>
              <Text style={{ marginTop: 3, fontSize: 13 }}>
                {this.state.Per3.toFixed(2) * 100}%
              </Text>
              <Text style={{ marginTop: 3, fontSize: 13 }}>
                {this.state.Per2.toFixed(2) * 100}%
              </Text>
              <Text style={{ marginTop: 3, fontSize: 13 }}>
                {this.state.Per1.toFixed(2) * 100}%
              </Text>
            </View>
          </View>
          <View style={{ marginBottom: 450, marginTop: 20 }}>
            <FlatList
              data={this.state.reviewData}
              renderItem={({ item, index }) => {
                const total = item.ratings.reduce(
                  (total, currentItem) => (total = total + currentItem.percent),
                  0,
                );
                let revierPer = ((5 * total) / 300).toFixed(1);
                return (
                  <View style={{ marginTop: 20 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{ flexDirection: 'row' }}>
                        <MaterialCommunityIcons
                          name="account-circle"
                          size={30}
                          color={'#4F4F54'}
                        />
                        <Text
                          numberOfLines={2}
                          style={{
                            color: '#4F4F54',
                            width: 170,
                            fontSize: 16,
                            fontFamily: 'Roboto-bold',
                            alignSelf: 'center',
                            marginLeft: 5,
                          }}>
                          {item.nickname}
                        </Text>
                      </View>
                      {/* <TouchableOpacity onPress={() => { this.deleteProduct(item.id) }} style={{ borderRadius: 5, alignSelf: "flex-start", paddingHorizontal: 15, paddingVertical: 3, backgroundColor: "#000" }}>
                                                <Text style={{ color: "#fff", fontSize: 12, fontFamily: "Roboto-Regular" }}>Delete</Text>
                                            </TouchableOpacity> */}
                    </View>
                    <View
                      style={{
                        marginTop: 10,
                        alignItems: 'flex-start',
                        flexDirection: 'row',
                      }}>
                      <Rating
                        type="custom"
                        ratingColor="#F87411"
                        ratingBackgroundColor="#ddd"
                        tintColor="#FFF"
                        // fractions={1.1}
                        startingValue={revierPer}
                        imageSize={12}
                        readonly
                      />
                    </View>
                    <Text
                      style={{
                        marginTop: 5,
                        color: '#4F4F54',
                        fontSize: 16,
                        fontFamily: 'Roboto-Regular',
                      }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        marginTop: 0,
                        color: '#4F4F54',
                        fontSize: 10,
                        fontFamily: 'Roboto-Regular',
                      }}>
                      {strings.REVIEW_ON} {item.created_at.substring(0, 10)}{' '}
                    </Text>
                    <Text
                      style={{
                        marginTop: 5,
                        color: '#4F4F54',
                        fontSize: 12,
                        fontFamily: 'Roboto-Regular',
                      }}>
                      {item.detail}{' '}
                    </Text>
                  </View>
                );
              }}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
        {this.state.loder && <Loder />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  headimg: {
    width: '100%',
    resizeMode: 'contain',
    height: 200,
    borderRadius: 5,
  },
  headitem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flex: 1,
  },
  itemimg: {
    height: 50,
    width: 50,
    borderRadius: 5,
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: windowWidth - 50,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
