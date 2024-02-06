import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/Header/Header';
import { getRecentJobListAction } from '../../Redux/actions/HomeAction';
import { Avatar, Card, IconButton, Paragraph, Title } from 'react-native-paper';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Rating } from 'react-native-ratings';
import moment from 'moment';
import Octicons from 'react-native-vector-icons/Octicons';

const RecentJobListing = props => {
  const [categoryData, setCategoryData] = useState([]);
  const recentJobs = useSelector(state => state.Home.recentJobs);
  const dispatch = useDispatch();
  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      dispatch(getRecentJobListAction());
      // console.log('========', recentJobs);
    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header {...props} title="All Recent jobs" />
      <View
        style={{
          flex: 1,
          marginTop: hp(4),
          marginHorizontal: wp(18),
        }}>
        <FlatList
          // style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          data={recentJobs}
          // keyExtractor={(item, index) => `${item.id}#${index}`}
          renderItem={(item, index) => {
            return (
              <View style={styles.jobItemContainer}>
                {/* {console.log(
                  '+++++++++++',
                  item.item.employer_id ? item.item.employer_id._id : 0,
                )} */}
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('JobDetailsScreen', {
                      details: item.item,
                    })
                  }>
                  <Image
                    source={{ uri: item.item.profileImage }}
                    style={styles.jobImg}
                    resizeMode={'contain'}
                  />
                  <View>
                    <View style={styles.priceContainer}>
                      <Text style={styles.priceText}>
                        {'$ ' + item.item.salary}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.dateText}>
                    {moment(item.item.date).format('ddd, Do MMM, YYYY ') +
                      ' - ' +
                      moment(item.item.createdAt).format('hh:mm a')}
                  </Text>
                  <Text style={styles.titleText}>{item.item.title}</Text>
                  <View style={styles.middleContainer}>
                    <TouchableOpacity
                      style={{ flexDirection: 'row' }}
                      onPress={() =>
                        props.navigation.navigate('FriendProfile', {
                          details: item.item,
                        })
                      }>
                      <Octicons
                        color={COLORS.YELLOW_GREEN}
                        size={wp(14)}
                        name="person"
                      />
                      {item.item.employer_id ? (
                        <Text
                          style={[
                            styles.userText,
                            { color: COLORS.LAPSI_LAZULI },
                          ]}>
                          {`${item.item.employer_id.firstname} ${item.item.employer_id.lastname}`}
                        </Text>
                      ) : null}
                    </TouchableOpacity>

                    <MIcon
                      color={COLORS.YELLOW_GREEN}
                      size={wp(14)}
                      name="clipboard-check-outline"
                      style={{ marginLeft: wp(12) }}
                    />
                    <Text style={styles.userText}>{item.item.job_type}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      // position: 'absolute',
                      left: 10,
                    }}>
                    <Rating
                      type="star"
                      imageSize={10}
                      ratingCount={5}
                      startingValue={item.item.jobrating}
                    />
                    <Text style={styles.viewText}>
                      {' - ' + '10' + ' View'}
                    </Text>
                  </View>

                  <Text style={styles.descText} numberOfLines={1}>
                    {item.item.description}
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.buttonStyle}
                      onPress={() =>
                        props.navigation.navigate('ChatScreen', {
                          details: item.item.employer_id._id,
                        })
                      }>
                      <MIcon
                        color={COLORS.YELLOW_GREEN}
                        size={wp(14)}
                        name="clipboard-check-outline"
                        style={{ marginLeft: wp(12) }}
                      />
                      <Text style={styles.buttonText}>{'Chat'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('JobDetailsScreen', {
                          details: item.item,
                        })
                      }
                      style={[
                        styles.buttonStyle,
                        {
                          backgroundColor: COLORS.YELLOW_GREEN,
                          marginLeft: wp(14),
                        },
                      ]}>
                      <Text style={[styles.buttonText, { color: COLORS.WHITE }]}>
                        {'Apply Now'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default RecentJobListing;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.WHITE,
  },
  jobItemContainer: {
    marginBottom: hp(24),
    paddingBottom: hp(14),
    width: '98%',
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    margin: 1,
  },
  jobImg: {
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: hp(180),
  },
  priceContainer: {
    height: wp(78),
    width: wp(78),
    backgroundColor: COLORS.YELLOW_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    position: 'absolute',
    top: hp(-60),
    right: wp(11),
  },
  priceText: {
    fontSize: wp(22),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.WHITE,
  },
  dateText: {
    fontSize: wp(10),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.BLACK,
    marginTop: hp(10),
    marginLeft: wp(10),
  },
  titleText: {
    fontSize: wp(16),
    marginHorizontal: wp(10),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.DARK_CHARCOAL,
    marginTop: hp(2),
  },
  descText: {
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.NICKEL,
    marginHorizontal: wp(10),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: wp(11),
    marginTop: hp(22),
  },
  buttonStyle: {
    paddingVertical: hp(8),
    paddingHorizontal: wp(16),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.YELLOW_GREEN,
  },
  buttonText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.YELLOW_GREEN,
  },
  middleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: wp(10),
    width: '100%',
  },
  userText: {
    fontSize: wp(12),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.DARK_CHARCOAL,
    marginLeft: wp(8),
  },
});
