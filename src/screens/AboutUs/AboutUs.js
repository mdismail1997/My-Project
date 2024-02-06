import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView, Dimensions
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, Switch, Paragraph } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import RenderHTML from 'react-native-render-html';
const { width, height } = Dimensions.get('window');
export const AboutUs = (props) => {
  const [alldata, setAllData] = useState('');
  const [loading, setLoding] = useState(false);
  const PageContect = async () => {
    const data = {
      page_title: 'About Us',
    };

    setLoding(true);
    await Apis.pagecontent(data)

      .then((response) => {
        console.warn(response.data);

        setAllData(response.data.response.description);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  useEffect(() => {
    PageContect();
  }, []);
  const source = {
    html: alldata
  };
  const tagsStyles = {
    body: {
      whiteSpace: 'normal',
      color: '#000',
    },
    p: {
      // textAlign: 'justify',
      // color: 'red',
    },
    strong: { color: '#000' }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="About Us" navProps={props.navigation} />
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
        <RenderHTML
          contentWidth={width}
          source={source}
          tagsStyles={tagsStyles}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  verticleLine: {
    height: 2,
    width: '90%',
    backgroundColor: '#909090',
    marginLeft: 10,
    marginTop: 10,
    opacity: 0.3,
  },
  arrowimg: {
    height: 30,
    width: 30,
    borderRadius: 10,
    marginTop: 10,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  text: {
    marginLeft: 20,
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 5,
  },
});
