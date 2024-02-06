import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, Image } from 'react-native';
import {
  Text,
  TextInput,
  Card,
  Paragraph,
  Button,
  Title,
  Snackbar, Checkbox
} from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIntl } from 'react-intl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../screens/Services/apis';
import MultiSelect from '../React-Native-Multi-Select';
import { SuccessfullySubmitModal } from '../Popupmessage';
import DropDownPicker from 'react-native-dropdown-picker';
import { RFValue } from 'react-native-responsive-fontsize';
export const EditPrescription = ({
  id,
  data,
  onMedicineChange,
  onCourseChange,
  onRouteChange,
  onDoseChange,
  onFrequencyChange,
  onCommentChange,
  onDoseTypeChange,
  onSubmit,
  onrefillChange,
  onSubChange,
}) => {
  const [loading, setLoding] = useState(false);
  const [route, setRoute] = useState();
  const [selectroute, setSelectRoute] = useState();
  const [medicine, setMedicine] = useState();
  const [selectmedicine, setSelectMedicine] = useState('');
  const [course, setCourse] = useState('');
  const [routeid, setRouteid] = useState([]);
  const [does, setDoes] = useState('');
  const [frequency, setFrequency] = useState('');
  const [brief, setBrief] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [isModalVisible, SetIsModalVisible] = useState(false);
  const [scheduledata, setScheduledata] = useState({});
  const [modalmessage, SetModalmessage] = useState();
  const [refills, setRefills] = useState(0);
  const [items, setItems] = useState([
    { label: 'ML', value: 'ML' },
    { label: 'MG', value: 'MG' },
  ]);
  const [value, setValue] = useState('');
  const [refillsitems, setrefillsItems] = useState([
    { label: 0, value: 0 },
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ]);
  const [frequencyitems, setfrequencyItems] = useState([
    { label: 'One time a day', value: 'One time a day' },
    { label: 'Two times a day', value: 'Two times a day' },
    { label: 'Three times a day', value: 'Three times a day' },
    { label: 'Four times a day', value: 'Four times a day' },
    { label: 'Five times a day', value: 'Five times a day' },
    // { label: '5', value: '5' },
  ]);
  const [frequencyopen, setFrequencyOpen] = useState(false);
  const [refillsopen, setRefillsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [checked, setChecked] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const [subvalue, setSubValue] = React.useState();
  const [oralvalue, setOralValue] = React.useState();
  useEffect(() => {
    const savedata = data.reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {});
    setScheduledata(savedata);
    // setSubValue()

    setSubValue(savedata[id].sub);
    setOralValue(savedata[id].route_id)
    console.log("savedata==", savedata, oralvalue)
  }, [data]);
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  const UpdateSchedule = async (values) => {
    try {
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);

      console.log('user id =====>>>>', user_id);
      const Scheduledate = data.filter((el) => el.id === id);
      console.log('Scheduledate=----', Scheduledate);
      setLoding(true);
      const response = await Apis.medicineupdate(Scheduledate[0]);
      console.warn(response.data);
      setLoding(false);
      if (response.data.success === '1') {
        SetModalmessage(response.data.message);
        SetIsModalVisible(true);
      } else {
      }
    } catch (err) {
      console.error(err.response.data);
      if (
        !scheduledata[id]?.medicine ||
        scheduledata[id]?.medicine.length < 1
      ) {
        setError((data) => ({
          ...data,
          iserror: true,
          message: err.response.data.errors.medicine,
        }));
      }
      if (!scheduledata[id]?.course || scheduledata[id]?.course.length < 1) {
        setError((data) => ({
          ...data,
          iserror: true,
          message: err.response.data.errors.course,
        }));
      }
      // setError((dat) => ({
      //   ...dat,
      //   iserror: true,
      //   message: err.response.data.errors,
      // }));
      setLoding(false);
    }
    onSubmit?.();
  };

  useEffect(() => {
    getmedicine();
    getRoute();
  }, []);
  const getmedicine = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getmedication(token)

      .then((response) => {
        console.log('medication======>', response.data.response);
        // const med = response.data.response.reduce(
        //   (acc, cur) => ({ ...acc, [cur.id]: cur.name }),
        //   {}
        // );
        // setmedValue(med);
        setMedicine(response.data.response);
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  const getRoute = async () => {
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
    await Apis.getroute(data)

      .then((response) => {
        console.warn(response.data);

        setRoute(response.data.response);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const handleKeyPress = (event) => {
    const number = parseInt(event.nativeEvent.key);
    if (number >= 1 && number <= 9) {
      const newMessage = getNumberMessage(number);
      setFrequency(newMessage);
    }
  }

  const getNumberMessage = (number) => {
    switch (number) {
      case 1:
        return 'One time a day';
      case 2:
        return 'Two times a day';
      // Add cases for numbers 3 to 9 with their respective text values
      case 3:
        return 'Three times a day';
      // ... Repeat for numbers 4 to 9
      case 4:
        return 'Four times a day';
      case 5:
        return 'Five times a day';
      case 6:
        return 'Six times a day';
      case 7:
        return 'Seven times a day';
      case 8:
        return 'Eight times a day';
      case 9:
        return 'Nine times a day';
      default:
        return '';
    }
  };
  const handleClose = () => {
    SetIsModalVisible(false);
  };
  //   const handleSubChange=()=>{
  //     setChecked(!checked)
  //   checked ?
  //  setSubValue (0): 
  //  setSubValue (1)
  //  onSubChange(id, subvalue)
  //  console.log('subvalue',subvalue)
  //  console.log('check',checked,)
  //    // setScheduledata(scheduledata[id]?.sub===0)
  //   }
  //  const SubValue =(scheduledata[id]?.sub) 
  return (
    <SafeAreaView>
      <ScrollView>
        <Snackbar
          visible={error.iserror}
          onDismiss={onDismissSnackBar}
          style={{
            backgroundColor: 'red',
          }}
        >
          {error.message}
        </Snackbar>
        <View>
          <Title
            style={{
              color: '#333333',
              marginLeft: 20,
              // marginTop: 20,
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            Medicine
          </Title>

          <View style={{ marginHorizontal: 20 }}>
            <Card
              style={{
                borderRadius: 15,
                // marginLeft: 5,
                width: '100%',
                marginTop: 5,
                zIndex: -2,
                borderColor: '#2173A8',
                borderWidth: 0.5,
                backgroundColor: '#fff',
              }}
            >
              <Card.Content>
                <MultiSelect
                  items={medicine}
                  uniqueKey="name"
                  // onToggleList={getSkill}
                  //  selectedItems={selectmedicine}
                  //  ={selectmedicine}
                  onSelectedItemsChange={(item) => onMedicineChange(id, item)}
                  selectedItems={scheduledata[id]?.medicine}
                  selectText={scheduledata[id]?.medicine}
                  // onChangeText={(text) => onMedicineChange(id, text)}
                  single
                />
              </Card.Content>
            </Card>
            {/* </View> */}
            <View
              style={{
                marginTop: 20,
                borderRadius: 15,
                height: 40,
                width: '95%',
                justifyContent: 'space-between',
                marginLeft: 5,
                backgroundColor: '#fff',
              }}
            >
              <TextInput
                mode="outlined"
                label="Duration*"
                value={scheduledata[id]?.course}
                onChangeText={(text) => onCourseChange(id, text)}
                right={
                  <TextInput.Affix text="days" textStyle={{ color: '#000' }} />
                }
                keyboardType="number-pad"
                style={{ backgroundColor: '#fff' }}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
              />
            </View>
          </View>
          <View
            style={{ flexDirection: 'row', marginHorizontal: 25, width: '85%', marginTop: 35 }}
          >
            <View style={{ flexDirection: 'row', width: '50%' }}>
              <Title
                style={{
                  color: '#333333',
                  marginLeft: 10,
                  marginTop: 20,
                  fontSize: RFValue(15),
                  fontWeight: 'bold',
                }}
              >
                Substitute
              </Title>
              {/* </View> */}
              <View
                style={{
                  marginTop: 18,
                  borderRadius: 5,
                  marginLeft: 20,
                  backgroundColor: '#fff',
                  borderColor: '#000',
                  borderWidth: 2,
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignContent: 'center'
                }}
              >
                <View
                  style={{
                    //   width: '55%',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    // marginTop: 10
                  }}
                >
                  <Checkbox

                    status={checked || subvalue === 1 ? 'checked' : 'unchecked'}
                    onPress={() => {
                      //console.log(subvalue);
                      //  handleSubChange()
                      setChecked(!checked)
                      //   checked ?
                      //  setSubValue (scheduledata[id]?.sub===1): 
                      //  setSubValue (scheduledata[id]?.sub===0)
                      onSubChange(id, checked ? 0 : 1)
                      console.log('subvalue', subvalue)
                      console.log('check', checked,)
                      // setChecked(!checked);
                    }}
                    on
                    style={{ marginLeft: 30 }}
                    //    checkborder='#fff'
                    // color="red"
                    uncheckedColor="#fff"
                  />
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', width: '50%', marginLeft: 20 }}>
              <Title
                style={{
                  color: '#333333',
                  marginLeft: 10,
                  marginTop: 20,
                  fontSize: RFValue(15),
                  fontWeight: 'bold',
                }}
              >
                Oral
              </Title>
              {/* </View> */}
              <View
                style={{
                  marginTop: 18,
                  borderRadius: 5,
                  marginLeft: 20,
                  backgroundColor: '#fff',
                  borderColor: '#000',
                  borderWidth: 2,
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignContent: 'center'
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                  }}
                >
                  <Checkbox
                    status={check || scheduledata[id]?.route_name === "Oral" ? 'checked' : 'unchecked'}
                    onPress={() => {
                      console.log(check);
                      setCheck(!check);
                      onRouteChange(id, check ? "Intra-muscular" : ["Oral"])
                      console.log('ccheck', check)
                      console.log(oralvalue)
                    }}
                    style={{ marginLeft: 30 }}
                    //    checkborder='#fff'
                    // color="red"
                    uncheckedColor="#fff"
                  />
                </View>
              </View>
            </View>
          </View>
          {scheduledata[id]?.route_name === "Oral" || check === true ? null :
            <><Title
              style={{
                color: '#333333',
                marginLeft: 20,
                marginTop: 20,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Route
            </Title><Card
              style={{
                borderRadius: 15,
                marginHorizontal: 10,
                width: '84%',
                alignSelf: 'center',
                marginTop: 5,
                backgroundColor: '#fff',
              }}
            >
                <Card.Content>
                  <MultiSelect
                    items={route}
                    uniqueKey="name"
                    // onToggleList={getSkill}
                    onSelectedItemsChange={(item) => onRouteChange(id, item)}
                    selectedItems={scheduledata[id]?.route_name}
                    selectText={scheduledata[id]?.route_name}
                    single />
                </Card.Content>
              </Card></>
          }
          {/* <View style={{ marginHorizontal: 30, marginTop: 20 }}>
          <TextInput
            mode="outlined"
            label="dose (Ml/MG)*"
            placeholder=""
           
          />
        </View> */}


          {/* 
          <View style={{ marginHorizontal: 30, marginTop: 20 }}>
          
          </View> */}
          <View
            style={{
              // marginTop: 20,
              flexDirection: 'row',
              marginHorizontal: 30,
              zIndex: 100
              // justifyContent: 'center',
              // borderWidth: 1,
              // borderColor: 'red',
              // backgroundColor: '#dbdbdb',
              // borderRadius: 5,
            }}
          >
            {/* <TextInput
              mode="outlined"
              label="Frequency*"
              placeholder=""
              style={{
                width: '58%',
                backgroundColor: '#fff',
                marginTop: 13,
                height: 50,
                zIndex: -2,
              }}
              //   maxLength={3}
              value={scheduledata[id]?.frequency.toString()}
              onChangeText={(text) => onFrequencyChange(id, text)}
              // onKeyPress={handleKeyPress}
              keyboardType="numeric"
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
            /> */}
            <DropDownPicker
              dropDownDirection='Bottom'
              open={frequencyopen}
              value={scheduledata[id]?.frequency}
              // value={gender}
              items={frequencyitems}
              setOpen={setFrequencyOpen}
              //   setValue={setValue}
              placeholder="Frequency*"
              // setItems={setItems}
              // onChangeValue={(item) => {
              //   onDoseTypeChange(id, item);
              // }}
              onSelectItem={(item) => {
                console.log(item.value);
                onFrequencyChange(id, item.value);
              }}
              // style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
              labelStyle={{
                width: '37%',
                //height: 50,
                textAlign: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}
              containerStyle={{
                //marginHorizontal: 5,
                // marginBottom: 10,
                marginTop: 20,
                width: '57%',
                // zIndex: 5,
                // marginLeft: 20,
                backgroundColor: 'grey',
              }}
            //   zIndex={5}
            />

            <DropDownPicker
              dropDownDirection='Bottom'
              open={refillsopen}
              value={scheduledata[id]?.refil}

              items={refillsitems}
              setOpen={setRefillsOpen}

              // onChangeValue={(item) => {
              //   onrefillChange(id, item);
              // }}

              onSelectItem={(item) => {
                console.log(item.value);
                onrefillChange(id, item.value);
              }}
              placeholder='ssss'
              setItems={setrefillsItems}
              // style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
              labelStyle={{
                width: '37%',
                //height: 50,
                textAlign: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}
              containerStyle={{
                //marginHorizontal: 5,
                // marginBottom: 10,
                marginTop: 20,
                width: '35%',
                // zIndex: 5,
                marginLeft: 20,
                backgroundColor: 'grey',
              }}
            //   zIndex={5}
            />

          </View>
          <View
            style={{
              // marginTop: 20,
              flexDirection: 'row',
              marginHorizontal: 30,
              // zIndex: 100
              // justifyContent: 'center',
              // borderWidth: 1,
              // borderColor: 'red',
              // backgroundColor: '#dbdbdb',
              // borderRadius: 5,
            }}
          >
            <TextInput
              mode="outlined"
              label="Dose*"
              placeholder=""
              maxLength={3}
              value={scheduledata[id]?.dose.toString()}
              onChangeText={(text) => onDoseChange(id, text)}
              // right={<TextInput.Icon icon="eye" onPress={showDate} />}
              keyboardType="number-pad"
              style={{
                width: '58%',
                backgroundColor: '#fff',
                marginTop: 13,
                zIndex: -2,
              }}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
            />
            <View style={{ width: '100%', zIndex: 100 }}>
              <DropDownPicker
                dropDownDirection='Bottom'
                open={open}
                value={scheduledata[id]?.dose_type}
                // value={gender}
                items={items}
                setOpen={setOpen}
                //   setValue={setValue}
                placeholder="Type"
                // setItems={setItems}
                // onChangeValue={(item) => {
                //   onDoseTypeChange(id, item);
                // }}
                onSelectItem={(item) => {
                  console.log(item.value);
                  onDoseTypeChange(id, item.value);
                }}
                // style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
                labelStyle={{
                  width: '37%',
                  //height: 50,
                  textAlign: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                }}
                containerStyle={{
                  //marginHorizontal: 5,
                  // marginBottom: 10,
                  marginTop: 20,
                  width: '35%',
                  // zIndex: 5,
                  marginLeft: 20,
                  backgroundColor: 'grey',
                }}
                zIndex={5}
              />
            </View>
          </View>
          {/* <View style={{ marginHorizontal: 30, marginTop: 20, height: 50 }}>
            <TextInput
              mode="outlined"
              label="Refill *"
              placeholder=""
              style={{ marginBottom: 10, height: 80, backgroundColor: '#fff' }}
              multiline={true}
              value={scheduledata[id]?.refill}
              onChangeText={(text) => onCommentChange(id, text)}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
            />
          </View> */}
          {/*
        <View
          style={{
            marginHorizontal: 30,
            marginTop: 70,
            borderRadius: 5,
            borderColor: '#2173A8',
            borderWidth: 1,
          }}
        >
          <Button
            mode="contained"
            color="#fff"
            uppercase={false}
            onPress={() => console.log('Pressed')}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#2173A8', fontSize: 18 }}
          >
            Add Medicine
          </Button>
        </View>*/}
          <View
            style={{
              marginHorizontal: 30,
              marginTop: 60,
              borderRadius: 10,
              marginBottom: 20,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              contentStyle={{ height: 50 }}
              labelStyle={{ color: '#fff', fontSize: 18 }}
              onPress={UpdateSchedule}
            >
              Update
            </Button>
          </View>

          <SuccessfullySubmitModal
            isModalVisible={isModalVisible}
            onClose={handleClose}
            style={{}}
            message={modalmessage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

