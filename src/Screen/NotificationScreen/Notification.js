import React, {useEffect} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Header} from '../../components/Header/Header';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import { useDispatch, useSelector } from 'react-redux';
import { notificationListAction, notificationReadAction } from '../../Redux/actions/JobAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import Loader from '../../components/Loader';

export const Notification = props => {

  const isLoading = useSelector(state => state.Job.isLoading);
  const notificationList = useSelector(state => state.Job?.notificationList);
  const notificationread = useSelector(state => state.Job.notificationread);
  const dispatch =  useDispatch()

  useEffect(() => {
    
   const createjobDetails = props.navigation.addListener('focus', async () => {
    
    const user = JSON.parse(await AsyncStorage.getItem('USER'));
    dispatch(notificationListAction(user.data._id))

  });
  return createjobDetails;
  }, []);

 
  const renderItem = ({item}) => (
    <TouchableOpacity onPress={()=> dispatch(notificationReadAction(item._id))}>
    <View style={{ backgroundColor: item.is_read===true? COLORS.WHITE: COLORS.DARK,
    marginTop: hp(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    borderRadius: 8,
    margin: 12,
    padding: 2,}}>
      <View style={styles.viewcss}>
        <View style={styles.imageviewcss}>
          <Image style={styles.imagecss} source={{uri:  item.from_id.profileimage}} />
        </View>
        <View style={styles.menviewtextcss}>
          <View style={styles.textviewcss}>
            <Text style={[styles.textcomoncss]}>{`${item.from_id.firstname} ${item.from_id.lastname}`}</Text>
            <Text style={styles.textcomoncss2}>{moment(item.createdAt).format('D MMM, yyyy')}</Text>
            <Text numberOfLines={2} style={styles.textcomoncss2}>
              {item.body}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('RatingScreen')}
          style={styles.backview}>
          <Text style={styles.testdolercss}>{`$${item.job_id.salary}`}</Text>
        </TouchableOpacity>
      </View>
    </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      {isLoading && <Loader/>}
      <Header
        title="Notification"
        navProps={props.navigation}
        {...props}
        Icon={require('../../Assets/notification.png')}
      />
      <ScrollView style={{marginHorizontal: wp(12)}}>
        {/* {console.log("******", notificationList)} */}
        <View style={{marginTop: hp(20)}}>
          <FlatList data={notificationList?.data} renderItem={renderItem} nestedScrollEnabled={true}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  backview: {
    backgroundColor: COLORS.YELLOW_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(40),
    width: wp(37),
    position: 'absolute',
    right: 6,
    borderRadius: 20,
    marginTop: hp(4),
  },
  menviewcss: {
    backgroundColor: COLORS.DARK,
    marginTop: hp(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    borderRadius: 8,
    margin: 12,
    padding: 2,
  },
  viewcss: {
    flexDirection: 'row',
    paddingVertical: hp(10),
    paddingHorizontal: wp(14),
    justifyContent: 'space-between',
  },
  imagecss: {
    width: wp(68),
    height: hp(72),
    alignSelf: 'center',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  textcomoncss: {
    fontSize: wp(14),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
  },
  textcomoncss2: {
    marginTop: hp(6),
    fontSize: wp(10),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
  },
  imageviewcss: {
    width: wp(80),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menviewtextcss: {
    height: hp(72),
    alignItems: 'flex-start',
    width: '72%',
    paddingRight: 2,
  },
  textviewcss: {
    marginLeft: wp(12),
    flex: 1,
  },
  testdolercss: {
    color: COLORS.WHITE,
    fontSize: wp(12),
  },
});
