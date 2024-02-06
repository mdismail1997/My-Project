import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity ,TextInput, TouchableHighlight, FlatList} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import ProgressBar from "react-native-animated-progress";
import { Screen,InputComponent,HeaderComponent  } from '../../components'
import ScrollView from 'react-native-gesture-handler'
import {Images} from '../../assets/image/index'
function LocationFinderScreen({ route, navigation }) {      
  
  return (
     <Screen>
        <View style={styles.topContainer}>
            <HeaderComponent title='' navigation={navigation} 
        />
         <View style = {styles.lineStyle} />
               
            <View style = {styles.headerText}>  
            <TouchableOpacity
              // onPress={()=>{
              //     navigation.navigate('SearchRoomieScreen') }}
            >
            <Text style={styles.subheader}>Location Finder</Text>  
            <Image source={Images.searchIcon} style={styles.searchIcon}/>
               </TouchableOpacity>          
               
            </View> 

         <View style = {styles.imageContainer}>
            <Image source={Images.LocationFinder}
               style={styles.mapImg}
            />         
         </View>                           
        </View>  
    </Screen>
  );
}

export default LocationFinderScreen
