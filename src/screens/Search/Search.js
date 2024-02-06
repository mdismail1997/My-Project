import React, { useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Text, TextInput, Button, Searchbar } from 'react-native-paper';
import { Header2, Header3 } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
export const SearchScreen = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchdoctor, setSearchDoctor] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const [unseencount, SetUnseenCount] = React.useState();
  const onChangeSearch = (query) => {
    setSearchQuery(query);

    const data = {
      keyword: query,
    };
    console.log('ddddaaa==', data);
    setLoding(true);
    Apis.patientsearch(data)
      .then((response) => {
        console.warn('responsedata=================>', response.data);
        // if (response.data.success === '0') {
        //   setError((data) => ({
        //     ...data,
        //     iserror: true,
        //     message: response.data.message,
        //   }
        //   ));

        // }
        setSearchDoctor(response.data.response ?? []);
        //  SetImage(response.data.response.profile_image);
        // if (query === '') {
        //   setSearchDoctor([]);
        // }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  useEffect(() => {
    onChangeSearch();
    getunseennotification();
  }, []);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      onChangeSearch();
      getunseennotification();
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, []);
  const getunseennotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      doctor_id: user_id,
    };

    setLoding(true);
    await Apis.doctorunseenNotification(data)

      .then((response) => {
        console.log('unseencount', response.data);
        setLoding(false);
        SetUnseenCount(response.data.response);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };


  const renderdata = ({ item, index }) => {
    return (
      <View style={styles.uncheckborder}>
        <Image style={styles.imgtick} source={item.img} />

        <Text
          style={{
            color: '#333333',
            marginLeft: 100,
            marginTop: 20,
            position: 'absolute',
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            color: '#333333',
            marginLeft: 100,
            marginTop: 50,
            fontSize: 10,
          }}
        >
          {item.description}
        </Text>

        <View>
          <Image
            style={{
              width: 40,
              height: 42,
              resizeMode: 'contain',
              alignSelf: 'flex-end',
              marginTop: -67,
              marginRight: 20,
            }}
            source={item.image}
          />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header3
        title="Search Patient"
        navProps={props.navigation}
        unseencount={unseencount?.toString()}
      />
      <Searchbar
        style={{
          maxHeight: 50,
          width: '90%',
          backgroundColor: '#fff',
          borderRadius: 10,
          marginTop: 20,
          alignSelf: 'center',
        }}
        placeholder="Search"
        placeholderTextColor='#000'
        inputStyle={{ color: '#000' }}
        iconColor="#000"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
      {/* 
      <View
        style={{
          alignSelf: 'flex-end',
          marginTop: -50,
          width: 40,
          height: 40,
          borderRadius: 10,
          marginRight: 10,
          backgroundColor: '#fff',
        }}
      >
        <Image
          style={styles.imgtick2}
          source={require('../../Assets/line.png')}
        />
      </View> */}
      {/* <Text
        style={{
          marginTop: 20,
          marginLeft: 25,
          fontSize: 15,
          color: '#333333',
          fontWeight: 'bold',
        }}
      >
        We found only 3 Patients
      </Text> */}
      {/* <FlatList
        style={{ marginBottom: 20 }}
        data={data}
        renderItem={renderdata}
        keyExtractor={(item, index) => item.id}
      /> */}
      <ScrollView contentContainerStyle={{ marginTop: 10 }}>
        {searchdoctor.map((el, i) => (
          <TouchableOpacity
            style={styles.uncheckborder}
            onPress={() => {
              console.log(el.id)
              props.navigation.navigate('PatientInformation', {
                userid: el.id,
              })
            }
            }
          >
            <Image style={styles.imgtick} source={{ uri: el.profile_image }} />

            <Text
              style={{
                color: '#333333',
                marginLeft: 100,
                marginTop: 5,
                //   position: 'absolute',
                fontSize: 15,
                fontWeight: 'bold',
                width: '50%'
              }}
            >
              {el.name}
            </Text>
            <Text
              style={{
                color: '#333333',
                marginLeft: 100,
                marginTop: 5,
                fontSize: 12,
              }}
            >
              Height : {el.height}
            </Text>
            <Text
              style={{
                color: '#333333',
                marginLeft: 100,
                marginTop: 5,
                fontSize: 12,
              }}
            >
              Weight : {el.weight}
            </Text>
            <Text
              style={{
                color: '#333333',
                marginLeft: 100,
                marginTop: 5,
                fontSize: 12,
                paddingBottom: 5
              }}
            >
              Age : {el.age}
            </Text>
            <View>
              <Image
                style={{
                  width: 40,
                  height: 42,
                  resizeMode: 'contain',
                  alignSelf: 'flex-end',
                  marginTop: -60,
                  marginRight: 20,
                }}
                source={require('../../Assets/rightarrow.png')}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    borderColor: '#fff',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 25,
    marginLeft: 20,
    borderRadius: 10,
    height: 50,
    width: '80%',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'flex-start',
    elevation: 15,
  },

  uncheckborder: {
    backgroundColor: '#FFFFFF',
    borderColor: '#ddd',
    borderWidth: 1,
    alignSelf: 'center',
    elevation: 5,
    // height: 100,
    //marginTop: 10,
    borderRadius: 10,
    width: '90%',
    marginBottom: 20
  },
  img: {
    width: 25,
    height: 32,
    resizeMode: 'contain',
    right: 5,
    alignSelf: 'center',
    marginRight: 30,
  },
  text: {
    marginTop: 15,
    color: '#000',
    fontSize: 15,
    marginRight: 80,
  },
  imgtick: {
    width: 60,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    margin: 10,
    //marginLeft: 10,
    position: 'absolute',
    borderColor: '#ddd',
    borderWidth: 1
  },
  imgtick2: {
    width: 30,
    height: 35,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: 5,
  },
  text1: {
    color: '#333333',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 100,
    marginLeft: 30,
  },
  text2: {
    color: '#737373',
    fontSize: 15,
    marginTop: 20,
    marginLeft: 30,
  },
});
