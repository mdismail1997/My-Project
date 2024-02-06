import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, SafeAreaView ,TextInput} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import {Images}from '../../assets/image/index'
import { DrawerActions } from '@react-navigation/native';

function SecondHeaderComponent({route, navigation,title, type, searchType}) {    
  const drawer =()=>{
    //console.log("ghghghghghghgghh")
    navigation.openDrawer()
  }
  return (
    <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backArrow}
            onPress={() =>{
              drawer();
            }        
            }>   
        <Image style={styles.iconSize} source={Images.MenuIcon} />
        </TouchableOpacity >
        <Image style={styles.headerLogo} source={Images.HeaderLogo} />
        {type==='Visible' && <Image style={styles.userLogo} source={Images.ProfilePic} />}
        <TouchableOpacity 
            onPress={() =>
              navigation.navigate('AccountScreen')           
            }>   
        {searchType==='RoomSearch' && <Image style={styles.userLogo} source={Images.searchIcon} />} 
        </TouchableOpacity >
      {/* <Text>{title}</Text> */}
    </View>
  );
}

function ThirdHeaderComponent({route, navigation,title, type, searchType}) {    
  const drawer =()=>{
    //console.log("ghghghghghghgghh")
    navigation.openDrawer()
  }
  return (
    <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backArrow}
            onPress={() =>{
              drawer();
            }        
            }>   
        <Image style={styles.iconSize} source={Images.Pro} />
        </TouchableOpacity >
        <Text style={styles.headerLogo}>
          Result
        </Text>
        {/* <Image style={styles.headerLogo} source={Images.HeaderLogo} /> */}
        {type==='Visible' && <Image style={styles.userLogo} source={Images.ProfilePic} />}
        <TouchableOpacity 
            onPress={() =>
              navigation.navigate('AccountScreen')           
            }>   
        {searchType==='RoomSearch' && <Image style={styles.userLogo} source={Images.searchIcon} />} 
        </TouchableOpacity >
      {/* <Text>{title}</Text> */}
    </View>
  );
}



export default SecondHeaderComponent
