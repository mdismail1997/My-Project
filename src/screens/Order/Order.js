import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
  BackHandler,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Paragraph,
  Title,
  Modal,
  IconButton,
  HelperText,
} from 'react-native-paper';
import { Header4 } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUserToken } from '../../storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import MultiSelect from '../../components/React-Native-Multi-Select';
import { SuccessfullySubmitModal } from '../../components/Popupmessage';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import DropDownPicker from 'react-native-dropdown-picker';
import { RFValue } from 'react-native-responsive-fontsize';
const mapObject = (value) =>
  value.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
export const Order = (props) => {
  useEffect(() => {
    GetRequest(), getlab(), getNote(), getorderdetails();
  }, [props.route.params?.bookingid, props.route.params?.endtime]);
  const [otherlab, setOtherlab] = useState('');
  const [loading, setLoding] = useState(false);
  const [route, setRoute] = useState();
  const [selectroute, setSelectRoute] = useState();
  const [medicine, setMedicine] = useState('');
  const [course, setCourse] = useState('');
  const [routeid, setRouteid] = useState([]);
  const [does, setDoes] = useState('');
  const [frequency, setFrequency] = useState('');
  const [brief, setBrief] = useState('');
  const [comment, setComment] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [editdatetime, setEditdatetime] = useState();
  const [isModalVisible, SetIsModalVisible] = useState();
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [image, SetImage] = useState('');
  const [slotstart, SetSlotstart] = useState('');
  const [end, Setend] = useState('');
  const [age, setAge] = useState('');
  const [prescription, SetPrescription] = useState('');
  const [problem, SetProblem] = useState('');
  const [modalmessage, SetModalmessage] = useState();
  const [value, setValue] = useState('');
  const [onsubmit, setOnSubmit] = useState('');
  const [lab, setLab] = useState([]);
  const [addnote, setAddnote] = useState('');
  const [items, setItems] = useState([
    { label: 'ML', value: 'ML' },
    { label: 'MG', value: 'MG' },
  ]);
  const [order, setOrder] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [isNoteVisible, SetIsNoteVisible] = useState(false);
  const automadalcloseref = useRef(null);
  const autoendtimeref = useRef(null);
  const onSelectedItemsChange = (id, _selectedItems) => {
    //setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
    if (id == 'lab' && _selectedItems.includes(1)) {
      if (_selectedItems[_selectedItems.length - 1] == 1) {
        setSelectedItems((prevData) => ({ ...prevData, [id]: [1] }));
      } else {
        let temp3 = _selectedItems.filter(item => item != 1)
        console.log("hello Temp", temp3)
        setSelectedItems((prevData) => ({ ...prevData, [id]: temp3 }));
      }

    }
    else {
      setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
      console.log("========Else===========", _selectedItems)
    }
  };

  const showDate = () => {
    setOpen(true);
  };

  const hideDate = () => {
    setOpen(false);
  };
  const Close = () => {
    SetIsNoteVisible(false);
  };
  console.log('endtime', props.route.params?.endtime);
  const getNote = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
    };

    setLoding(true);
    await Apis.getnote(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setAddnote(response.data.response.note);
        // setSelectRoute(response.data.response.route_id);
        // setMedicine(response.data.response[0].medicine);
        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);
        console.log(alldata);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getlab = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getlabresult(token)

      .then((response) => {
        console.log('labresult======>', response.data.response);
        setLab(response.data.response);
        // getlabresultdetails();
        // getlabimage();
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  // const generatepres = () => {
  //   prescriptionshow ? showprescription() : Linking.openURL(prescription);
  // };
  const GenerateOrder = async (values) => {
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);
      const Order = {
        booking_id: props.route.params?.bookingid,
        //time_zone: RNLocalize.getTimeZone(),
        order_id: selectedItems['lab']?.toString(),
        other_order: otherlab,
        comment: comment,
      };
      console.log('order', Order);
      setLoding(true);
      const response = await Apis.generateorder(Order);
      console.log(response.data);

      console.log('order==', response.data.order);
      setLoding(false);
      if (response.data.order) {
        console.log('order------', response.data.order);
        return response.data.order;
      } else {
        console.log('message---', response.data);
        SetModalmessage(response.data.message);
        SetIsModalVisible(true);
      }
    } catch (err) {
      console.error(err.response.data);
      setError((data) => ({
        ...data,
        iserror: true,
        message: err.response.data,
      }));
    }
  };

  const GetRequest = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('id---', data);
    setLoding(true);
    await Apis.bookingdetails(data)
      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        console.log(response.data.data);

        setName(response.data.data.patient_name);
        setDay(response.data.data.day);
        SetImage(response.data.data.profile_image);
        setDate(response.data.data.date);
        SetSlotstart(response.data.data.slot_start);
        Setend(response.data.data.slot_end);
        SetProblem(response.data.data.problem);
        setAge(response.data.data.age);
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const handleClose = () => {
    SetIsModalVisible(false);
    SetIsNoteVisible(false);
  };
  const getorderdetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
    };

    await Apis.getorder(data)

      .then((response) => {
        console.warn(response.data);

        setComment(response.data.response.comment);
        setSelectedItems((prevData) => ({
          ...prevData,
          ['lab']: response.data.response?.order_id
            ?.split(',')
            .map((el) => Number(el)),
        }));
      })
      .catch((error) => {
        console.error(error.response);
      });
  };
  const twoOptionAlertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      'Alert',
      //body
      'You have selected the None option. No orders should be generated for this patient. Please click OK to proceed.',
      [

        {
          text: 'Ok',
          onPress: () => props.navigation.goBack(),
        },
        {
          text: 'Cancel',
          //  onPress: () => props.navigation.goBack(),
        },
      ],

      //clicking out side of alert will not cancel
    );
  };
  // useEffect(() => {
  //   const backAction = async (data) => {
  //     let usertoken = await AsyncStorage.getItem('authtoken');
  //     const userid = await AsyncStorage.getItem('userid');
  //     const user_id = JSON.parse(userid);
  //     let token = usertoken;
  //     console.log('user id =====>>>>', user_id);
  //     console.log('token123=', token);

  //     console.log('backdata', data);
  //     setLoding(true);
  //     await Apis.orderautosave(data)

  //       .then((response) => {
  //         console.warn(response.data);
  //         setLoding(false);
  //         // props.navigation.navigate('PatientChart', {
  //         //   bookingid: props.route.params?.bookingid,
  //         // });
  //         props.navigation.goBack();
  //         return true;
  //       })
  //       .catch((error) => {
  //         console.error(error.response);
  //         setLoding(false);
  //       });
  //   };
  //   const backdata = {
  //     ...{
  //       booking_id: props.route.params?.bookingid,
  //       //time_zone: RNLocalize.getTimeZone(),
  //       order_id: selectedItems['lab']?.toString(),
  //       other_order: otherlab,
  //       comment: comment,
  //     },
  //   };
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
  //     backAction(backdata)
  //   );
  //   return () => backHandler.remove();
  // }, [
  //   comment,
  //   otherlab,
  //   props.navigation,
  //   props.route.params?.bookingid,
  //   selectedItems,
  // ]);
  const Autosave = useCallback(
    async (callback) => {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);
      const Medicine = {
        booking_id: props.route.params?.bookingid,
        //time_zone: RNLocalize.getTimeZone(),
        order_id: selectedItems['lab']?.toString(),
        other_order: otherlab,
        comment: comment,
      };
      console.log('med======', Medicine);
      setLoding(true);
      await Apis.orderautosave(Medicine)

        .then((response) => {
          console.warn(response.data);
          setLoding(false);
          callback?.();
          // props.navigation.navigate('PatientChart', {
          //   bookingid: props.route.params?.bookingid,
          // });
          // return true;
        })

        .catch((error) => {
          console.error(error.response);
          setLoding(false);
        });
      if (autoendtimeref.current) {
        clearInterval(autoendtimeref.current);
      }
    },
    [comment, otherlab, props.route.params?.bookingid, selectedItems]
  );

  useEffect(() => {
    clearInterval(autoendtimeref.current);
    autoendtimeref.current = setInterval(() => {
      if (Date.now() >= props.route.params?.endtime + 120000) {
        Autosave(() => {
          props.navigation.navigate('Dashboard');
        });
      }
    }, 5000);
    return () => {
      clearInterval(autoendtimeref.current);
    };
  }, [Autosave, props.navigation, props.route.params?.endtime]);

  // if (isModalVisible === false) {
  //   getPrescriptiondetails();
  // }
  // const showprescription = () => {
  //   Alert.alert('You cannot generate');
  // };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 20 }}>
        <TouchableOpacity
          onPress={() =>
          // Autosave(() => {
          { props.navigation.goBack(); }
            // })
          }
        >
          <Image
            source={require('../../Assets/back.png')}
            resizeMode="contain"
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 40,
            fontSize: RFValue(18),
            fontFamily: 'Roboto-Bold',
            color: '#333333',
          }}
        >
          Order
        </Text>
      </View>
      <ScrollView style={{ marginBottom: 20, backgroundColor: '#fff' }}>
        <View style={styles.checkborder}>
          <Image style={styles.img} source={{ uri: image }} />
          <View>
            <Text
              style={{
                color: '#333333',
                marginLeft: 100,
                marginTop: 5,
                //  position: 'absolute',
                fontSize: RFValue(15),
                fontWeight: 'bold',
              }}
            >
              {name}
            </Text>
            {/* <View style={{ flexDirection: 'row', width: '80%' }}> */}
            <Text
              style={{
                color: '#333333',
                marginLeft: 100,
                marginTop: 3,
                width: '38%',
              }}
            >
              Age: {age}
            </Text>
            {/* <Button
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              contentStyle={{
                backgroundColor: '#2173A8',
                //    marginTop: 10,
                borderRadius: 15,
                marginLeft: 20,
              }}
              onPress={() => {
                SetIsNoteVisible(true);
              }}
              labelStyle={{ color: '#fff', fontSize: 15 }}
            >
              Show Note
            </Button>
          </View>
          <View style={{ flexDirection: 'row', width: '80%' }}> */}
            <Text
              style={{
                color: '#333333',
                marginLeft: 100,
                width: '38%',
                marginTop: 3,
              }}
            >
              {date}
            </Text>
            {/* <Button
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              contentStyle={{
                backgroundColor: '#2173A8',
                //   marginTop: 10,
                borderRadius: 15,
                width: '73%',
                marginLeft: 20,
              }}
              onPress={() => {
                props.navigation.navigate('Order', {
                  bookingid: props.route.params?.bookingid,
                });
              }}
              labelStyle={{ color: '#fff', fontSize: 15 }}
            >
              Order
            </Button>
          </View> */}
            <Text
              style={{
                color: '#333333',
                marginLeft: 100,
                marginTop: 3
              }}
            >
              {day},{slotstart} - {end}
            </Text>
          </View>
        </View>
        <View style={{ marginHorizontal: 20, marginTop: 30 }}>
          <TouchableOpacity
            onPress={() => {
              setOrder(!order);
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: 10,
              backgroundColor: '#eee',
              borderRadius: 5,
              paddingVertical: 5,
              zIndex: -2,
            }}
          >
            <Title style={{ marginVertical: 5, marginLeft: 10, color: '#000' }}>Order</Title>
            <Image
              source={require('../../Assets/drop2.png')}
              style={{
                marginVertical: 5,
                marginRight: 10,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
          {order ? (
            <View>
              <Card style={{ borderRadius: 15, marginHorizontal: 10, backgroundColor: '#fff', }}>
                <Card.Content>
                  <MultiSelect
                    items={lab}
                    uniqueKey="id"
                    // onToggleList={getlab}
                    selectedItems={selectedItems['lab']}
                    onSelectedItemsChange={(item) => {
                      onSelectedItemsChange('lab', item);
                      console.log('item', item);
                    }}
                  />
                  {selectedItems['lab']?.some(
                    (element) => mapObject(lab)[element] === 'Others'
                  ) && (
                      <TextInput
                        mode="outlined"
                        label="Add Your History"
                        value={otherlab}
                        maxLength={10}
                        onChangeText={(text) => setOtherlab(text)}
                        placeholder=""
                        outlineColor="#fff"
                        style={{
                          marginHorizontal: '1%',
                          marginBottom: 10, backgroundColor: '#fff',
                          // borderColor: '#000', borderWidth: 1
                        }}
                        theme={{
                          colors: {
                            text: 'black',
                            placeholder: 'black',
                          },
                        }}
                      />
                    )}
                </Card.Content>
              </Card>
              <View style={{ marginHorizontal: 15, marginTop: 15 }}>
                <TextInput
                  mode="outlined"
                  label="Comment"
                  placeholder=""
                  style={{ height: 80, backgroundColor: '#fff', }}
                  multiline={true}
                  maxLength={50}
                  value={comment}
                  onChangeText={(text) => setComment(text)}

                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                />
                <HelperText
                  visible
                  style={{ position: 'absolute', bottom: 0, right: 0 }}
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                >
                  {`${comment.length}/50`}
                </HelperText>
              </View>
            </View>
          ) : null}
        </View>

        <View
          style={{
            marginHorizontal: 30,
            borderRadius: 10,
            marginBottom: 20,
            marginTop: 20,
            zIndex: -2,
          }}
        >
          <Button
            mode="contained"
            color="#2173A8"
            uppercase={false}
            onPress={async () => {
              console.log(selectedItems['lab']?.length)
              if (selectedItems['lab']?.length < 1 || selectedItems['lab']?.length === undefined) { alert("Please select any order.") }
              else if (selectedItems['lab'] == 1) { twoOptionAlertHandler() }
              else {
                const _prescription = await GenerateOrder();
                console.log('pres=====', _prescription);
                Linking.openURL(_prescription);
              }
            }}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 18 }}
          >
            Generate Order
          </Button>
        </View>
      </ScrollView>
      <Modal
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 20,
          bottom: 150,
          position: 'absolute',
        }}
        onDismiss={handleClose}
        visible={isNoteVisible}
      // animationIn="zoomIn"
      // animationOut="zoomOut"
      >
        <View
          style={{
            backgroundColor: '#f7ebf7',
            borderRadius: 15,
            alignSelf: 'center',
            width: 330,
            height: 250,
          }}
        >
          <IconButton
            icon="close"
            size={26}
            color="red"
            style={{ alignSelf: 'flex-end' }}
            onPress={Close}
          />
          <Text
            style={{
              color: '#333333',
              marginLeft: 20,
              marginTop: 9,
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            {addnote}
          </Text>
        </View>
      </Modal>
      <SuccessfullySubmitModal
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
        message={modalmessage}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    justifyContent: 'space-between',
    backgroundColor: '#fff',

    alignSelf: 'center',
    height: 90,
    marginTop: 20,
    width: '90%',
  },
  view: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'center',
    elevation: 5,
    height: 60,
    marginTop: 20,
    borderRadius: 15,
    width: '90%',
  },

  img: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
    borderColor: '#ddd',
    borderWidth: 1
  },
  text: {
    marginTop: 10,
    color: '333333',
    fontSize: 20,
    marginRight: 40,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
});
