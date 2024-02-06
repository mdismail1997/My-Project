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
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
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
    startJobAction
} from '../../Redux/actions/JobAction';
import DialogAlert from '../../components/DialogAlert/DialogAlert';
import Loader from '../../components/Loader';
import { approveJob, startJob } from '../../Services/ApiService';
import { useState } from 'react';

const allCreatedJobDetails = props => {
    const detailsView = props.route.params.details;
    const approveData = useSelector(state => state.Job.approveData);
    const isLoading = useSelector(state => state.Job.isLoading);
    const approveMessage = useSelector(state => state.Job.approveMessage);
    const acceptapproveMessage = useSelector(state => state.Job.acceptapproveMessage);
    const startjobMessage = useSelector(state => state.Job.startjobMessage)


    const dispatch = useDispatch();
    const onDismissSnackBar = () => setShowmodal(false);
    const [visible, setVisible] = React.useState(false);
    const [message, setMessage] = useState('');


    const [modal, setModal] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const [status, setStatus] = useState('');

    const statusArr = [

        {
            label: 'Completed',
            value: 'Completed',
        },
    ];


    console.log("/////////////////////////", detailsView.item.employeesId)
    useEffect(() => {
        console.log('length ', startjobMessage);
        if (startjobMessage) {
            console.log('!!!!!!!!!!!!', startjobMessage);
        }
    }, [startjobMessage]);



    return (
        <Provider>
            <SafeAreaView style={{ backgroundColor: COLORS.WHITE }}>
                {isLoading && <Loader />}
                <Header {...props} title={'All Created Job Details'} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 12 }}>
                        <Card style={{ padding: 12 }}>
                            {/* <View style={styles.container}> */}
                            {/* {console.log('details', detailsView)} */}
                            <Image
                                source={{ uri: detailsView.item.profileimage }}
                                style={styles.jobImage}
                                resizeMode={'stretch'}
                            />
                            <Chip
                                style={{
                                    height: hp(40),
                                    backgroundColor: COLORS.ORANGE,
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



                            {/* {detailsView?.item?.employeesId ?
                                <Dropdown
                                disable={detailsView.item.status=='completed' ? true:false}
                                    value={status}
                                    data={statusArr}
                                    labelField="label"
                                    valueField="value"
                                    selectedTextStyle={{ color: COLORS.BLACK }}
                                    placeholder={detailsView.item.status}
                                    placeholderStyle={{ color: COLORS.NICKEL, fontSize: 16 }}
                                    style={{
                                        height: hp(40),
                                        backgroundColor: COLORS.YELLOW_GREEN,
                                        width: wp(100),
                                        borderRadius: 8,
                                        position: 'absolute',
                                        margin: hp(170),
                                        marginLeft: wp(220),
                                        // justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10
                                    }}
                                    itemTextStyle={{ color: COLORS.BLACK, fontSize: 16 }}
                                    itemContainerStyle={{ backgroundColor: '#fff' }}
                                    containerStyle={{ backgroundColor: '#fff' }}
                                    onChange={data => data.value === 'Completed' ? setModal(true) : null}

                                /> : */}
                            {/* <Chip
                                    style={{
                                        height: hp(40),
                                        backgroundColor: COLORS.ORANGE,
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
                                </Chip> */}





                            <View style={[styles.details, { marginTop: 18 }]}>
                                <Title
                                    style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                                    Job Title
                                </Title>
                                <Paragraph style={{ color: COLORS.NICKEL }}>
                                    {detailsView.item.title}
                                </Paragraph>
                            </View>
                            <View style={styles.details}>
                                <Title
                                    style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                                    Post By
                                </Title>
                                <Paragraph style={{ color: COLORS.NICKEL }}>
                                    {`${detailsView.item.employer_id.firstname} ${detailsView.item.employer_id.lastname}`}
                                </Paragraph>
                            </View>


                            <View style={styles.details}>
                                <Title
                                    style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                                    Job Type
                                </Title>
                                <Paragraph style={{ color: COLORS.NICKEL }}>
                                    {detailsView.item.job_type}
                                </Paragraph>
                            </View>
                            <View style={styles.details}>
                                <Title
                                    style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                                    Project Amount
                                </Title>
                                <Paragraph style={{ color: COLORS.NICKEL }}>
                                    $ {detailsView.item.salary}
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
                            <View style={styles.details}>
                                <Title
                                    style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                                    Time Schedule
                                </Title>
                                <Paragraph style={{ color: COLORS.NICKEL }}>
                                    {detailsView.item.start_time} - {detailsView.item.end_time}

                                </Paragraph>
                            </View>
                            <View style={styles.details}>
                                <Title
                                    style={{ fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18) }}>
                                    Address
                                </Title>
                                <Paragraph style={{ color: COLORS.NICKEL }}>
                                    {detailsView.item.address}

                                </Paragraph>
                            </View>



                            <View style={styles.buttonContainer}>
                                <CustomButton
                                    title={'Pay & Complete'}
                                    buttonStyle={{
                                        width: '45%',
                                        backgroundColor: COLORS.LAPSI_LAZULI,
                                        //   left: wp(85),
                                        marginBottom: 32,
                                    }}
                                    // onPress={() => props.navigation.goBack()}
                                    onPress={ ()=>setModal(true) }
                                />
                            </View>


                        </Card>

                    </View>

                </ScrollView>
                {modal ? (
                    <>
                        <Modal
                            animationType="slide"
                            // transparent={true}
                            visible={modal}
                            onRequestClose={hideModal}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <TouchableOpacity
                                        onPress={() => setModal(false)}
                                        style={{ position: 'absolute', right: 15, top: 5 }}>
                                        <MIcon
                                            name="close-circle"
                                            color={COLORS.YELLOW_GREEN}
                                            size={wp(28)}
                                        />
                                    </TouchableOpacity>


                                    <Text style={styles.headerText}>Work has been done</Text>
                                    <Text style={styles.modalText}>Please complete the payment process</Text>
                                    <View style={{ width: '100%', height: wp(50), justifyContent: 'center' }}>
                                        {/* <TouchableOpacity>
                                            <Text style={{
                                                color: COLORS.YELLOW_GREEN,
                                                textAlign: 'center',
                                                fontSize: wp(18)
                                            }}>Pay with saved Card</Text></TouchableOpacity> */}
                                        <CustomButton
                                            title={'Pay with saved Card'}
                                            buttonStyle={{
                                                padding: 10,
                                                width: '85%',
                                                marginTop: hp(20),
                                            }}

                                            onPress={() =>
                                                props.navigation.navigate('saveCardPayment', {
                                                    details: detailsView,
                                                })
                                            }


                                        />
                                    </View>
                                    <View style={{ width: '100%', marginTop: hp(30), justifyContent: 'center' }}>
                                        <TouchableOpacity onPress={() =>
                                            props.navigation.navigate('cardPayment', {
                                                details: detailsView,
                                            })
                                        }>
                                            <Text style={{
                                                color: COLORS.YELLOW_GREEN,
                                                textAlign: 'center',
                                                fontSize: wp(18)
                                            }}>To Pay with other card?
                                                <Text style={{
                                                    color: COLORS.YELLOW_GREEN,
                                                    textAlign: 'center',
                                                    fontSize: wp(18),
                                                    fontWeight: 'bold',
                                                }}
                                                >
                                                    {" "} Click Here</Text>
                                            </Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </>
                ) : null}
            </SafeAreaView>
        </Provider>
    );
};

export default allCreatedJobDetails;

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
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(22),
        marginBottom: 12,
        flex: 1,
        // padding: 12,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,

    },
    modalView: {
        height: hp(260),
        width: '85%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',


    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: wp(18)

    },
    headerText: {

        marginBottom: 15,
        textAlign: 'center',
        fontSize: wp(24),
        fontWeight: '600'
    },

});
