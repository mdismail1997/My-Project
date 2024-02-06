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
  Title,
} from 'react-native-paper';
import { Header4, Header6 } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
export const ShowHeight = (props) => {
  // React.useEffect(() => {
  //   const unsubscribe = props.navigation.addListener('focus', () => {
  //     getdata();
  //     // getpatientdata();
  //     // setUpcoming(true);
  //     // setCompleted(false);
  //   });
  //   return unsubscribe;
  // }, []);
  React.useEffect(() => {
    console.log('===>', props.route.params?.name);
  }, [
    props.route.params.mail,
    props.route.params.categoryid,
    props.route.params.category,
    props.route.params.inch,
    props.route.params.weight,
    props.route.params.feet,
    props.route.params?.birthyear,
    props.route.params?.userid,
    props.route.params?.name,
    props.route.params?.dob,
  ]);
  const [feet, setFeet] = React.useState('');
  const [inch, setInch] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [loading, setLoding] = React.useState(false);
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
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', bottom: 0 }}>
      <Header4 title="Quick Visit" navProps={props.navigation} />
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
              {props.route.params?.name}
            </Text>{' '}
            welcome. Chat for your appointment.
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
            Your <Text style={{ color: '#2173A8' }}>name</Text> is
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
            {props.route.params?.name}
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
            Your <Text style={{ color: '#2173A8' }}>height</Text> is
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
            {props.route.params?.feet}'{props.route.params?.inch}
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
            Your <Text style={{ color: '#2173A8' }}>weight</Text> is
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
            {props.route.params?.weight}
          </Text>
        </View>
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
              //  setIndex([i]);
              //console.log('=====>', index);
              props.navigation.navigate('AddDetails', {
                categoryid: props.route.params?.categoryid,
                userid: props.route.params?.userid,
                inch: props.route.params.inch,
                feet: props.route.params?.feet,
                weight: props.route.params?.weight,
                birthyear: props.route.params?.birthyear,
                category: props.route.params?.category,
                mail: props.route.params?.mail,
                name: props.route.params?.name,
                dob: props.route.params?.dob,
              });
            }}
            style={styles.unselect}
          >
            <Text style={styles.textunselect}>Next</Text>
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
});
