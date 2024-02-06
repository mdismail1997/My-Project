import React, { useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Animated,
  Keyboard,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Modal,
  Portal,
  Title,
  Snackbar,
} from 'react-native-paper';
import { Header4, Header6 } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import Symptom from '../../../components/Symptom';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RFValue } from 'react-native-responsive-fontsize';
export const AddHeight = (props) => {
  // React.useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     getdata();
  //     // getpatientdata();
  //     // setUpcoming(true);
  //     // setCompleted(false);
  //   });
  //   return unsubscribe;
  // }, []);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 10,
      duration: 10000,
    }).start();
  }, [fadeAnim]);

  React.useEffect(() => {
    console.log(props.route.params?.userid);
  }, [
    props.route.params?.mail,
    props.route.params?.categoryid,
    props.route.params?.category,
    props.route.params?.userid,
  ]);
  const [loading, setLoding] = React.useState(false);
  const [feet, setFeet] = React.useState('');
  const [inch, setInch] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [selectedValue, setSelectedValue] = React.useState('');
  const [errmsg, setErrMsg] = React.useState();
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = React.useState(false);
  const [date, setDate] = React.useState('');
  const [name, setName] = React.useState('');
  const showDate = () => {
    setDatePickerVisible(true);
  };

  const hideDate = () => {
    setDatePickerVisible(false);
  };
  const handleCon = (picdate) => {
    console.log(chipData[picdate.getDay()]);
    const updateddate = picdate.toISOString();
    console.warn('A date has been picked: ', updateddate);
    setDate(updateddate.split('T')[0]);
    // setSelectedDate(picdate);
    //   setDay(chipData[picdate.getDay()]);
    console.log(date);
    hideDate();
  };
  const handlePress = (event, value) => {
    setSelectedValue(value);
  };
  const chipData = [
    '2010',
    '2009',
    '2008',
    '2007',
    '2006',
    '2005',
    '2004',
    '2003',
    '2002',
    '2001',
    '2000',
    '1999',
    '1998',
    '1997',
    '1996',
    '1995',
    '1994',
    '1993',
    '1992',
    '1991',
    '1990',
    '1989',
    '1988',
    '1987',
    '1986',
    '1985',
    '1984',
    '1983',
    '1982',
    '1981',
    '1980',
    '1979',
    '1978',
    '1977',
    '1976',
    '1975',
    '1974',
    '1973',
    '1972',
    '1971',
    '1970',
    '1969',
    '1968',
    '1967',
    '1966',
    '1965',
    '1964',
    '1963',
    '1962',
    '1961',
    '1960',
  ];

  const validator = () => {
    //console.log('all--------', name, mobno, location, gender, npi, dea);
    let errMsg;
    if (name.trim() === '') {
      errMsg = 'It is not permitted to enter an empty name';
    }
    if (!date || date?.length < 1) {
      errMsg = 'DOB field required';
    }
    if (!name || name?.length < 1) {
      errMsg = 'Name field required';
    }
    if (!weight || weight?.length < 1) {
      errMsg = 'Weight field required';
    }
    if (!inch || inch?.length < 1) {
      errMsg = 'Inch field required';
    }
    if (!feet || feet?.length < 1) {
      errMsg = 'Feet field required';
    }
    // if (!birthyear || location?.length < 1) {
    //   errMsg = 'BirthYear field required';
    // }

    return errMsg;
  };
  // const [loading, setLoding] = React.useState(false);
  // const [name, setName] = React.useState('');
  // const [alldata, setAllData] = React.useState([]);
  // const [index, setIndex] = React.useState(false);
  // const getdata = async () => {
  //   let usertoken = await AsyncStorage.getItem('authtoken');
  //   const userid = await AsyncStorage.getItem('userid');
  //   const user_id = JSON.parse(userid);
  //   let token = usertoken;
  //   console.log('user id =====>>>>', user_id);
  //   console.log('token123=', token);
  //   setLoding(true);
  //   await Apis.patientcategory()

  //     .then((response) => {
  //       console.warn(response.data);
  //       setAllData(response.data.response);
  //       setLoding(false);
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //       setLoding(false);
  //     });
  // };
  // const getpatientdata = async () => {
  //   let usertoken = await AsyncStorage.getItem('authtoken');
  //   const userid = await AsyncStorage.getItem('userid');
  //   const user_id = JSON.parse(userid);
  //   let token = usertoken;
  //   console.log('user id =====>>>>', user_id);
  //   console.log('token123=', token);
  //   const data = {
  //     user_id: user_id,
  //   };

  //   setLoding(true);
  //   await Apis.profileData(data)

  //     .then((response) => {
  //       console.warn(response.data);
  //       setLoding(false);
  //       setName(response.data.response.name);
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //       setLoding(false);
  //     });
  // };
  const getquickdata = async () => {
    const data = {
      email: props.route.params?.mail,
    };
    setLoding(true);
    await Apis.showquickvisitdata(data)
      .then((response) => {
        console.warn(response.data);
        console.log('lll', response.data);
        // setAllData(response.data.response);
        setInch(response.data.response.inch),
          setFeet(response.data.response.feet),
          setWeight(response.data.response.weight.toString()),
          setSelectedValue(response.data.response.name);
        setName(response.data.response.name);
        setDate(response.data.response.dob);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  console.log(weight);
  useEffect(() => {
    getquickdata();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', bottom: 0 }}>
      <Header4 title="Quick Visit" navProps={props.navigation} />
      <Snackbar
        visible={errmsg !== undefined}
        onDismiss={() => {
          setErrMsg(undefined);
        }}
        style={{ backgroundColor: '#d15656', zIndex: 10 }}
      >
        {errmsg}
      </Snackbar>
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
        style={{ marginBottom: 20, backgroundColor: '#fff', bottom: 0 }}
      >
        <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15, color: '#000' }}>
            Hello {''}
            <Text style={{ color: '#2173A8' }}>
              {props.route.params?.mail}
            </Text>{' '}
            welcome. Chat for your appointment. Select from following
          </Text>
        </View>

        <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15, color: '#000' }}>
            Your <Text style={{ color: '#2173A8' }}>gender</Text> is
          </Text>
        </View>
        <View
          style={{
            width: '35%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            {props.route.params?.category}
          </Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ marginLeft: 35, color: '#000', marginTop: 15, fontSize: RFValue(14) }}>
            Height
          </Text>
          <Animated.View
            style={[
              styles.fadingContainer,
              {
                // Bind opacity to animated value
                opacity: fadeAnim,
              },
            ]}
          >
            {/* <Text style={{ padding: 15 }}>
            Helo {''}
            <Text style={{ color: '#2173A8' }}>
              {props.route.params?.message}
            </Text>{' '}
            Welcome .
          </Text> */}
            <Image
              style={{ width: 45, height: 45, marginLeft: 20, marginTop: -5 }}
              source={{
                uri: 'https://editablegifs.com/gifs/gifs/thinking-emoji/output.gif?egv=3181',
              }}
            />
          </Animated.View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 30,
            justifyContent: 'space-between',
          }}
        >
          <TextInput
            label="Enter Feet "
            placeholder="Enter Feet"
            value={feet}
            maxLength={2}
            onChangeText={(text) => setFeet(text)}
            mode="outlined"
            keyboardType="phone-pad"
            style={{
              marginBottom: 10,
              width: '45%',
              marginTop: 10,
              // height: 60,
              // borderRadius: 10,
              backgroundColor: '#fff',
              fontSize: RFValue(15),
            }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            right={
              <TextInput.Affix
                text="Ft."
                textStyle={{ color: '#000', marginTop: 3 }}
              />
            }
          />
          <TextInput
            label="Enter Inch "
            placeholder="Enter Inch"
            value={inch}
            onChangeText={(text) => setInch(text)}
            maxLength={2}
            mode="outlined"
            keyboardType="phone-pad"
            style={{
              marginBottom: 10,
              width: '45%',
              marginTop: 10,
              // height: 50,
              // borderRadius: 10,
              backgroundColor: '#fff',
              fontSize: RFValue(15),
            }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            right={
              <TextInput.Affix
                text="inch"
                textStyle={{ color: '#000', marginTop: 3 }}
              />
            }
          />
        </View>
        <View>
          <TextInput
            label="Enter Your Weight"
            placeholder="Enter Weight"
            value={weight}
            onChangeText={(text) => setWeight(text)}
            mode="outlined"
            keyboardType="number-pad"
            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              width: '85%',
              // height: 50,
              // borderRadius: 10,
              backgroundColor: '#fff',
              fontSize: RFValue(15),
            }}
            maxLength={3}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            right={<TextInput.Affix text="Lbs" textStyle={{ color: '#000' }} />}
          />
        </View>
        <View>
          <TextInput
            label="Enter Your Name"
            placeholder="Enter  Name"
            value={name}
            onChangeText={(text) => setName(text)}
            mode="outlined"
            keyboardType={'ascii-capable'}
            // keyboardType="number-pad"

            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              width: '85%',
              fontSize: RFValue(15),
              // height: 50,
              // borderRadius: 10,
              backgroundColor: '#fff',
            }}
            maxLength={30}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
          />
        </View>
        <View>
          <TextInput
            label="Date Of Birth"
            mode="outlined"
            value={date}
            onChangeText={(text) => setDate(text)}
            //  placeholder="mm-dd-yyyy"
            outlineColor="black"
            style={{
              marginHorizontal: '9%',
              width: '85%',
              marginTop: 5,
              backgroundColor: '#fff',
              fontSize: RFValue(15),
            }}
            editable={false}
            //  showSoftInputOnFocus={false}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            right={
              <TextInput.Icon
                icon={require('../../../Assets/date.png')}
                onPress={() => {
                  console.log(datePickerVisible), showDate();
                }}
                color="#000"
              />
            }
          />
        </View>
        <DateTimePickerModal
          date={selectedDate}
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleCon}
          onCancel={hideDate}
          maximumDate={new Date()}
        />

        {/* <Title style={{ marginLeft: 30 }}>Select Your Birth Year</Title>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.app}
            // onPress={() => props.navigation.navigate('Chatting')}
          >
            {chipData.map((el, i) => (
              <Symptom
                key={i}
                title={el}
                value={el}
                onPress={handlePress}
                selected={selectedValue}
              />
            ))}
          </TouchableOpacity>
        </ScrollView> */}
        <View
          // key={el.id}
          style={{
            // alignSelf: 'center',
            //  justifyContent: 'center',
            paddingTop: 30,
            marginBottom: 30,
            marginHorizontal: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const err = validator();
              console.log('err-----', err);
              if (!err) {
                props.navigation.navigate('ShowHeight', {
                  categoryid: props.route.params?.categoryid,
                  inch: inch,
                  feet: feet,
                  weight: weight,
                  category: props.route.params?.category,
                  birthyear: selectedValue,
                  userid: props.route.params?.userid,
                  mail: props.route.params?.mail,

                  name: name,
                  dob: date,
                });
              } else {
                setErrMsg(err);
              }
            }}
            style={styles.unselect}
          >
            <Text style={styles.textunselect}>Submit</Text>
          </TouchableOpacity>
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            bottom: 0,
          }}
        >
          {alldata.map((el, i) => (
            <View
              key={el.id}
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'center',
                paddingTop: 30,
                marginBottom: 30,
                marginRight: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setIndex([i]);
                  console.log('=====>', index);
                  props.navigation.navigate('BodyParts', {
                    categoryid: el.id,
                  });
                }}
                style={index === i ? styles.select : styles.unselect}
              >
                <Text
                  style={index === i ? styles.textselect : styles.textunselect}
                >
                  {el.cat}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  select: {
    elevation: 15,
    borderRadius: 10,
    backgroundColor: '#146BCE',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  unselect: {
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#146BCE',
    paddingHorizontal: 20,
    paddingTop: 15,
    height: 50,
  },
  textselect: { fontSize: 15, color: '#fff', marginBottom: 10 },
  textunselect: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  app: {
    marginHorizontal: 15,
    marginRight: 40,
    maxWidth: 770,
    width: 4080,
    flexDirection: 'row',
    marginTop: 10,
  },
});
