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

                  <Text style={styles.subheader}>MY AMBASSADORS</Text>             
                  <Image source={Images.Plus} style={styles.searchIcon}/>
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
                            <View style={styles.infoContainer}>
                            <Image source={Images.SvgEyeOpen}  style={styles.SvgEyeOpen} />
                           
                            {/* <Text style={styles.place}>eye</Text> */}
                            {/* <Text style={styles.price}>delete</Text>    */}
                          </View> 
                                {/* <Text style={styles.btnText}>Details</Text>                */}
                            </TouchableOpacity>
                            <TouchableOpacity  onPress={()=>navigation.navigate('RoomDetailsScreen')}>
                            <View style={styles.infoContainer}>
                            <Image source={Images.DeleteIcon}  style={styles.Deleteicon} />
                           
                            {/* <Text style={styles.place}>eye</Text> */}
                            {/* <Text style={styles.price}>delete</Text>    */}
                          </View> 
                                {/* <Text style={styles.btnText}>Details</Text>                */}
                            </TouchableOpacity>
                            <View style={styles.btnContainer1}>
                            <TouchableOpacity  onPress={()=>navigation.navigate('RoomDetailsScreen')}>
                            {/* <Image source={Images.SvgEyeOpen}  style={styles.searchIcon} /> 
                            <Image source={Images.SvgEyeOpen}  style={styles.SvgEyeOpen} />*/}
                                <Text style={styles.btnText}>Details</Text>               
                            </TouchableOpacity>
                          </View>  
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
