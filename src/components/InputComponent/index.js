import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, SafeAreaView ,TextInput} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'

const InputComponent=({placeholder,secureTextEntry=false,image,onChangeText,value,errorMessage}={})=>{
    const [isActive,setIsActive]=useState(false)

    const emailFocus=()=>{
        console.log("Email focus")
        setIsActive(true)
        }
        const emailBlur=()=>{
          console.log("Email blur")
          setIsActive(false)
        }
    return(
        <View style={isActive?styles.inputContainer:styles.inputContainer2}>
             <View style={isActive?styles.inputSubContainer:styles.inputSubContainer2}>
               <TextInput  
               placeholder={placeholder}
               style={styles.inputStyle}
               onFocus={emailFocus}
               onBlur={emailBlur}
               secureTextEntry={secureTextEntry}
               onChangeText={onChangeText}
               value={value}
               errorMessage={errorMessage}
               />
               </View>
               <View style={isActive?styles.iconContainer:styles.iconContainer2}>
                  <Image    
                  source={image}
                  style={styles.IconStyle}
                  />
               </View>
           </View>
    )
}

export default InputComponent