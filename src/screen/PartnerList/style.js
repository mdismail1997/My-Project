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
        borderColor: STYLES.FOUR_COLO,
    },
    headerContainer: {
        marginTop: calcH(0.015),  
        textAlign: 'center' ,
        flexDirection: "row", 
        position: 'relative'
    },
    secondheaderContainer:{
        width: calcW(0.65),
        marginTop: calcH(0.015),  
        textAlign: 'center' ,
        // flexDirection: "row", 
        position: 'relative',
        borderWidth: calcW(0.0005),
        borderRadius:20,

    },
    subheader: {
        textAlign:'center',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',
    },
    searchIcon: {
        position: 'absolute',
        width: calcW(0.05),
        height: calcW(0.05),
        left:calcW(0.6),
        marginTop: calcW(0.02),
       
    },
    listContainer: {
        marginTop: calcH(0.04),
        marginBottom: calcH(0.12)
       // backgroundColor:'red',
    },
    listView: {
        height: calcH(0.18),
        //width: calcH(0.49),
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row' ,
    },
    place: {     
        fontSize: 16,
        fontWeight: '400',
        fontFamily: 'quicksand_regular',         
    },
    price: {   
        fontSize: 19,  
        height: calcH(0.037),
        //backgroundColor:'red',
        borderRadius:calcW(0.03),
        fontWeight: '700',
        fontFamily: 'quicksand_bold',  
    },  
    picContainer: {
        width:'34%',
    }, 
    picture:{
        height: calcW(0.25),
        width: calcW(0.25),
        borderRadius: calcH(0.15),
        backgroundColor:STYLES.PRIMARY_COLOR,
    },
    infoContainer:{
        width:'40%',
    },
    btnContainer: {
        width:'26%',
        marginTop: calcH(0.015),
        justifyContent:'center',
        height:calcH(0.05),
        alignItems:'center',
         backgroundColor:STYLES.PRIMARY_COLOR,
        borderRadius:calcH(0.03),
    },
    btnText:{
       fontSize:14,
       color:STYLES.THIRD_COLOR,
       fontWeight:'500'
    },
   
})

export default styles;