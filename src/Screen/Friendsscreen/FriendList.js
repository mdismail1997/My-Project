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
  Modal,
} from 'react-native';
import { Header } from '../../components/Header/Header';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import SearchComp from '../../components/SearchComp';
import { getAllUsers } from '../../Services/ApiService';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontIcon from 'react-native-vector-icons/dist/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { clearRejectMessageAction, friendRequestAction, getFriendListAction, rejectFriendAction } from '../../Redux/actions/ProfileAction';
import { Divider, Menu, Provider, Snackbar } from 'react-native-paper';

const FriendList = props => {
  const [data, setdata] = useState();
  const [visible, setVisible] = React.useState(false);
  const [visibleS, setVisibleS] = React.useState(false);
  const [searchText, setSearchText] = useState('')

  const openMenu = (value) => {
    console.log("value", value);
    setdata(value)
    setVisible(!visible)
  }

  const closeMenu = () => setVisible(false);


  const isLoading = useSelector(state => state.Profile.isLoading);
  const friendList = useSelector(state => state.Profile.friendList);
  const message = useSelector(state => state.Profile?.rejectMessage);
  // console.log("friendddddddd",friendList)
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('length ', message);
    if (message?.length > 0) {
      setVisibleS(true)
      dispatch(getFriendListAction())
    }
  }, [message]);

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      dispatch(getFriendListAction())
    });

    return createjobDetails;
  }, []);

  const onDismissSnackBar = () => setVisibleS(false);

  const removeFriend = (value) => {
    closeMenu()
    dispatch(rejectFriendAction(value))

    if (message?.length > 0) {
      dispatch(getFriendListAction())
    }
  }

  const renderItem = ({ item, index }) => (
    // <TouchableOpacity
    //   onPress={() =>
    //     props.navigation.navigate('ChatScreen', {details: item._id})
    //   }>

    <View style={styles.menviewcss}>
      <View style={styles.viewcss}>
        <View style={styles.imageviewcss}>
          {/* {console.log('****', item)} */}
          <Image style={styles.imagecss} source={{ uri: item.profileimage }} />
        </View>
        <View style={styles.textviewcss}>
          <Text
            style={[
              styles.textcomoncss,
            ]}>{`${item.firstname} ${item.lastname}`}</Text>
          <Text style={styles.textcomoncss2}>{item.phone_number}</Text>
        </View>

        <TouchableOpacity
          onPress={() => openMenu(index)
          }
          style={styles.backview}>
          <Image source={require('../../Assets/dotsRotate.png')} style={styles.imagecssdot} />
        </TouchableOpacity>



      </View>
    </View>

    // </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      <Header
        title="Friends"
        navProps={props.navigation}
        {...props}
        Icon={require('../../Assets/notification.png')}
      />
      {/* {isLoading && <Loader />} */}

      <ScrollView
        style={{ marginHorizontal: wp(14) }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <SearchComp icon title={'Search Friends...'} value={searchText} onChangeText={(text) => setSearchText(text)} />
        </View>
        {console.log("*********friendlist*********", friendList)}
        <View style={{ marginTop: hp(20) }}>
          <FlatList
            data={friendList?.data?.filter(i => searchText == i.firstname?.substring(0, searchText.length))}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>

      <TouchableOpacity onPress={() => props.navigation.navigate('FriendInvite')}>
        <View style={styles.backviewuser}>
          <Image
            style={styles.imageuser}
            source={require('../../Assets/usergroup.png')}
          />
        </View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
      onDismiss={closeMenu}
      >
        <View style={{width: wp(105),height: hp(105),alignSelf:"flex-end",backgroundColor:'white',elevation:10,borderRadius:20,marginTop:'58%',marginRight:hp(40)}}>
          <TouchableOpacity style={{width:'100%'}}
            onPress={() => closeMenu()}
            >
            <MIcon
              name="close-circle"
              color={COLORS.YELLOW_GREEN}
              size={wp(25)}
              style={{alignSelf:'flex-end',marginRight:3}}
            />
          </TouchableOpacity>

          {/* <View style={styles.centeredView}> */}
            <View style={styles.modalView}>
              <TouchableOpacity  onPress={() => [closeMenu(), props.navigation.navigate('ProfileView', { details: friendList?.data[data] })]}><Text style={styles.textcomoncss}>View</Text></TouchableOpacity>

              <TouchableOpacity onPress={() => removeFriend(friendList?.data[data].requestId)}><Text style={styles.textcomoncss}>Remove</Text></TouchableOpacity>
            </View>
          {/* </View> */}
        </View>
      </Modal>
      <Snackbar
        visible={visibleS}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
            dispatch(clearRejectMessageAction())
          },
        }}>
        {message}
      </Snackbar>

    </SafeAreaView>
  );
};

export default FriendList

const styles = StyleSheet.create({
  searchContainer: {
    margin: hp(14),
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
    borderColor: COLORS.NICKEL,
    borderWidth: 0,
  },
  imagecssdot: {
    width: wp(20),
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
    borderColor: COLORS.NICKEL,
    borderWidth: 0,
    borderRadius: 8
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
  centeredView: {
    // flex: 0.7,
    justifyContent: 'center',
    // alignItems: 'flex-end',
    marginTop: 18,
  },
  modalView: {
    //  marginTop: 10,
     height:'50%',
    backgroundColor: 'white',
    borderRadius: 20,
    // width: wp(105),
    // height: hp(105),
    alignItems: 'center',
    justifyContent: 'space-around',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
});
