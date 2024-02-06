// import { StyleSheet, Text, View } from 'react-native'
// import React from 'react'

// export default function termsCondition() {
//   return (
//     <View>
//       <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
//       <Text>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with:

// “Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.”
// The purpose of lorem ipsum is to create a natural looking block of text (sentence, paragraph, page, etc.) that doesn't distract from the layout. A practice not without controversy, laying out pages with meaningless filler text can be very useful when the focus is meant to be on design, not content.

// The passage experienced a surge in popularity during the 1960s when Letraset used it on their dry-transfer sheets, and again during the 90s as desktop publishers bundled the text with their software. Today it's seen all around the web; on templates, websites, and stock designs. Use our generator to get your own, or read on for the authoritative history of lorem ipsum.</Text>
//     </View>
//   )
// }

// const styles = StyleSheet.create({})
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
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Hud from '../../utils/hud';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import {calcH, calcW, allPadding} from '../../utils/comon';
import colors from '../../utils/colors';
import RenderHtml from 'react-native-render-html';
import {RFValue} from 'react-native-responsive-fontsize';

export default function Termsandcondition({navigation}) {
  const [termsCondition, settermsCondition] = useState('');
  const [banner_content, setbanner_content] = useState('');
  const [pagename, setPagename] = useState('');
  const [banner_image, setbanner_image] = useState(null);
  const [title, settitle] = useState('');
  useEffect(() => {
    // const unsubscribe = navigation.addListener('focus', () => {
    //   getProfile();
    // });
    // return unsubscribe;
    const getProfile = async () => {
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('{token}', token);
      Hud.showHud();
      axios({
        method: 'get',
        url: BASE_URL + 'terms-and-condition',
        headers: {
          Accept: 'application/json',
          //authorization: 'Bearer ' + token,
        },
      })
        .then(response => {
          console.log(JSON.stringify(response.data));
          Hud.hideHud();
          setPagename(response.data.page_name);
          settermsCondition(response.data.content);
          setbanner_content(response.data.banner_content);
          setbanner_image(response.data.banner_image);
          settitle(response.data.title);
          // setFilePath(response.data.profile_photo)
        })
        .catch(err => {
          console.log('errprofile', err.response.data);
          Hud.hideHud();
          Alert.alert(err);
        });
    };
    getProfile();
  }, []);

  // ----------------------------------------------------------------------------------------------------
  const {width} = useWindowDimensions().width;
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <View
          style={{
            //alignItems: 'center',
            padding: allPadding,
            backgroundColor: colors.background,
          }}>
          <Text
            style={{fontWeight: 'bold', fontSize: RFValue(22), color: '#000'}}>
            {title}
          </Text>
          {/* <HTMLView value={banner_content} stylesheet={styles.a} /> */}
          <RenderHtml
            contentWidth={width}
            source={{html: banner_content}}
            baseStyle={{color: '#000'}}
          />
          <View
            style={{
              flex: 1,
              padding: allPadding,
              margintop: calcH(-0.12),
              alignItems: 'center',
            }}>
            <Image
              source={{uri: banner_image}}
              style={{
                width: calcW(0.68),
                height: calcH(0.23),
              }}
              resizeMode={'contain'}
            />
          </View>
          <RenderHtml contentWidth={width} source={{html: termsCondition}} />
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
