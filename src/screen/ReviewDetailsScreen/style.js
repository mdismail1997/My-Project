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
    secondlineStyle:{
        marginTop: calcH(0.001),
        width:calcW(1),
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO  ,
    },
    pageTitle : {
        marginTop: calcH(0.038),
    },
    subheader: {
        textAlign:'center',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',
    },
    headingContainer: {
        flexDirection : 'row',
        height:calcH(0.10),
        width:calcW(1),
        marginTop: calcH(0.03),
    },
    headTitle1: {
        width: calcW(0.5),      
        justifyContent: 'center',
        borderColor: STYLES.FOUR_COLO ,
        borderTopColor: '#ffffff',  
    },
    headTitle2: {
        width: calcW(0.5),      
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: STYLES.FOUR_COLO ,
        borderTopColor: '#ffffff', 
       // backgroundColor: STYLES.PRIMARY_COLOR  
    },
  
    destination: { 
        left: calcW(0.12),  
        fontSize:20,
        fontWeight: '700',
        fontFamily: 'quicksand_bold',
    },
    budget: {
        fontSize:16,
        fontWeight: '700',
        fontFamily: 'quicksand_bold',
        left: calcW(0.01),
    },
    place: {
        left: calcW(0.08),
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'Quicksand-Regular',    
        width:'30%'
    },
    price: {
        width: '30%',
        fontSize: 14,       
        fontWeight: '400',
        fontFamily: 'Quicksand-Regular',
        left: calcW(0.06),
    },  
    starPlace : {
        flexDirection:'row' ,
        alignItems:'center',
        right: calcW(0.04), 
        // marginBottom:calcH(0.06)
    }, 
    reviewDetailsContainer: {
       height: calcH(0.28),
       width:'98%',
      // backgroundColor: STYLES.PRIMARY_COLOR 
    }, 
    infoContainer : {
        flexDirection : 'row',      
        height: calcH(0.15)
    },
    profileRateContainer : {       
        width:'72%',
        flexDirection : 'row',
    },
    imgContainer: {
        width:'30%',
        height: calcH(0.15),
        marginTop: calcH(0.035),
    },
    starNameContainer: {
        width:'42%',
        height: calcH(0.15),
    }, 
    daysContainer: {
        width:'26%',
        marginTop: calcH(0.05),
    }, 
    daysText: {
        color: STYLES.FOUR_COLO,
        fontSize: 14,
        left:calcW(0.065)
    }, 
    profileImg:{
        height: calcW(0.14),
        width: calcW(0.14),
        borderRadius: calcH(0.1),
     },
     reviewerName: {
        fontSize:16,
        marginTop:calcH(0.045)
     },
     starReviewer: {
        right: calcW(0.017),       
     },
     descripContainer: {

     },
     descripReview: {
        lineHeight: calcH(0.035)
     }
})

export default styles;