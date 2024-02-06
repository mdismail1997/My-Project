import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../../utils/constants/common';

const styles = StyleSheet.create({
  
    topContainer: {
        alignItems: 'center',
        marginTop: calcH(0.1),  // 100 
    },
    logoContainer: {
        width: calcW(0.22),
        height: calcW(0.22),
        marginRight: calcW(0.04) // 40
    },
    logoImg: {
        width: calcW(0.22),
        height: calcW(0.22),
        resizeMode: 'contain'
    },
    topText: {
        fontSize: 18,
        color: '#000000',
        fontWeight: '700',
        fontFamily: 'quicksand_bold',
        paddingTop: calcH(0.04)
    },
    subText: {
        color: '#ADADAD', 
        fontSize: 15, 
        marginTop:calcW(0.02),
    },
    otpContainer: {
        marginTop:calcH(0.02),
        height: calcH(0.18),
    },
    categoryRow1: {
        height:calcH(0.25),
        backgroundColor:STYLES.THIRD_COLOR,
        marginTop: calcH(0.025),
        flexDirection: "row",   
    },
    catCard2: {
        width: "22%",
        height: calcH(0.09),
        borderRadius:15,
        marginRight:"2%",
        justifyContent: "center",
        alignItems: "center", 
        borderWidth: 2,
        borderColor: STYLES.FOUR_COLO  ,
        shadowColor: STYLES.FOUR_COLO,
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.9,
        shadowRadius: 3,
        elevation: 3,         
    },
    catName: {
        fontSize: 18,
        textAlign: 'center',
    },
   
    formContainer: {
        alignItems: 'center',
        marginTop: calcH(0.04)
    },
  
    inputSubContainer:{
        width:calcW(0.67),
        marginLeft:calcH(0.03)
    },
    iconContainer:{
        width:calcW(0.2),
    },
    inputStyle:{
        height:calcH(0.05)
    },
    IconStyle:{
        width:calcW(0.04),
        height:calcH(0.04),
        resizeMode:'contain'
    },
     btnContainer:{
        alignItems:'center',
        marginTop:calcH(0.02)
     },
     btnSubContainer:{
         width:calcW(0.52),
         height:calcH(0.06),
         borderRadius:calcH(0.03),
         backgroundColor:STYLES.PRIMARY_COLOR,
         justifyContent:'center',
         alignItems:'center'
     },
     btnText:{
        fontSize:14,
        color:STYLES.THIRD_COLOR,
        fontWeight:'500'
     },
  
     bottomContainer:{
        justifyContent:'center',
        marginTop:calcH(0.08),
        flexDirection:'row'

     },
     underlineStyleBase: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        fontSize: 18,
        color: '#808080',
      },
    
      underlineStyleHighLighted: {
        borderColor: '#ECECFF',
      },
     bottomtext:{
        fontSize:14,
        color:'#e1e1e1',
        fontWeight:'500'
     },
     bottomtext2:{
        fontSize:14,
        color:'#000000',
        fontWeight:'500',
        paddingLeft:calcW(0.01)
     },

})

export default styles;