import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  useWindowDimensions,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';
import AsyncStorage from '@react-native-async-storage/async-storage';

import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import {calcH, calcW, allPadding} from '../../utils/comon';
import colors from '../../asserts/colors.js/colors';

import RenderHtml from 'react-native-render-html';
import {RFValue} from 'react-native-responsive-fontsize';

export default function Termsandcondition({navigation}) {
  const [termsCondition, settermsCondition] = useState('');
  const [banner_content, setbanner_content] = useState('');
  const [pagename, setPagename] = useState('');
  const [banner_image, setbanner_image] = useState(null);
  const [title, settitle] = useState('');
  useEffect(() => {
    getProfile();
    // const unsubscribe = navigation.addListener('focus', () => {
    //   getProfile();
    // });
    // return unsubscribe;
  }, []);

  // ----------------------------------------------------------------------------------------------------
  const getProfile = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('{token}', token);
    //Hud.showHud();
    axios({
      method: 'get',
      url: BASE_URL + 'about-us',
      headers: {
        Accept: 'application/json',
        //authorization: 'Bearer ' + token,
      },
    })
      .then(response => {
        console.log(JSON.stringify(response.data));
        //Hud.hideHud();
        setPagename(response.data.page_name);
        settermsCondition(response.data.content);
        setbanner_content(response.data.banner_content);
        setbanner_image(response.data.banner_image);
        settitle(response.data.title);
        // setFilePath(response.data.profile_photo)
      })
      .catch(err => {
        console.log('terms', err.response.data);
        //Hud.hideHud();
        Alert.alert(err);
      });
  };
  const {width} = useWindowDimensions().width;

  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          position: 'relative',
          left: 1,
          // top: 1,
          flexDirection: 'row',
          alignItems: 'center',
          height: calcH(0.08),
          width: calcW(1.5),
          borderColor: '#000',
          elevation: 1,
          paddingLeft: allPadding,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <IconAntDesign
            color={colors.textHeader}
            size={24}
            name={'arrowleft'}
          />
          <Text
            style={[
              styles.subText,
              {fontWeight: 'bold', fontSize: 18, color: colors.textHeader},
            ]}>
            {'   '}
            {pagename}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View
          style={{
            //alignItems: 'center',
            padding: allPadding,
            backgroundColor: colors.background,
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: RFValue(22),
              color: colors.textHeader,
            }}>
            {title}
          </Text>
          {/* <HTMLView value={banner_content} stylesheet={styles.a} /> */}
          <RenderHtml
            contentWidth={width}
            baseStyle={{
              color: colors.textHeader,
            }}
            source={{html: banner_content}}
          />
          <View
            style={{
              flex: 1,
              padding: allPadding,
              top: Platform.OS === 'android' ? 0 : null,
              alignItems: 'center',
            }}>
            <Image
              source={{uri: banner_image}}
              style={{
                width: calcW(0.68),
                height: calcH(0.23),
              }}
            />
          </View>
          <RenderHtml
            contentWidth={width}
            baseStyle={{color: colors.textHeader}}
            source={{html: termsCondition}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  a: {
    fontWeight: '600',
    color: '#FF3366', // make links coloured pink
  },
});
