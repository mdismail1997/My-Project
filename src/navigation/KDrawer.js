import React, { useState, useEffect } from 'react'
import { ScrollView, SafeAreaView, View, TouchableOpacity, Alert, Text, StyleSheet, Image,TextInput } from 'react-native';
//import * as webService from '../Services/webService'
import { Images } from '../assets/image';
import { calcH, calcW, STYLES } from '../utils/constants/common';
//const Drawer = createDrawerNavigator();
const KDrawer = props => {
  const [active, setActive] = useState(0);


  const navigateToDashboardScreen = async () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('DashboardScreen');
  }
  const navigateToAccount = async () => {
    props.navigation.closeDrawer();
    props.navigation.navigate('SearchFriendList');
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
          marginTop: 15,
          marginRight:240,
          //position: 'absolute',
          //alignItems: 'flex-end',
          //bottom: 0,
          //marginLeft: 250,
        }}>
          <TouchableOpacity
            style={styles.crossBut}
            onPress={() => {
              props.navigation.closeDrawer();
            }}
          >

            <Image source={Images.ArrowK} style={{ width: 25, height: 35, }}>
            </Image>
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 10, }}>

          <Image source={Images.RegScreen} style={{ width: 110, height: 110, borderRadius: 1000 }}>
          </Image>
        </View>
        


<View style ={{}}>
<TouchableOpacity
          style={styles.touch1}
          onPress={() => handleChange('DashboardScreen', 0)}
        >
          {/* <Text style={styles.text}>Dashboard</Text> */}
          <TextInput
        style={styles.text}
        placeholder="SANJU ADHIKARI"
        onChangeText={newText => setText(newText)}
        //defaultValue={text}
      />

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touch}
          onPress={navigateToAccount}
        >
          {/* <Text style={styles.text}>My profile</Text> */}
          <TextInput
        style={styles.text}
        placeholder="6289982261"
        onChangeText={newText => setText(newText)}
        //defaultValue={text}
      />

        </TouchableOpacity>



        <TouchableOpacity
          style={styles.touch}
          onPress={navigateToAccount}
        >
          {/* <Text style={styles.text}>Notification</Text> */}
          <TextInput
        style={styles.text}
        placeholder="*******"
        onChangeText={newText => setText(newText)}
        //defaultValue={text}
      />

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.touch}
          onPress={navigateToFriendList}
        >
          {/* <Text style={styles.text}>FirendList</Text> */}
          <TextInput
        style={styles.text}
        placeholder="ENTER YOUR UPI ID"
        onChangeText={newText => setText(newText)}
        //defaultValue={text}
      />

        </TouchableOpacity>

</View>
        


        <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} >
                 <Text style={styles.btnText}>UPDATE</Text>               
              </TouchableOpacity>
           </View>

        <TouchableOpacity
          style={styles.touch}
          onPress={() => doLogout()}

        >
          <Text style={styles.logouttext}> Log Out  </Text>

        </TouchableOpacity>

        <View style={styles.bottomContainer2} >
            <Text style={styles.bottomtext}>
            GETTTING TROUBLE WITH APP ? 
            </Text>
          </View>
          <View >
            <Text style={styles.bottomtext1}>
            CALL ON 6289982261 
            </Text>
          </View>



      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    bottomtext1:{
        //top:-30,
        fontSize:12,
        color:'blue',
        fontWeight:'500',
        paddingLeft:calcW(0.01)
        
     },
    bottomtext:{
        fontSize:12,
        color:'black',
        fontWeight:'500'
     },
    bottomContainer2:{
        //top:-30,
         width:calcH(0.35),
        justifyContent:'center',
        marginTop:calcH(0.055),
        flexDirection:'row',
        //marginBottom:calcH(0.1),

     },
    btnText:{
        fontSize:15,
        color:STYLES.THIRD_COLOR,
        fontWeight:'500'
     },
    btnContainer:{
        alignItems:'center',
        marginTop:calcH(0.04)
     },
     btnSubContainer:{
        width:calcW(0.52),
        height:calcH(0.07),
        borderRadius:calcH(0.03),
        backgroundColor:"black",
        justifyContent:'center',
        alignItems:'center'
    },
  touch1: {
    // width: '95%',
    padding: 10,
    // borderBottomWidth: 0,
    borderColor: 'white',
    // justifyContent: 'space-between',
    //marginLeft: 20,
    marginTop: 20,
    //flexDirection: 'row',
    //backgroundColor:'red'

  },
  touch: {
    //width: '95%',
    padding: 10,
    //borderBottomWidth: 0,
    
    borderColor: 'white',
    //justifyContent: 'space-between',
    //marginLeft: 20,
    marginTop: 10,
    //flexDirection: 'row',
   // backgroundColor: 'red'
  },
  crossBut: {
    //backgroundColor:'red',

  },
  text: {
    //fontWeight: 'bold',
    // borderWidth: calcW(0.002),
    borderBottomWidth:3,
    
    //borderWidth:1,
    
    textAlign:'center',
    borderColor: '#999999',
    fontSize: 18,
    fontFamily: 'Muli-BlackItalic',
    color:STYLES.THIRD_COLOR,
    //marginLeft: 25,
  },
  logouttext: {
    // fontWeight: 'bold',
    color: 'blue',
    fontSize: 15,
    fontFamily: 'Muli-BlackItalic',
   // marginLeft: 25,
  }
})

export default KDrawer
