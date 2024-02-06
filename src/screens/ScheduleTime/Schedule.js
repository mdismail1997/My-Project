import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ToastAndroid,
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
  Title,
} from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { useIntl } from 'react-intl';
import { Editdatetime } from '../../components/Editdatetime/Editdate';
import * as RNLocalize from 'react-native-localize';
import MultiSelect from '../../components/React-Native-Multi-Select';
import { AddTimeFrame } from '../../components/Editdatetime/addtimeframe';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import { RFValue } from 'react-native-responsive-fontsize';
export const Schedule = (props) => {
  const intl = useIntl();

  useEffect(() => {
    items.reduce(
      (prevData, curr) => ({ ...prevData, [curr.id]: curr.name }),
      {}
    );
    getavailabilitydetails();
  }, []);
  const [loading, setLoding] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [scheduletime, setScheduletime] = useState([]);
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [id, setId] = useState([]);
  const [startmultipletime, setStartMultipletime] = useState('');
  const [endtimemultiple, setEndtimeMultiple] = useState('');
  const [isModalVisible, SetIsModalVisible] = useState();
  const handlePress = (event, value) => {
    setSelectedValue(value);
  };
  const [visible, setVisible] = React.useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [multiplevisible, setMultipleVisible] = useState(false);

  const showMultipleModal = () => setMultipleVisible(true);
  const hideMultipleModal = () => setMultipleVisible(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isVisible, setVisibility] = useState(false);
  const [editdatetime, setEditdatetime] = useState();
  const [error, setError] = useState({ iserror: false, message: '', success: null });
  const [success, setSuccess] = useState({ isSuccess: false, message: '' });
  const [startdate, setStartDate] = useState('');
  const [enddate, setEndDate] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedtype, setSelectedType] = useState({});
  const [multipletime, setMultipletime] = useState([{}]);
  const [multipledays, selectMultipleDayse] = useState([
    { name: 'Monday', id: 1 },
    { name: 'Tuesday', id: 2 },
    { name: 'Wednesday', id: 3 },
    { name: 'Thursday', id: 4 },
    { name: 'Friday', id: 5 },
    { name: 'Saturday', id: 6 },
    { name: 'Sunday', id: 7 },
  ]);
  const [items, setItems] = useState([
    { name: 'Chat', id: 1 },
    { name: 'Audio', id: 2 },
    { name: 'Video', id: 3 }
    // { label: 'Chat', value: 'Chat' },
    // { label: 'Audio', value: 'Audio' },
    // { label: 'Video', value: 'Video' },
  ]);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState([]);
  const [starttimeVisible, setstarttimeVisible] = useState(false);
  const [endtimeVisible, setEndtimeVisible] = useState(false);

  const [timeData, setTimeData] = useState([]);


  const minimumDate = new Date();
  const onSelectedItemsChange = (id, _selectedItems) => {
    setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
  };
  const onSelectedTypeChange = (id, _selectedType) => {
    setSelectedType((prevData) => ({ ...prevData, [id]: _selectedType }));
  };
  //console.log('sssss-----', selectedItems);
  const mapdays = multipledays.reduce(
    (prevData, curr) => ({ ...prevData, [curr.id]: curr.name }),
    {}
  );
  const maptype = items.reduce(
    (prevData, curr) => ({ ...prevData, [curr.id]: curr.name }),
    {}
  );
  // console.log(
  //   'type-----',
  //   selectedtype?.items
  //     ?.map((el) => {
  //       return maptype[el];
  //     })
  //     ?.toString()
  // );
  // console.log('eeee------', multipletime);
  const showstarttimePicker = () => {
    setstarttimeVisible(true);
  };

  const hidestarttimeDatePicker = () => {
    setstarttimeVisible(false);
  };

  const handlestarttimeConfirm = (date) => {
    console.warn('A time has been picked: ', date.toLocaleTimeString('en-US'));
    const output = intl.formatTime(date);
    console.log('output======>', output);
    setStartMultipletime(output);

    hidestarttimeDatePicker();
  };
  const showendtimePicker = () => {
    setEndtimeVisible(true);
  };

  const hideendtimeDatePicker = () => {
    setEndtimeVisible(false);
  };

  const handleendtimeConfirm = (date) => {
    console.warn('A time has been picked: ', date.toLocaleTimeString('en-US'));
    const output = intl.formatTime(date);
    console.log('output======>', output);
    setEndtimeMultiple(output);

    hideendtimeDatePicker();
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const currentTime = new Date();
    const currentDate = new Date().setHours(0, 0, 0, 0);


    // if (date < currentTime) {
    //   Alert.alert('Invalid Time', 'Please select a future time');
    //   hideDatePicker();
    // } else if (date >= currentDate) {
    console.warn('A time has been picked: ', date);
    const output = intl.formatTime(date);
    console.log('output===StartTime===>', output);
    setStarttime(output);

    hideDatePicker();
    //   }

  };

  const showPicker = () => {
    setVisibility(true);
  };

  const hidePicker = () => {
    setVisibility(false);
  };

  // const handle = (endtime) => {
  //   console.warn(
  //     'A time has been picked: ',
  //     endtime.toLocaleTimeString('en-US')
  //   );
  //   const output = intl.formatTime(endtime);
  //   console.log('output======>', output);
  //   setEndtime(output);
  //   hidePicker();
  // };
  const handle = (date) => {
    const currentTime = new Date();
    const currentDate = new Date().setHours(0, 0, 0, 0);


    // if (date < currentTime) {
    //   Alert.alert('Invalid Time', 'Please select a future time');
    //   hidePicker();
    // } else if (date >= currentDate) {
    console.warn('A time has been picked: ', date);
    const output = intl.formatTime(date);
    console.log('output======>', output);
    setEndtime(output);

    hidePicker();
    // }

  };
  const handleClose = () => {
    SetIsModalVisible(false);
  };
  if (isModalVisible === false) {
    props.navigation.replace('Profile');
  }
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showDate = () => {
    setDatePickerVisible(true);
  };

  const hideDate = () => {
    setDatePickerVisible(false);
  };

  const handleCon = (picdate) => {
    // let dat = moment().format();

    // console.log('kk', dat);
    console.log(chipData[picdate.getDay()]);
    // const updateddate = picdate.toISOString();
    // console.warn('A date has been picked: ', updateddate);
    // setDate(updateddate.split('T')[0]);
    const updateddate = moment(picdate).format('MM-DD-YYYY')
    console.warn('A date has been picked: ', updateddate);
    //setDate(updateddate.split('T')[0]);
    setDate(updateddate);
    // setSelectedDate(picdate);
    setDay(chipData[picdate.getDay()]);
    console.log(date);
    hideDate();

  };

  const [selectestartdDate, setSelectedStartDate] = useState(new Date());
  const [startdatePickerVisible, setstartDatePickerVisible] = useState(false);

  const showstartDate = () => {
    setstartDatePickerVisible(true);
  };

  const hidestartDate = () => {
    setstartDatePickerVisible(false);
  };

  const handlestartCon = (picdate) => {
    // console.log(chipData[picdate.getDay()]);
    // const updateddate = picdate.toISOString();
    // console.warn('A date has been picked: ', updateddate);
    // setStartDate(updateddate.split('T')[0]);
    const updateddate = moment(picdate).format('MM-DD-YYYY')
    console.warn('A date has been picked: ', updateddate);
    //setDate(updateddate.split('T')[0]);
    setStartDate(updateddate);
    // setSelectedDate(picdate);
    // setDay(chipData[picdate.getDay()]);
    console.log(date);
    hidestartDate();
  };

  const [selecteenddDate, setSelectedendtDate] = useState(new Date());
  const [enddatePickerVisible, setendDatePickerVisible] = useState(false);

  const showendDate = () => {
    setendDatePickerVisible(true);
  };

  const hideendDate = () => {
    setendDatePickerVisible(false);
  };

  const handleendtCon = (picdate) => {
    // console.log(chipData[picdate.getDay()]);
    // const updateddate = picdate.toISOString();
    // console.warn('A date has been picked: ', updateddate);
    // setEndDate(updateddate.split('T')[0]);
    const updateddate = moment(picdate).format('MM-DD-YYYY')
    console.warn('A date has been picked: ', updateddate);
    //setDate(updateddate.split('T')[0]);
    setEndDate(updateddate);
    // setSelectedDate(picdate);
    // setDay(chipData[picdate.getDay()]);
    console.log(date);
    hideendDate();
  };
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
    console.log('Time Zone---', data);
    setLoding(true);
    await Apis.availabilitydetails(data)

      .then((response) => {
        console.warn('data======', response.data.response);
        setLoding(false);
        setAlldata(response.data.response);
        //setTimeData()
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
  //console.log('alldata----->', alldata)
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '', success: null }));
    setSuccess((data) => ({ ...data, isSuccess: false, message: '' }));
  };
  // console.log('alldata=============>', alldata);

  const AddSchedule = async (values) => {
    console.warn("S", starttime)
    console.warn("E", endtime)
    if (date === '') {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'The Date field is required',
      }));
      // setVisible(false);
    } else if (starttime === '') {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'The Start Time field is required',
      }));
      // setVisible(false);
    } else if (endtime === '') {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'The End Time field is required',
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
      //console.log("Single Shedule++++++++++", typeof starttime, endtime)


      let d1 = date.replace(/-/g, '/')

      const validd = singleShudulevalidation(d1, starttime, endtime)

      //const validd = validDateRangeFunc(d1, d2)
      if (validd) {
        console.log('Valid range')
        singleSheduleFun()

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
    // else {
    //   try {
    //     let usertoken = await AsyncStorage.getItem('authtoken');
    //     const userid = await AsyncStorage.getItem('userid');
    //     const user_id = JSON.parse(userid);
    //     let token = usertoken;
    //     console.log('user id =====>>>>', user_id);
    //     console.log('token123=', token);

    //     const Scheduledate = {
    //       user_id: user_id,
    //       start_time: starttime,
    //       end_time: endtime,
    //       date: date,
    //       day: day,
    //       time_zone: RNLocalize.getTimeZone(),

    //       //con_type: type.toString(),
    //       con_type: selectedtype?.items
    //         ?.map((el) => {
    //           return maptype[el];
    //         })
    //         ?.toString()
    //     };
    //     SetIsModalVisible(true);
    //     setLoding(true);
    //     console.log('Scheduledate', Scheduledate);
    //     if (date) {
    //       setScheduletime((data) => [...data, Scheduledate]);
    //     }

    //     const response = await Apis.doctoravailability(Scheduledate);
    //     console.log('???', response.data);
    //     setLoding(false);

    //     getavailabilitydetails();
    //     // Delete();
    //     // eslint-disable-next-line eqeqeq
    //     if (response.data.success != '0') {
    //       console.log('???==>', response.data);
    //       setError((data) => ({
    //         ...data,
    //         success: true,
    //         iserror: true,
    //         message: response.data.message,
    //       }));
    //       setVisible(false);
    //       //props.navigation.navigate('Account');
    //       setAlldata((data) => [...data, Scheduledate]);
    //       setDate('');
    //       setEndtime('');
    //       setStarttime('');
    //       setDay('');
    //     } else if (response.data.success === '0') {
    //       console.log(response.data);
    //       setError((data) => ({
    //         ...data,
    //         success: false,
    //         iserror: true,
    //         message: response.data.message,
    //       }));
    //     }
    //     // else if (
    //     //   err.response.data.errors.end_time[0] ===
    //     //   'The end time must be after start time.'
    //     // ) {
    //     //   setError((data) => ({
    //     //     ...data,
    //     //     success: false,
    //     //     iserror: true,
    //     //     message: err.response.data.errors.end_time,
    //     //   }));
    //     // }
    //     else {
    //       setError((data) => ({
    //         ...data,
    //         success: false,
    //         iserror: true,
    //         message: response.data.message,
    //       }));
    //     }
    //     //  console.log('res--', alldata);
    //   } catch (err) {
    //     console.error('catch error=======', err.response.data);
    //     setLoding(false);
    //     // if (
    //     //   err.response.data.errors.date[0] === 'The date is not a valid date.'
    //     // ) {
    //     //   setError((data) => ({
    //     //     ...data,
    //     //     success: false,
    //     //     iserror: true,
    //     //     message: err.response.data.errors.date,
    //     //   }));
    //     // } else

    //     // if (
    //     //   err.response.data.errors.end_time[0] ===
    //     //   'End time must be after start time.'
    //     // ) {
    //     setError((data) => ({
    //       ...data,
    //       success: false,
    //       iserror: true,
    //       message: err.response.data.errors.end_time,
    //     }));
    //     //  }
    //     // setVisible(false);
    //   }
    // }
  };

  const singleShudulevalidation = (date, startTime, endTime) => {
    var x = new Date(date + " " + startTime)
    var y = new Date(date + " " + endTime)
    console.log("=========>", x, y)
    var validRange = 0
    for (let i = 0; i < alldata.length; i++) {
      let a = new Date(alldata[i].date + " " + alldata[i].start_time).getTime();
      let b = new Date(alldata[i].date + " " + alldata[i].end_time).getTime();
      if (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) {
        // between
        //validRange=false
      } else {
        console.log("data[i].start_time", alldata[i].start_time, alldata[i].end_time)
        validRange = validRange + 1
        // break
      }
    }

    console.log("==============>", validRange)

    if (validRange == alldata.length) {
      console.log("=======Range valid=========>",)
      return true

    } else {
      console.log("Range invalid")
      return false
    }
  }



  const singleSheduleFun = async () => {

    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);

      const Scheduledate = {
        user_id: user_id,
        start_time: starttime,
        end_time: endtime,
        date: date,
        day: day,
        time_zone: RNLocalize.getTimeZone(),

        //con_type: type.toString(),
        con_type: selectedtype?.items
          ?.map((el) => {
            return maptype[el];
          })
          ?.toString()
      };
      SetIsModalVisible(true);
      setLoding(true);
      console.log('Scheduledate', Scheduledate);
      if (date) {
        setScheduletime((data) => [...data, Scheduledate]);
      }

      const response = await Apis.doctoravailability(Scheduledate);
      console.log('???', response.data);
      setLoding(false);

      getavailabilitydetails();
      // Delete();
      // eslint-disable-next-line eqeqeq
      if (response.data.success != '0') {
        console.log('???==>', response.data);
        setSuccess((data) => ({
          ...data,
          isSuccess: true,
          message: response.data.message,
        }));
        setError({ iserror: false, message: '', success: null })
        setVisible(false);
        //props.navigation.navigate('Account');
        setAlldata((data) => [...data, Scheduledate]);
        setDate('');
        setEndtime('');
        setStarttime('');
        setDay('');
      } else if (response.data.success === '0') {
        console.log(response.data);
        setError((data) => ({
          ...data,
          success: false,
          iserror: true,
          message: response.data.message,
        }));
        setSuccess({ isSuccess: false, message: '' })
      }
      // else if (
      //   err.response.data.errors.end_time[0] ===
      //   'The end time must be after start time.'
      // ) {
      //   setError((data) => ({
      //     ...data,
      //     success: false,
      //     iserror: true,
      //     message: err.response.data.errors.end_time,
      //   }));
      // }
      else {
        setError((data) => ({
          ...data,
          success: false,
          iserror: true,
          message: response.data.message,
        }));
        setSuccess({ isSuccess: false, message: '' })
      }
      //  console.log('res--', alldata);
    } catch (err) {
      console.error('catch error=======', err.response.data);
      setLoding(false);
      // if (
      //   err.response.data.errors.date[0] === 'The date is not a valid date.'
      // ) {
      //   setError((data) => ({
      //     ...data,
      //     success: false,
      //     iserror: true,
      //     message: err.response.data.errors.date,
      //   }));
      // } else

      // if (
      //   err.response.data.errors.end_time[0] ===
      //   'End time must be after start time.'
      // ) {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: err.response.data.errors.end_time,
      }));
      setSuccess({ isSuccess: false, message: '' })
      //  }
      // setVisible(false);
    }


  };


  const AddMultipleSchedule = async (values) => {
    if (startdate === '') {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'The Start Date field is required',
      }));
      setVisible(false);
    } else if (enddate === '') {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'The End Date field is required',
      }));
      setVisible(false);
    }
    else if (startdate.valueOf() > enddate.valueOf()) {
      setError(data => ({
        ...data,
        success: false,
        iserror: true,
        message: 'End Date must be after Start Date',
      }
      ))
    }
    else if (selectedItems.multipledays == 0 || selectedItems.multipledays == undefined) {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'The Days field is required',
      })
      )
      setVisible(false);
    }
    else if (selectedtype?.items == 0 || selectedtype?.items == undefined) {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'The Type field is required',
      })
      )
      setVisible(false);
    }
    else if (multipletime[0]?.start_time == undefined) {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'The Start Time field is required',
      }
      )
      )
    }
    else if (multipletime[0]?.end_time == undefined) {
      setError((data) => ({
        ...data,
        success: false,
        iserror: true,
        message: 'The End Time field is required',
      }
      )
      )
    }
    else {
      let error = 0
      for (var i = 0; i < multipletime.length; i++) {
        if (multipletime[i]?.start_time == undefined) {
          error = 1
          setError(data => ({
            ...data,
            success: false,
            iserror: true,
            message: 'The Start Time field is required',
          }
          ))
        }
        else if (multipletime[i]?.end_time == undefined) {
          error = 1
          setError(data => ({
            ...data,
            success: false,
            iserror: true,
            message: 'The End Time field is required',
          }
          ))
        }
        // else if (multipletime[i]?.start_time > multipletime[i]?.end_time) {
        //   error = 1
        //   setError(data => ({
        //     ...data,
        //     success: false,
        //     iserror: true,
        //     message: 'The end time must be after start time.',
        //   }
        //   ))
        //   console.log('iiiiiiiiiiiiii=====', i)
        // }
        // else if (type === '') {
        //   setError((data) => ({
        //     ...data,
        //     success: false,
        //     iserror: true,
        //     message: 'Type field is required',
        //   }));
        // }
        else {
          if (i === multipletime.length - 1) {
            console.log(error == 0)
            if (error == 0) {

              let d1 = startdate.replace(/-/g, '/')
              let d2 = enddate.replace(/-/g, '/')
              console.log("did2", d1 == d2)
              var validd
              for (let j = 0; j < multipletime.length; j++) {
                if (d1 == d2) {
                  console.log("============D1 D2============", multipletime[j].start_time, multipletime[j].end_time)
                  validd = singleShudulevalidationMultipleTime(d1, multipletime[j].start_time, multipletime[j].end_time)
                  if (!validd) {
                    break;
                  }
                } else {
                  console.log("============D1 Not Equal D2============", d1, d2)
                  validd = validDateRangeFunc(d1, d2, startdate, enddate, multipletime[j].start_time, multipletime[j].end_time)
                  if (!validd) {
                    break;
                  }
                }
              }
              if (validd) {
                console.log('Valid range')
                submitAddMultiple()
              } else {
                Alert.alert(
                  "",
                  "You have already added a time schedule within the time range you entered. Please add other times that have not been entered.",

                  [

                    { text: "ok" },
                  ],
                  { cancelable: false }

                );
              }



            }
          }
          else {
            console.warn("else", i)
          }
        }
      }
    };
  }

  function getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());

    const dates = [];

    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  }

  const dateFunc = (date) => {
    var newDat = date.split('-')
    var d = newDat[2] + '-' + newDat[0] + "-" + newDat[1]

    return d
  }

  function getDateRange(startDate, endDate) {

    console.warn("=====startDate", startDate, endDate)
    // Create date objects for the start and end dates

    const s = dateFunc(startDate)
    const e = dateFunc(endDate)
    // console.log("000000000000000", s, e)

    const start = new Date(s);
    const end = new Date(e);


    const dateRange = [];

    let current = new Date(start);
    while (current <= end) {
      dateRange.push(new Date(current));
      current.setDate(current.getDate() + 1); // Move to the next day
    }

    return dateRange;
  }

  const validation = (x, y) => {
    // var x=new Date(date+" "+startTime)
    //var y=new Date(date+" "+endTime)
    console.log("====x,y=====>", x, y)
    var validRange = 0
    for (let i = 0; i < alldata.length; i++) {
      let a = new Date(alldata[i].date + " " + alldata[i].start_time).getTime();
      let b = new Date(alldata[i].date + " " + alldata[i].end_time).getTime();
      if (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) {
        // between
        //validRange=false
        console.log("invalid data[i].start_time", alldata[i].start_time, alldata[i].end_time)
      } else {
        console.log("data[i].start_time", alldata[i].start_time, alldata[i].end_time)
        validRange = validRange + 1
        // break
      }
    }

    console.log("==============>", validRange)

    if (validRange == alldata.length) {
      console.log("=======Range valid=========>",)
      return true
    } else {
      console.log("Range invalid")
      return false
    }
  }

  const validDateRangeFunc = (d1, d2, s1, e1, start_time, end_time) => {

    console.log("========d1d2=======>", d1, d2)

    console.log("========d1d2=======>", typeof s1, e1)
    //let dateRange = getDateRange(new Date(d1), new Date(d2))
    let dateRange = getDateRange(s1, e1)
    console.log("+++++++++++++dateRange++++++++++++++", dateRange)
    let validRange1 = 0

    for (let x = 0; x < dateRange.length; x++) {
      let date1 = JSON.stringify(dateRange[x]).substring(1, 11).replace(/-/g, '/')
      //let date1 = dateRange[x]
      //console.log("======dateRange[x]========>", typeof dateRange[x], JSON.stringify(dateRange[x]).substring(1, 11))
      let startDate1 = new Date(date1 + " " + start_time)
      let endDate1 = new Date(date1 + " " + end_time)
      console.log("==+++++++++++++++", date1, startDate1)
      let valid = validation(startDate1, endDate1)
      console.log("Valid", valid, validRange1)
      if (!valid) {
        console.log("=========Valid=======", valid)
        //validRange1 = false
        //break;
      } else {
        validRange1 = validRange1 + 1
      }

    }
    if (validRange1 == dateRange.length) {
      console.log('Valid range')
      // submitAddMultiple()
      return true


    } else {

      return false
    }

  }

  const singleShudulevalidationMultipleTime = (date, startTime, endTime) => {
    console.log("===========Start Time & End Time", startTime, endTime)
    var x = new Date(date + " " + startTime)
    var y = new Date(date + " " + endTime)


    console.log("=========>", x, y)
    var validRange = 0
    for (let i = 0; i < alldata.length; i++) {
      let a = new Date(alldata[i].date + " " + alldata[i].start_time).getTime();
      let b = new Date(alldata[i].date + " " + alldata[i].end_time).getTime();
      if (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) {
        // between
        //validRange=false
      } else {
        console.log("data[i].start_time", alldata[i].start_time, alldata[i].end_time)
        validRange = validRange + 1
        // break
      }
    }

    console.log("==============>", validRange)

    if (validRange == alldata.length) {
      console.log("=======Range valid=========>",)
      return true

    } else {
      console.log("Range invalid")
      return false
    }
  }

  const submitAddMultiple = async () => {
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);

      const Scheduledate = {
        user_id: user_id,
        from_date: startdate,
        to_date: enddate,
        time_slots: multipletime,

        days: selectedItems?.multipledays
          ?.map((el) => {
            return mapdays[el];
          })
          ?.toString(),
        time_zone: RNLocalize.getTimeZone(),
        con_type: selectedtype?.items
          ?.map((el) => {
            return maptype[el];
          })
          ?.toString()
      };

      SetIsModalVisible(true);
      setLoding(true);
      console.log('Scheduledate===', Scheduledate);
      if (date) {
        setScheduletime((data) => [...data, Scheduledate]);
      }

      const response = await Apis.multipleavailability(Scheduledate);
      setLoding(false);

      setMultipleVisible(false);


      // setAlldata((data) => [...data, Scheduledate]);
      if (response.data.success !== '0') {
        console.log(response.data);
        console.log('uid == ', response.data);

        setSuccess((data) => ({
          ...data,
          isSuccess: true,
          message: response.data.message,
        }));
        setError({ iserror: false, message: '', success: null })
        getavailabilitydetails()
        // setTimeout(() => {
        //   props.navigation.navigate('Account');
        // }, 2500);





      } else {
        setError((dat) => ({
          ...dat,
          iserror: true,
          success: false,
          message: response.data.message,
        }));
        setSuccess({ isSuccess: false, message: '' })
        setMultipleVisible(true)
        console.log('res--', response.data);
      }

    } catch (error) {
      console.error(error.response.data);
      setLoding(false);
      setError((dat) => ({
        ...dat,
        iserror: true,
        success: false,
        message: "End Time must be greater than Start Time",
      }));

    }
  }
  const Choose = (_id) => {
    console.log('_id=======', _id);

    Alert.alert(
      'Choose',
      //body
      'Are you sure you want to delete?',

      [
        { text: 'Yes', onPress: () => Delete(_id) },
        // { text: 'Gallery', onPress: () => GalleryPicker() },
        { text: 'No', onPress: () => null },
      ],
      { cancelable: true }
      //clicking out side of alert will not cancel
    );
  };
  const Delete = async (scheduleid) => {
    console.log('av id =====>>>>', scheduleid);

    const data = {
      id: scheduleid,
    };
    await Apis.availabilitydelete(data)

      .then((response) => {
        console.warn('responsedata=================>', response.data);
        // props.navigation.navigate('Account');
        setAlldata((prevData) => prevData.filter((el) => el.id !== scheduleid));
      })

      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
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
  const handleDeleteFile = (index) => {
    setAlldata((prevData) => prevData.filter((el, i) => i !== index));
  };

  const showType = (data) => {
    console.log('type==========', data)
    const Type = data.split(',')
    console.log('typeSplit', typeof Type, Type.length)
    const newArr = [];
    Type.map((item) => {


      console.log("7777777", item)
      if (item.trim() == 'Chat') {

        newArr.push(1);
      } else if (item.trim() == 'Audio') {


        newArr.push(2);
      }
      else if (item.trim() == 'Video') {

        newArr.push(3);
      }
    });

    console.log("=====================>", newArr)
    return newArr
  }


  //console.log("ELLLLLLLLEMENT++++++++++++++++++++", alldata)

  const timeConvert = timeStr => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') {
      hours = '00';
    }
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Scheduling Time" navProps={props.navigation} />

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
        style={{ marginBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {/* <Text
            style={{
              color: '#333333',
              marginLeft: 20,
              marginTop: 10,
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            Schedule time
          </Text> */}
          <View style={{}}>
            <Button
              icon="plus-circle"
              onPress={showModal}
              contentStyle={{ flexDirection: 'row-reverse', marginTop: 5 }}
              labelStyle={{ fontSize: 12 }}
            >
              Add Schedule
            </Button>
          </View>
          <View style={{ marginLeft: -15 }}>
            <Button
              icon="plus-circle"
              onPress={showMultipleModal}
              contentStyle={{
                flexDirection: 'row-reverse',
                marginTop: 5,
              }}
              labelStyle={{ fontSize: 12 }}
            >
              Add Multiple Schedule
            </Button>
          </View>
        </View>

        {alldata.map((el) => (
          <Card
            key={el.id}
            style={{
              borderRadius: 15,
              marginHorizontal: 10,
              width: '90%',
              marginTop: 10,
              alignSelf: 'center',
              backgroundColor: '#fff',
              borderColor: '#ddd',
              borderWidth: 1
            }}
          >
            <Card.Content style={{ marginBottom: 10 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ width: '100%', }}>
                  <Paragraph style={{ color: '#000' }}>
                    DATE : {el.date}
                  </Paragraph>
                  <Paragraph style={{ color: '#000' }}>
                    DAY : {el.day}
                  </Paragraph>
                  <Paragraph style={{ color: '#000' }}>
                    TIME : {el.start_time}-{el.end_time}
                  </Paragraph>
                  <Paragraph style={{ color: '#000' }}>
                    CONSULTATION TYPE : {el.type}
                  </Paragraph>
                </View>
                <View style={{ flexDirection: 'row', paddingBottom: 70, position: 'absolute', right: 10 }}>
                  <TouchableOpacity
                    onPress={() =>
                      setEditdatetime((data) => ({
                        ...data,
                        [el.id]: !data?.[el.id],
                      }))
                    }
                  >
                    <Image
                      style={{
                        width: 20,
                        height: 22,
                        resizeMode: 'contain',
                        alignItems: 'center',
                      }}
                      source={require('../../Assets/update.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => Choose(el.id)}>
                    <Image
                      style={{
                        width: 20,
                        height: 22,
                        resizeMode: 'contain',
                        marginLeft: 5,
                      }}
                      source={require('../../Assets/delete.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card.Content>
            {/* {console.log('elementid----------------->', el)} */}
            {editdatetime?.[el.id] && (
              <Editdatetime
                error={error}
                setError={setError}
                sucess={success}
                setSuccess={setSuccess}
                id={el.id}
                data={alldata}
                datatype={showType(el.type)}
                onDateChange={(id, date) => {
                  console.log('iddate====>', id, date);
                  setAlldata((prevdata) => {
                    const indexdata = prevdata.indexOf(el);
                    console.log('predata------->', indexdata);
                    const updateddata = [...prevdata];
                    updateddata[indexdata].date = date;
                    return updateddata;
                  });
                }}
                onStarttimeChange={(id, start_time) => {
                  console.log('idstattime====>', id, start_time);
                  setAlldata((prevdata) => {
                    const indexdata = prevdata.indexOf(el);
                    console.log('predata------->', indexdata);
                    const updateddata = [...prevdata];
                    let st1 = new Date(`01/03/2023 ${start_time}`)
                    let et1 = new Date(`01/03/2023 ${updateddata[indexdata].end_time}`)
                    if (st1 >= et1) {
                      console.log('nvalid Time"')
                      Alert.alert("Please enter correct time")
                    } else {
                      console.log('valid Time')
                      updateddata[indexdata].start_time = start_time;
                    }
                    console.log('updateddata====>', updateddata);
                    return updateddata;

                  });
                }}
                onEndtimeChange={(id, end_time) => {
                  console.log('idendtime====>', id, end_time);
                  setAlldata((prevdata) => {
                    const indexdata = prevdata.indexOf(el);
                    const updateddata = [...prevdata];
                    console.log('start and end Time', indexdata, updateddata[indexdata].start_time.split(' '), updateddata[indexdata].end_time);

                    // let st = timeConvert(updateddata[indexdata].start_time)
                    // let et = timeConvert(end_time)

                    let st1 = new Date(`01/03/2023 ${updateddata[indexdata].start_time}`)
                    let et1 = new Date(`01/03/2023 ${end_time}`)

                    console.log("ssssssssssssssssssssss", st1)

                    if (st1 >= et1) {
                      console.log('invalid Time"')
                      Alert.alert("Please enter correct time")
                    } else {
                      console.log('valid Time')
                      updateddata[indexdata].end_time = end_time;

                    }



                    // if(updateddata[indexdata].start_time <)
                    console.log('updateddata====>', updateddata);
                    return updateddata;
                  });
                }}
                onChangeType={(id, type) => {
                  console.warn('++++++++++++Type++++++++++=>', id, type);
                  setAlldata((prevdata) => {
                    const indexdata = prevdata.indexOf(el);
                    console.log('predata------->', indexdata);
                    const updateddata = [...prevdata];
                    updateddata[indexdata].type = type;
                    return updateddata;
                  });
                }}
                onDayChange={(id, day) => {
                  console.log('idday====>', id, day);
                  setAlldata((prevdata) => {
                    const indexdata = prevdata.indexOf(el);
                    console.log('predata------->', indexdata);
                    const updateddata = [...prevdata];
                    updateddata[indexdata].day = day;
                    return updateddata;
                  });
                }}
                onTypeChange={(id, type) => {
                  console.log('typetime====>', id, type);
                  setAlldata((prevdata) => {
                    const indexdata = prevdata.indexOf(el);
                    console.log('predata------->', indexdata);
                    const updateddata = [...prevdata];
                    updateddata[indexdata].type = type;
                    console.log('pppp', updateddata);
                    return updateddata;

                  });
                }}
                onSubmit={() => {
                  setEditdatetime((data) => ({
                    ...data,
                    [el.id]: !data?.[el.id],
                  }));
                  // setTimeout(() => {
                  // props.navigation.navigate('Account')
                  // }, 2500);

                }}
              />
            )}
          </Card>
        ))}
        {/* {alldata.map((el, i) => (
          <Card
            style={{
              borderRadius: 15,
              marginHorizontal: 10,
              width: '84%',
              marginTop: 10,
              alignSelf: 'center',
            }}
          >
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View>
                  <Paragraph>Date:{el.date}</Paragraph>
                  <Paragraph>Day:{el.day}</Paragraph>
                  <Paragraph>
                    Time: {el.start_time}-{el.end_time}
                  </Paragraph>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity>
                    <Image
                      style={{
                        width: 20,
                        height: 22,
                        resizeMode: 'contain',
                        alignItems: 'center',
                      }}
                      source={require('../../Assets/update.png')}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Image
                      style={{
                        width: 20,
                        height: 22,
                        resizeMode: 'contain',
                        marginLeft: 5,
                      }}
                      source={require('../../Assets/delete.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Card.Content>
          </Card>
                    ))}*/}
      </ScrollView>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            paddingVertical: 20,
            marginHorizontal: 20,
            borderRadius: 10,
          }}
        >
          <View>
            <TouchableOpacity onPress={showDate}>
              <TextInput
                // label="Date Of Birth"
                // value={about}
                // onChangeText={text => setAbout(text)}
                mode="outlined"
                value={date}
                outlineColor={'#2173A8'}
                onChangeText={(text) => setDate(text)}
                //change placeholder
                placeholder="mm-dd-yyyy *"
                // change color code
                selectionColor="black"
                showSoftInputOnFocus={false}
                //outlineColor="black"
                activeOutlineColor="black"
                style={{
                  marginHorizontal: '9%',
                  width: '82%',
                  marginTop: 10,
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
            </TouchableOpacity>
            <DateTimePickerModal
              date={selectedDate}
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={handleCon}
              onCancel={hideDate}
              minimumDate={new Date()}

            />
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 20,
                  marginTop: 10,
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                Time Frame
              </Text>
              <TouchableOpacity
                style={{ flexDirection: 'row', width: '100%' }}
                onPress={showDatePicker}
              >
                <TextInput
                  value={starttime}
                  onChangeText={(text) => setStarttime(text)}
                  mode="outlined"
                  label="Start Time*"
                  // placeholder="15:00:00 PM"
                  showSoftInputOnFocus={false}
                  selectionColor="black"
                  outlineColor={'#2173A8'}
                  activeOutlineColor="black"
                  onPressIn={showDatePicker}
                  style={{
                    marginTop: 10,
                    marginHorizontal: '9%',
                    marginBottom: 20,
                    width: '82%',
                    backgroundColor: '#fff',
                  }}
                  keyboardType={'numeric'}
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                  right={
                    <TextInput.Icon
                      icon={require('../../Assets/carbon_time.png')}
                      onPress={showDatePicker}
                      color="#000"
                    />
                  }
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flexDirection: 'row', width: '100%' }}
                onPress={showPicker}
              >
                <TextInput
                  value={endtime}
                  onChangeText={(text) => setEndtime(text)}
                  mode="outlined"
                  label="End Time*"
                  // placeholder="15:00:00 PM"
                  showSoftInputOnFocus={false}
                  selectionColor="black"
                  outlineColor={'#2173A8'}
                  activeOutlineColor="black"
                  onPressIn={showPicker}
                  style={{
                    marginHorizontal: '9%',
                    marginBottom: 20,
                    width: '82%',
                    backgroundColor: '#fff',
                  }}
                  keyboardType={'numeric'}
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                  right={
                    <TextInput.Icon
                      icon={require('../../Assets/carbon_time.png')}
                      onPress={showPicker}
                      color="#000"
                    />
                  }
                />
              </TouchableOpacity>
              {/* <View style={{ marginTop: 10, zIndex: 100 }}>
                <DropDownPicker
                  multiple={true}
                  open={open}
                  value={type}
                  items={items}
                  setOpen={setOpen}
                  setValue={setType}
                  placeholder="Type"
                  setItems={setItems}
                  style={{ backgroundColor: '#fff', borderColor: '#2173A8' }}
                  onSelectItem={(item) => {
                    console.log(item);
                  }}
                  // translation={{
                  //   PLACEHOLDER: "Select an item"
                  // }}
                  //  multipleText={${type.toString}}
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
                    zIndex: 1000, height: 100,
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
                    // selectedItems={selectedItems['multipledays']}
                    selectedItems={selectedtype['items']}
                    onSelectedItemsChange={(item) => {
                      console.log('addd Item', item)
                      onSelectedTypeChange('items', item)
                    }
                    }
                  //styleItemsContainer={{ height: '60%' }}
                  // styleDropdownMenuSubsection={{ height: '40%' }}
                  // styleTextDropdown={{ height: "60%" }}
                  //  styleListContainer={{ height: '20%' }}
                  />
                  {/* {selectedItems['lab']?.some(
                (element) => mapObject(lab)[element] === 'Others'
              ) && (
                <TextInput
                  mode="outlined"
                  label="Add Your HIstory"
                  value={otherlab}
                  onChangeText={(text) => setOtherlab(text)}
                  placeholder=""
                  outlineColor="#fff"
                  style={{
                    borderRadius: 50,
                    elevation: 0,
                  }}
                />
              )} */}
                </Card.Content>
              </Card>
              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
              // minimumDate={new Date()}
              />
              <DateTimePickerModal
                isVisible={isVisible}
                mode="time"
                onConfirm={handle}
                onCancel={hidePicker}
              //minimumDate={new Date()}
              />
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
                  marginBottom: 10,
                  backgroundColor: '#2173A8',
                }}
                activeOpacity={0.7}
              >
                <TouchableOpacity onPress={AddSchedule}>
                  <Text
                    style={{
                      textAlign: 'center',
                      lineHeight: 53,
                      color: '#FFFFFF',
                      fontWeight: '700',
                      fontSize: RFValue(16),
                      fontFamily: 'Rubik',
                      letterSpacing: 0.4,
                    }}
                  >
                    Add New Time Slot
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </Portal>
      {/* <------------------newmodal=================> */}
      <Portal>
        <Modal
          visible={multiplevisible}
          onDismiss={hideMultipleModal}
          contentContainerStyle={{
            backgroundColor: 'white',
            paddingVertical: 20,
            marginHorizontal: 20,
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View>
              <TouchableOpacity onPress={showstartDate}>
                <TextInput
                  keyboardType={'numeric'}
                  label="Start Date*"
                  // label="Date Of Birth"
                  // value={about}
                  // onChangeText={text => setAbout(text)}
                  mode="outlined"
                  value={startdate}
                  onChangeText={(text) => setStartDate(text)}
                  //change placeholder
                  placeholder="mm-dd-yyyy *"
                  // change color code
                  selectionColor="black"
                  outlineColor="black"
                  activeOutlineColor="black"
                  onPressIn={showstartDate}
                  style={{
                    marginHorizontal: '9%',
                    width: '82%',
                    marginTop: 5,
                    backgroundColor: '#fff',
                  }}
                  showSoftInputOnFocus={false}
                  theme={{
                    colors: {
                      text: 'black',
                      placeholder: 'black',
                    },
                  }}
                  right={
                    <TextInput.Icon
                      icon={require('../../Assets/date.png')}
                      onPress={showstartDate}
                      color="#000"
                    />
                  }
                />
              </TouchableOpacity>
              <DateTimePickerModal
                date={selectestartdDate}
                isVisible={startdatePickerVisible}
                mode="date"
                onConfirm={handlestartCon}
                onCancel={hidestartDate}
                minimumDate={new Date()}
              //disabled={new Date()}
              />
            </View>

            <View>
              <TouchableOpacity onPress={showendDate}>
                <TextInput
                  keyboardType={'numeric'}
                  label="End  Date*"
                  // value={about}
                  // onChangeText={text => setAbout(text)}
                  mode="outlined"
                  value={enddate}
                  onChangeText={(text) => setEndDate(text)}
                  //change placeholder
                  placeholder="mm-dd-yyyy *"
                  // change color code
                  selectionColor="black"
                  showSoftInputOnFocus={false}
                  outlineColor="black"
                  activeOutlineColor="black"
                  onPressIn={showendDate}
                  style={{
                    marginHorizontal: '9%',
                    width: '82%',
                    marginTop: 5,
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
                      icon={require('../../Assets/date.png')}
                      onPress={showendDate}
                      color="#000"
                    />
                  }
                />
              </TouchableOpacity>
              <DateTimePickerModal
                date={selecteenddDate}
                isVisible={enddatePickerVisible}
                mode="date"
                showSoftInputOnFocus={false}
                onConfirm={handleendtCon}
                onCancel={hideendDate}
                minimumDate={new Date()}
              />
              <View>
                <Text
                  style={{
                    marginVertical: 5, marginLeft: 20, color: '#333333', fontSize: RFValue(15),
                    fontWeight: 'bold',
                  }}
                >
                  Select Days*
                </Text>
                <Card
                  style={{
                    borderRadius: 15,
                    marginHorizontal: 20,
                    backgroundColor: '#fff',
                    borderColor: '#ddd', borderWidth: 1,
                  }}
                >
                  <Card.Content>
                    <MultiSelect
                      items={multipledays}
                      uniqueKey="id"
                      //  onToggleList={multipledays}
                      // selectedItems={selectedItems['multipledays']}
                      selectedItems={selectedItems['multipledays']}
                      onSelectedItemsChange={(item) => {
                        console.log(item)
                        onSelectedItemsChange('multipledays', item)
                      }
                      }
                    />
                    {/* {selectedItems['lab']?.some(
                (element) => mapObject(lab)[element] === 'Others'
              ) && (
                <TextInput
                  mode="outlined"
                  label="Add Your HIstory"
                  value={otherlab}
                  onChangeText={(text) => setOtherlab(text)}
                  placeholder=""
                  outlineColor="#fff"
                  style={{
                    borderRadius: 50,
                    elevation: 0,
                  }}
                />
              )} */}
                  </Card.Content>
                </Card>
              </View>
            </View>
            {/* <View style={{ marginTop: 10, zIndex: 100 }}>
              <DropDownPicker
                multiple={true}
                open={open}
                value={type}
                items={items}
                setOpen={setOpen}
                setValue={setType}
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
                fontSize: RFValue(15),
                fontWeight: 'bold',
                marginVertical: 5
              }}
            >
              Select Type*
            </Text>
            <Card
              style={{
                borderRadius: 15,
                marginHorizontal: 20,
                backgroundColor: '#fff',
                borderColor: '#ddd', borderWidth: 1
              }}
            >
              <Card.Content>
                <MultiSelect

                  items={items}
                  uniqueKey="id"
                  //  onToggleList={multipledays}
                  // selectedItems={selectedItems['multipledays']}
                  selectedItems={selectedtype['items']}
                  onSelectedItemsChange={(item) => {
                    //console.log('item===', item)
                    onSelectedTypeChange('items', item)
                  }
                  }
                //styleItemsContainer={{ height: '60%' }}
                // styleDropdownMenuSubsection={{ height: '40%' }}
                // styleTextDropdown={{ height: "60%" }}
                //  styleListContainer={{ height: '20%' }}
                />
                {/* {selectedItems['lab']?.some(
                (element) => mapObject(lab)[element] === 'Others'
              ) && (
                <TextInput
                  mode="outlined"
                  label="Add Your HIstory"
                  value={otherlab}
                  onChangeText={(text) => setOtherlab(text)}
                  placeholder=""
                  outlineColor="#fff"
                  style={{
                    borderRadius: 50,
                    elevation: 0,
                  }}
                />
              )} */}
              </Card.Content>
            </Card>
            <View>
              <ScrollView>
                <View
                  style={{
                    flexDirection: 'row',
                    width: '100%',
                    justifyContent: 'space-around',
                    marginHorizontal: 10,
                    backgroundColor: '#fff'
                  }}
                >
                  <Text
                    style={{
                      color: '#333333',
                      // marginLeft: 20,
                      marginTop: 15,
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}
                  >
                    Time Frame
                  </Text>
                  <Button
                    icon="plus-circle"
                    // onPress={showModal}
                    onPress={() =>
                      setMultipletime((prevData) => [...prevData, {}])
                    }
                    contentStyle={{
                      flexDirection: 'row-reverse',
                      marginTop: 5,
                      marginRight: 50,
                      backgroundColor: '#fff'
                    }}
                    color='#000'
                    labelStyle={{ fontSize: 13, }}
                  >
                    Add More
                  </Button>
                </View>
                {multipletime.map((el, i) => (
                  <AddTimeFrame
                    value={el}
                    onStartTimeChange={(time) => {
                      setMultipletime((prevData) => {
                        prevData[i].start_time = time;
                        return prevData;
                      });
                    }}
                    onEndTimeChange={(time) => {
                      setMultipletime((prevData) => {
                        prevData[i].end_time = time;
                        return prevData;
                      });
                    }}
                  />
                ))}
                {/* <View style={{ flexDirection: 'row', width: '100%' }}>
                  <TextInput
                    value={startmultipletime}
                    onChangeText={(text) => setStartMultipletime(text)}
                    mode="outlined"
                    label="Start Time*"
                    // placeholder="15:00:00 PM"
                    selectionColor="black"
                    outlineColor="black"
                    activeOutlineColor="black"
                    style={{
                      marginHorizontal: '9%',
                      marginBottom: 10,
                      width: '82%',
                    }}
                    right={
                      <TextInput.Icon
                        icon={require('../../Assets/carbon_time.png')}
                        onPress={showstarttimePicker}
                      />
                    }
                  />
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                  <TextInput
                    value={endtimemultiple}
                    onChangeText={(text) => setEndtimeMultiple(text)}
                    mode="outlined"
                    label="End Time*"
                    // placeholder="15:00:00 PM"
                    selectionColor="black"
                    outlineColor="black"
                    activeOutlineColor="black"
                    style={{
                      marginHorizontal: '9%',
                      marginBottom: 10,
                      width: '82%',
                    }}
                    right={
                      <TextInput.Icon
                        icon={require('../../Assets/carbon_time.png')}
                        onPress={showendtimePicker}
                      />
                    }
                  />
                </View>
                <DateTimePickerModal
                  isVisible={starttimeVisible}
                  mode="time"
                  onConfirm={handlestarttimeConfirm}
                  onCancel={hidestarttimeDatePicker}
                />
                <DateTimePickerModal
                  isVisible={endtimeVisible}
                  mode="time"
                  onConfirm={handleendtimeConfirm}
                  onCancel={hideendtimeDatePicker}
                /> */}
                {/* {multipletime ? <AddTimeFrame /> : null} */}
                <View
                  style={{
                    marginTop: 5,
                    width: '80%',
                    height: 55,
                    // change BorderColor
                    borderColor: '#fff',
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    marginBottom: 10,
                    backgroundColor: '#2173A8',
                  }}
                  activeOpacity={0.7}
                >
                  <TouchableOpacity onPress={AddMultipleSchedule}>
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
                      Add New Time Slot
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        </Modal>
        <Snackbar
          visible={error.iserror}
          onDismiss={onDismissSnackBar}
          duration={4000}
          style={{
            backgroundColor: error.success ? '#5cb85c' : '#d15656',
            bottom: 0,
            zIndex: 1000,
          }}
        // wrapperStyle={{ position: 'absolute' }}
        >
          {error.message}
        </Snackbar>
        <Snackbar
          visible={success.isSuccess}
          onDismiss={onDismissSnackBar}
          duration={4000}
          style={{
            backgroundColor: '#5cb85c',
            bottom: 0,
            zIndex: 1000,
          }}
        // wrapperStyle={{ position: 'absolute' }}
        >
          {success.message}
        </Snackbar>
      </Portal>
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