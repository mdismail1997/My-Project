import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity, Alert
} from 'react-native';
import { Text, TextInput, Card, Paragraph, Snackbar } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as RNLocalize from 'react-native-localize';

import { useIntl } from 'react-intl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../screens/Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import DropDownPicker from 'react-native-dropdown-picker';
import MultiSelect from '../React-Native-Multi-Select';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';
import { date } from 'zod';
export const Editdatetime = ({
  id,
  data,
  onDateChange,
  onStarttimeChange,
  onEndtimeChange,
  onTypeChange,
  onChangeType,
  // onSelectedTypeChange,
  onDayChange,
  onSubmit,
  datatype,
  error,
  setError,
  success,
  setSuccess
}) => {
  const intl = useIntl();
  const [datevisible, setDatevisible] = useState(false);
  const [alldata, setAlldata] = useState([]);
  const [timevisible, setTimevisible] = useState(false);
  const [endtimevisible, setEndTimevisible] = useState(false);
  const [day, setDay] = useState('');
  const [scheduletime, setScheduletime] = useState([]);
  const [scheduledata, setScheduledata] = useState({});
  const [loading, setLoding] = useState(false);
  const [selectedtype, setSelectedType] = useState([{}]);
  const [update, setUpdate] = useState([]);
  const [items, setItems] = useState([
    { name: 'Chat', id: 1 },
    { name: 'Audio', id: 2 },
    { name: 'Video', id: 3 },
    // { label: 'Chat', value: 'Chat' },
    // { label: 'Audio', value: 'Audio' },
    // { label: 'Video', value: 'Video' },
  ]);
  const onSelectedTypeChange = (id, _selectedType) => {
    console.warn("Change Item", _selectedType)


    //sendDataToParent(_selectedType);
    setUpdate(_selectedType)
    setSelectedType((prevData) => ({ ...prevData, [id]: _selectedType }));

  };
  //console.log("llllllllllllllllllllllll", data)
  // const [open, setOpen] = useState(false);
  // const [type, setType] = useState([]);
  // const [error, setError] = React.useState({ iserror: false, message: '' });
  // const [success, setSuccess] = React.useState({ isSuccess: false, message: '' });
  useEffect(() => {
    const savedata = data.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
    setScheduledata(savedata);
    //gettype()
    //console.log('===>>', scheduledata)
    setSelectedType((prevData) => ({ ...prevData, ['items']: datatype }));

    //setUpdate(selectedtype)
  }, [data]);

  const getavailabilitydetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    //console.log('user id =====>>>>', user_id);
    //console.log('token123=', token);
    const data = {
      user_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    //console.log('Time Zone---', data);
    setLoding(true);
    await Apis.availabilitydetails(data)

      .then((response) => {
        console.warn('data======', response.data.response);
        setLoding(false);
        setAlldata(response.data.response);
        // setId(response.data.response.id);
        // setMedicine(response.data.response[0].medicine);
        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);
        //console.log('alldata----->', alldata);
        // console.log(id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setSuccess((data) => ({ ...data, isSuccess: false, message: '' }));
  };



  //console.log('llll;;;;-====', selectedtype['items'], datatype)
  // const typechange = () => {
  const arr = []
  // const object = { type: scheduledata[id]?.type.split(',') }
  const Type = scheduledata[id]?.type.split(', ')


  //console.log('typelength====', Type?.length)
  //console.log('update====', update)


  //console.log('Data=====', data)
  //console.log('stype=====', selectedtype)

  //console.log('++++++++Date=====', data)

  const CheckingSchedule = async (values) => {
    const Scheduledate = data.filter((el) => el.id === id);
    const Scheduledate1 = { ...Scheduledate }

    console.log('-----------Scheduledate1111111-----------', Scheduledate1);

    if (Scheduledate1 === '') {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'The Date field is required.',
      }));
      // setVisible(false);
    }

    else if (selectedtype?.items == 0 || selectedtype?.items === undefined) {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'Type field is required',
      }));
    }
    else {
      console.warn("Single Shedule++++++++++", Scheduledate1['0'])

      //let d1 = (JSON.stringify(Scheduledate1.date)).replace(/-/g, '/')

      let d1 = Scheduledate1['0'].date

      let starttime = Scheduledate1['0'].start_time
      let endtime = Scheduledate1['0'].end_time
      const validd = UpdateShudulevalidation(d1, starttime, endtime)

      //const validd = validDateRangeFunc(d1, d2)
      if (validd) {
        console.log('Valid range')
        UpdateSchedule()

      } else {

        Alert.alert(
          "",
          "You have already added a time schedule within the time range you entered. Please add other times that have not been entered.",

          [
            { text: " " },
            { text: "ok" },
          ],
          { cancelable: false }
          //clicking out side of alert will not cancel
        );
      }

    }

  };

  const UpdateShudulevalidation = (date, startTime, endTime) => {
    console.log("=========Data+++++++++++", data, id)
    var data1 = data.filter(item => item.id != id)
    var x = new Date(date + " " + startTime)
    var y = new Date(date + " " + endTime)
    console.log("======Start Time===>", startTime)
    console.log("======End Time===>", endTime)
    var validRange = 0
    for (let i = 0; i < data1.length; i++) {
      let a = new Date(data1[i].date + " " + data1[i].start_time).getTime();
      let b = new Date(data1[i].date + " " + data1[i].end_time).getTime();
      if (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) {
        // between
        //validRange=false
        console.log("Start Time & End Time range", data1[i].start_time, data1[i].end_time)
      } else {
        console.log("Start Time & End Time", data1[i].start_time, data1[i].end_time)
        validRange = validRange + 1
        // break
      }
    }

    console.log("==============>", validRange)

    if (validRange == data1.length) {
      console.log("=======Range valid=========>",)
      return true

    } else {
      console.log("Range invalid")
      return false
    }
  }








  const UpdateSchedule = async (values) => {
    try {
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      //console.log('Selected type=====>>>>', selectedtype.items);
      //console.log('user id =====>>>>', user_id);
      var tempArr = ''
      selectedtype.items.map(item => {
        if (item == 1) {
          tempArr = tempArr + 'Chat,'
        }
        else if (item == 2) {
          tempArr = tempArr + 'Audio,'
        }
        else if (item == 3) {
          tempArr = tempArr + 'Video,'
        }
        console.log('tempArr', tempArr)


      })
      var tempArr = tempArr.substring(0, tempArr.length - 1);
      console.warn("temp++++++++++++++++", tempArr)
      const Scheduledate = data.filter((el) => el.id === id);
      const Scheduledate1 = { ...Scheduledate[0], "type": tempArr }

      console.log('Scheduledate=----', Scheduledate1);
      console.log('++++++Shedule type+++++++=----', selectedtype.items);
      if (Scheduledate1.type === '') {
        setError((data) => ({
          ...data,
          iserror: true,
          message: 'Type feild is required',
        }));
      }

      else
        setLoding(true);
      const response = await Apis.availabilityupdate(Scheduledate1);


      console.warn('pppp==>', response.data);
      setLoding(false);
      if (response.data.success === '0') {
        setError((data) => ({
          ...data,
          iserror: true,
          message: response.data.message,
        }));
        return;
      } else {
        //getavailabilitydetails()
        setError((data) => ({
          iserror: false,

        }));
        setSuccess((data) => ({
          ...data,
          isSuccess: true,
          message: response.data.message,
        }));
        onChangeType(id, tempArr)
        setTimeout(() => {
          onSubmit?.();

        }, 2500);


      }
    }
    catch (err) {
      console.error(err.response.data);
      if (err.response.data.errors.end_time[0] === "End Time field must be after Start Time") {
        setError((dat) => ({
          ...dat,
          iserror: true,
          message: err.response.data.errors.end_time,
        }));
        setLoding(false);
      }

      else {
        onSubmit?.();
        setError((dat) => ({
          ...dat,
          iserror: true,
          message: err.response.data.errors.end_time,
        }));

      }

    }

  };
  const hideDate = () => {
    setDatevisible(false);
  };
  const showDate = () => {
    setDatevisible(true);
  };
  const showTimePicker = () => {
    setTimevisible(true);
  };

  const hideTimePicker = () => {
    setTimevisible(false);
  };
  const showEndTimePicker = () => {
    setEndTimevisible(true);
  };

  const hideEndimePicker = () => {
    setEndTimevisible(false);
  };
  const chipData = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const dataaa = [
    1, 2
  ]
  return (
    <SafeAreaView>
      {/* <Snackbar
        visible={success.isSuccess}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: 'green',
          bottom: 0,
          zIndex: 10,
          // position: 'absolute',
        }}
      >
        {success.message}
      </Snackbar> */}


      {/* <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: '#d15656',
          zIndex: 9999,
          // position: 'absolute',
        }}
      >
        {error.message}
      </Snackbar> */}

      <ScrollView>

        {loading ? (
          <Spinner
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={'Loading...'}
            textStyle={{ color: '#fff' }}
          />
        ) : null}
        <View>
          <TextInput
            label="Date*"
            mode="outlined"
            value={scheduledata[id]?.date}
            onChangeText={(text) => onDateChange(id, text)}
            placeholder="mm-dd-yyyy*"
            selectionColor="black"
            outlineColor="black"
            showSoftInputOnFocus={false}
            activeOutlineColor="black"
            editable={false}
            style={{
              marginHorizontal: '9%',
              width: '82%',
              backgroundColor: '#fff',
            }}
            onPressIn={showDate}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            right={
              <TextInput.Icon
                icon={require('../../Assets/date.png')}
                onPress={showDate}
                color="#000"
              />
            }
          />
          <DateTimePickerModal
            isVisible={datevisible}
            mode="date"
            onConfirm={(date) => {
              console.log(intl.formatDate(date));
              // const text = intl.formatDate(date, {
              //   month: 'numeric',
              //   year: 'numeric',
              //   day: 'numeric',
              // });
              const text = moment(date).format('MM/DD/YYYY')
              onDateChange(id, text);
              const day = chipData[date.getDay()];
              onDayChange(id, day);
              hideDate()
            }}
            minimumDate={new Date()}
            onCancel={hideDate}
          />
          <ScrollView>
            <Text
              style={{
                color: '#333333',
                marginLeft: 20,
                marginTop: 5,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Time Frame
            </Text>
            <View style={{ flexDirection: 'row', width: '100%', marginTop: 5 }}>
              <TextInput
                value={scheduledata[id]?.start_time.toLowerCase()}
                onChangeText={(text) => onStarttimeChange(id, text)}
                mode="outlined"
                label="Start Time*"
                // placeholder="15:00:00 PM"
                showSoftInputOnFocus={false}
                selectionColor="black"
                onPressIn={showTimePicker}
                outlineColor="black"
                activeOutlineColor="black"
                editable={false}
                style={{
                  marginHorizontal: '9%',
                  marginBottom: 10,
                  width: '82%',
                  backgroundColor: '#fff',
                }}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
                right={
                  <TextInput.Icon
                    icon={require('../../Assets/carbon_time.png')}
                    onPress={showTimePicker}
                    color="#000"
                  />
                }
              />
            </View>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <TextInput
                value={scheduledata[id]?.end_time.toLowerCase()}
                onChangeText={(text) => onEndtimeChange(id, text)}
                mode="outlined"
                label="End Time*"
                showSoftInputOnFocus={false}
                selectionColor="black"
                outlineColor="black"
                activeOutlineColor="black"
                editable={false}
                style={{
                  marginHorizontal: '9%',
                  marginBottom: 10,
                  width: '82%',
                  backgroundColor: '#fff',
                }}
                // onPressIn={() => { console.log('ss', endtimevisible), showEndTimePicker }}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
                right={
                  <TextInput.Icon
                    icon={require('../../Assets/carbon_time.png')}
                    onPress={() => { console.log('ss', endtimevisible), showEndTimePicker() }}
                    color="#000"
                  />
                }
              />
            </View>
            <DateTimePickerModal
              isVisible={timevisible}
              mode="time"
              onConfirm={(date) => {
                // const output = intl.formatTime(date);
                // console.log('output======>', output);
                // onStarttimeChange(id, output);
                // hideTimePicker();
                const currentTime = new Date();
                const currentDate = new Date().setHours(0, 0, 0, 0);


                // if (date < currentTime) {
                //   Alert.alert('Invalid Time', 'Please select a future time');
                //   hideTimePicker();
                // } else if (date >= currentDate) {
                console.warn('A time has been picked: ', date);
                const output = intl.formatTime(date);
                console.log('output======>', output);
                onStarttimeChange(id, output.toLowerCase());

                hideTimePicker();
                // }

              }}
              onCancel={hideTimePicker}
            // minimumDate={new Date()}
            />
            <DateTimePickerModal
              isVisible={endtimevisible}
              mode="time"
              onConfirm={(date) => {
                // const output = intl.formatTime(date);
                // console.log('output======>', output);
                // onEndtimeChange(id, output);
                // hideEndimePicker()

                const currentTime = new Date();
                const currentDate = new Date().setHours(0, 0, 0, 0);


                // if (date < currentTime) {
                //   Alert.alert('Invalid Time', 'Please select a future time');
                //   hideEndimePicker()
                // } else if (date >= currentDate) {
                console.warn('A time has been picked: ', date);
                const output = intl.formatTime(date);
                console.log('output======>', output.toLowerCase());
                onEndtimeChange(id, output.toLowerCase());

                hideEndimePicker();
                //}
              }}
              onCancel={hideEndimePicker}
            ///minimumDate={new Date()}
            />
            {/* <View style={{ marginTop: 10 }}>
              <DropDownPicker
                open={open}
                value={scheduledata[id]?.type}
                items={items}
                setOpen={setOpen}
                //  setValue={setType}
                multiple={true}
                onSelectItem={(item) => {
                  console.log(item.value);
                  onTypeChange(id, item.value);
                }}
                placeholder="Type"
                setItems={setItems}
                style={{ backgroundColor: '#fff', borderColor: '#2173A8' }}
                labelStyle={{
                  width: '100%',
                  // backgroundColor: 'red',
                  //height: 50,
                }}
                containerStyle={{
                  marginHorizontal: '8%',
                  marginBottom: 8,
                  marginTop: 3,
                  width: '84%',
                  zIndex: 1000,
                  //backgroundColor: 'red',
                }}
                dropDownContainerStyle={{ backgroundColor: '#fff' }}
              />
            </View> */}
            <Text
              style={{
                color: '#333333',
                marginLeft: 20,
                // marginTop: 10,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Select Type*
            </Text>
            <Card
              style={{
                borderRadius: 15,
                marginHorizontal: 20,
                backgroundColor: '#fff',
              }}
            >
              <Card.Content>
                <MultiSelect

                  items={items}
                  uniqueKey="id"
                  //  onToggleList={multipledays}
                  //    selectedItems={update.type}
                  //selectedItems={dataaa}
                  selectedItems={selectedtype['items']}
                  onSelectedItemsChange={(item) => {
                    console.log('Selected ++++++item===', item)
                    onSelectedTypeChange('items', item)
                  }
                  }

                />

              </Card.Content>
            </Card>
            <View
              style={{
                marginTop: 20,
                width: '80%',
                height: 55,
                // change BorderColor
                borderColor: '#fff',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                borderWidth: 1,
                marginBottom: 70,
                backgroundColor: '#2173A8',
              }}
              activeOpacity={0.7}
            >
              <TouchableOpacity
                onPress={() => {
                  CheckingSchedule();
                }}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    lineHeight: 53,
                    color: '#FFFFFF',
                    fontWeight: '700',
                    fontSize: 18,
                    fontFamily: 'Rubik',
                    letterSpacing: 0.4,
                  }}
                >
                  Update Time Slot
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};