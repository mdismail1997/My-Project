import React,{useState,useEffect} from 'react';
import { View, Text,Image,TouchableOpacity ,StatusBar} from 'react-native';
import styles from './style'
import {STYLES,calcH,calcW} from '../../utils/constants/common'
import ProgressBar from "react-native-animated-progress";
import {Images} from '../../assets/image/index'

function SplashScreen({route,navigation}) {
    const [loadingTime,setLoadingTime]=useState(0)
    useEffect(()=>{
      //  waitForShow()
      loading()
    },[loadingTime])

    const loading=()=>{
        var value=loadingTime;
        if(value<101){
            if(value>=90){
                setTimeout(() => {
                    setLoadingTime(loadingTime+10)
                console.log(loadingTime)
                navigation.navigate('LoginScreen')
                }, 500);
            }
            else{
                setTimeout(() => {
                    setLoadingTime(loadingTime+10)
                console.log(loadingTime)
               // navigation.navigate('LoginScreen')
                }, 500);
            }
               
              
        }
        else if(loadingTime===100){
            
        }
        
    }
    const waitForShow=()=>{
    //   setTimeout(()=>{
    //    navigation.navigate('BeforeLoginScreen')
    //   },2000)
    }
    return (
      <View style={styles.container}>
          {/* <StatusBar backgroundColor={STYLES.PRIMARY_COLOR} /> */}
          <View style={styles.topContainer}>
              <View style={styles.logoContainer}>
                <Image  source={Images.SplashIcon} 
                style={styles.logoImg}
                />
              </View>
            <Text style={styles.topHeadText}>Ur Crowd</Text>
            <Text style={styles.bottomTopText}>Where Your World Meets Our</Text>
          </View>
          <View style={styles.bottomContainer}>
              <View style={styles.bottomSubContainer}>
          <ProgressBar
         // indeterminate
            
          progress={loadingTime}
          trackColor="#b02723"
          height={calcH(0.003)}
          backgroundColor={STYLES.THIRD_COLOR}
         animated={true}
        />
        </View>
</View>
      </View>
    );
  }


  export default  SplashScreen
