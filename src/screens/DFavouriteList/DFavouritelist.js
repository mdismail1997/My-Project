import React from 'react';
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
import { Header } from '../../components/Header/Header';
import * as Apis from '../Services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const DoctorFavourite = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [favouritelist, setFavouriteList] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);
  const FavouriteList = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    const data = {
      doctor_id: user_id,
    };
    console.log('data======', data)
    setLoding(true);
    await Apis.patientfavouritelist(data)

      .then((response) => {
        console.warn(response.data);
        setFavouriteList(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  React.useEffect(() => {
    FavouriteList();
  }, []);
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {

      FavouriteList();
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Favorite" navProps={props.navigation} />
      {/* <Searchbar
        style={{
          maxHeight: 50,
          width: '80%',
          marginLeft: 15,
          borderRadius: 10,
          marginTop: 20,
        }}
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />

      <View
        style={{
          alignSelf: 'flex-end',
          marginTop: -45,
          width: 40,
          height: 40,
          borderRadius: 10,
          marginRight: 10,
          backgroundColor: '#fff',
        }}
      >
        <Image
          style={styles.imgtick2}
          source={require('../../../Assets/line.png')}
        />
      </View> */}
      <Text
        style={{
          marginTop: 20,
          marginLeft: 25,
          fontSize: 15,
          color: '#333333',
          fontWeight: 'bold',
          marginBottom: 10
        }}
      >
        Favorite Patient List
      </Text>
      {/* <FlatList
        style={{ marginBottom: 20 }}
        data={data}
        renderItem={renderdata}
        keyExtractor={(item, index) => item.id}
      /> */}
      <ScrollView>
        {favouritelist.map((el, i) => (
          <View style={styles.uncheckborder}>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate('PatientInformation', {
                  userid: el.id,
                })
              }
              style={{ flexDirection: 'row', alignItems: "center", }}
            >
              <Image
                style={styles.imgtick}
                source={{ uri: el.profile_image }}
              />
              {/* // source={el.profile_image} */}
              {/* <View style={{ flexDirection: "column", width: "67%", alignSelf: "center", marginLeft: 10 }}> */}

              <View
                style={{
                  flexDirection: 'column',
                  width: '67%',
                  alignSelf: 'center',
                  marginLeft: 10,
                }}
              >
                <Text
                  style={{
                    color: '#333333',
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  {el.name}
                </Text>
                <Text
                  style={{
                    color: '#333333',
                    fontSize: 10,
                  }}
                >
                  {el.email}
                </Text>
                <Text
                  style={{
                    color: '#333333',
                    marginTop: 5,
                    fontSize: 10,
                    paddingBottom: 3
                  }}
                >
                  DOB : {el.dob}
                </Text>
              </View>
              {/* <View>
         <Image
           style={{
             width: 40,
             height: 42,
             resizeMode: 'contain',
             alignSelf: 'flex-end',
             marginTop: -50,
             marginRight: 20,
           }}
           source={require('../../../Assets/rightarrow.png')}
         />
       </View> */}
            </TouchableOpacity>
          </View>
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
    // height: 50,
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
    alignSelf: 'center',
    elevation: 5,
    //  height: 90,
    marginBottom: 20,
    borderRadius: 10,
    width: '90%',
    borderColor: '#ddd',
    borderWidth: 1,
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
    width: 70,
    height: 80,
    resizeMode: 'contain',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    margin: 5,

  },
  imgtick2: {
    width: 30,
    height: 35,
    resizeMode: 'contain',
    alignSelf: 'center',
    margin: 10

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
