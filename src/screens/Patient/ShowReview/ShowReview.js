import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView, Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, Switch, Paragraph } from 'react-native-paper';
import { Header } from '../../../components/Header/Header';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import RenderHTML from 'react-native-render-html';
import { RFValue } from 'react-native-responsive-fontsize';
import { Rating } from 'react-native-ratings';
import Entypo from 'react-native-vector-icons/Entypo';
import { FlatList } from 'react-native';
const { width, height } = Dimensions.get('window');
export const ShowReview = (props) => {
  const [alldata, setAllData] = useState([]);
  const [loading, setLoding] = useState(false);
  const [doctorname, setDoctorname] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const ShowReview = async () => {
    const data = {
      doctor_id: props.route.params?.id,
    };

    setLoding(true);
    await Apis.showratingreview(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setAllData(response.data.data);
        setDoctorname(response.data.data.doctorName);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  useEffect(() => {
    ShowReview();
    console.log(props.route.params.doctorname)
    // eslint-dis(able-next-line react-hooks/exhaustive-deps
  }, [props.route.params.id, props.route.params.doctorname]);

  return (
    <SafeAreaView style={{ flex: 1, color: '#fff', backgroundColor: '#fff' }}>
      <Header
        title={props.route.params?.doctorname}
        navProps={props.navigation}
      />
      {/* <View
        style={{
          flexDirection: 'row',
          //   alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 40,
          marginLeft: 30,
          width: '90%',
          //  backgroundColor: 'red'
        }}
      >
        <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
          {/* <Image
            source={require('../../../Assets/back.png')}
            resizeMode="contain"
            style={{ width: 20, height: 20, tintColor: '#2173A8' }}
          /> */}
      {/* <Entypo name="arrow-left" size={30} color={'#000'} />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 20,
            fontSize: 20,
            //  fontFamily: 'Roboto-Bold',
            color: '#333333',
            width: "75%"
          }}
        >
          {props.route.params?.doctorname}
        </Text>
      </View> */}
      {/* <View style={styles.verticleLine}></View> */}
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
        style={{ marginHorizontal: 20 }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* {alldata?.length < 1 || alldata == null ? (
          <Text
            style={{
              color: '#000',
              fontSize: RFValue(18),
              marginLeft: 20,
              marginTop: 20,
            }}
          >
            No review available
          </Text>
        ) : ( */}
        <Text
          style={{
            color: '#000',
            fontSize: RFValue(18),
            marginLeft: 10,
            marginTop: 10,
          }}
        >
          Reviews
        </Text>
        {/* )} */}

        {/* {alldata?.length < 1 || alldata == null ? (
          <Text
            style={{
              color: '#000',
              fontSize: RFValue(18),
              marginLeft: 20,
              marginTop: 20,
            }}
          >
            No review available
          </Text>
        ) :
          ( */}
        <FlatList
          data={alldata}
          //  numColumns={2}
          keyExtractor={item => item.id}
          renderItem={({ item }) =>

            <>
              <View style={styles.uncheckborder}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    style={styles.imgtick}
                    source={{ uri: item.patientImage }}
                  />
                  <View
                    style={{
                      // flexDirection: 'column',
                      width: '70%',
                      // justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: '#333333',
                        paddingTop: 10,
                        fontSize: RFValue(14),
                        fontWeight: 'bold',
                        width: '70%',
                        marginLeft: 10,
                      }}
                    >
                      {item.patientName}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 10,
                        marginTop: 5,
                        justifyContent: 'space-between'
                      }}
                    >
                      <Rating
                        fractions={2}
                        startingValue={item.rating ?? 0}
                        imageSize={17}
                        ratingCount={5}
                        readonly={true}
                      />
                      <Text style={{ color: '#000' }}>{item.created_at}</Text>
                    </View>



                  </View>
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    textAlign: 'justify',
                    marginLeft: 20,
                    width: '80%',
                    color: '#000',
                  }}
                >
                  {item.review}
                </Text>
              </View>
            </>



          }
        />
        {/* )} */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  uncheckborder: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',

    alignSelf: 'center',
    paddingVertical: 10,
    // height: 90,
    marginTop: 20,
    borderRadius: 10,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1
  },
  verticleLine: {
    height: 1,
    width: '90%',
    backgroundColor: '#909090',
    marginLeft: 10,
    marginTop: 10,
    opacity: 0.3,
  },
  imgtick: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 40,
    marginLeft: 10,
    // alignSelf: 'center',
  },
});
