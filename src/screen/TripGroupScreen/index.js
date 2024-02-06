import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar ,TextInput, FlatList} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import { Screen,InputComponent , HeaderComponent} from '../../components'
import ScrollView from 'react-native-gesture-handler'
import { Images } from '../../assets/image';


function TripGroupScreen({ route, navigation }) {    

  return (
     <Screen>  
        <View style={styles.topContainer}> 
            <HeaderComponent navigation={navigation} />     
            <View style = {styles.lineStyle} />
        
            <View style={styles.pageTitle}>
                <TouchableOpacity  onPress={()=>navigation.navigate('BucketScreen')}>
                   <Text style={styles.subheader}>Switzerland Trip Group</Text>
                </TouchableOpacity>
            </View>
        <View style={styles.groupContainer}>
            <View style={styles.member}>
                <Image source={Images.TripProfile1} style={styles.profileImg} />
                <Text style={styles.memberName}>Delandro</Text>
            </View>
            <View style={styles.member1}> 
                <Image source={Images.TripProfile2} style={styles.profileImg} />
                <Text style={styles.memberName}>Sebastian</Text>
            </View>
            <View style={styles.member2}> 
                <Image source={Images.TripProfile3} style={styles.profileImg} />
                <Text style={styles.memberName}>Juan</Text>
            </View>
        </View>

        <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} onPress={()=>navigation.navigate('')}>
                 <Text style={styles.btnText}>Plan Trip</Text>               
              </TouchableOpacity>
           </View>               
       </View>   
    </Screen>
  );
}

export default TripGroupScreen;
