import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar ,TextInput, FlatList} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import { Screen,InputComponent , HeaderComponent} from '../../components'
import ScrollView from 'react-native-gesture-handler'
import Stars from 'react-native-stars';
import {ReviewDetailsDATA} from '../../localization/localData'
import { Images } from '../../assets/image';


function ReviewDetailsScreen({ route, navigation }) {    

  return (
     <Screen>  
        <View style={styles.topContainer}> 
            <HeaderComponent navigation={navigation} />     
            <View style = {styles.lineStyle} />
        
            <View style={styles.pageTitle}>
                  <Text style={styles.subheader}>Switzerland Trip</Text>
            </View>
        <View style={styles.headingContainer}>
            <View style={styles.headTitle1}>
                <Text style={styles.destination}>Trip Reviews</Text>
            </View>
           
            <View style={styles.headTitle2}> 
            <View style={styles.starPlace}>
                            <Stars
                                display={4}
                                spacing={5}
                                count={5}
                                starSize={15}
                                fullStar= {Images.StarIcon}
                                emptyStar= {Images.StarIconOutline}/>                               
               <Text style={styles.budget}>4.7</Text>             
            </View>
                
            </View>
        </View>
        <View style = {styles.secondlineStyle} />
      <View style = {styles.reviewDetailsContainer}>
            <View style = {styles.infoContainer}>
                <View style = {styles.profileRateContainer}>
                    <View style = {styles.imgContainer}>
                        <Image source={Images.TripProfile2} style={styles.profileImg} />
                    </View>
                    <View style = {styles.starNameContainer}>
                        <Text style = {styles.reviewerName}>Marlon Brando</Text>
                            <View style={styles.starReviewer}>
                                <Stars
                                    display={4}
                                    spacing={5}
                                    count={5}
                                    starSize={15}
                                    fullStar= {Images.StarIcon}
                                    emptyStar= {Images.StarIconOutline}/>                               
                            
                            </View>
                    </View>
                </View>
                <View style = {styles.daysContainer}>
                    <Text style = {styles.daysText}>2 days ago</Text>
                </View>
            </View>
            <View style = {styles.descripContainer}>
                <Text style = {styles.descripReview}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.. 
                </Text>
            </View>
      </View>
      <View style = {styles.secondlineStyle} />

      <View style = {styles.reviewDetailsContainer}>
            <View style = {styles.infoContainer}>
                <View style = {styles.profileRateContainer}>
                    <View style = {styles.imgContainer}>
                        <Image source={Images.TripProfile3} style={styles.profileImg} />
                    </View>
                    <View style = {styles.starNameContainer}>
                        <Text style = {styles.reviewerName}>Kate Winslet</Text>
                            <View style={styles.starReviewer}>
                                <Stars
                                    display={4}
                                    spacing={5}
                                    count={5}
                                    starSize={15}
                                    fullStar= {Images.StarIcon}
                                    emptyStar= {Images.StarIconOutline}/>                               
                            
                            </View>
                    </View>
                </View>
                <View style = {styles.daysContainer}>
                    <Text style = {styles.daysText}>2 days ago</Text>
                </View>
            </View>
            <View style = {styles.descripContainer}>
                <Text style = {styles.descripReview}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.. 
                </Text>
            </View>
      </View>
                
       </View>   
    </Screen>
  );
}

export default ReviewDetailsScreen;
