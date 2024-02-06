import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, StatusBar ,TextInput, FlatList, Pressable} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import { Screen,InputComponent , HeaderComponent} from '../../components'
import ScrollView from 'react-native-gesture-handler'
import Stars from 'react-native-stars';
import {TripReviewDATA} from '../../localization/localData'
import { Images } from '../../assets/image';

function TripReviewScreen({ route, navigation }) {    
  const [actionTriggered, setActionTriggered] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
     <Screen>  
       {/* <View style={[styles.topContainer,  setModalVisible(modalVisible) ? {backgroundColor: 'rgba(0,0,0,0.5)'} : '']}> */}
        <View style={styles.topContainer}> 
            <HeaderComponent navigation={navigation} />     
            <View style = {styles.lineStyle} />
        
            <View style={styles.pageTitle}>
                  <Text style={styles.subheader}>Trip Review</Text>
            </View>
        <View style={styles.headingContainer}>
            <View style={styles.headTitle1}>
                <Text style={styles.destination}>Place</Text>
            </View>
           
            <View style={styles.headTitle2}> 
                <Text style={styles.budget}>Review</Text>
            </View>
        </View>

            <View style={styles.listContainer}>     
                <FlatList 
                  data={TripReviewDATA}
                  renderItem={({item}) =>             
                        <View style={styles.listView}>                       
                          <Text style={styles.place}>{item.place}</Text>
                         
                          <View style={styles.starPlace}>
                            <Stars
                                display={4}
                                spacing={5}
                                count={5}
                                starSize={15}
                                fullStar= {Images.StarIcon}
                                emptyStar= {Images.StarIconOutline}/>
                                <View style={styles.btnContainer}>
                                    <TouchableOpacity style={styles.eyeContainer} onPress={()=>navigation.navigate('ReviewDetailsScreen')}>
                                      <Image source={Images.Eye} style={styles.iconeye} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.plusContainer}  onPress={() => {setModalVisible(true)}}>
                                      <Image source={Images.Plus}  style={styles.iconplus} />  
                                    </TouchableOpacity>                              
                                </View>                               
                            </View>
                        </View>            
                }
                  keyExtractor={item => item.id}
                />      
            </View> 

            <Modal
        animationType="fade"        
        visible={modalVisible}
        statusBarTranslucent={true} 
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
          
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
             <View style={styles.headerView}>
                <Text style={styles.modalText}>Switzerland Trip</Text>
                 <TouchableOpacity style={styles.modelCancelContainer} onPress={() =>{                 
                  setModalVisible(!modalVisible)
                 }}>
                    <Image source={Images.CloseIconWhite}  style={styles.iconplus} /> 
                 </TouchableOpacity>
             </View>          
            <View style = {styles.lineModelStyle} />
            <Text style={styles.modalsubText}>Add your review</Text>
              <View style={styles.starPlace}>
                            <Stars
                                display={4}
                                spacing={5}
                                count={5}
                                starSize={15}
                                fullStar= {Images.StarIcon}
                                emptyStar= {Images.StarIconOutline}/>
              </View> 
              <View style={styles.typeContainer}>
                  <InputComponent placeholder="Type here" />  
              </View>
              <View style={styles.subcanbtnContainer}>
                                    <TouchableOpacity style={styles.cancelContainer} onPress={()=>navigation.navigate('')}>
                                     <Text style={styles.cancelText}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.submitContainer}  onPress={() =>navigation.navigate('')}>
                                    <Text style={styles.submitText}>Submit</Text>
                                    </TouchableOpacity>                              
                                </View>              
          </View>
        </View>   
      </Modal>  
     
       </View>         
    </Screen>
  );
}

export default TripReviewScreen;
