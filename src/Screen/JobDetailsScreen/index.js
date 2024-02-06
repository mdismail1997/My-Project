import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  Platform,
  Share,
} from 'react-native';
import React, { useEffect } from 'react';
import { styles } from './styles';
import { Header } from '../../components/Header/Header';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { Rating } from 'react-native-ratings';
import moment from 'moment';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { COLORS } from '../../utils/Const';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsersAction } from '../../Redux/actions/AuthAction';
import { applyJob, getAllUsers } from '../../Services/ApiService';
import { useState } from 'react';
import CardForm from '../../components/CardComponent/CardForm';
import {
  DateTimePicker,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import ImagePickerComp from '../../components/ImagePicker';
import {
  applyJobAction,
  clearApplyJobMessageAction,
} from '../../Redux/actions/JobAction';
import Loader from '../../components/Loader';
import { createChatAction } from '../../Redux/actions/ProfileAction';

const JobDetailsScreen = props => {
  const details = props.route.params.details;
  const userdata = useSelector(state => state.Profile.userData);


  //console.log("DDDDDDDDDDEEEEEEEEETTTTTTAAAAAAIIIIILLLLLLLLLSSSSS", details)
   //console.log("UUUUUUUUSSSSSSEEEEERRRRRRRRRSSSSSSS",userdata.data.rating)


  // console.log("DETAILS++++++++",  details.salary)
  // console.log(
  //   '🚀 ~ file: index.js ~ line 9 ~ JobDetailsScreen ~ details',
  //   details,
  // );
  const message = useSelector(state => state.Job.applyMessage);
  const isLoading = useSelector(state => state.Job.isLoading);
  const createChat = useSelector(state => state.Profile.createChat);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const [sal, setSal] = useState(0);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [imageName, setImageName] = useState('No Image Selected');
  const [modalVisible, setModalVisible] = useState(false);
  const [msg, setMsg] = useState('');
  const [userData, setUserData] = useState('');
  const [avgrating, setavgRating] = useState(0);
  // useEffect(() => {
  //   dispatch(getAllUsersAction);
  // }, []);
  // console.log("llllllllllllllll", props.route.params.details.location.coordinates[0])
  // console.log("=--=-=-=-=--=",details.price.fixed)
  useEffect(() => {
    console.log('length ', message);
    if (message.length > 0) {
      setModalVisible(true);
      // console.log("*******", message);
    }
  }, [message]);



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



  useEffect(() => {
    getDetails();
    const createjobDetails = props.navigation.addListener('focus', async () => {
      getLogin();
      //getCurrentLocation1()
      // getCurrentLocation();
      // dispatch(getCategoryListAction());
      // dispatch(getRecentJobListAction());
      // dispatch(getExpertiseAction());

    });

    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDetails = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('USER'));
    // console.log("UUUUUUUUSSSSSSEEEEERRRRRRRRRSSSSSSS", user)
    setUserData(user.data);
  }

  // console.log("UUUUUUUUSSSSSSEEEEERRRRRRRRRSSSSSSS",userData._id)

  const apply = async (id) => {
    const value = {
      remoteUserId: id._id
    }
    dispatch(createChatAction(value))
    console.log("chatcreate", createChat);
    if (createChat.success === true) {
      props.navigation.navigate('ChatScreen', {
        details: id,
      })

    }
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);

    setDate(currentDate);
  };
  const showMode = currentMode => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: true,
        minimumDate: date,
      });
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };
  const applyjobA = async () => {
    const User = JSON.parse(await AsyncStorage.getItem('USER'));
    console.log('***$$$', User);
    const data = {
      employee_id: User.data._id,
      expectedJoiningDate: date.toLocaleString(),
      expectedSalary: sal,
      job_id: details?._id,
      resume: profileImage,
      shortDescription: msg,
    };
    console.log(data);
    dispatch(applyJobAction(details?._id, data));
    // const res = applyJob(details?._id, data)
    // if(res){
    //   setMsg(res.message)
    //   setModalVisible(true)
    // }
  };
  const clear = () => {
    dispatch(clearApplyJobMessageAction());
    setModalVisible(!modalVisible);
    // setModal(!modal);
  };

  const onShare = async (value) => {
    console.log(value);
    // dispatch(getJobDetailsAction(value))
    try {
      const result = await Share.share({
        message: `https://nodeserver.mydevfactory.com/projects/tulika/Soumen/UverlistWebReact/#/JobDetails/${value}`

      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Header title={'Job Details'} {...props} />
      {isLoading && <Loader />}
      <View style={styles.userInfoContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: details?.employer_id?.profileimage }}
            style={styles.userProfileImage}
          />
          <View style={{ marginLeft: wp(10), width: '60%' }}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('FriendProfile', {
                  details: props.route.params.details,
                })
              }>
              <Text
                style={
                  styles.usernameText
                }>{`${details?.employer_id?.firstname} ${details?.employer_id?.lastname}`}</Text>
            </TouchableOpacity>
            <Text style={styles.addressText}>
              {details?.employer_id?.address}
            </Text>
            <Rating
              type="star"
              imageSize={14}
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
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{`$ ${details?.salary === null ? 0 : details?.salary}`}</Text>
        </View>
      </View>
      <Text style={styles.jobTitleText}>{details?.title}</Text>
      <Text style={styles.timeDateText}>
        {moment(details?.createdAt).format('ddd, Do MMM, YYYY ') +
          ' - ' +
          moment(details?.createdAt).format('hh:mm a')}
      </Text>
      <Text style={styles.descText}>{details?.description}</Text>
      <MapView
        style={{ height: hp(154), marginHorizontal: wp(20), marginTop: hp(16) }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.78825,
          longitude: -82.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}

      />

      {/* <Text style={styles.milesText}>
        You Live{' '}
        <Text style={[styles.milesText, { color: COLORS.YELLOW_GREEN }]}>
          5 Miles Away
        </Text>
      </Text> */}
      <View style={styles.buttonContainer}>
        <CustomButton title="Share" buttonStyle={styles.buttonStyle} icon onPress={() => onShare(details?._id)} />
        {details.employer_id?._id === userData._id ?
          <CustomButton
            title="Send Message"
            buttonStyle={[
              styles.buttonStyle,
              { backgroundColor: COLORS.NICKEL },
            ]}

          />

          :
          <CustomButton
            title="Send Message"
            buttonStyle={[
              styles.buttonStyle,
              { backgroundColor: COLORS.COQUELICOT },
            ]}
            onPress={() => apply(details?.employer_id)}
          />
        }

      </View>
      {details.employer_id?._id === userData._id ?
        null :
        <CustomButton
          title="Apply"
          //  disabled={details.employer_id?._id === userData._id ? true : false}
          buttonStyle={styles.applyButtonStyle}
          titleStyle={{ color: COLORS.YELLOW_GREEN }}
          onPress={() => setModal(!modal)}
        />
      }

      {modal ? (
        <>
          {details?.subcategory ? (
            <CardForm
              jobTitle={details?.title}
              category={details?.category.name}
              subcategory
              subC={details?.subcategory.name}
              salary={JSON.stringify(details?.salary)}
              // onChangeTextSal={text => setSal(text)}
              // onBlurSal={text => setSal(parseFloat(sal).toFixed(2))}
              description={details?.description}
              //onChangeTextDes={text => setMsg(text)}
              joinDate={date.toDateString()}
              OnPressDate={() => showMode('date')}
              // onPressResume={() => setIsVisible(true)}
              // imageText={
              //   profileImage !== '' ? imageName[0].path : 'No Image Selected'
              // }
              onPressB={() => applyjobA()}
            // onpress={() => dispatch(clearUpdateMessageAction())}
            />
          ) : (
            <CardForm
              jobTitle={details?.title}
              category={details?.category.name}
              salary={JSON.stringify(details?.salary)}
              // onChangeTextSal={text => setSal(text)}
              // onBlurSal={text => setSal(parseFloat(sal).toFixed(2))}
              description={details?.description}
              // onChangeTextDes={text => setMsg(text)}
              joinDate={date.toDateString()}
              OnPressDate={() => showMode('date')}
              // onPressResume={() => setIsVisible(true)}
              // imageText={
              //   profileImage !== '' ? imageName[0].path : 'No Image Selected'
              // }
              onPressB={() => applyjobA()}
            />
          )}
        </>
      ) : null}
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          onChange={onChange}
        />
      )}
      {/* {console.log(
        '****',
        imageName[0].path.split('/')[imageName[0].path.split('/').length - 1],
      )} */}
      <ImagePickerComp
        isVisible={isVisible}
        onPressCancel={() => setIsVisible(false)}
        onPressPicker={image => {
          [setProfileImage(image), setIsVisible(false)];
        }}
        onPressCamera={image => {
          [setProfileImage(image), setIsVisible(false)];
        }}
        data={text => setImageName(text)}
      />
      {modalVisible ? (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modal}
          // onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          //   setModalVisible(!modalVisible);
          // }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Image
                  source={require('../../Assets/logo1.png')}
                  resizeMode={'contain'}
                />
                <Text style={styles.modalText}>{message}</Text>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <CustomButton
                    title="Ok"
                    onPress={() => clear()}
                    buttonStyle={styles.button}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : null}
    </View>
  );
};

export default JobDetailsScreen;
