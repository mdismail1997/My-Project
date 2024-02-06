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
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import SearchComp from '../../components/SearchComp';
import { getAllUsers } from '../../Services/ApiService';
import FontIcon from 'react-native-vector-icons/dist/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { acceptFriendAction, clearRejectMessageAction, friendRequestAction, getFriendListAction, inviteFriendAction, rejectFriendAction } from '../../Redux/actions/ProfileAction';
import { getAllUsersAction } from '../../Redux/actions/HomeAction';
import { Button, Chip, Dialog, Portal, Provider, Snackbar } from 'react-native-paper';
import CustomButton from '../../components/CustomButton';

const FriendInvite = props => {

  const [add, setAdd] = useState(false)
  const [suggest, setSuggest] = useState(false);
  const [data, setdata] = useState();

  const [visible, setVisible] = React.useState(false);
  const [visiblee, setVisiblee] = React.useState(false);
  const [searchText, setSearchText] = useState('')

  const onToggleSnackBar = (value) => {
    dispatch(rejectFriendAction(value))
    // if()
    if (message?.length > 0) {
      setVisible(!visible);
      dispatch(friendRequestAction())
    }

  }

  const openMenu = (value) => {
    console.log("value", value);
    setdata(value)
    setVisiblee(!visiblee)
  }


  const onDismissSnackBar = () => setVisible(false);

  const isLoading = useSelector(state => state.Profile.isLoading);
  const payload = useSelector(state => state.Home.payload);
  const friendRequest = useSelector(state => state.Profile?.friendRequest);
  const suggestData = useSelector(state => state.Home.suggestData)
  const message = useSelector(state => state.Profile?.rejectMessage);
  const dispatch = useDispatch()

  //console.log(".,....,.,.,.,.,><><><<>", payload)

  useEffect(() => {
    console.log('length ', message);
    if (message?.length > 0) {
      setVisible(!visible);
    }
  }, [message]);

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      dispatch(getAllUsersAction())
      dispatch(friendRequestAction())
    });

    return createjobDetails;
  }, []);


  const closeMenu = () => setVisiblee(false);



  const renderItem = ({ item }) => (

    <View style={styles.menviewcss}>
      <View style={styles.viewcss}>
        <View style={styles.imageviewcss}>
          {/* {console.log('****', item)} */}
          <Image style={styles.imagecss} source={{ uri: item.profileimage }} />
        </View>
        <View style={[styles.textviewcss, { padding: 5, borderColor: '#000', borderWidth: 0 }]}>
          <Text
            style={[
              styles.textcomoncss, { marginBottom: hp(5) }
            ]}>{`${item.firstname} ${item.lastname}`}</Text>
          <Text style={[styles.textcomoncss2, { marginBottom: hp(8) }]}>{item.phone_number}</Text>
          <View style={{ flexDirection: 'row', marginRight: wp(12), borderColor: '#000', borderWidth: 0, justifyContent: 'space-between' }}>


            <Button mode="outlined" labelStyle={{ color: COLORS.DARK_CHARCOAL }} style={{ backgroundColor: COLORS.WHITE, borderColor: COLORS.DARK_CHARCOAL, borderWidth: 2, height: hp(52), width: wp(102),justifyContent:'center' }} onPress={() => [props.navigation.navigate('ProfileView', { details: item })]}>
              View
            </Button>
            <Button mode="contained" style={{ backgroundColor: COLORS.YELLOW_GREEN, height: hp(52), width: wp(102),justifyContent:'center' }} onPress={() => [dispatch(inviteFriendAction(item._id)), dispatch(getAllUsersAction())]}>
              Add
            </Button>
          </View>
        </View>

        {/* <CustomButton title={'Invite'} buttonStyle={{width: wp(55), height: hp(25)}} onPress={()=> [dispatch(inviteFriendAction(item._id)), dispatch(getAllUsersAction())]}/> */}
      </View>
    </View>

  );

  const renderRequest = ({ item }) => (

    <View style={styles.menviewcss}>
      <View style={styles.viewcss}>
        <View style={styles.imageviewcss}>
          {/* {console.log('****request', item)} */}
          <Image style={styles.imagecss} source={{ uri: item.sender.profileimage }} />
        </View>

        <View style={[styles.textviewcss, { padding: 5, borderColor: '#000', borderWidth: 0 }]}>
          <Text
            style={[
              styles.textcomoncss, { marginBottom: hp(5) }
            ]}>{`${item.sender.firstname} ${item.sender.lastname}`}</Text>
          <Text style={[styles.textcomoncss2, { marginBottom: hp(8) }]}>{item.sender.phone_number}</Text>
          <View style={{ flexDirection: 'row', marginRight: wp(12), borderColor: '#000', borderWidth: 0, justifyContent: 'space-between' }}>

            <Button mode="contained" style={{ backgroundColor: COLORS.YELLOW_GREEN, height: hp(52), width: wp(102),justifyContent:'center' }} onPress={() => [dispatch(acceptFriendAction(item._id)), dispatch(friendRequestAction())]}>
              Accept
            </Button>
            <Button mode="outlined" labelStyle={{ color: COLORS.COQUELICOT }} style={{ backgroundColor: COLORS.WHITE, borderColor: COLORS.COQUELICOT, borderWidth: 2, height: hp(52), width: wp(102),justifyContent:'center' }} onPress={() => onToggleSnackBar(item._id)}>
              Reject
            </Button>
          </View>
        </View>


      </View>


    </View>

  );







  const suggestRequest = ({ item, index }) => (

    <View style={styles.menviewcss}>
      <View style={styles.viewcss}>
        <View style={styles.imageviewcss}>
          {/* {console.log('****request', item)} */}
          <Image style={styles.imagecss} source={{ uri: item.profileimage }} />
        </View>

        <View style={[styles.textviewcss, { padding: 5, borderColor: '#000', borderWidth: 0 }]}>
          <Text
            style={[
              styles.textcomoncss, { marginBottom: hp(8) }
            ]}>{`${item.firstname} ${item.lastname}`}</Text>
          <Text style={[styles.textcomoncss2, { marginBottom: hp(8) }]}>{item.phone_number}</Text>
          <Text style={[styles.textcomoncss2, { marginBottom: hp(8) }]}>{item.email}</Text>
          {/* <View style={{ flexDirection: 'row', marginRight: wp(12), borderColor: '#000', borderWidth: 0, justifyContent: 'space-between' }}>


          </View> */}
        </View>
        <TouchableOpacity
          onPress={() => openMenu(index)
          }
          style={styles.backview}>
          <Image source={require('../../Assets/dotsRotate.png')} style={styles.imagecssdot} />
        </TouchableOpacity>

      </View>


    </View>

  );


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.WHITE }}>
      {isLoading && <Loader />}
      <Header
        title="Invite"
        navProps={props.navigation}
        {...props}
        Icon={require('../../Assets/notification.png')}
      />


      <ScrollView
        style={{ marginHorizontal: wp(14) }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <SearchComp icon title={'Search Friends...'} value={searchText} onChangeText={(text) => setSearchText(text)} />
        </View>
        <View style={{ flexDirection: 'row', paddingLeft: 12 }}>
          <Chip onPress={() => [setSuggest(true), setAdd(false), dispatch(getAllUsersAction())]} style={{ marginEnd: 10, backgroundColor: suggest ? COLORS.YELLOW_GREEN : COLORS.DARKGREY }}>Suggested Friends</Chip>
          <Chip onPress={() => [setAdd(true), setSuggest(false), dispatch(friendRequestAction())]} style={{ backgroundColor: add ? COLORS.YELLOW_GREEN : COLORS.DARKGREY }}>Friend Requests</Chip>
        </View>
        {/* {console.log("*********users",friendRequest)} */}
        <View style={{ marginTop: hp(20) }}>
          {add ? (
            <FlatList
              data={friendRequest?.data}
              renderItem={renderRequest}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            />
          ) : suggest ?
            (
              <FlatList
                data={payload?.data?.filter(i => searchText == i.firstname?.substring(0, searchText.length))}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              />

            )
            : (null
              // <FlatList
              //   data={payload?.data?.filter(i => searchText == i.firstname.substring(0, searchText.length))}
              //   renderItem={renderItem}
              //   showsVerticalScrollIndicator={false}
              //   nestedScrollEnabled={true}
              // />
            )}

        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visiblee}
        onDismiss={closeMenu}
      >
        <View style={{ width: wp(105), height: hp(105), alignSelf: "flex-end", backgroundColor: 'white', elevation: 10, borderRadius: 20, marginTop: '58%', marginRight: hp(40) }}>
          <TouchableOpacity style={{ width: '100%' }}
            onPress={() => closeMenu()}
          >
            <MIcon
              name="close-circle"
              color={COLORS.YELLOW_GREEN}
              size={wp(25)}
              style={{ alignSelf: 'flex-end', marginRight: 3 }}
            />
          </TouchableOpacity>

          {/* <View style={styles.centeredView}> */}
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => [closeMenu(), props.navigation.navigate('ProfileView', { details: suggestData?.data[data] })]}><Text style={styles.textcomoncss}>View</Text></TouchableOpacity>

            <TouchableOpacity onPress={() => removeFriend(friendList?.data[data].requestId)}><Text style={styles.textcomoncss}>Add</Text></TouchableOpacity>
          </View>
          {/* </View> */}
        </View>
      </Modal>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Ok',
          onPress: () => {
            // Do something
            dispatch(clearRejectMessageAction())
            props.navigation.navigate('FriendList')
          },
        }}>
        {message}
      </Snackbar>

    </SafeAreaView>
  );
};

export default FriendInvite

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
    marginBottom: hp(24),
    paddingBottom: hp(10),
    width: '95%',
    flex: 1,

    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
    marginLeft: 12,
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
    borderWidth: 1,
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
    // alignItems: 'center'
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
  modalView: {

     height:'50%',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
