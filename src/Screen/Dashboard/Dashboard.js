import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,

  FlatList,
} from 'react-native';
import {
  List,
  Card,
  Button,
  Title,
  Paragraph,
  Chip,
  Text,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Header } from '../../components/Header/Header';
import SearchComp from '../../components/SearchComp';
import { Swipeable } from 'react-native-gesture-handler';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { styles } from './styles';
import CustomButton from '../../components/CustomButton';
import moment from 'moment/moment';
import Loader from '../../components/Loader';
import Share from 'react-native-share';



import {
  getAlljobAction,
  getJobDetailsAction,
} from '../../Redux/actions/JobAction';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../utils/Const';
import { retrieveData } from '../../utils/AsyncStore';
import axios from 'axios';
import { Alert } from 'react-native';
import { GET_ALL_JOB_SUCCESS } from '../../Redux/actions/types';
import { useRef } from 'react';

const Dashboard = props => {
  const [choose, setChoose] = useState(true);
  const [value, setValue] = useState('All');
  const [select, setSelect] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [userDetails, setuserDetails] = useState('');
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);


  const userData = useSelector(state => state.Job.userData);

  const isLoading = useSelector(state => state.Job.isLoading);
  const jobdetails = useSelector(state => state.Job.jobDetails);
  const dispatch = useDispatch();


  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      dispatch(getAlljobAction());
      jobDetails();
      // setDataList(userData.jobs);
    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);







  const jobDetails = async () => {
    const User = JSON.parse(await AsyncStorage.getItem('USER'));
    // console.log('***$$$', User.data);
    setuserDetails(User.data);
    setProfileImage(User.data.profileimage);
  };

    const onShare = async (value,img) => {
    // console.log(img)
    //dispatch(getJobDetailsAction(value))
    const linkUrl = `https://nodeserver.mydevfactory.com/projects/tulika/Soumen/UverlistWebReact/#/JobDetails/${value}`;
   // const message = 'Check out this link and image!';
    try {
      const shareOptions = {
        title: 'UverList',
       // message: `${message}\n${linkUrl}`,
        url: `${img}\n${linkUrl}`,
       // message: `https://nodeserver.mydevfactory.com/projects/tulika/Soumen/UverlistWebReact/#/JobDetails/${value}`,
        failOnCancel: false,
      };
      const sharedResponse = await Share.open(shareOptions);
      console.log('Share response:', JSON.stringify(sharedResponse));
    } catch (error) {
      console.log('Share error===>', error);
    }
  };

  // const onShare = async (value,img) => {
  //   console.log(img)
  //   //dispatch(getJobDetailsAction(value))

  //   try {
  //     const result = await Share.share({
  //       message: `https://nodeserver.mydevfactory.com/projects/tulika/Soumen/UverlistWebReact/#/JobDetails/${value}`,
  //        url:img,
  //     });

  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         // shared with activity type of result.activityType
  //       } else {
  //         // shared
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       // dismissed
  //     }
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };

  const leftSwipe = (item) => {
    //console.log('leftSwipe');
    return (
      <View style={{ backgroundColor: '#f5f5f5', marginBottom: hp(24), paddingBottom: hp(10), }}>
        <TouchableOpacity style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => onDeleteJob(id = item.item.details._id)}>
          <MIcon
            name="delete"
            color={COLORS.COQUELICOT}
            size={wp(40)}
          />
        </TouchableOpacity>
        {/* <Text>{item.item.details.status}</Text> */}
      </View>
    )
  }
  const onDeleteJob = (id) => {
    //console.log("============>",userData.jobs)
    onDeleteJob1(id)
  }

  const onDeleteJob1 = async (id) => {

    var userToken = await retrieveData('USER_TOKEN')
    setLoading(true)
    let config = {
      method: 'post',
      url: `https://nodeserver.mydevfactory.com:6098/api/jobs/job_delete`,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userToken,
      },
      data: {
        job_id: id

      }

    };

    axios(config)
      .then(async (response) => {
        console.log(".....|||||.......", response.data.data)
        if (response.status == 200) {
          setLoading(false)

          Alert.alert(response.data.message)



          dispatch(getAlljobAction());

        } else {
          setLoading(false)
          Alert.alert("Failed to delete job!")
        }
      })
      .catch((error) => {
        setLoading(false)
        console.log(error);
      });

  }




  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Loader />}
      <Header title={'Profile'} {...props} />

      <ScrollView
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}>
        <View style={styles.mainContainer}>
          <View style={styles.profileImgContainer}>
            <Image
              source={
                profileImage !== ''
                  ? { uri: profileImage }
                  : require('../../Assets/userimage.png')
              }
              style={styles.profileImageStyle}
            />
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text variant="headlineLarge">{`${userDetails.firstname} ${userDetails.lastname}`}</Text>
          </View>
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteTitle}>{'Quote'}</Text>
            <Text style={styles.quote}>
              {'Price is what you pay. value is what you get ~'}
            </Text>
            <Text style={styles.quoteAuthor}>{'Warren Buffet'}</Text>
          </View>
          <CustomButton
            title={'Job Offered'}   // 'Job Applications'
            buttonStyle={styles.buttonJob}
            titleStyle={{ color: COLORS.YELLOW_GREEN, fontWeight: 'bold' }}
            onPress={() => props.navigation.navigate('JobApplication')}
          />
          <View style={{ marginTop: wp(15) }}>
            <CustomButton
              title={'Job Applied'}
              buttonStyle={styles.buttonJob}
              titleStyle={{ color: COLORS.YELLOW_GREEN, fontWeight: 'bold' }}
              onPress={() => props.navigation.navigate('JobApplied')}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              buttonColor={choose ? COLORS.YELLOW_GREEN : COLORS.WHITE}
              style={{
                width: '50%',
                backgroundColor: choose ? COLORS.YELLOW_GREEN : COLORS.WHITE,
                // labelStyle: choose ? COLORS.WHITE : COLORS.BLACK,
              }}
              uppercase={false}
              labelStyle={{ color: choose ? COLORS.WHITE : COLORS.BLACK }}
              onPress={() => {
                [setChoose(true), setSelect(false), props.navigation.navigate('JobWorked')];
              }}>

              Job Worked
            </Button>
            <Button
              mode="contained"
              buttonColor={select ? COLORS.YELLOW_GREEN : COLORS.WHITE}
              style={{
                width: '50%',
                backgroundColor: select ? COLORS.YELLOW_GREEN : COLORS.WHITE,
              }}
              labelStyle={{ color: select ? COLORS.WHITE : COLORS.BLACK }}
              uppercase={false}
              onPress={() => {
                [setSelect(true), setChoose(false), props.navigation.navigate('JobCreated')];
              }}>
              Job Created
            </Button>
          </View>
          <View
            style={{
              padding: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '80%',
            }}>
            <Chip
              onPress={() => setValue('All')}
              style={
                value === 'All' ? styles.chip : [styles.chip, { borderWidth: 0 }]
              }>
              All
            </Chip>
            <Chip
              style={
                value === 'public'
                  ? styles.chip
                  : [styles.chip, { borderWidth: 0 }]
              }
              onPress={() => setValue('public')}>
              Public Job
            </Chip>
            <Chip
              style={
                value === 'private'
                  ? styles.chip
                  : [styles.chip, { borderWidth: 0 }]
              }
              onPress={() => setValue('private')}>
              Private Job
            </Chip>
          </View>



          <View style={{}}>
            <FlatList
              style={{ flex: 1 }}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
              data={
                value === 'All'
                  ? userData?.jobs
                  : userData?.jobs.filter(el => el.details.job_type === value)
              }
              renderItem={(item, index) => {
                return (

                  <>
                    <Swipeable renderLeftActions={() => leftSwipe(item)} enabled={item.item.details.status === 'closed' ? true : false}

                    >
                      <Card style={styles.jobItemContainer}>
                        <Card.Content
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              marginLeft: 12,
                              flex: 1,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View style={{ flex: 0.83 }}>
                              <View style={{ flexDirection: 'row', borderColor: '#000', borderWidth: 0 }}>
                                <Title style={{ fontSize: wp(18), flex: 1, color: COLORS.BLACK }} numberOfLines={1}>
                                  {`${item.item.details.title} -- `}
                                </Title>
                                <Paragraph style={{ color: '#737373' }}>
                                  {item.item.details.job_type
                                    .charAt(0)
                                    .toUpperCase() +
                                    item.item.details.job_type.slice(1)}
                                </Paragraph>
                              </View>
                              <Paragraph style={{ fontSize: wp(12), color: COLORS.DARK_CHARCOAL }}>
                                {`${moment(item.item.details.updatedAt).format(
                                  ' MMM D YYYY',
                                )}@${item.item.details.start_time} - ${item.item.details.end_time
                                  }`}
                              </Paragraph>
                            </View>
                            <Chip
                              style={{
                                height: hp(40),
                                backgroundColor:
                                  item.item.details.status === 'closed'
                                    ? COLORS.ORANGE
                                    : COLORS.YELLOW_GREEN,
                              }}
                              textStyle={{
                                color: COLORS.WHITE,
                                fontWeight: '100',
                              }}>
                              {`${item.item.details.status
                                .charAt(0)
                                .toUpperCase()}${item.item.details.status.slice(
                                  1,
                                )}`}
                            </Chip>
                          </View>
                        </Card.Content>
                        <View
                          style={[
                            styles.buttonContainer,
                            { padding: 0, marginTop: hp(10) },
                          ]}>
                          <CustomButton
                            title={'View'}
                            // onPress={() => jobDetails(item.item.details._id)}
                            buttonStyle={{
                              width: wp(100),
                            }}
                          />
                          <Button
                            icon={() => (
                              <Icon
                                name="share-square-o"
                                size={30}
                                color={COLORS.YELLOW_GREEN}
                              />
                            )}
                            color={COLORS.YELLOW_GREEN}
                            style={{
                              width: '35%',
                              borderWidth: 2,
                              borderColor: COLORS.YELLOW_GREEN,
                              borderRadius: 12,
                            }}
                            uppercase={false}
                            onPress={() => onShare(item.item.details._id,item.item.details.profileImage)}>
                            Share
                            {/* {console.log("````````````-----``````",item.item.details.profileImage)} */}
                          </Button>
                        </View>
                      </Card>

                      {/* {console.log("~~~~~~~~~~~~~",item.item.details)} */}
                    </Swipeable>
                  </>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
      {Loading && <Loader />}
    </SafeAreaView>
  );
};

export default Dashboard;
