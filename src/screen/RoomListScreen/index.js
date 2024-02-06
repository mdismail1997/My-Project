import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar, SafeAreaView ,TextInput, TouchableHighlight, FlatList} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import ProgressBar from "react-native-animated-progress";
import { Screen,InputComponent,HeaderComponent  } from '../../components'
import ScrollView from 'react-native-gesture-handler'
import {RoomDATA} from '../../localization/localData'
import {Images} from '../../assets/image/index'

function RoomListScreen({ route, navigation }) {    
    
  return (
     <Screen>
        <View style={styles.topContainer}>
            <HeaderComponent title='' navigation={navigation} searchType='RoomSearch'
        />
         <View style = {styles.lineStyle} />
               
        <View style = {styles.headerContainer}>    
              <TouchableOpacity  
              // onPress={()=>{
              //     navigation.navigate('SearchRoomieScreen') }}
                  >

                  <Text style={styles.subheader}>Search Room Result</Text>             
                  <Image source={Images.searchIcon} style={styles.searchIcon}/>
              </TouchableOpacity>
             
              
        </View>
        <View style={styles.listContainer}>     
                <FlatList 
                  data={RoomDATA}
                  renderItem={({item}) =>             
                        <View style={styles.listView}>  
                          <View style={styles.picContainer}>
                            <Image source={item.pic} style={styles.picture}/>
                          </View> 
                          <View style={styles.infoContainer}>
                            <Text style={styles.place}>{item.place}</Text>
                            <Text style={styles.price}>{item.price}</Text>   
                          </View>                         
                          <View style={styles.btnContainer}>
                            <TouchableOpacity  onPress={()=>navigation.navigate('RoomDetailsScreen')}>
                                <Text style={styles.btnText}>Details</Text>               
                            </TouchableOpacity>
                          </View>                                                                                                   
                        </View>            
                }
                  keyExtractor={item => item.id}
                />      
            </View>
      
        </View>  
    </Screen>
  );
}


export default RoomListScreen
