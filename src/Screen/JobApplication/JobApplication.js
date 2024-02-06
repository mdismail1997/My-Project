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
  acceptedJobAction,
  getAlljobAction,
  getJobDetailsAction,
  receivedJobAction,
} from '../../Redux/actions/JobAction';
import {appliedJob, getJobDetails} from '../../Services/ApiService';
import {COLORS} from '../../utils/Const';

const JobApplication = props => {
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [accept, setAccept] = useState(false);
  const [offer, setOffer] = useState(false);
  const [disapprove, setDisapprove] = useState(false);

  const [modalVisible, setModalVisible] = useState(true);

  const userData = useSelector(state => state.Job.userData);
  const isLoading = useSelector(state => state.Job.isLoading);
  const appliedData = useSelector(state => state.Job.appliedData);
  const receivedData = useSelector(state => state.Job.receivedData);
  const offeredData = useSelector(state => state.Job.offeredData);
  const acceptedData = useSelector(state => state.Job.acceptedData);

  
  const dispatch = useDispatch();

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', () => {
      dispatch(offeredJobAction());
      dispatch(appliedJobAction());
      dispatch(receivedJobAction());
      dispatch(acceptedJobAction());
    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acceptedData]);

  // console.log('**************', offeredData);
  console.log('**************?????????', acceptedData);

  const pressOffer = () => {
    setOffer(true);
    setAccept(false);
    setDisapprove(false);
  };

  const pressAccept = () => {
    setOffer(false);
    setAccept(true);
    setDisapprove(false);
  };

  const pressDisapprove = () => {
    setOffer(false);
    setAccept(false);
    setDisapprove(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Loader />}
      <Header
        title={'Job Application'}
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
                offer && accept == false && disapprove == false
                  ? '#8FCD2D'
                  : COLORS.WHITE
              }
              style={{
                width: '33.33%',
                backgroundColor:
                  offer && accept == false && disapprove == false
                    ? '#8FCD2D'
                    : COLORS.WHITE,
              }}
              labelStyle={{
                color:
                  offer && accept == false && disapprove == false
                    ? COLORS.WHITE
                    : COLORS.BLACK,
              }}
              uppercase={false}
              onPress={() => pressOffer()}>
              Offered
            </Button>

            <Button
              mode="contained"
              buttonColor={
                accept && offer == false && disapprove == false
                  ? '#8FCD2D'
                  : COLORS.WHITE
              }
              style={{
                width: '33.33%',
                backgroundColor:
                  accept && offer == false && disapprove == false
                    ? '#8FCD2D'
                    : COLORS.WHITE,
              }}
              labelStyle={{
                color:
                  accept && offer == false && disapprove == false
                    ? COLORS.WHITE
                    : COLORS.BLACK,
              }}
              uppercase={false}
              onPress={() => pressAccept()}>
              Accepted
            </Button>

            <Button
              mode="contained"
              buttonColor={
                disapprove && offer == false && accept == false
                  ? '#8FCD2D'
                  : COLORS.WHITE
              }
              style={{
                width: '33.33%',
                backgroundColor:
                  disapprove && offer == false && accept == false
                    ? '#8FCD2D'
                    : COLORS.WHITE,
              }}
              labelStyle={{
                color:
                  disapprove && offer == false && accept == false
                    ? COLORS.WHITE
                    : COLORS.BLACK,
              }}
              uppercase={false}
              onPress={() => pressDisapprove()}>
              Disapproved
            </Button>
          </View>
          {offer ? (
            <FlatList
              style={{flex: 1}}
              nestedScrollEnabled={true}
              data={offeredData}
              renderItem={(item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('ReceivedDetails', {
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
                          {/* {console.log('+++++++++88888888888', item.item.job.title)} */}
                          <View style={{marginLeft: 12, flex: 1}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View>
                                <Title
                                  style={{
                                    fontSize: wp(18),
                                    color: COLORS.BLACK,
                                  }}>
                                  {item.item.job.title}
                                </Title>
                                <Paragraph
                                  style={{
                                    fontSize: wp(10),
                                    color: COLORS.NICKEL,
                                  }}>
                                  {moment(item.item.updatedAt).format(
                                    ' MMMM D, YYYY ',
                                  )}
                                </Paragraph>
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
                              <Image
                                source={require('../../Assets/name.png')}
                              />
                              <Paragraph
                                style={{
                                  marginLeft: 12,
                                  color: COLORS.NICKEL,
                                }}>
                                {`${item.item.employer.firstname} ${item.item.employer.lastname}`}
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
                                  marginLeft: 12,
                                  color: COLORS.NICKEL,
                                }}>{`${item.item.employer.phone_number}`}</Paragraph>
                            </View>
                            <View
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
                                }}>{`${item.item.employer.email}`}</Paragraph>
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
          ) : accept ? (
            <FlatList
              style={{flex: 1}}
              nestedScrollEnabled={true}
              data={acceptedData?acceptedData.filter(item => item.status != 'disapproved' ):isLoading && <Loader />}
              renderItem={(item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('AcceptedDetails', {
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
                          <View style={{marginLeft: 12, flex: 1}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View>
                                <Title
                                  style={{
                                    fontSize: wp(18),
                                    color: COLORS.BLACK,
                                  }}>
                                  {item.item.job_id?.title}
                                </Title>
                                <Paragraph
                                  style={{
                                    fontSize: wp(10),
                                    color: COLORS.NICKEL,
                                  }}>
                                  {moment(item.item.job_id?.updatedAt).format(
                                    ' MMMM D, YYYY ',
                                  )}
                                </Paragraph>
                              </View>
                              {item.item.status==='completed'?
                              <Chip
                              
                                style={{
                                  height: hp(40),
                                  backgroundColor:  COLORS.COQUELICOT,
                                }}
                                textStyle={{color: COLORS.WHITE}}
                                onPress={() => console.log('Pressed')}>
                                
                                {`${item.item.status
                                  .charAt(0)
                                  .toUpperCase()}${item.item.status.slice(1)}`}
                              </Chip>:
                              <Chip
                              
                              style={{
                                height: hp(40),
                                backgroundColor:  COLORS.YELLOW_GREEN,
                              }}
                              textStyle={{color: COLORS.WHITE}}
                              onPress={() => console.log('Pressed')}>
                              
                              {`${item.item.status
                                .charAt(0)
                                .toUpperCase()}${item.item.status.slice(1)}`}
                            </Chip>
                              }
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',

                                alignItems: 'center',
                              }}>
                              <Image
                                source={require('../../Assets/name.png')}
                              />
                              <Paragraph
                                style={{
                                  marginLeft: 12,
                                  color: COLORS.NICKEL,
                                }}>{`${item.item.employer_id?.firstname} ${item.item.employer_id?.lastname}`}</Paragraph>
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
                                  marginLeft: 12,
                                  color: COLORS.NICKEL,
                                }}>{`${item.item.employer_id?.phone_number}`}</Paragraph>
                            </View>
                            <View
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
                                }}>{`${item.item.employer_id?.email}`}</Paragraph>
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
          ) : disapprove ? (
            <FlatList
              style={{flex: 1}}
              nestedScrollEnabled={true}
              data={acceptedData.filter(
                item => item.status != 'approved' && item.status != 'applied' && item.status != 'completed'
              )}
              renderItem={(item, index) => {
                return (
                  <>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('DisapprovedDetails', {
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
                          <View style={{marginLeft: 12, flex: 1}}>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                              }}>
                              <View>
                                <Title
                                  style={{
                                    fontSize: wp(18),
                                    color: COLORS.BLACK,
                                  }}>
                                  {item.item.job_id?.title}
                                </Title>
                                <Paragraph
                                  style={{
                                    fontSize: wp(10),
                                    color: COLORS.NICKEL,
                                  }}>
                                  {moment(item.item.job_id?.updatedAt).format(
                                    ' MMMM D, YYYY ',
                                  )}
                                </Paragraph>
                              </View>
                              <Chip
                                style={{
                                  height: hp(40),
                                  backgroundColor: COLORS.COQUELICOT,
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
                              <Image
                                source={require('../../Assets/name.png')}
                              />
                              <Paragraph
                                style={{
                                  marginLeft: 12,
                                  color: COLORS.NICKEL,
                                }}>{`${item.item?.employer_id?.firstname} ${item.item?.employer_id?.lastname}`}</Paragraph>
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
                                  marginLeft: 12,
                                  color: COLORS.NICKEL,
                                }}>{`${item.item.employer_id?.phone_number}`}</Paragraph>
                            </View>
                            <View
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
                                }}>{`${item.item.employer_id?.email}`}</Paragraph>
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

export default JobApplication;
