import React, { useState, useEffect } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
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
  Portal,
  Modal,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import CardComponent from '../../components/CardComponent/CardComponent';
import { Header } from '../../components/Header/Header';
import SearchComp from '../../components/SearchComp';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { hp, wp } from '../../utils/ResponsiveLayout';
import { styles } from './styles';
import CustomButton from '../../components/CustomButton';
import moment from 'moment/moment';
import Loader from '../../components/Loader';
import {
  appliedJobAction,
  offeredJobAction,
  acceptedJobAction,
  getAlljobAction,
  getJobDetailsAction,
  receivedJobAction,
  workedJobAction,
  createdJobAction
} from '../../Redux/actions/JobAction';
import { appliedJob, getJobDetails } from '../../Services/ApiService';
import { COLORS } from '../../utils/Const';

const JobCreated = props => {
  const containerStyle = { backgroundColor: 'white', padding: 20 };
  const [publicc, setPublic] = useState(false);
  const [all, setAll] = useState(false);
  const [privatee, setprivate] = useState(false);

  const [value, setValue] = useState('All');

  const [modalVisible, setModalVisible] = useState(true);

  const userData = useSelector(state => state.Job.userData);
  const isLoading = useSelector(state => state.Job.isLoading);
  const appliedData = useSelector(state => state.Job.appliedData);
  const receivedData = useSelector(state => state.Job.receivedData);
  const offeredData = useSelector(state => state.Job.offeredData);
  const acceptedData = useSelector(state => state.Job.acceptedData);

  const createdData = useSelector(state => state.Job.createdData)


  const dispatch = useDispatch();

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', () => {
      dispatch(createdJobAction());
    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdData]);


  console.log("CREATED DATA======>", createdData);

  const pressOffer = () => {
    setAll(true);
    setPublic(false);
    setprivate(false);
  };

  const pressAccept = () => {
    setAll(false);
    setPublic(true);
    setprivate(false);
  };

  const pressDisapprove = () => {
    setAll(false);
    setPublic(false);
    setprivate(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Loader />}
      <Header
        title={'Created Job Details'}
        {...props}
        Icon={require('../../Assets/notification.png')}
        icon
        IconDot={require('../../Assets/dots.png')}
      />
      <ScrollView>
        <View style={styles.mainContainer}>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              buttonColor={
                all && publicc == false && privatee == false
                  ? '#8FCD2D'
                  : COLORS.WHITE
              }
              style={{
                width: '33.33%',
                backgroundColor:
                  all && publicc == false && privatee == false
                    ? '#8FCD2D'
                    : COLORS.WHITE,
              }}
              labelStyle={{
                color:
                  all && publicc == false && privatee == false
                    ? COLORS.WHITE
                    : COLORS.BLACK,
              }}
              uppercase={false}
              onPress={() => pressOffer()}>
              All
            </Button>

            <Button
              mode="contained"
              buttonColor={
                publicc && all == false && privatee == false
                  ? '#8FCD2D'
                  : COLORS.WHITE
              }
              style={{
                width: '33.33%',
                backgroundColor:
                  publicc && all == false && privatee == false
                    ? '#8FCD2D'
                    : COLORS.WHITE,
              }}
              labelStyle={{
                color:
                  publicc && all == false && privatee == false
                    ? COLORS.WHITE
                    : COLORS.BLACK,
              }}
              uppercase={false}
              onPress={() => pressAccept()}>
              Public Job
            </Button>

            <Button
              mode="contained"
              buttonColor={
                privatee && all == false && publicc == false
                  ? '#8FCD2D'
                  : COLORS.WHITE
              }
              style={{
                width: '33.33%',
                backgroundColor:
                  privatee && all == false && publicc == false
                    ? '#8FCD2D'
                    : COLORS.WHITE,
              }}
              labelStyle={{
                color:
                  privatee && all == false && publicc == false
                    ? COLORS.WHITE
                    : COLORS.BLACK,
              }}
              uppercase={false}
              onPress={() => pressDisapprove()}>
              Private Job
            </Button>
          </View>
          {all ? (
            <FlatList
              style={{ flex: 1 }}
              nestedScrollEnabled={true}
              data={createdData}
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
                          <View style={{ marginLeft: 12, flex: 1 }}>
                            <View style={{ flexDirection: 'row', borderColor: '#000', borderWidth: 0, width: '60%' }}>
                              <Title style={{ fontSize: wp(20), flex: 1, color: COLORS.BLACK }} numberOfLines={1}>
                                {`${item.item.title} -- `}
                              </Title>
                              <Paragraph style={{ color: '#737373', fontSize: wp(16) }}>
                                {item.item.job_type
                                  .charAt(0)
                                  .toUpperCase() +
                                  item.item.job_type.slice(1)}
                              </Paragraph>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                             
                              }}>
                              <View>
                                <Paragraph style={{ fontSize: wp(14), color: COLORS.DARK_CHARCOAL }}>
                                  {`${moment(item.item.createdAt).format(
                                    ' MMM D YYYY',
                                  )} @${item.item.start_time} - ${item.item.end_time
                                    }`}
                                </Paragraph>
                              </View>
                              <Chip
                                style={{
                                  height: hp(40),
                                  backgroundColor: item.item.status=='opened'? COLORS.YELLOW_GREEN:item.item.status=='closed'?COLORS.COQUELICOT:item.item.status=='completed'?COLORS.DARKGREYY:item.item.status=='In process'?COLORS.ORANGE:null,
                                }}
                                textStyle={{ color: COLORS.WHITE }}
                                onPress={() => console.log('Pressed')}>
                                {`${item.item.status
                                  .charAt(0)
                                  .toUpperCase()}${item.item.status.slice(1)}`}
                              </Chip>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '90%',
                          
                              }}>
                              <Title style={{ fontSize: wp(16), color: COLORS.DARK_CHARCOAL }} numberOfLines={1}>
                                Total Applied :
                              </Title>
                              <Paragraph
                                style={{
                                  color: COLORS.BLACK,
                                  marginLeft: hp(8),
                                  fontSize: wp(16)
                                }}>{`${item.item.totalApply}`}</Paragraph>
                            </View>



                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '90%'
                              }}>
                              <Title style={{ fontSize: wp(16), color: COLORS.BLACK }} numberOfLines={1}>
                                Salary:
                              </Title>
                              <Paragraph
                                style={{
                                  color: COLORS.NICKEL,
                                  marginLeft: hp(12),
                                  fontSize: wp(16)
                                }}>${item?.item?.salary}</Paragraph>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                marginTop:hp(10),


                              }}>
                              <CustomButton
                                title={'View'}
                                // onPress={() => jobDetails(item.item.details._id)}
                                buttonStyle={{
                                  width: wp(85),
                                }}
                                onPress={() =>
                                  props.navigation.navigate('allCreatedJobDetails', {
                                    details: item,
                                  })
                                }
                              />
  

                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </View>
                    {/* {console.log("item,", )} */}
                  </>
                );
              }}
            />
          ) : publicc ? (
            <FlatList
              style={{ flex: 1 }}
              nestedScrollEnabled={true}
              data={
                createdData.filter(
                  item => item.job_type == 'public',
                )
              }
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
                          <View style={{ marginLeft: 12, flex: 1 }}>
                            <View style={{ flexDirection: 'row', borderColor: '#000', borderWidth: 0, width: '60%' }}>
                              <Title style={{ fontSize: wp(20), flex: 1, color: COLORS.BLACK }} numberOfLines={1}>
                                {`${item.item.title} -- `}
                              </Title>
                              <Paragraph style={{ color: '#737373', fontSize: wp(16) }}>
                                {item.item.job_type
                                  .charAt(0)
                                  .toUpperCase() +
                                  item.item.job_type.slice(1)}
                              </Paragraph>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View>
                                <Paragraph style={{ fontSize: wp(14), color: COLORS.DARK_CHARCOAL }}>
                                  {`${moment(item.item.createdAt).format(
                                    ' MMM D YYYY',
                                  )} @${item.item.start_time} - ${item.item.end_time
                                    }`}
                                </Paragraph>
                              </View>
                              <Chip
                                style={{
                                  height: hp(40),
                                  backgroundColor: COLORS.ORANGE,
                                }}
                                textStyle={{ color: COLORS.WHITE }}
                                onPress={() => console.log('Pressed')}>
                                {`${item.item.status
                                  .charAt(0)
                                  .toUpperCase()}${item.item.status.slice(1)}`}
                              </Chip>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '90%'
                              }}>
                              <Title style={{ fontSize: wp(16), color: COLORS.BLACK }} numberOfLines={1}>
                                Total Applied:
                              </Title>
                              <Paragraph
                                style={{
                                  color: COLORS.NICKEL,
                                  marginLeft: hp(12),
                                  fontSize: wp(16)
                                }}>{`${item.item.totalApply}`}</Paragraph>
                            </View>






                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '90%'
                              }}>
                              <Title style={{ fontSize: wp(16), color: COLORS.BLACK }} numberOfLines={1}>
                                Salary:
                              </Title>
                              <Paragraph
                                style={{
                                  color: COLORS.NICKEL,
                                  marginLeft: hp(12),
                                  fontSize: wp(16)
                                }}>${item?.item?.salary}</Paragraph>
                            </View>


                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                marginTop:hp(10),

                              }}>
                              <CustomButton
                                title={'View'}
                                // onPress={() => jobDetails(item.item.details._id)}
                                buttonStyle={{
                                  width: wp(85),
                                }}
                                onPress={() =>
                                  props.navigation.navigate('publicCreatedJobDetails', {
                                    details: item,
                                  })
                                }
                              />

                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </View>
                    {/* {console.log("item,", )} */}
                  </>
                );
              }}
            />
          ) : privatee ? (
            <FlatList
              style={{ flex: 1 }}
              nestedScrollEnabled={true}
              data={
                createdData.filter(
                  item => item.job_type == 'private',
                )
              }
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
                          <View style={{ marginLeft: 12, flex: 1 }}>
                            <View style={{ flexDirection: 'row', borderColor: '#000', borderWidth: 0, width: '60%' }}>
                              <Title style={{ fontSize: wp(20), flex: 1, color: COLORS.BLACK }} numberOfLines={1}>
                                {`${item.item.title} -- `}
                              </Title>
                              <Paragraph style={{ color: '#737373', fontSize: wp(16) }}>
                                {item.item.job_type
                                  .charAt(0)
                                  .toUpperCase() +
                                  item.item.job_type.slice(1)}
                              </Paragraph>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View>
                                <Paragraph style={{ fontSize: wp(14), color: COLORS.DARK_CHARCOAL }}>
                                  {`${moment(item.item.createdAt).format(
                                    ' MMM D YYYY',
                                  )} @${item.item.start_time} - ${item.item.end_time
                                    }`}
                                </Paragraph>
                              </View>
                              <Chip
                                style={{
                                  height: hp(40),
                                  backgroundColor: COLORS.ORANGE,
                                }}
                                textStyle={{ color: COLORS.WHITE }}
                                onPress={() => console.log('Pressed')}>
                                {`${item.item.status
                                  .charAt(0)
                                  .toUpperCase()}${item.item.status.slice(1)}`}
                              </Chip>
                            </View>

                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '90%'
                              }}>
                              <Title style={{ fontSize: wp(16), color: COLORS.BLACK }} numberOfLines={1}>
                                Total Applied:
                              </Title>
                              <Paragraph
                                style={{
                                  color: COLORS.NICKEL,
                                  marginLeft: hp(12),
                                  fontSize: wp(16)
                                }}>{`${item.item.totalApply}`}</Paragraph>
                            </View>


                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: '90%'
                              }}>
                              <Title style={{ fontSize: wp(16), color: COLORS.BLACK }} numberOfLines={1}>
                                Salary:
                              </Title>
                              <Paragraph
                                style={{
                                  color: COLORS.NICKEL,
                                  marginLeft: hp(12),
                                  fontSize: wp(16)
                                }}>${item?.item?.salary}</Paragraph>
                            </View>


                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                marginTop:hp(10),

                              }}>
                              <CustomButton
                                title={'View'}
                                // onPress={() => jobDetails(item.item.details._id)}
                                buttonStyle={{
                                  width: wp(85),
                                }}
                                onPress={() =>
                                  props.navigation.navigate('privateCreatedJobDetails', {
                                    details: item,
                                  })
                                }
                              />

                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </View>
                    {/* {console.log("item,", )} */}
                  </>
                );
              }}
            />
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobCreated;
