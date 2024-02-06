import React, {useState} from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {Header} from '../../components/Header/Header';
import {Text, TextInput} from 'react-native-paper';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import CustomButton from '../../components/CustomButton';
import {Rating} from 'react-native-ratings';
import {Notification} from '../NotificationScreen/Notification';

export const RatingScreen = props => {
  const [Describe, setDescribe] = useState('');
  const [checked, setChecked] = useState(false);
  const IMAGE = require('../../Assets/starblack.png');

  const ratingCompleted = rating => {
    console.log('Rating is: ', rating);
  };
  const setData = () => {
    props.navigation.navigate('Createpassword');
  };

  return (
    <SafeAreaView style={styles.mencanteinview}>
      <Header
        title="Rating"
        navProps={props.navigation}
        {...props}
        Icon={require('../../Assets/notification.png')}
      />
      <ScrollView style={{marginHorizontal: wp(25)}}>
        <View style={{marginTop: hp(33)}}>
          <View style={styles.menviewrowcss}>
            <Image
              source={require('../../Assets/righttick.png')}
              style={styles.imagefingerCSS}
            />
            <Text style={styles.jobtextcss}>Job Title</Text>
          </View>
          <Text style={styles.Cleantextcss}>
            Clean my kitchen with your equipment
          </Text>
        </View>
        <View style={{marginTop: hp(20)}}>
          <View style={styles.menviewrowcss}>
            <Image
              source={require('../../Assets/righttick.png')}
              style={styles.imagefingerCSS}
            />
            <Text style={styles.jobtextcss}>Employee </Text>
          </View>
          <Text style={styles.Cleantextcss}>Peter Redford</Text>
        </View>
        <Text style={styles.ratetextcss}>Rate & Dispute </Text>
        <Rating
          type="custom"
          source={IMAGE}
          ratingColor={COLORS.ORANGE}
          ratingBackgroundColor={COLORS.BLACK}
          ratingCount={5}
          imageSize={20}
          onFinishRating={rating => ratingCompleted(rating)}
          style={{paddingVertical: wp(10), alignItems: 'flex-start'}}
        />
        <View style={{marginTop: 30}}>
          <TextInput
            mode="outlined"
            label="Describe your experience"
            placeholder=""
            onChangeText={value => setDescribe(value)}
            value={Describe}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
            style={{
              backgroundColor: COLORS.WHITE,
              borderRadius: 15,
              height: hp(99),
            }}
          />
        </View>
        <CustomButton
          onPress={() => {
            setData();
          }}
          title="Submit"
          buttonStyle={{marginTop: hp(22), marginHorizontal: wp(0)}}
          // disable={!checked}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  mencanteinview: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  menviewrowcss: {
    flexDirection: 'row',
  },
  imagefingerCSS: {
    width: wp(20),
    height: hp(20),
    resizeMode: 'contain',
  },
  jobtextcss: {
    fontSize: wp(14),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_BOLD,
    alignSelf: 'center',
    marginLeft: wp(12),
  },
  Cleantextcss: {
    fontSize: wp(13),
    color: COLORS.NICKEL,
    fontFamily: FONT_FAMILY.LATO_BOLD,
    marginLeft: wp(30),
    marginTop: hp(10),
  },
  ratetextcss: {
    fontSize: wp(13),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_BOLD,
    marginTop: hp(20),
  },
  imagestarCSS: {
    width: wp(20),
    height: hp(20),
    resizeMode: 'contain',
  },
});
