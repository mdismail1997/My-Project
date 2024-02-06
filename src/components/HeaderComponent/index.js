import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, SafeAreaView ,TextInput} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import {Images}from '../../assets/image/index'

function HeaderComponent({ route, navigation,title, type, searchType}) {    
  
  return (
    <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backArrow}
            onPress={() =>
              //navigation.navigate('DrawerNavigation')   
              navigation.goBack()         
            }>   
        <Image style={styles.iconSize} source={Images.ArrowLeft} />
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


export default HeaderComponent
