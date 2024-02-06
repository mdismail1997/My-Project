import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../utils/constants/common';


const styles = StyleSheet.create({
    topContainer: {
        alignItems: 'center',
    },
    lineStyle:{
        marginTop: calcH(0.005),
        width:calcW(1),
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO  ,
    },
    headerText: {
        marginTop: calcH(0.035),    
    },
    headersecondText: {
        marginTop: calcH(0.08),   
    },
    subheader: {
        textAlign:'center',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',
    },
    imageContainer: {
        borderRadius:5,
        paddingBottom:0,
        backgroundColor: STYLES.FOUR_COLO,
        marginTop: calcH(0.05),
        height: calcH(0.3),
        width:'100%',
        flexDirection:'row'
    },
    btnContainer:{
        alignItems:'center',
        marginTop:calcH(0.02),
     },
     btnbookPayContainer: {
      alignItems:'center',
      marginTop:calcH(0.02),
      marginBottom: calcH(0.05)
     },
     btnBookContainer : {
        alignItems:'center',
        marginTop:calcH(0.02),
        marginBottom: calcH(0.05)
     },
     btnSubContainer:{
         width:calcW(0.88),
         height:calcH(0.06),
         borderRadius:calcH(0.03),
         backgroundColor:STYLES.PRIMARY_COLOR,
         justifyContent:'center',
         alignItems:'center'
     },
     btnPaymentContainer:{
        width:calcW(0.88),
        height:calcH(0.06),
        borderRadius:calcH(0.03),
        backgroundColor:STYLES.FOUR_COLO,
        justifyContent:'center',
        alignItems:'center'
    },
    btnPaymentText: {
        fontSize:14,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold' 
    },
     btnText:{
        fontSize:13,
        color:STYLES.THIRD_COLOR,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold'
     },
     infoContainer: {
        marginTop:calcH(0.04),
        height: calcH(0.45), 
       // backgroundColor: STYLES.PRIMARY_COLOR     
    },
    totalAmount :{
        flexDirection:"row",
        alignItems:'center',
        marginTop:calcW(0.02)
      },
      totalAmountInterest: {
        flexDirection:"row",
        alignItems:'center',
        marginTop:calcW(0.08)  
      },
      iconContainer: {
        left:calcW(0.015),
        width: '15%',
     
      },
      iconSize: {
        width:calcW(0.04),
        height:calcH(0.035) 
     },
     iconMoneySize: {
      width:calcW(0.04),
      height:calcW(0.05) 
     },
     iconInterestSize: {
      width:calcW(0.04),
      height:calcW(0.04) 
     },
     iconPetSize: {
      width:calcW(0.05),
      height:calcW(0.04) 
     },
      titleleft: {           
        color:'#707070',
        right: calcW(0.06),  
        width: '20%',
        fontSize:16,
        fontWeight: '400',
        fontFamily: 'Quicksand-Regular'
      },
      semiColon: {
        width: '5%',      
      },
      titleright: {
        color:'#ACACAC',
        left:calcW(0.05),
        width: '60%',
        fontSize:16,
        fontWeight: '400',
        fontFamily: 'Quicksand-Regular'
      },
      roomImg: {
        height: calcH(0.3),
        width:'100%',
        borderRadius: calcH(0.01),
      }
})

export default styles;