import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  Searchbar,
  Card,
  Paragraph,
  Snackbar,
  Modal,
  Portal,
  Provider,
  IconButton,
  DataTable,
} from 'react-native-paper';
import { Header, Header2 } from '../../components/Header/Header';
import RadioSelector from '../../components/Chip';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { useIntl } from 'react-intl';
import { Editdatetime } from '../../components/Editdatetime/Editdate';
import { SuccessfullySubmitModal } from '../../components/Popupmessage';
import * as RNLocalize from 'react-native-localize';
const optionsPerPage = [2, 3, 4];
export const Timing = (props) => {
  const intl = useIntl();

  const [loading, setLoding] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [scheduletime, setScheduletime] = useState([]);
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [data, setData] = useState([]);
  const getavailabilitydetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      date: props.route.params?.date,
      time_zone: RNLocalize.getTimeZone(),
      user_id: user_id,
    };
    console.log('data=---', data);
    setLoding(true);
    await Apis.availabilitydoctor(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        const arr = response.data.response;
        const newArr = arr.flatMap((el) => el);
        console.log('status----', newArr);
        setAlldata(newArr);
        // setId(response.data.response.id);
        // setMedicine(response.data.response[0].medicine);
        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);
        console.log(alldata);
        setDate(response.data.date);
        setDay(response.data.day);
        // console.log(id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const getavailability = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    setLoding(true);
    await Apis.availabilitydetails(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setData(response.data.response);
        // setId(response.data.response.id);
        // setMedicine(response.data.response[0].medicine);
        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);
        console.log(data);
        // console.log(id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const [page, setPage] = React.useState();
  const [itemsPerPage, setItemsPerPage] = React.useState(optionsPerPage[0]);

  React.useEffect(() => {
    getavailabilitydetails();
  }, [props.route.params?.date]);

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header title="Slot Timings" navProps={props.navigation} />

      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <Card
          style={{
            borderRadius: 15,
            marginHorizontal: 10,
            // marginTop: -20,
            paddingBottom: 10,
            marginBottom: 10,
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderWidth: 1
          }}
        >
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 10,
              }}
            >
              {/* <Paragraph style={{ textAlign: 'center', fontSize: 18 }}>
                ( Slot)
              </Paragraph> */}
              <Paragraph style={{ textAlign: 'center', fontSize: 18, color: '#000' }}>
                {date} {' '} {day}
              </Paragraph>
              {/* <Paragraph style={{ textAlign: 'center', fontSize: 18, color: '#000' }}>
                {day}
              </Paragraph> */}
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '95%',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  borderColor: '#000',
                  //   backgroundColor: '#cbcfd4',
                  width: '40%',
                  marginTop: 10,
                }}
              >
                <Paragraph
                  style={{
                    textAlign: 'center',
                    color: '#000',
                    fontSize: 18,
                    marginHorizontal: 5,
                  }}
                >
                  Slot Timing
                </Paragraph>
              </View>
              <View
                style={{
                  borderColor: '#000',
                  // backgroundColor: '#cbcfd4',
                  width: '30%',
                  marginTop: 10,
                }}
              >
                <Paragraph
                  style={{
                    textAlign: 'center',
                    color: '#000',
                    fontSize: 18,
                    marginHorizontal: 5,
                  }}
                >
                  Status
                </Paragraph>
              </View>
              <View
                style={{
                  borderColor: '#000',
                  //  backgroundColor: '#cbcfd4',
                  width: '35%',
                  marginTop: 10,
                }}
              >
                <Paragraph
                  style={{
                    textAlign: 'center',
                    color: '#000',
                    fontSize: 18,
                    marginHorizontal: 5,
                  }}
                >
                  Patient
                </Paragraph>
              </View>
            </View>
            {/* <ScrollView contentContainerStyle={{ paddingBottom: 150 }}> */}
            {alldata.map((el, i) => (
              //  { console.log('index------',i)}
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    borderColor: '#000',
                    //  backgroundColor: '#fff',
                    width: '40%',
                  }}
                >
                  <Paragraph
                    style={{
                      //   textAlign: 'center',
                      color: '#000',
                      fontSize: 15,
                      marginHorizontal: 5,
                      padding: 7,
                      // backgroundColor: 'pink'
                    }}
                  >
                    {el.slot_start_time} - {el.slot_end_time}
                  </Paragraph>
                </View>
                <View
                  style={{
                    // borderColor: '#000',
                    //  backgroundColor: '#fff',
                    width: '30%',
                  }}
                >
                  <Paragraph
                    style={{
                      // textAlign: 'center',
                      color: '#000',
                      fontSize: 14,
                      marginHorizontal: 7,
                      padding: 5,
                      //backgroundColor: 'pink'
                    }}
                  >
                    {el.status}
                  </Paragraph>
                </View>
                <TouchableOpacity
                  style={{
                    borderColor: '#000',
                    // backgroundColor: '#fff',
                    width: '35%',
                  }}
                  onPress={() => {
                    el.patient_name === "NA" ? alert('Schedule not booked.') : props.navigation.navigate('PatientInformation', {
                      userid: el.patient_id,
                    })
                  }}
                >
                  <Paragraph
                    style={{
                      //   textAlign: 'center',
                      color: '#000',
                      fontSize: 14,
                      marginHorizontal: 5,
                      padding: 5,
                      marginLeft: 10
                      // backgroundColor: 'pink'
                    }}
                  >
                    {el.patient_name}
                  </Paragraph>
                </TouchableOpacity>
              </View>
            ))}

            {/* </ScrollView> */}
          </Card.Content>
          {/* {console.log('elementid----------------->')} */}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  view: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',

    alignSelf: 'center',
    elevation: 5,
    height: 60,
    marginTop: 15,
    borderRadius: 15,
    width: '90%',
    marginBottom: 10,
  },
  app: {
    marginHorizontal: 15,
    marginRight: 40,
    maxWidth: 500,
    flexDirection: 'row',
    marginTop: 20,
  },
});
