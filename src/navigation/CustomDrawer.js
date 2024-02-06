import React, { useState, useEffect } from 'react'
import { ScrollView, SafeAreaView, View, TouchableOpacity, Alert, Text, StyleSheet, Image } from 'react-native';
//import * as webService from '../Services/webService'
import { Images } from '../assets/image';
//const Drawer = createDrawerNavigator();
const customdrawer = props => {
  const [active, setActive] = useState(0);


  const navigateToDashboardScreen = async () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('DashboardScreen');
  }
  const navigateToAccount = async () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('AccountScreen');
  }
  const navigateToNotification = async () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('Chat');
  }
  const navigateToFriendList = async () => {
    //props.navigation.closeDrawer();
    // props.navigation.navigate('SearchFriendList');
    props.navigation.navigate('FriendRequest');
  }
  const doLogout = () => {
    Alert.alert(
      //title
      'Signout',
      //body
      'Are you sure want to signout?',
      [
        { text: 'Yes', onPress: () => processLogout() },
        { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' },
      ],
      { cancelable: false },
      //clicking out side of alert will not cancel
    );
  };
  const processLogout = async () => {
    //await AsyncStorage.setItem("user_token", "");
    //webService.clearAsyncStore()
    props.navigation.replace('LoginScreen');

  };


  const handleChange = (path, val) => {
    // this.setState({ active: val });
    setActive(val)
    props.navigation.navigate(path);
  };




  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>



      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          width: '100%',
          justifyContent: 'center',
          // marginTop: 30,
          alignItems: 'center',
        }}
      >
        <View style={{
          marginTop: 10,
          //position: 'absolute',
          alignItems: 'flex-end',
          bottom: 0,
          marginLeft: 250,
        }}>
          <TouchableOpacity
            style={styles.crossBut}
            onPress={() => {
              props.navigation.closeDrawer();
            }}
          >

            <Image source={Images.CloseIcon} style={{ width: 20, height: 30, }}>
            </Image>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 10, }}>

          <Image source={Images.ProfilePic} style={{ width: 90, height: 90, borderRadius: 1000 }}>
          </Image>
        </View>
        <View style={{ marginTop: 10, }}>

          <Text style={{ fontSize: 25, fontFamily: 'Muli-BlackItalic', }} >
            John Doe
          </Text>
        </View>
        <View style={{ marginTop: 5, }}>

          <Text style={{ fontSize: 18, fontFamily: 'Muli-BlackItalic', }} >
            Johndoe@gmail.com
          </Text>
        </View>



        <TouchableOpacity
          style={styles.touch1}
          onPress={() => handleChange('DashboardScreen', 0)}
        >
          <Text style={styles.text}>Dashboard</Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touch}
          onPress={navigateToAccount}
        >
          <Text style={styles.text}>My profile</Text>

        </TouchableOpacity>



        <TouchableOpacity
          style={styles.touch1}
          onPress={navigateToNotification}
        >
          <Text style={styles.text}>Notification</Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touch1}
          onPress={navigateToFriendList}
        >
          <Text style={styles.text}>FirendList</Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touch1}
          onPress={() => doLogout()}

        >
          <Text style={styles.logouttext}> Logout  </Text>

        </TouchableOpacity>




      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  touch1: {
    width: '95%',
    padding: 10,
    borderBottomWidth: 0,
    borderColor: 'white',
    justifyContent: 'space-between',
    //marginLeft: 20,
    marginTop: 10,
    flexDirection: 'row',
    //backgroundColor:'red'

  },
  touch: {
    width: '95%',
    padding: 10,
    borderBottomWidth: 0,
    borderColor: 'white',
    justifyContent: 'space-between',
    //marginLeft: 20,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: 'red'
  },
  crossBut: {
    //backgroundColor:'red',

  },
  text: {
    // fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Muli-BlackItalic',
    marginLeft: 25,
  },
  logouttext: {
    // fontWeight: 'bold',
    color: 'red',
    fontSize: 20,
    fontFamily: 'Muli-BlackItalic',
    marginLeft: 25,
  }
})

export default customdrawer
