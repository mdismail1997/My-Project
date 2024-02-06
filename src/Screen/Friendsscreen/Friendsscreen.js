import React, { useState, useEffect } from 'react';
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
import { Header } from '../../components/Header/Header';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import SearchComp from '../../components/SearchComp';
import { chatHistory, getAllUsers } from '../../Services/ApiService';
import FontIcon from 'react-native-vector-icons/dist/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { getAllUsersAction } from '../../Redux/actions/HomeAction';
import { getChatHistoryAction } from '../../Redux/actions/ProfileAction';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export const Friendsscreen = props => {
  const [data, setdata] = useState([]);
  const [user, setUser] = useState()
  // const detailsview = props.route.params.details

  const isLoading = useSelector(state => state.Auth.isLoading);
  const chatHistory = useSelector(state => state.Profile.chatHistory);
  const dispatch = useDispatch()

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      // const response = await chatHistory();
      // console.log("history", response);
      // if(data)
      // setdata(pre=>[...pre, detailsview]);
      const user = JSON.parse(await AsyncStorage.getItem('USER'));

      setUser(user.data)
      dispatch(getChatHistoryAction())

    });

    return createjobDetails;
  }, []);


   //console.log("---------chathistory-----------",chatHistory)



  const renderItem = ({item}) => (
    <TouchableOpacity

      onPress={() =>
        props.navigation.navigate('ChatScreen', {details: item.user?._id!== user._id? item.user: item.remoteUser, chat_id:item._id} )
      }>
      <View style={styles.menviewcss}>
        <View style={styles.viewcss}>
          <View style={styles.imageviewcss}>
            {/* {console.log('item.-----------------------', item._id)} */}
            {item.user?._id!== user._id ?(
              <Image style={styles.imagecss} source={{uri: item.user?.profileimage}} />
            ): (
              <Image style={styles.imagecss} source={{uri: item.remoteUser.profileimage}} />
            )}

          </View>
          <View style={styles.textviewcss}>
          {item.user?._id!== user._id ?(
            <Text
            style={[
              styles.textcomoncss,
            ]}>{`${item.user?.firstname} ${item.user?.lastname}`}</Text>
          ):(
            <Text
              style={[
                styles.textcomoncss,
              ]}>{`${item.remoteUser?.firstname} ${item.remoteUser?.lastname}`}</Text>
          )}

            {/* <Text style={styles.textcomoncss2}>{item.employer_id.date}</Text> */}
          </View>
          <TouchableOpacity
            // onPress={() => props.navigation.navigate('Notification')}
            style={styles.backview}>
            <FontIcon
              name="comment-dots"
              size={20}
              color={COLORS.YELLOW_GREEN}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );










  // const renderItem = ({ item }) => (

  //   <TouchableOpacity style={{ width: '100%' }} 
  //   onPress={() =>
  //            props.navigation.navigate('ChatScreen', {details: item.user?._id!== user._id? item.user: item.remoteUser})
  //         }>
    
  //     <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  //       <View style={{ paddingTop: wp(15), paddingBottom: wp(15) }}>
  //         {item.user?._id !== user._id ? (
  //           <Image style={{ width: hp(50), height: wp(50), borderRadius: 25 }} source={{ uri: item.user?.profileimage }} />) :
  //           (
  //             <Image style={{ width: hp(50), height: wp(50), borderRadius: 25 }} source={{ uri: item.remoteUser.profileimage }} />
  //           )}
  //       </View>
  //       <View style={{ flexDirection: 'column', justifyContent: 'center', padding: hp(15), paddingLeft: 0, marginLeft: hp(15), width: wp(300), borderBottomWidth: 1, borderBottomColor: '#cccccc' }}>
  //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: wp(5), width: '95%' }}>
  //           {item.user?._id !== user._id ? (
  //             <Text style={styles.textcomoncss}>
  //               {`${item.user?.firstname} ${item.user?.lastname}`}
  //             </Text>) :
  //             (<Text style={styles.textcomoncss}>
  //               {`${item.remoteUser?.firstname} ${item.remoteUser?.lastname}`}
  //             </Text>)}
  //           {item?.user?.isOnline===false ?
  //             <Icon
  //               name="circle"
  //               color={COLORS.YELLOW_GREEN}
  //               size={wp(15)}
  //               style={styles.iconStyle}
  //             /> : null}
  //         </View>
  //         <Text style={{ fontSize: wp(12), color: '#333333' }}>
  //           {console.log('item-----------***------------', item?.user?.isOnline)}
  //           {item.messages.pop()?.text}
  //         </Text>
  //       </View>
  //     </View>
  //   </TouchableOpacity>



  // );














  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <Header
        title="Chats"
        navProps={props.navigation}
        {...props}

      />
      {isLoading && <Loader />}
      <ScrollView
        style={{ marginHorizontal: wp(14), }}
        showsVerticalScrollIndicator={false}>
        {/* <View style={styles.searchContainer}>
          <SearchComp />
        </View> */}
        {console.log("data chat", user?._id)}
        <View style={{ marginTop: hp(20), }}>
          <FlatList

            data={chatHistory?.data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>
      {/* <View style={styles.backviewuser}>
        <Image
          style={styles.imageuser}
          source={require('../../Assets/usergroup.png')}
        />
      </View> */}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    marginTop: hp(34),
  },
  backview: {
    // position: 'absolute',
    right: 6,
    alignSelf: 'center',
    // marginTop: hp(4),
  },
  menviewcss: {
    marginTop: hp(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 2,
    flex: 1,
  },
  viewcss: {
    flexDirection: 'row',
    paddingVertical: hp(10),
    justifyContent: 'space-between',
  },
  imagecss: {
    width: wp(68),
    height: hp(72),
    alignSelf: 'center',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  imagecssdot: {
    width: wp(30),
    height: hp(10),
    resizeMode: 'contain',
  },
  textcomoncss: {
    fontSize: wp(14),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_BOLD,
  },
  textcomoncss2: {
    fontSize: wp(14),
    color: COLORS.NICKEL,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
  },
  imageviewcss: {
    width: wp(80),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textviewcss: {
    marginLeft: wp(12),
    flex: 1,
    justifyContent: 'center',
  },

  imageuser: {
    width: wp(25),
    height: hp(25),
    resizeMode: 'contain',
  },
  backviewuser: {
    backgroundColor: COLORS.YELLOW_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(60),
    width: wp(54),
    alignSelf: 'flex-end',
    right: 10,
    borderRadius: 30,
    bottom: 17,
  },
});
