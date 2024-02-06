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
import { Text, TextInput, Button, Searchbar, Snackbar } from 'react-native-paper';
import { Header } from '../../../components/Header/Header';
import * as Apis from '../../Services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
export const Favourite = (props) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [favouritelist, setFavouriteList] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [favourite, SetFavourite] = React.useState(false);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [err, setErr] = React.useState({ iserr: false, message: '' });
  const FavouriteList = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    const data = {
      patient_id: user_id,
    };

    setLoding(true);
    await Apis.favouritelist(data)

      .then((response) => {
        console.warn(response.data);
        setFavouriteList(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  React.useEffect(() => {
    FavouriteList();
    CheckFavourite()
  }, []);
  const AddFavourite = async (id) => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    const data = {
      doctor_id: id,
      patient_id: user_id,
    };

    // setLoding(true);
    await Apis.addfauvarite(data)

      .then((response) => {
        console.warn(response.data);
        if (response.data.success === '1') {
          SetFavourite(true);
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
          setErr(() => ({

            iserr: false

          }));
        } else {
          SetFavourite(false);
          setErr((data) => ({
            ...data,
            iserr: true,
            message: response.data.message,
          }));
        }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  const CheckFavourite = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    const data = {
      doctor_id: props.route.params?.id,
      patient_id: user_id,
    };

    // setLoding(true);
    await Apis.checkfauvarite(data)

      .then((response) => {
        console.warn('kkkkoo', response.data);
        if (response.data.success === '1') {
          SetFavourite(true);
        } else {
          SetFavourite(false);
        }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setErr((data) => ({ ...data, iserr: false, message: '' }));
  };
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
          marginTop: 10,
          marginLeft: 25,
          fontSize: 15,
          color: '#333333',
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        Favorite Doctors List
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
                props.navigation.navigate('DoctorProfile', { id: el.id })
              }
              style={{ flexDirection: "row", alignItems: 'center' }}
            >
              <Image style={styles.imgtick} source={{ uri: el.profile_image }} />
              {/* // source={el.profile_image} */}
              <View style={{ flexDirection: "column", marginLeft: 10, width: "63%", justifyContent: "space-between" }}>


                <Text
                  style={{
                    color: '#333333',


                    paddingTop: 5,
                    fontSize: 15,
                    fontWeight: 'bold',
                  }}
                >
                  {el.name}
                </Text>
                {/* <TouchableOpacity
                  onPress={() => AddFavourite(el.id)}
                  style={{ alignItems: 'flex-end', marginTop: 5 }}
                >
                  {favourite ? (
                    <AntDesign
                      name="heart"
                      size={30}
                      color="#2173A8"
                      style={{
                        position: 'absolute',
                        zIndex: 9999,
                        marginTop: -25,
                        marginRight: 10,
                      }}
                    />
                  ) : (
                    <AntDesign
                      name="hearto"
                      size={30}
                      color="#2173A8"
                      style={{
                        position: 'absolute',
                        zIndex: 9999,
                        marginTop: -25,
                        marginRight: 20,
                      }}
                    />
                  )}
                </TouchableOpacity> */}
                <Text
                  style={{
                    color: '#333333',

                    fontSize: 10,
                  }}
                >
                  {el.about}
                </Text>
                <Text
                  style={{
                    color: '#333333',


                    fontSize: 10,
                    paddingBottom: 5
                  }}
                >
                  {el.speciality}
                </Text>
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
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: 'green',
          bottom: 20,
          // zIndex: 10,
        }}
        wrapperStyle={{ position: 'absolute' }}
      >
        {error.message}
      </Snackbar>
      <Snackbar
        visible={err.iserr}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: '#d15656',
          bottom: 20,
          // zIndex: 10,
        }}
        wrapperStyle={{ position: 'absolute' }}
      >
        {err.message}
      </Snackbar>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    borderColor: '#fff',
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 25,
    marginLeft: 20,
    borderRadius: 10,
    // height: 50,
    width: '80%',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    alignSelf: 'flex-start',
    // elevation: 5,
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
    width: 80,
    height: 80,
    resizeMode: 'contain',
    // alignSelf: 'flex-start',
    borderRadius: 20,
    //  margin:10,
    margin: 8,
    borderColor: '#ddd',
    borderWidth: 1,
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
