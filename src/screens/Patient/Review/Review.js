import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Text, TextInput, Button, Snackbar, Title } from 'react-native-paper';
import { Header, Header4 } from '../../../components/Header/Header';
import { Rating, AirbnbRating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';

export const Review = (props) => {
  const [name, setName] = React.useState('');
  const [loading, setLoding] = React.useState(false);
  const [image, SetImage] = React.useState('');
  const [review, SetReview] = React.useState('');
  const [rating, SetRating] = React.useState(0);
  const [showreview, setShowReview] = React.useState(false);
  const [complain, setComplain] = React.useState('');
  const [showcomplain, setShowComplain] = React.useState(false);
  const [error, setError] = useState({ iserror: false, message: '' });
  const getdoctordata = async () => {
    const data = {
      booking_id: props.route.params?.booking_id,
    };

    setLoding(true);
    await Apis.doctordetailsforrating(data)

      .then(async (response) => {
        console.warn('doc data=========', response.data);
        setLoding(false);

        setName(response.data.response.doctor);

        SetImage(response.data.response.doctor_image);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  useEffect(() => {
    getdoctordata();
  }, [
    props.route.params?.booking_id,
    props.route.params?.doctor_id,
    props.route.params?.patient_id,
  ]);

  console.log('id----', props.route.params?.doctor_id);

  const Addrating = async (text) => {
    const data = {
      doctor_id: props.route.params?.doctor_id,
      rating: rating,
      review: review,
      type: text,
      complain: complain,
      patient_id: props.route.params?.patient_id,
    };
    console.log('rating-----', data);
    setLoding(true);
    await Apis.ratingreview(data)

      .then(async (response) => {
        console.warn('doc data=========', response.data);
        setLoding(false);
        if (response.data.success === '1') {
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
        }
        setLoding(false);
        // iserror(true)
        props.navigation.navigate('PatientTabNavigator');

        setName(response.data.response.doctor);
        SetImage(response.data.response.doctor_image);
      })
      .catch((error) => {
        console.log(error.response)
        console.error(`error.response.data.errors.${text}`);
        let err =
          text === 'C'
            ? error.response.data.errors.complain
            : error.response.data.errors.review;
        setError((data) => ({
          ...data,
          iserror: true,
          message: err,
        }));

        setLoding(false);
      });
  };
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Write a Review" navProps={props.navigation} />
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{ backgroundColor: '#d15656', zIndex: 1 }}
      >
        {error.message}
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
      <ScrollView style={{ marginBottom: 20 }}>
        <View>
          <Image
            source={{ uri: image }}
            style={{
              borderRadius: 85,
              height: 130,
              width: 130,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
          />

          <Text
            style={{
              color: '#000',
              fontSize: 15,
              marginTop: 10,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            How was your experience with
          </Text>
          <Text
            style={{
              color: '#2173A8',
              fontSize: 18,
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {name}
          </Text>
        </View>
        <AirbnbRating
          count={5}
          defaultRating={0}
          size={20}
          showRating={false}
          selectedColor="#2173A8"
          starContainerStyle={{ marginTop: 20 }}
          onFinishRating={(value) => SetRating(value)}
        />
        {/* <View style={{ marginHorizontal: 30, marginTop: 20 }}>
          <TextInput
            value={review}
            onChangeText={(text) => SetReview(text)}
            mode="outlined"
            label="Write a comment*"
            // placeholder="Tell people about your Experience"
            style={{ marginBottom: 10, height: 100 }}
            multiline={true}
          />
        </View> */}
        <View style={{ marginHorizontal: 20, marginTop: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 10,
              alignSelf: 'center',
              justifyContent: 'space-around',
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setShowReview(!showreview, setShowComplain(false));
              }}
              style={showreview ? styles.button : styles.button2}
            >
              <Title style={showreview ? styles.btext : styles.btext2}>
                Review
              </Title>
              {/* <Image
                source={require('../../../Assets/drop2.png')}
                style={{
                  marginVertical: 5,
                  marginRight: 10,
                  alignSelf: 'center',
                  tintColor: '#fff',
                }}
              /> */}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowComplain(!showcomplain, setShowReview(false));
              }}
              style={showcomplain ? styles.button : styles.button2}
            >
              <Title style={showcomplain ? styles.btext : styles.btext2}>
                Complain
              </Title>
              {/* <Image
                source={require('../../../Assets/drop2.png')}
                style={{
                  marginVertical: 5,
                  marginRight: 10,
                  alignSelf: 'center',
                }}
              /> */}
            </TouchableOpacity>
          </View>
          {showreview ? (
            <View style={{ marginTop: 10 }}>
              <TextInput
                mode="outlined"
                label="Comment *"
                placeholder=""
                style={{ marginHorizontal: 22, backgroundColor: '#fff' }}
                multiline={true}
                value={review}
                onChangeText={(text) => SetReview(text)}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
              />
              <View
                style={{
                  marginHorizontal: 25,
                  marginTop: 20,
                  bottom: 10,
                  borderRadius: 10,
                }}
              >
                <Button
                  mode="contained"
                  color="#2173A8"
                  uppercase={false}
                  onPress={() => {
                    Addrating('R');
                  }}
                  contentStyle={{ height: 50 }}
                  labelStyle={{ color: '#fff', fontSize: 18 }}
                >
                  Submit Review
                </Button>
              </View>
            </View>
          ) : null}
          {showcomplain ? (
            <View style={{ marginTop: 10 }}>
              <TextInput
                mode="outlined"
                label="Complain*"
                placeholder=""
                style={{ marginHorizontal: 22, backgroundColor: '#fff' }}
                multiline={true}
                value={complain}
                onChangeText={(text) => setComplain(text)}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
              />
              <View
                style={{
                  marginHorizontal: 25,
                  marginTop: 20,
                  bottom: 10,
                  borderRadius: 10,
                }}
              >
                <Button
                  mode="contained"
                  color="#2173A8"
                  uppercase={false}
                  onPress={() => {
                    Addrating('C');
                  }}
                  contentStyle={{ height: 50 }}
                  labelStyle={{ color: '#fff', fontSize: 18 }}
                >
                  Submit Complain
                </Button>
              </View>
            </View>
          ) : null}
        </View>
        {/* <View
          style={{
            marginHorizontal: 30,
            marginTop: 20,
            bottom: 10,
            borderRadius: 10,
          }}
        >
          <Button
            mode="contained"
            color="#2173A8"
            uppercase={false}
            onPress={Addrating}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 18 }}
          >
            Submit Review
          </Button>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'center',
    elevation: 15,
    height: 90,
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
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
  button: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
    backgroundColor: '#2173A8',
    borderRadius: 5,
    paddingVertical: 5,
    width: '40%',
  },
  button2: {
    justifyContent: 'space-between',
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    width: '40%',
    borderColor: '#2173A8',
    borderWidth: 1,
  },
  btext: {
    marginVertical: 5,
    color: '#fff',
    textAlign: 'center',
  },

  btext2: {
    marginVertical: 5,
    //  marginLeft: 10,
    color: '#2173A8',
    textAlign: 'center',
  },
});
