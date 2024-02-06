import React, {useState, useEffect} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import CardComponent from '../../components/CardComponent/CardComponent';
import {Header} from '../../components/Header/Header';
import SearchComp from '../../components/SearchComp';

import {hp, wp} from '../../utils/ResponsiveLayout';
import {styles} from './styles';
import CustomButton from '../../components/CustomButton';
import moment from 'moment/moment';
import Loader from '../../components/Loader';
import {
  appliedJobAction,
  offeredJobAction,
  getAlljobAction,
  getJobDetailsAction,
  receivedJobAction,
  approvedJobAction,
  deniedJobAction,
} from '../../Redux/actions/JobAction';
import {appliedJob, getJobDetails} from '../../Services/ApiService';
import {COLORS} from '../../utils/Const';

const JobApplied = props => {
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [apply, setApply] = useState(false);
  const [approve, setApprove] = useState(false);
  const [denied, setDenied] = useState(false);

  const [modalVisible, setModalVisible] = useState(true);

  const userData = useSelector(state => state.Job.userData);
  const isLoading = useSelector(state => state.Job.isLoading);
  const appliedData = useSelector(state => state.Job.appliedData);
  const approvedData = useSelector(state => state.Job.approvedData);
  const deniedData = useSelector(state => state.Job.deniedData);
  const receivedData = useSelector(state => state.Job.receivedData);
  // const offeredData = useSelector(state => state.Job.offeredData);

  const dispatch = useDispatch();

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', () => {
      dispatch(deniedJobAction());
      dispatch(offeredJobAction());
      dispatch(appliedJobAction());
      dispatch(approvedJobAction());
      dispatch(receivedJobAction());
    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('DDDDDDDDEEEEEENNNNNIIIIEEEDDDDD', deniedData);

  const pressApprove = () => {
    setApprove(true);
    setApply(false);
    setDenied(false);
  };

  const pressApply = () => {
    setApprove(false);
    setApply(true);
    setDenied(false);
  };

  const pressDenied = () => {
    setDenied(true);
    setApply(false);
    setApprove(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Loader />}
      <Header
        title={'Job Applied'}
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
                apply && approve == false && denied == false
                  ? '#8FCD2D'
                  : COLORS.WHITE
              }
              style={{
                width: '33.33%',
                backgroundColor:
                  apply && approve == false && denied == false
                    ? '#8FCD2D'
                    : COLORS.WHITE,
              }}
              labelStyle={{
                color:
                  apply && approve == false && denied == false
                    ? COLORS.WHITE
                    : COLORS.BLACK,
              }}
              uppercase={false}
              onPress={() => pressApply()}>
              Applied
            </Button>

            <Button
              mode="contained"
              buttonColor={
                approve && apply == false && denied == false
                  ? '#8FCD2D'
                  : COLORS.WHITE
              }
              style={{
                width: '33.33%',
                backgroundColor:
                  approve && apply == false && denied == false
                    ? '#8FCD2D'
                    : COLORS.WHITE,
              }}
              labelStyle={{
                color:
                  approve && apply == false && denied == false
                    ? COLORS.WHITE
                    : COLORS.BLACK,
              }}
              uppercase={false}
              onPress={() => pressApprove()}>
              Approved
            </Button>

            <Button
              mode="contained"
              buttonColor={
                denied && apply == false && approve == false
                  ? '#8FCD2D'
                  : COLORS.WHITE
              }
              style={{
                width: '33.33%',
                backgroundColor:
                  denied && apply == false && approve == false
                    ? '#8FCD2D'
                    : COLORS.WHITE,
              }}
              labelStyle={{
                color:
                  denied && apply == false && approve == false
                    ? COLORS.WHITE
                    : COLORS.BLACK,
              }}
              uppercase={false}
              onPress={() => pressDenied()}>
              Denied
            </Button>
          </View>
          {apply ? (
            <FlatList
              style={{flex: 1}}
              nestedScrollEnabled={true}
              data={appliedData}
              renderItem={(item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('Applied', {
                          details: item,
                        })
                      }>
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
                            item.item.job_id.title,
                          )}
                          <View style={{marginLeft: 12, flex: 1}}>
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
                                <View style={{width: '60%'}}>
                                  <Title
                                    style={{
                                      fontSize: wp(18),
                                      color: COLORS.BLACK,
                                    }}>
                                    {item.item.job_id.title}
                                  </Title>
                                </View>
                                <View style={{width: '20%'}}>
                                  <Paragraph
                                    style={{
                                      color: '#737373',
                                      fontSize: wp(16),
                                    }}>
                                    {item.item.job_id.job_type
                                      .charAt(0)
                                      .toUpperCase() +
                                      item.item.job_id.job_type.slice(1)}
                                  </Paragraph>
                                </View>
                              </View>
                              <Chip
                                style={{
                                  height: hp(40),
                                  backgroundColor: COLORS.YELLOW_GREEN,
                                }}
                                textStyle={{color: COLORS.WHITE}}
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
                              }}>
                              <Paragraph
                                style={{
                                  fontSize: wp(14),
                                  color: COLORS.NICKEL,
                                }}>
                                {moment(item.item.updatedAt).format(
                                  ' MMMM D, YYYY ',
                                )}
                              </Paragraph>
                            </View>
                            <View
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
                            </View>
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

                            <View>
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
                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </TouchableOpacity>
                    {/* {console.log("item,", )} */}
                  </>
                );
              }}
            />
          ) : approve ? (
            <FlatList
              style={{flex: 1}}
              nestedScrollEnabled={true}
              data={approvedData}
              renderItem={(item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('Approved', {
                          details: item,
                        })
                      }>
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
                          {/* {console.log('+++++++++88888888888', item.item.job_id.title)} */}
                          <View style={{marginLeft: 12, flex: 1}}>
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
                                <View style={{width: '60%'}}>
                                  <Title
                                    style={{
                                      fontSize: wp(18),
                                      color: COLORS.BLACK,
                                    }}>
                                    {item.item.job_id.title}
                                  </Title>
                                </View>
                                <View style={{width: '20%'}}>
                                  <Paragraph
                                    style={{
                                      color: '#737373',
                                      fontSize: wp(16),
                                    }}>
                                    {item.item.job_id.job_type
                                      .charAt(0)
                                      .toUpperCase() +
                                      item.item.job_id.job_type.slice(1)}
                                  </Paragraph>
                                </View>
                              </View>
                              <Chip
                                style={{
                                  height: hp(40),
                                  backgroundColor: COLORS.YELLOW_GREEN,
                                }}
                                textStyle={{color: COLORS.WHITE}}
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
                              }}>
                              <Paragraph
                                style={{
                                  fontSize: wp(14),
                                  color: COLORS.NICKEL,
                                }}>
                                {moment(item.item.updatedAt).format(
                                  ' MMMM D, YYYY ',
                                )}
                              </Paragraph>
                            </View>
                            <View
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
                            </View>

                            <View>
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
                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </TouchableOpacity>
                    {/* {console.log("item,", )} */}
                  </>
                );
              }}
            />
          ) : denied ? (
            <FlatList
              style={{flex: 1}}
              nestedScrollEnabled={true}
              data={deniedData}
              renderItem={(item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('Approved', {
                          details: item,
                        })
                      }>
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
                          {/* {console.log('+++++++++88888888888', item.item.job_id.title)} */}
                          <View style={{marginLeft: 12, flex: 1}}>
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
                                <View style={{width: '60%'}}>
                                  <Title
                                    style={{
                                      fontSize: wp(18),
                                      color: COLORS.BLACK,
                                    }}>
                                    {item.item.job_id.title}
                                  </Title>
                                </View>
                                <View style={{width: '20%'}}>
                                  <Paragraph
                                    style={{
                                      color: '#737373',
                                      fontSize: wp(16),
                                    }}>
                                    {item.item.job_id.job_type
                                      .charAt(0)
                                      .toUpperCase() +
                                      item.item.job_id.job_type.slice(1)}
                                  </Paragraph>
                                </View>
                              </View>
                              <Chip
                                style={{
                                  height: hp(40),
                                  backgroundColor: COLORS.YELLOW_GREEN,
                                }}
                                textStyle={{color: COLORS.WHITE}}
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
                              }}>
                              <Paragraph
                                style={{
                                  fontSize: wp(14),
                                  color: COLORS.NICKEL,
                                }}>
                                {moment(item.item.updatedAt).format(
                                  ' MMMM D, YYYY ',
                                )}
                              </Paragraph>
                            </View>
                            <View
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
                            </View>

                            <View>
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
                            </View>
                          </View>
                        </Card.Content>
                      </Card>
                    </TouchableOpacity>
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

export default JobApplied;
