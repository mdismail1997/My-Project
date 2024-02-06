import React from 'react';
import {
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Header} from '../../components/Header/Header';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import SearchComp from '../../components/SearchComp';

export const Invitescreen = props => {
  const DATA = [
    {
      image: require('../../Assets/news-2.png'),
      NickBlay: 'Sunita sen',
      date: 'xxxxxxxx89',
      Invitetext: 'Invite',
    },
    {
      image: require('../../Assets/image-5.png'),
      NickBlay: 'Carolin Marin',
      date: 'xxxxxxxx89',
      Invitetext: 'Invite',
    },
    {
      image: require('../../Assets/news-1.png'),
      NickBlay: 'Pitar sen',
      date: 'xxxxxxxx89',
      Invitetext: 'Invite',
    },
  ];
  const renderItem = ({item}) => (
    <View style={styles.menviewcss}>
      <View style={styles.viewcss}>
        <View style={styles.imageviewcss}>
          <Image style={styles.imagecss} source={item.image} />
        </View>
        <View style={styles.textviewcss}>
          <Text style={[styles.textcomoncss]}>{item.NickBlay}</Text>
          <Text style={styles.textcomoncss2}>{item.date}</Text>
        </View>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Friendsscreen')}
          style={styles.backview}>
          <Text style={styles.invitetextcss}>{item.Invitetext}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      <Header
        title="Invite"
        navProps={props.navigation}
        {...props}
        Icon={require('../../Assets/notification.png')}
      />
      <ScrollView style={{marginHorizontal: wp(14)}}>
        <View style={styles.searchContainer}>
          <SearchComp />
        </View>
        <View style={{marginTop: hp(20)}}>
          <FlatList data={DATA} renderItem={renderItem} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  searchContainer: {
    marginTop: hp(34),
  },
  backview: {
    marginTop: hp(4),
    backgroundColor: COLORS.YELLOW_GREEN,
    borderRadius: 10,
    width: wp(100),
    height: hp(35),
    justifyContent: 'center',
    alignSelf: 'center',
  },
  menviewcss: {
    marginTop: hp(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 2,
    flex: 1,
  },
  viewcss: {
    flexDirection: 'row',
    paddingVertical: hp(10),
    justifyContent: 'space-between',
  },
  imagecss: {
    width: wp(68),
    height: hp(72),
    alignSelf: 'center',
    borderRadius: 8,
    resizeMode: 'contain',
  },
  imagecssdot: {
    width: wp(30),
    height: hp(10),
    resizeMode: 'contain',
  },
  textcomoncss: {
    fontSize: wp(14),
    color: COLORS.BLACK,
    fontFamily: FONT_FAMILY.LATO_BOLD,
  },
  textcomoncss2: {
    fontSize: wp(12),
    color: COLORS.NICKEL,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
  },
  imageviewcss: {
    width: wp(80),
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textviewcss: {
    marginLeft: wp(12),
    flex: 1,
    justifyContent: 'center',
  },

  imageuser: {
    width: wp(25),
    height: hp(25),
    resizeMode: 'contain',
  },
  backviewuser: {
    backgroundColor: COLORS.YELLOW_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    height: hp(60),
    width: wp(54),
    alignSelf: 'flex-end',
    right: 10,
    borderRadius: 30,
    bottom: 17,
  },
  invitetextcss: {
    fontSize: wp(12),
    color: COLORS.WHITE,
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    textAlign: 'center',
  },
});
