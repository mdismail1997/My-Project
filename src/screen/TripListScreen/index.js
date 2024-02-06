import React, { useState, useEffect } from 'react';
import { View, Text, Image, BackHandler, TouchableOpacity, StatusBar, TextInput, FlatList } from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import { Screen, InputComponent, HeaderComponent } from '../../components'
import ScrollView from 'react-native-gesture-handler'
import Stars from 'react-native-stars';
import { TripDATA } from '../../localization/localData';
import { Images } from '../../assets/image/index'

function TripListScreen({ route, navigation }) {

  return (
    <Screen>
      <View style={styles.topContainer}>
        <HeaderComponent navigation={navigation} />
        <View style={styles.lineStyle} />
        <TouchableOpacity
          style={styles.btnSubContainer}
          onPress={() => {
            navigation.navigate('TripReviewSecondScreen')
          }}>

          <View style={styles.pageTitle}>
            <Text style={styles.subheader}>Trip List</Text>
          </View>



        </TouchableOpacity>


        <View style={styles.headingContainer}>
          <View style={styles.headTitle1}>
            <Text style={styles.destination}>Place</Text>
          </View>
          <View style={styles.headTitle1}>
            <Text style={styles.budget}>Budget</Text>
          </View>
          <View style={styles.headTitle1}>
            <Text style={styles.budget}>Review</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            data={TripDATA}
            renderItem={({ item }) =>
              <View style={styles.listView}>
                {/* <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('BucketScreen')
                  }}

                > */}


                  <Text style={styles.place}
                  onPress={() => {
                    navigation.navigate('BucketScreen')}}>{item.place}</Text>
                  <Text style={styles.price}>{item.price}</Text>
                {/* </TouchableOpacity> */}
                <TouchableOpacity style={{ alignItems: 'center', right: calcW(0.1) }} onPress={() => navigation.navigate('TripReviewScreen')}>
                  <Stars
                    display={4}
                    spacing={5}
                    count={5}
                    starSize={15}
                    fullStar={Images.StarIcon}
                    emptyStar={Images.StarIconOutline} />
                </TouchableOpacity>
              </View>
            }
            keyExtractor={item => item.id}
          />
        </View>

      </View>
    </Screen>
  );
}

export default TripListScreen;
