import React from 'react';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import { Badge, Text } from 'react-native-paper';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export const Header = (props) => (

  <View style={[styles.view, { marginTop: 30, paddingVertical: 15 }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => props.navProps.goBack(null)}>
        <Image
          source={require('../../Assets/back.png')}
          resizeMode="contain"
          style={{ width: 20, height: 20, tintColor: '#2173A8' }}
        />
      </TouchableOpacity>
      <Text
        style={{
          marginLeft: 20,
          fontSize: 20,
          //  fontFamily: 'Roboto-Bold',
          color: '#333333',
          width: "85%"
        }}
      >
        {props.title}
      </Text>
    </View>
  </View>
);
export const HeaderSignup = (props) => (

  <View style={[styles.view, { marginTop: 30, paddingVertical: 15 }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => props.navProps.replace('LogIn')}>
        <Image
          source={require('../../Assets/back.png')}
          resizeMode="contain"
          style={{ width: 20, height: 20, tintColor: '#2173A8' }}
        />
      </TouchableOpacity>
      <Text
        style={{
          marginLeft: 20,
          fontSize: 20,
          //  fontFamily: 'Roboto-Bold',
          color: '#333333',
          width: "85%"
        }}
      >
        {props.title}
      </Text>
    </View>
  </View>
);
export const Header2 = (props) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: 30,
      marginLeft: 10,
      paddingVertical: 15,
      paddingHorizontal: 20,
    }}
  >
    <Text
      style={{
        fontSize: 20,
        // fontFamily: 'Roboto-Bold',
        color: '#333333',
      }}
    >
      {props.title}
    </Text>
    <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
      <MaterialCommunityIcons
        name="bell"
        color="#2173A8"
        size={30}
        solid
        //  style={{ marginTop: -30 }}
        onPress={() => props.navProps.navigate('Notification')}
      />
      {/* <Badge style={{ backgroundColor: '#fff', marginTop: -27 }} size={15}>
        1
      </Badge> */}
    </TouchableOpacity>
  </View>
);
export const Header3 = (props) => (
  <View style={[styles.view, { marginTop: 30, paddingVertical: 15, width: '95%' }]}>

    <Text
      style={{
        fontSize: 20,
        //  fontFamily: 'Roboto-Bold',
        color: '#333333',
      }}
    >
      {props.title}
    </Text>


    {/* <TouchableOpacity style={{ width: 30 }}>
        <AntDesign name="heart" size={30} color="#000" />
      </TouchableOpacity> */}

    <TouchableOpacity
      style={{ alignSelf: 'flex-end', marginRight: 10, height: 30 }}
      onPress={() => props.navProps.navigate('Notification')}
    >
      <MaterialCommunityIcons
        name="bell"
        color="#2173A8"
        size={30}
        solid
      //    style={{ marginTop: -5 }}
      />

      <Badge style={{
        backgroundColor: 'red',
        marginTop: -25,

        color: '#fff',
        fontWeight: 'bold',
      }} size={15}>
        {props.unseencount}
      </Badge>
    </TouchableOpacity>

  </View>
);
export const Header4 = (props) => (
  <View style={[styles.view, { marginTop: props.change ? props.margin : 30, paddingVertical: props.change ? props.padding : 15 }]}>
    <View style={{ flexDirection: 'row', alignItems: "center", }}>
      <TouchableOpacity onPress={() => props.navProps.goBack(null)}>
        <Image
          source={require('../../Assets/back.png')}
          resizeMode="contain"
          style={{ width: 20, height: 20, tintColor: '#2173A8' }}
        />
      </TouchableOpacity>
      <Text
        style={{
          marginLeft: 40,
          fontSize: 20,
          // fontFamily: 'Roboto-Bold',
          color: '#333333',
        }}
      >
        {props.title}
      </Text>
    </View>
    {/* <TouchableOpacity style={{ marginRight: 20 }}>
      <Image
        source={require('../../Assets/menu.png')}
        resizeMode="contain"
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity> */}
  </View>
);
export const Header5 = (props) => (
  <View style={[styles.view, { marginTop: 30, paddingVertical: 15 }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => props.navProps.goBack(null)}>
        <Image
          source={require('../../Assets/back.png')}
          resizeMode="contain"
          style={{ width: 20, height: 20, tintColor: '#2173A8' }}
        />
      </TouchableOpacity>
      <Text
        style={{
          marginLeft: 30,
          fontSize: 20,
          //  fontFamily: 'Roboto-Bold',
          marginTop: 5,
          color: '#333333',
        }}
      >
        {props.title}
      </Text>
    </View>
    <View style={{ flexDirection: 'row', marginRight: '5%' }}>
      {/* <TouchableOpacity style={{ width: 30 }}>
        <AntDesign name="heart" size={30} solid color="#000" />
      </TouchableOpacity> */}

      <TouchableOpacity
        style={{ alignSelf: 'flex-end' }}
        onPress={() => props.navProps.navigate('Notification')}
      >
        <MaterialCommunityIcons
          name="bell"
          color="#2173A8"
          size={30}
          solid
          style={{ marginTop: 5 }}
        />
        {/* <Badge style={{ backgroundColor: '#fff', marginTop: -27 }} size={15}>
          1
        </Badge> */}
      </TouchableOpacity>
    </View>
  </View>
);
export const Header6 = (props) => (
  <View
    style={{
      width: '100%',
      marginTop: 30,
      marginLeft: 10,
    }}
  >
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 20,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          style={{
            height: 35,
            width: 35,
            borderRadius: 19,
            backgroundColor: '#fff',
            elevation: 2,
            justifyContent: 'center',
            marginLeft: 10,
          }}
          onPress={() => props.navProps.goBack(null)}
        >
          <Image
            source={require('../../Assets/back.png')}
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
              alignSelf: 'center',
              tintColor: '#2173A8',
            }}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: 20,
            fontSize: 20,
            fontFamily: 'Roboto-Bold',
            color: '#333333',
          }}
        >
          {props.title}
        </Text>
      </View>
      <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
        <MaterialCommunityIcons
          name="dots-vertical"
          color="#2173A8"
          size={30}
          solid
          style={{ alignSelf: 'flex-end', marginRight: '20%' }}
        />
      </TouchableOpacity>
    </View>
  </View>
);
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    //  marginTop: props.margin? props.margin :  30,
    marginLeft: 20,
    //  paddingVertical: props.padding? props.padding : 15,
    paddingHorizontal: 10,
  },
});
