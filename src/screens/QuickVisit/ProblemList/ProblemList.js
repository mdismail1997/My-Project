import React, { useEffect, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Image,
  TouchableOpacity, FlatList
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { Button, Chip, Searchbar, Text, Avatar, } from 'react-native-paper';
import * as Apis from '../../Services/apis';
import { RFValue } from 'react-native-responsive-fontsize';
import Entypo from 'react-native-vector-icons/Entypo';
import { black, green100 } from 'react-native-paper/lib/typescript/styles/colors';
export const ProblemList = (props) => {
  const [problemListItems, setProblemListItems] = React.useState([]);
  const [value, setValue] = React.useState();
  const [selectAll, setSelectAll] = React.useState(false);
  const [loading, setLoding] = React.useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 10,
      duration: 10000,
    }).start();
  }, [fadeAnim]);
  // const getProblemList = async () => {
  //   try {
  //     setLoding(true);
  //     const res = await Apis.problemsList();
  //     setLoding(false);
  //     console.log(res.data.response);
  //     setProblemListItems(res.data.response);
  //   } catch (error) {
  //     console.error(error);
  //     setLoding(false);
  //   }
  // };
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchdoctor, setSearchDoctor] = React.useState([]);
  // const [loading, setLoding] = React.useState(false);
  const onChangeSearch = (query) => {
    setSearchQuery(query);

    const data = {
      keyword: query,
      year: props.route.params?.birthyear,
    };
    console.log('ddddaaa==', data);
    //setLoding(true);
    Apis.problemsList(data)
      .then((response) => {
        console.log('dats', response.data);
        setSearchDoctor(response.data.response ?? []);
        if (query === '') {
          setSearchDoctor(response.data.response ?? []);
        }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  React.useEffect(() => {
    onChangeSearch();
  }, [
    props.route.params?.userid,
    props.route.params.mail,
    props.route.params.birthyear,
    props.route.params.gender,
    props.route.params.name,
  ]);
  // const getProblemList = async () => {
  //   const data = {
  //     year: props.route.params?.birthyear,
  //   };
  //   setLoding(true);
  //   console.log('hhh', data);
  //   await Apis.problemsList(data)
  //     .then((response) => {
  //       console.warn(response.data);
  //       console.log('lll', response.data);
  //       // setAllData(response.data.response);
  //       // setInch(response.data.response.inch),
  //       //   setFeet(response.data.response.feet),
  //       //   setWeight(response.data.response.weight.toString()),
  //       //   setSelectedValue(response.data.response.year.toString());
  //       setLoding(false);
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //       setLoding(false);
  //     });
  // };
  // React.useEffect(() => {
  //   getProblemList();
  //   props.route.params?.userid;
  // }, [
  //   props.route.params?.userid,
  //   props.route.params.mail,
  //   props.route.params.birthyear,
  // ]);

  const handleSubmit = () => {
    console.log(value);

    console.log('mail===', props.route.params.gender);

    props.navigation.navigate('SymptomsList', {
      data: [value],
      userid: props.route.params?.userid,
      mail: props.route.params.mail,
      gender: props.route.params?.gender,
      birthyear: props.route.params?.birthyear,
      name: props.route.params.name,
    });
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView contentContainerStyle={{ padding: 3 }}>
        <View
          style={{
            flexDirection: 'row',
            borderRadius: 10,
            borderWidth: 1,
            padding: 10,
            borderColor: '#2173A8',
            width: '90%',
            alignSelf: 'center',
            alignItems: 'center',
            //backgroundColor:'red',
            marginVertical: 20,
            // justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
            <Image
              source={require('../../../Assets/back.png')}
              resizeMode="contain"
              style={{
                width: 20, height: 20, marginTop: 5,
                tintColor: '#2173A8',
                //backgroundColor:'red', 
              }}
            />
            {/*   <Entypo
              name='arrow-left'
              size={30}
              color={'#000000'}
          />*/}
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              //textAlign: 'center',

              marginLeft: 15,
              // marginTop: 10,
              color: '#000',
              //alignSelf: 'center',
              //alignItems:'center',
            }}
          >
            How can we help you?
          </Text>
          <View style={{ width: 10, }} />




        </View>
        <Searchbar
          style={{
            maxHeight: 50,
            width: '90%',
            backgroundColor: '#fff',
            borderRadius: 10,
            marginBottom: 10,
            alignSelf: 'center',
            //fontSize: RFValue(5),
          }}
          placeholder="Search for additional complaints"
          theme={{
            colors: {
              text: 'black',
              placeholder: 'black',


            },
          }}
          inputStyle={{ fontSize: RFValue(14), }}
          onChangeText={onChangeSearch}
          value={searchQuery}
          iconColor="#000"
          placeholderTextColor={'#000000'}
        />
        <View
          style={{
            //flexDirection: 'row',
            //flexWrap: 'wrap',
            // marginVertical: 5,
            width: '100%',
            //flex: 1,
            //flexDirection:'row',
            //backgroundColor:'red',
            justifyContent: 'space-evenly',
            //marginLeft:12,
            alignItems: 'center',
            // paddingHorizontal:20,
            alignSelf: 'center',
            //marginHorizontal: 10,
            //width:'100%'
          }}
        >


          <FlatList
            data={searchdoctor}
            numColumns={2}
            keyExtractor={item => item.id}
            renderItem={({ item }) =>
              <View
                style={{
                  //flex:1,
                  width: '47%',
                  paddingHorizontal: 8,
                  // marginVertical: 10,
                  margin: 5,
                  paddingVertical: 5,
                  //marginLeft: 7,
                  //  backgroundColor:'green',
                  // marginRight:'4%',
                }}
              >
                <TouchableOpacity
                  style={
                    value === item ? styles.unselectvalue : styles.selectvalue
                  }
                  onPress={() => {
                    if (value === item) {
                      setValue();
                    } else {
                      setValue(item);
                    }
                    console.log(value)
                  }}

                >
                  <Image
                    source={{ uri: item.img }}
                    style={{
                      width: '35%',
                      borderRadius: 60,
                      height: 52,
                      //  marginLeft: 5,
                      borderColor: '#000',
                      borderWidth: 1
                    }}
                  />
                  <Text
                    style={
                      value === item ? styles.selectext : styles.unselecttext
                    }
                  >{item.problem}
                  </Text>
                </TouchableOpacity></View>}
          />

        </View>
        <Button
          mode="contained"
          disabled={value?.length < 1}
          onPress={() => {
            console.log('myVal', value);
            // {
            value != undefined
              ? handleSubmit()
              : alert('Please select symptom to continue.');
            // }
          }}
          style={{ marginHorizontal: 30, marginVertical: 10 }}
        >
          Submit
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  selectvalue: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    paddingVertical: 3,
    // paddingHorizontal:15,
    borderWidth: 1,
    height: 140,
  },
  unselectvalue: {
    paddingVertical: 5,
    // paddingHorizontal:10,
    flexDirection: 'row',
    backgroundColor: '#2173A8',
    //backgroundColor: 'grey',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
    borderColor: '#ddd',
    //fontSize:5,
    borderWidth: 1,
    height: 140,
    //marginLeft:10,

  },
  selectext: {
    fontSize: 13,
    width: '47%',
    //marginVertical: 10,
    color: '#fff',
    marginLeft: 15,
    //  backgroundColor: 'red',
    // textAlign: 'left',
  },
  unselecttext: {
    //   backgroundColor: 'red',
    fontSize: 13,
    width: '47%',
    //marginVertical: 10,
    color: '#000',
    marginLeft: 10
    // textAlign: 'justify',
    //textAlign: 'justify',
  },
  selecall: {
    margin: 2,
    marginHorizontal: 10,
    backgroundColor: '#2173A8',
  },
  unselectall: {
    margin: 2,
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },
});
