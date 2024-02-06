import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar ,TextInput, FlatList} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import { Screen,InputComponent , HeaderComponent} from '../../components'
import ScrollView from 'react-native-gesture-handler'
import {DATA} from '../../localization/localData'

function BucketScreen({ route, navigation }) {    

  return (
     <Screen>  
        <View style={styles.topContainer}> 
            <HeaderComponent navigation={navigation} />     
            <View style = {styles.lineStyle} />
        
            <View style={styles.pageTitle}>
                  <Text style={styles.subheader}>Bucket List</Text>
            </View>
        <View style={styles.headingContainer}>
            <View style={styles.headTitle1}>
                <Text style={styles.destination}>Destination</Text>
            </View>
            <View style={styles.headTitle2}> 
                <Text style={styles.budget}>Budget</Text>
            </View>
        </View>

            <View style={styles.listContainer}>     
                <FlatList 
                  data={DATA}
                  renderItem={({item}) =>             
                        <View style={styles.listView}>                       
                          <Text style={styles.place}>{item.place}</Text>
                          <Text style={styles.price}>{item.price}</Text>
                        </View>            
                }
                  keyExtractor={item => item.id}
                />      
            </View>     
       </View>   
    </Screen>
  );
}

export default BucketScreen;
