import React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Modal,
  Portal,
  Checkbox,
  Snackbar,
} from 'react-native-paper';
import { Header } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';

export const PatientChngMed = (props) => {
  const [checked, setChecked] = React.useState([]);
  const [alldata, setAllData] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [err, setErr] = React.useState({ iserr: false, message: '' });
  const getmedicine = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      prs_id: props.route.params?.pres_id,
    };
    console.log('data------', data);
    setLoding(true);
    await Apis.prescriptionmedicine(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setAllData(response.data.medicines);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  React.useEffect(() => {
    getmedicine();
  }, [props.route.params?.pres_id, props.route.params?.book_id]);
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setErr((data) => ({ ...data, iserr: false, message: '' }));
  };
  const Medicinechnage = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      med_id: checked.toString(),
      booking_id: props.route.params?.book_id,
    };
    console.log('data------', data);
    setLoding(true);
    await Apis.chnagemedicine(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setErr((data) => ({
          ...data,
          iserr: true,
          message: 'Medicine Change Request Send Successfully',
        }));
        setTimeout(() => {
          props.navigation.navigate('PatientTabNavigator');
        }, 2500);

      })
      .catch((error) => {
        console.error(error.response.data.errors);
        if (
          error.response.data.errors.med_id[0] ===
          'Medicine field is required'
        ) {
          setError((data) => ({
            ...data,
            iserror: true,
            message: 'Select Any Medicine',
          }));
        }
        setLoding(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Request Change of Medicine" navProps={props.navigation} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656', zIndex: 100 }}
      >
        {error.message}
      </Snackbar>
      <Snackbar
        visible={err.iserr}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: 'green', zIndex: 100 }}
      >
        {err.message}
      </Snackbar>
      <ScrollView style={{ marginBottom: 20, backgroundColor: '#fff' }}>
        {/* <FlatList
          data={data}
          renderItem={renderdata}
          keyExtractor={(item, index) => item.id}
        /> */}
        {/* {alldata.length < 1 && <Text>ssss</Text>} */}
        {alldata.map((el, i) => (
          <View style={styles.view} key={el.id}>
            <View style={{ flexDirection: 'row', alignItem: 'center' }}>
              <Text
                style={{
                  color: '#000',
                  marginLeft: 20,
                  fontSize: 15,
                  alignSelf: 'center',
                }}
              >
                {el.medicine}
              </Text>
              <Text
                style={{
                  color: '#737373',
                  fontSize: 10,
                  alignSelf: 'center',
                  marginLeft: 10,
                }}
              >
                {el.course} course
              </Text>
            </View>
            <Pressable style={{ justifyContent: 'center' }} onPress={() => { }}>
              {/* <View style={{height:34,width:33,borderColor:'#000',borderWidth:1.5, }}> */}
              <Checkbox
                status={checked?.includes(el.id) ? 'checked' : 'unchecked'}
                onPress={() => {
                  if (checked?.includes(el.id)) {
                    setChecked((prevdata) =>
                      prevdata.filter((ele) => ele !== el.id)
                    );
                  } else {
                    setChecked((prevdata) => [
                      ...new Set([...prevdata, el.id]),
                    ]);
                  }
                }}
                uncheckedColor="black"
              />
              {/* </View> */}
            </Pressable>
          </View>
        ))}
        {/* <View style={{ marginHorizontal: 30, marginTop: 10, height: 100 }}>
          <TextInput
            mode="outlined"
            label="Request change of Medicine?*"
            placeholder="Tell people about your Experience"
            style={{ marginBottom: 10, height: 100 }}
            multiline={true}
          />
        </View> */}
        <View style={{ marginHorizontal: 30, marginTop: 20, borderRadius: 10 }}>
          <Button
            mode="contained"
            color="#2173A8"
            uppercase={false}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 18 }}
            onPress={Medicinechnage}
          >
            Send Request
          </Button>
        </View>
      </ScrollView>
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
    alignItem: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    elevation: 5,
    height: 50,
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  img: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
  },
  text: {
    marginTop: 10,
    color: '333333',
    fontSize: 20,
    marginRight: 40,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
  modaltext: {
    marginTop: 25,
    color: '#333333',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: 15,
  },
});
