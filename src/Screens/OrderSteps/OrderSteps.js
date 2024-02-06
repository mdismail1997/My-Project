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
  Dimensions,
} from 'react-native';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import { GetRequest } from '../../Services/ApiFunctions';
import StepIndicator from 'react-native-step-indicator';
import { setLng, getLng } from '../../Component/lng/changeLng';
import strings from '../../Component/lng/LocalizedStrings';

const labels = [
  'Cart',
  'Delivery Address',
  'Order Summary',
  'Payment Method',
  'Track',
];

const customStyles = {
  stepIndicatorSize: 25,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#43BC18',
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: '#43BC18',
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: '#43BC18',
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#43BC18',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#43BC18',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: '#43BC18',
};
const { width, height } = Dimensions.get('window');
const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

export default class OrderSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      count: 0,
      loder: false,
      focus1: true,
      focus2: false,

      currentPosition: 1,
      labelsData: [
        { label: strings.PENDING },
        { label: strings.PROCESSING },
        { label: strings.OUT_FOR_DELIVERY },
        { label: strings.ARRIVING },
        { label: strings.DELIVERED },
      ],
      image: '',
      street: '',
      city: '',
      zcode: '',
      country: '',
      rcode: '',
    };
  }

  componentDidMount = async () => {
    this.selectedLng()
    this.next();
    // console.warn(
    //   'propssssssssss12333333333',
    //   this.props.route.params.myid,
    // );

    // console.warn(
    //   '2222222222222',
    //   this.props.route.params.itemm.billing_address,
    // );
    this.setState({
      street:
        this.props.route.params.itemm.billing_address.street[0] +
        ' ' +
        this.props.route.params.itemm.billing_address.street[0],
      city: this.props.route.params.itemm.billing_address.city,
      zcode: this.props.route.params.itemm.billing_address.postcode,
      country: this.props.route.params.itemm.billing_address.country_id,
      rcode: this.props.route.params.itemm.billing_address.region,
    });
    this.getDetails(this.props.route.params.item);
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

  next = () => {
    if (this.props.route.params.status == strings.PENDING) {
      this.setState({
        currentPosition: 1,
      });
    } else if (this.props.route.params.status == strings.PROCESSING) {
      this.setState({
        currentPosition: 2,
      });
    } else if (this.props.route.params.status == strings.OUT_FOR_DELIVERY) {
      this.setState({
        currentPosition: 3,
      });
    } else if (this.props.route.params.status == strings.ARRIVING) {
      this.setState({
        currentPosition: 4,
      });
    } else if (this.props.route.params.status == strings.DELIVERED) {
      this.setState({
        currentPosition: 5,
      });
    }
  };

  getDetails = item => {
    // setLoder(true)
    GetRequest(`products/${item.sku}`, undefined, {}, 'admin')
      .then(res => {
        res.custom_attributes.map(item => {
          if (item.attribute_code == 'image') {
            // setImage(item.value)
            // console.warn('img', item.value);
            this.setState({ image: item.value });
          }
        });
      })

      .catch(error => {
        setLoder(false);
      });
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
            marginTop: 20,
            marginLeft: 20,
            marginRight: 20,
          }}>
          <View>
            <Image
              source={{
                uri: this.state.image
                  ? `https://traders-platform.com/pub/media/catalog/product${this.state.image}`
                  : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
              }}
              resizeMode="contain"
              style={{ width: 110, height: 150, borderRadius: 5 }}
            />
            {/* <Image source={require('../../Assets/top.png')} resizeMode="cover" style={{ width: 100, height: 130, }} /> */}
          </View>
          <View style={{ marginLeft: 15, flex: 1, marginTop: 10 }}>
            <Text
              style={{
                color: '#5A5A5F',
                fontSize: 13,
                fontFamily: 'Roboto-Regular',
                fontWeight: 'bold',
              }}>
              {strings.ORDER_ID} -{this.props.route.params.myid}
            </Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 12,
                fontFamily: 'Roboto-Regular',
                marginTop: 5,
                fontWeight: "bold"
              }}>
              {strings.DELIVERY_DATE} : {this.props.route.params.date}
            </Text>
            <Text
              style={{
                color: '#000',
                fontSize: 12,
                fontFamily: 'Roboto-Regular',
                marginTop: 5,
                fontWeight: "bold"
              }}>
              {strings.AED} {this.props.route.params.item.price}
            </Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 13,
                fontFamily: 'Roboto-Regular',
                marginTop: 5,
              }}>
              {
                this.state.street +
                ' , ' +
                this.state.city +
                ' , ' +
                this.state.rcode +
                ' , ' +
                this.state.country}
            </Text>
            <Text
              style={{
                color: '#000000',
                fontSize: 13,
                fontFamily: 'Roboto-Regular',
                marginTop: 10,
                fontWeight: 'bold'
              }}>
              {this.props.route.params.itemm.billing_address.telephone
                ? this.props.route.params.itemm.billing_address.telephone
                : ''}
            </Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 18,
            color: '#000',
            fontWeight: 'bold',
            alignSelf: 'center',
            fontFamily: 'Roboto-Regular',
            marginTop: 20,
          }}>
          {strings.ORDER_STATUS.toUpperCase()} : {this.props.route.params.status.toUpperCase()}
        </Text>
        <ScrollView>
          <View style={styles.indicatorContainer}>
            <StepIndicator
              customStyles={customStyles}
              currentPosition={this.state.currentPosition}
              labels={labels}
              direction={'vertical'}
              renderLabel={({ position, stepStatus, label, crntPosition }) => {
                return (
                  <View style={styles.lblContainer}>
                    <Text style={styles.lblText}>
                      {this.state.labelsData[position].label}
                    </Text>
                  </View>
                );
              }}
            />
          </View>

        </ScrollView>

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
    width: 140,
    // alignSelf: 'center'
  },
  lblText: {
    fontSize: 13,
    color: '#616060',
    fontWeight: 'bold',
    fontFamily: 'Roboto-bold',
  },
  status: {
    fontSize: 15,
    color: 'gray',
  },
  nextBtn: {
    marginTop: 0,
    alignSelf: 'center',
  },
  text: {
    color: '#ff3232',
    fontSize: 18,
  },
  indicatorContainer: {
    height: height * 0.65,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  indicatorContainer1: {
    height: 100,
    // width: 300,
    padding: 20,
    paddingTop: 0,
    margin: 15,
    // elevation: 10,
    // borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
});
