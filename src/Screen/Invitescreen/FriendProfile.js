import { StyleSheet, View, SafeAreaView, Image, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { styles } from './styles';
import { COLORS } from '../../utils/Const';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { useDispatch, useSelector } from 'react-redux';
import { Rating } from 'react-native-ratings';
import {
  List,
  Card,
  Button,
  Title,
  Text,
  Paragraph,
  Chip,
  Portal,
  Modal,
} from 'react-native-paper';
import {
  getCategoryListAction,
  getSubCategoryListAction,
} from '../../Redux/actions/HomeAction';
import Loader from '../../components/Loader';

const FriendProfile = props => {
  const detailsView = props.route.params.details;
  const userdata = useSelector(state => state.Profile.userData);

  console.log("|||||||||||||||||||||||||||||||||||", userdata?.data)

  const [category, setcategory] = useState();
  const [userData, setUserData] = useState('');
  const [avgrating, setavgRating] = useState(0);

  const categoryList = useSelector(state => state.Home.categoryList);
  const isLoading = useSelector(state => state.Home.isLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      dispatch(getCategoryListAction());

      setcategory(detailsView.employer_id?.occupation.map(e => e.category));
    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  const getRating = async () => {
    setavgRating(avgRatingCalculator(userdata?.data?.rating))

  }


  useEffect(() => {
    getRating();
  }, [userdata]);


  const avgRatingCalculator = (ratings) => {
    if (ratings.length === 0) {
      return 0
    }
    const sum = ratings.reduce((total, rating) => total + rating.rate, 0);
    const avg = sum / ratings.length;
    return avg.toFixed(1);
  }





  const renderItem = ({ item }) => (
    <Card
      style={{
        height: '65%',
        marginRight: 12,
      }}>
      <Card.Content>
        <Image
          source={{ uri: item.icon }}
          style={{ width: wp(75), height: hp(75) }}
          resizeMode={'contain'}
        />
        <Paragraph numberOfLines={2}>{`${item.name
          .charAt(0)
          .toUpperCase()}${item.name.slice(1)}`}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.WHITE, flex: 1, padding: 12 }}>
      {isLoading && <Loader />}
      <Header
        {...props}
        title={`${detailsView.employer_id.firstname} ${detailsView.employer_id.lastname}`}
      />
      <View style={{ padding: 12 }}>
        <View style={styles.profileImgContainer}>
          <Image
            source={
              detailsView?.employer_id?.profileimage !== ''
                ? { uri: detailsView?.employer_id?.profileimage }
                : require('../../Assets/userimage.png')
            }
            style={styles.profileImageStyle}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Title>{`${detailsView.employer_id.firstname} ${detailsView.employer_id.lastname}`}</Title>
          <Text variant="displaySmall" style={{ color: COLORS.NICKEL }}>
            {detailsView.employer_id.email}
          </Text>
          <Paragraph>{`+${detailsView.employer_id.phone_number}`}</Paragraph>
        </View>
        <Title style={{ fontSize: wp(18), alignSelf: 'center' }}>Service Provided</Title>
      </View>

      <View style={{ alignItems: 'center' }}>
        <Rating
          type="star"
          imageSize={22}
          ratingCount={5}
          startingValue={avgrating}
          readonly
          style={{
            alignItems: 'flex-start',
            marginTop: hp(10),
          }}
        />
        <Text style={styles.viewText}> {avgrating} - {userdata?.data?.rating ? userdata?.data?.rating?.length + ' ' + 'Review' : 0 + ' ' + 'Review'}</Text>
      </View>

      <FlatList
        style={{ flex: 1 }}
        nestedScrollEnabled={true}
        data={userdata?.data?.rating}
        renderItem={(item, index) => {
          return (
            <>
              <View>
                <Card style={styles.jobItemContainer}>
                  <Card.Content
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      // alignItems: 'center',
                    }}>
                    {/* <Image
                          source={{uri: item.item.job_id.profileImage}}
                          style={styles.jobImg}
                          resizeMode={'contain'}
                        /> */}
                    {console.log(
                      '+++++++++88888888888',
                      item.item.desc,
                    )}
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            width: '80%',
                            flexDirection: 'row',
                            borderColor: '#000',
                            borderWidth: 0,
                            alignItems: 'center',
                          }}>
                          <View style={{ width: '60%' }}>
                            <Title
                              style={{
                                fontSize: wp(18),
                                color: COLORS.BLACK,
                              }}>
                              {item.item.desc}
                            </Title>
                          </View>
                        </View>

                      </View>
                      <View
                        style={{
                          flexDirection: 'row',

                          alignItems: 'center',
                        }}>
                        <Paragraph
                          style={{
                            fontSize: wp(14),
                            color: COLORS.NICKEL,
                          }}>
                          {item.item.rate}
                        </Paragraph>
                        <Paragraph>
                          <Rating
                            type="star"
                            imageSize={14}
                            ratingCount={5}
                            startingValue={item?.item?.rate}
                            readonly
                            style={{
                              alignItems: 'flex-start',
                              marginTop: hp(10),
                            }}
                          />
                        </Paragraph>
                      </View>
                      {/* <View
                              style={{
                                flexDirection: 'row',

                                alignItems: 'center',
                              }}>
                              <Image
                                source={require('../../Assets/call.png')}
                              />
                              <Paragraph
                                style={{
                                  marginLeft: 8,
                                  color: COLORS.NICKEL,
                                  fontSize: wp(14),
                                }}>{`${item.item.employer_id.phone_number}`}</Paragraph>
                            </View> */}
                      {/* <View
                              style={{
                                flexDirection: 'row',

                                alignItems: 'center',
                              }}>
                              <Image
                                source={require('../../Assets/mail.png')}
                              />
                              <Paragraph
                                style={{
                                  marginLeft: 12,
                                  color: COLORS.NICKEL,

                                }}>{`${item.item.employee_id.email}`}</Paragraph>
                            </View> */}

                      {/* <View>
                              <Title
                                style={{
                                  fontSize: wp(16),
                                  color: COLORS.NICKEL,
                                  marginLeft: 2,
                                }}>
                                {`${item.item.employer_id.firstname} ${item.item.employer_id.lastname}`}
                              </Title>
                              <Paragraph
                                style={{
                                  // marginLeft: 10,
                                  fontSize: wp(18),
                                  color: COLORS.LAPSI_LAZULI,
                                }}>
                                ${`${item.item.job_id.salary}`}
                              </Paragraph>
                            </View> */}
                    </View>
                  </Card.Content>
                </Card>
              </View>
              {/* {console.log("item,", )} */}
            </>
          );
        }}
      />

    </SafeAreaView>
  );
};

export default FriendProfile;
