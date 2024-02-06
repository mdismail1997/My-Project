import React,{useState,useEffect} from 'react';
import { View, Text,Image,TouchableOpacity,ActivityIndicator} from 'react-native';
import styles from './style'

function CommonButton({
    onPress,
    title,
    flag=false,
    buttonContainer,
    buttonText,
    disable,
}={}) {
  console.log("flag==", flag)
  const  btnStyle=buttonContainer?buttonContainer:styles.btnContainer
  const btnText=buttonText?buttonText:styles.btnTxt
    return (
        <TouchableOpacity style={btnStyle} onPress={onPress} disabled={flag || disable?true:false}>
            {
                flag?<ActivityIndicator color="#ffffff"/>
        :<Text style={btnText}>{title} </Text>
            }
    </TouchableOpacity>
    );
  }


  export default  CommonButton