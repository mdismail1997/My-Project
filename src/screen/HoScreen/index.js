import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar, SafeAreaView ,TextInput, TouchableHighlight} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import ProgressBar from "react-native-animated-progress";
import { Screen,InputComponent,HeaderComponent } from '../../components'
import ScrollView from 'react-native-gesture-handler'
import ThirdHeaderComponent from '../../components/SecondHeaderComponent';


function HoScreen({ route, navigation }) {    
     const [activeColor, setactiveColor] = useState(" ")
    const setActive=(title)=> {
        setactiveColor(title) ; 
    }
  return (
     <Screen>
        <View style={styles.topContainer}>
        <ThirdHeaderComponent title='' navigation={navigation}
        />
         <View style = {styles.lineStyle} />
          {/* <TouchableOpacity  onPress={()=>navigation.toggleDrawer()}><Text>ok</Text></TouchableOpacity>      */}
        <View style = {styles.headerText}>           
        <Text style={styles.subheader}>Dashboard</Text>
        </View>

        <View style={styles.cardContainer}>
        <View style={styles.categoryRow1}> 
                 
           <TouchableOpacity style={activeColor === "My Account" ? styles.catCard1:styles.catCard2 } onPress={()=>{
               setActive("My Account")
               navigation.navigate('AccountScreen')
               }}>
                
             <Text style={activeColor === "My Account" ? styles.activecatName : styles.catName}>My Account</Text>             
            </TouchableOpacity>
                
                   
            <TouchableOpacity style={activeColor === "Room Crowd"?styles.catCard1:styles.catCard2 }  onPress={()=>{
              setActive("Room Crowd")
              // navigation.navigate('RoomListScreen')
              navigation.navigate('SearchRoomieScreen')
              }}>
                <Text style={activeColor === "Room Crowd" ? styles.activecatName : styles.catName}>Room Crowd</Text>
                </TouchableOpacity>
        </View>
        <View style={styles.categoryRow2}>
        <TouchableOpacity style={activeColor === "Trip Crowd"?styles.catCard1:styles.catCard2 } onPress={()=>{setActive("Trip Crowd")
      // navigation.navigate('TripListScreen')
      navigation.navigate('SearchTrip')
      }}>
                <Text style={activeColor === "Trip Crowd" ? styles.activecatName : styles.catName}>Trip Crowd</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={activeColor === "Social Crowd"?styles.catCard1:styles.catCard2 } onPress={()=>{setActive("Social Crowd")
              //navigation.navigate('CreateGroupScreen')
              navigation.navigate('SearchFriendList')
              }}>
                <Text style={activeColor === "Social Crowd" ? styles.activecatName : styles.catName}>Social Crowd</Text>
                </TouchableOpacity>
        </View>
       </View>
        </View>  
    </Screen>
  );
}


export default HoScreen
