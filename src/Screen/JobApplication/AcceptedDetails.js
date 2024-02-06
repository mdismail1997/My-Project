import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Provider,
  Portal,
  Modal,
  Chip,
  Snackbar,
} from 'react-native-paper';
import { hp, wp } from '../../utils/ResponsiveLayout';
import moment from 'moment';
import CustomButton from '../../components/CustomButton';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
  approveJobAction,
  acceptapproveJobAction,
  clearApproveJobMessageAction,
} from '../../Redux/actions/JobAction';
import DialogAlert from '../../components/DialogAlert/DialogAlert';
import Loader from '../../components/Loader';
import { approveJob } from '../../Services/ApiService';
import { useState } from 'react';

const AcceptedDetails = props => {
  const detailsView = props.route.params.details;
  const approveData = useSelector(state => state.Job.approveData);
  const isLoading = useSelector(state => state.Job.isLoading);
  const approveMessage = useSelector(state => state.Job.approveMessage);
  const acceptapproveMessage = useSelector(state=>state.Job.acceptapproveMessage);

  
  const dispatch = useDispatch();
  const onDismissSnackBar = () => setShowmodal(false);
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = useState('');
  const [showmodal, setShowmodal] = useState(false);


//console.log("/////////////////////////", detailsView.item.employee_id.profileimage)
  useEffect(() => {
    console.log('length ', acceptapproveMessage);
    if (acceptapproveMessage) {
      console.log('!!!!!!!!!!!!', acceptapproveMessage);
    }
  }, [acceptapproveMessage]);


  const acceptapprovedjob = async approved => {

    // console.log('############', approved);
    dispatch(acceptapproveJobAction(detailsView.item._id, approved));
    setShowmodal(!showmodal);
    // const res = await approveJob(detailsView.item._id, accepted);
    // console.log('^^^^^^^^^', res);
    // if (approveMessage) {
    //   setMessage(res.message);
    //   setShowmodal(!showmodal);
    // }
  };
  return (
    <Provider>
      <SafeAreaView style={{ backgroundColor: COLORS.WHITE }}>
        {isLoading && <Loader />}
        <Header {...props} title={'Job Accepted Details'} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 12 }}>
            <Card style={{ padding: 12 }}>
              {/* <View style={styles.container}> */}
              {/* {console.log('details', detailsView)} */}
              <Image
                source={{ uri: detailsView.item.employee_id.profileimage }}
                style={styles.jobImage}
                resizeMode={'stretch'}
              />
              <Chip
                style={{
                  height: hp(40),
                  backgroundColor: COLORS.YELLOW_GREEN,
                  width: wp(92),
                  borderRadius: 8,
                  position: 'absolute',
                  margin: hp(170),
                  marginLeft: wp(220),
                  // justifyContent: 'center',
                  alignItems: 'center',
                }}
                textStyle={{ color: COLORS.WHITE }}
                onPress={() => console.log('Pressed')}>
                {`${detailsView.item.status
                  .charAt(0)
                  .toUpperCase()}${detailsView.item.status.slice(1)}`}
              </Chip>
              <View style={[styles.details, { marginTop: 18 }]}>
                <Title
                  style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                  Job Title
                </Title>
                <Paragraph style={{ color: COLORS.NICKEL }}>
                  {detailsView.item.job_id.title}
                </Paragraph>
              </View>
              <View style={styles.details}>
                <Title
                  style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                  Category
                </Title>
                <Paragraph style={{ color: COLORS.NICKEL }}>
                  {detailsView.item.job_id?.category.name}
                </Paragraph>
              </View>
              {detailsView.item.job_id?.subcategory ? (
                <View style={styles.details}>
                  <Title
                    style={{
                      fontFamily: FONT_FAMILY.LATO_BOLD,
                      fontSize: wp(18),
                    }}>
                    Subcategory
                  </Title>
                  <Paragraph style={{ color: COLORS.NICKEL }}>
                    {detailsView.item.job_id?.subcategory.name}
                  </Paragraph>
                </View>
              ) : null
              }

              <View style={styles.details}>
                <Title
                  style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                  Applicant Name
                </Title>
                <Paragraph style={{ color: COLORS.NICKEL }}>
                  {`${detailsView.item.employee_id.firstname} ${detailsView.item.employee_id.lastname}`}
                </Paragraph>
              </View>
              <View style={styles.details}>
                <Title
                  style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                  Applicant Contact
                </Title>
                <Paragraph style={{ color: COLORS.NICKEL }}>
                  {detailsView.item.employee_id.phone_number}
                </Paragraph>
              </View>
              <View style={styles.details}>
                <Title
                  style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                  Applicant Email
                </Title>
                <Paragraph numberOfLines={1} style={{ color: COLORS.NICKEL }}>
                  {detailsView.item.employee_id.email}
                </Paragraph>
              </View>
              <View style={styles.details}>
                <Title
                  style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                  Date Applied
                </Title>
                <Paragraph style={{ color: COLORS.NICKEL }}>
                  {moment(detailsView.item.createdAt).format(
                    'ddd, MMM D YYYY ',
                  )}
                </Paragraph>
              </View>




              {detailsView.item.status === 'approved' ?
                (<View style={styles.buttonContainer}>
                  <CustomButton
                    title={'Already Approved'}
                    buttonStyle={{
                      width: '45%',
                         backgroundColor: COLORS.NICKEL,
                      //   left: wp(85),
                      marginBottom: 32,
                    }}
                   
                  />
                  <CustomButton
                    title={'Disapprove'}
                    buttonStyle={{
                      width: '45%',
                      backgroundColor: COLORS.COQUELICOT,
                      right: wp(28),
                      marginBottom: 32,
                    }}
                    onPress={() => acceptapprovedjob('disapproved')}
                  />
                </View>) :
                (
                  <View style={styles.buttonContainer}>
                    <CustomButton
                      title={'Approve'}
                      buttonStyle={{
                        width: '45%',
                        //   backgroundColor: COLORS.NICKEL,
                        //   left: wp(85),
                        marginBottom: 32,
                      }}
                      onPress={() => acceptapprovedjob('approved')}
                    />
                    <CustomButton
                      title={'Disapprove'}
                      buttonStyle={{
                        width: '45%',
                        backgroundColor: COLORS.COQUELICOT,
                        right: wp(28),
                        marginBottom: 32,
                      }}
                      onPress={() => acceptapprovedjob('disapproved')}
                    />
                  </View>
                )
              }

            </Card>
            {showmodal ? (
              <>
                <Snackbar
                  visible={showmodal}
                  onDismiss={onDismissSnackBar}
                  style={{ marginBottom: 62 }}
                  action={{
                    label: 'Ok',
                    onPress: () => {
                      props.navigation.navigate('JobApplication')
                    },
                  }}>
                  {/* {acceptapproveMessage.msg} */}
                  Appication disapproved successfully!
                </Snackbar>
              </>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
};

export default AcceptedDetails;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    marginBottom: 25,
    padding: 15,
  },
  jobImage: {
    width: '95%',
    height: hp(195),
    borderRadius: 10,
    marginLeft: 12,
  },
  details: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 2,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginTop: hp(22),
    marginBottom: 12,
    flex: 1,
    // padding: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
