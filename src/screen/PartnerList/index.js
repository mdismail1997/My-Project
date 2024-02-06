import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar, SafeAreaView ,TextInput, TouchableHighlight, FlatList} from 'react-native';
import styles from './style';
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import ProgressBar from "react-native-animated-progress";
import { Screen,InputComponent,HeaderComponent  } from '../../components'
import ScrollView from 'react-native-gesture-handler'
import {RoomDATA} from '../../localization/localData'
import {Images} from '../../assets/image/index'
import {PartnerListDATA} from '../../localization/localData'
function PartnerListScreen({ route, navigation }) {    
    
  return (
     <Screen>
        <View style={styles.topContainer}>
            <HeaderComponent title='' navigation={navigation} searchType='RoomSearch'
        />
         <View style = {styles.lineStyle} />
               
        <View style = {styles.headerContainer}>    
              <TouchableOpacity  
              //onPress={()=>{navigation.navigate('') }}
                  >                         
                  <Text style={styles.subheader}>Trip PartnerList</Text>             
                 
              </TouchableOpacity>
              
             
              
        </View>
        <View style = {styles.secondheaderContainer}>
        <TouchableOpacity  
              //onPress={()=>{navigation.navigate('') }}
                  >                         
                  <Text style={styles.subheader}>Destination : Switzerland</Text>             
                 
              </TouchableOpacity>

        </View>
        
        <View style={styles.listContainer}>     
                <FlatList 
                  data={PartnerListDATA}
                  renderItem={({item}) =>             
                        <View style={styles.listView}>  
                          <View style={styles.picContainer}>
                            <Image source={item.pic} style={styles.picture}/>
                          </View> 
                          <View style={styles.infoContainer}>
                            {/* <Text style={styles.place}>{item.place}</Text> */}
                            <Text style={styles.price}>{item.name}</Text>   
                          </View>                         
                          <View style={styles.btnContainer}>
                            <TouchableOpacity  
                            //onPress={()=>navigation.navigate('RoomDetailsScreen')}
                            >
                                <Text style={styles.btnText}>Add Friend</Text>               
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


export default PartnerListScreen
