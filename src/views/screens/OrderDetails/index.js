import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';

import ProductDetailsCard from '../../components/ProductDetailsCard.js';
import Loader from '../../components/Loader.js';
import {calcH, calcW, fSize} from '../../../utils/constants/common.js';
import {capitalizeFirstLetter} from '../../navigator/DrawerContent.js';
import images from '../../../conts/icons.js';
import * as commonUrl from '../../../utils/constants/API/commonUrl.js';

import StepIndicator from 'react-native-step-indicator';
import Toast from 'react-native-toast-message';
import {createGet} from '../../../utils/constants/API/ServerRequest.js';
import Separator from '../../components/Separator.js';
import COLORS from '../../../conts/colors.js';
import {FONTS} from '../../../conts/theme.js';

const labelsData = [
  {label: 'Pending'},
  {label: 'Processing'},
  {label: 'Out for delivery'},
  {label: 'Arriving'},
  {label: 'Dilevered'},
];
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

const OrderDetails = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [currentPosition, setCurrentPosition] = useState(1);
  const [orderDetails, setOrderDetails] = useState();
  const [review, setReview] = useState([]);
  const [reviewData, setReviewData] = useState({});

  const {item} = route.params;
  const {billing_address} = item;
  //console.log('item', item);
  console.log('item', item);
  React.useEffect(() => {
    if (item.status == 'pending') {
      setCurrentPosition(1);
    } else if (item.status == 'processing') {
      setCurrentPosition(2);
    } else if (item.status == 'out_for_delivery') {
      setCurrentPosition(3);
    } else if (item.status == 'arriving') {
      setCurrentPosition(4);
    } else if (item.status == 'delivered') {
      setCurrentPosition(5);
    } else if (item.status == 'complete') {
      setCurrentPosition(5);
    }
  }, []);

  React.useEffect(() => {
    getOrderDetails();
  }, []);

  const url = `${commonUrl.getSellerOrderDetails}${item?.order_id}`;

  const getOrderDetails = async () => {
    setLoading(true);
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        setOrderDetails(result.data);
        const reviewUrl = `${commonUrl.getProductReview}${result?.data?.items[0]?.sku}/reviews`;
        let result1 = await createGet({
          tokenType: 'admin',
          url: reviewUrl,
        });
        if (result1.status === 200) {
          setReview(result1.data);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log('error', error);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const orderDate = item?.created_at.split(' ')[0];
  const d = new Date(orderDate);
  const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
  const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
  const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);

  console.log('ye', ye);
  if (review.length > 0) {
    const reviewDate = review[0]?.created_at.split(' ')[0];
    const a = new Date(reviewDate);

    var yeRewview = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(a);
    var moRewview = new Intl.DateTimeFormat('en', {month: 'short'}).format(a);
    var daRewview = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(a);
  }

  return (
    <ScrollView>
      <SafeAreaView>
        {loading ? (
          <Loader visible={loading} />
        ) : (
          <View style={styles.subContainer}>
            <View style={{borderBottomWidth: 0.8, paddingBottom: 10}}>
              <ProductDetailsCard
                key={item?.magepro_name?.name}
                image={{uri: item.magepro_name.product_image}}
                date={`${da} ${mo} ${ye}`}
                name={capitalizeFirstLetter(item?.magepro_name?.name)}
                stat={capitalizeFirstLetter(item?.status)}
                statStyle={{
                  color:
                    item.status == 'complete'
                      ? COLORS.order_green_color
                      : item.status == 'canceled'
                      ? COLORS.red
                      : COLORS.grey,
                }}
                order={`#OD-${item?.magerealorder_id}`}
                price={`AED${parseInt(
                  item?.purchased_actual_seller_amount,
                ).toFixed(2)}`}
              />
            </View>
            <View style={{borderWidth: 0}}>
              <ProductDetailsCard
                image={images.user}
                name={`${capitalizeFirstLetter(
                  orderDetails?.billing_address.firstname,
                )} ${orderDetails?.billing_address.lastname}`}
                order={`${orderDetails?.billing_address.street.toString()}, ${
                  orderDetails?.billing_address.city
                }, ${orderDetails?.billing_address.region} -${
                  orderDetails?.billing_address.postcode
                }`}
                date={`+${orderDetails?.billing_address.telephone}`}
              />
            </View>
            {item.status == 'complete' || item.status == 'canceled' ? (
              <View style={{marginTop: 10}}>
                {item.status == 'complete' ? (
                  <>
                    <Text style={{fontWeight: 'bold'}}>Review</Text>
                    <Separator padding={2} />
                    <View style={{marginTop: 10}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View />
                        {review.length > 0 && (
                          <Text>
                            {`${daRewview} ${moRewview} ${yeRewview}`}{' '}
                          </Text>
                        )}
                      </View>
                      {review?.length > 0 ? (
                        review?.map((review, i) => {
                          return (
                            <View>
                              <Text
                                key={`${i}-${review?.id}`}
                                style={{
                                  fontWeight: '500',
                                  color: COLORS.header_color,
                                }}>
                                {`${i + 1}. ${review.detail}...` ||
                                  'No description'}
                              </Text>
                            </View>
                          );
                        })
                      ) : (
                        <View>
                          <Text style={styles.noOrderText}>
                            No Reviews yet...
                          </Text>
                        </View>
                      )}
                    </View>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        ...FONTS.Montserrat_med,
                        color: COLORS.header_color,
                      }}>
                      Cancellation Reason
                    </Text>
                    <Separator padding={2} />
                    {orderDetails?.status_histories.length > 1 ? (
                      orderDetails?.status_histories.map((history, index) => {
                        console.log('history', history);
                        if (history.comment != null) {
                          return (
                            <Text
                              key={`${index}-${history?.created_at}`}
                              style={{
                                fontWeight: '500',
                                color: COLORS.header_color,
                              }}>
                              {`• ${history.comment}...` || 'No reason given'}
                            </Text>
                          );
                        }
                      })
                    ) : (
                      <Text
                        style={{fontWeight: '500', color: COLORS.header_color}}>
                        {'• No reason given...'}
                      </Text>
                    )}
                  </>
                )}
              </View>
            ) : (
              <View style={styles.indicatorContainer}>
                <StepIndicator
                  customStyles={customStyles}
                  currentPosition={currentPosition}
                  labels={labels}
                  direction={'vertical'}
                  renderLabel={({
                    position,
                    stepStatus,
                    label,
                    crntPosition,
                  }) => {
                    return (
                      <View style={styles.lblContainer}>
                        <Text style={styles.lblText}>
                          {labelsData[position].label}
                        </Text>
                      </View>
                    );
                  }}
                />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </ScrollView>
  );
};

export default OrderDetails;

const styles = StyleSheet.create({
  subContainer: {
    marginHorizontal: calcW(0.04),
    //marginVertical: calcH(0.02),
  },
  indicatorContainer: {
    height: calcH(0.45),
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    //borderWidth: 1,
    marginLeft: calcW(0.16),
  },
  lblContainer: {
    //borderWidth: 1,
    padding: 0,
    width: calcW(0.3),
  },
  lblText: {
    fontSize: fSize(13),
    color: '#616060',
    fontWeight: 'bold',
    fontFamily: 'Roboto-bold',
  },
  noOrderText: {
    ...FONTS.Poppins_med,
    fontSize: fSize(18),
    color: COLORS.Profile_font_color,
  },
});
