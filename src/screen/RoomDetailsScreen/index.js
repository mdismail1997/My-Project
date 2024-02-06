import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity ,TextInput, TouchableHighlight, FlatList} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import ProgressBar from "react-native-animated-progress";
import { Screen,InputComponent,HeaderComponent  } from '../../components'
import ScrollView from 'react-native-gesture-handler'
import {Images} from '../../assets/image/index'
function RoomDetailsScreen({ route, navigation }) {      
  
  return (
     <Screen>
        <View style={styles.topContainer}>
            <HeaderComponent title='' navigation={navigation} 
        />
         <View style = {styles.lineStyle} />
               
            <View style = {styles.headerText}>            
            <Text style={styles.subheader}>Room Details</Text>       
            </View> 

         <View style = {styles.imageContainer}>
         <Image source={Images.RoomBig}
            style={styles.roomImg}
          /> 
         </View>

         <View style={styles.infoContainer}>                          
                <View style={styles.totalAmount}>
                      <View style={styles.iconContainer}>
                         <Image style={styles.iconSize} source={Images.locationIcon} />
                      </View>                       
                        <Text style={styles.titleleft}>Location</Text>
                        <Text style={styles.semiColon}> : </Text>
                        <Text style={styles.titleright}>San Fancisco, USA</Text>                       
                </View> 
                <View style={styles.totalAmount}>
                      <View style={styles.iconContainer}>
                         
                      </View>                       
                        <Text style={styles.titleleft}>Address</Text>
                        <Text style={styles.semiColon}> : </Text>
                        <Text style={styles.titleright}>10/4, San Francisco, 20153</Text>                       
                </View> 
                <View style={styles.totalAmountInterest}>
                      <View style={styles.iconContainer}>
                         <Image style={styles.iconInterestSize} source={Images.InterstIcon} />
                      </View>                       
                        <Text style={styles.titleleft}>Interest In</Text>
                        <Text style={styles.semiColon}> : </Text>
                        <Text style={styles.titleright}>Cricket, Gym, Football</Text>                       
                </View>  
                <View style={styles.totalAmount}>
                      <View style={styles.iconContainer}>
                         <Image style={styles.iconMoneySize} source={Images.MoneyIcon} />
                      </View>                       
                        <Text style={styles.titleleft}>Price</Text>
                        <Text style={styles.semiColon}> : </Text>
                        <Text style={styles.titleright}>$1000 - $4000</Text>                       
                </View>
                <View style={styles.totalAmount}>
                      <View style={styles.iconContainer}>
                         <Image style={styles.iconPetSize} source={Images.PetsIcon} />
                      </View>                       
                        <Text style={styles.titleleft}>Pets</Text>
                        <Text style={styles.semiColon}> : </Text>
                        <Text style={styles.titleright}>Without Pet</Text>                       
                </View>                          
            </View> 
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} onPress={()=>navigation.navigate('VirtualTour')}>
                 <Text style={styles.btnText}>Virtual Tour</Text>               
              </TouchableOpacity>
           </View>
           <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} onPress={()=>navigation.navigate('LocationFinderScreen')}>
                 <Text style={styles.btnText}>View Location</Text>               
              </TouchableOpacity>
           </View>
           <View style={styles.btnbookPayContainer}>
              <TouchableOpacity style={styles.btnPaymentContainer} onPress={()=>navigation.navigate('')}>
                 <Text style={styles.btnPaymentText}>Make Payment and Book Room</Text>               
              </TouchableOpacity>
           </View>
                            
        </View>  
    </Screen>
  );
}


export default RoomDetailsScreen
