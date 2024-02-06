import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../utils/constants/common';

const styles = StyleSheet.create({
    topContainer: {
        alignItems: 'center',
        flex: 1,
    },
    lineStyle:{
        marginTop: calcH(0.005),
        width:calcW(1),
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO  ,
    },
    datePickerStyle: {
        width: 250,
      },
    profileView:{
        marginTop:calcH(0.05),
        position: 'relative',
        height: calcW(0.40),
        width: calcW(0.40),
        borderRadius: calcH(0.2),
      //  backgroundColor:STYLES.FOUR_COLO,
    },
    profileImg:{
        height: calcW(0.35),
        width: calcW(0.35),
        borderRadius: calcH(0.1),
     },

     editBtn:{
        marginTop:-10,
         marginRight:15,
         backgroundColor: STYLES.PRIMARY_COLOR,
         height:calcW(0.06),
         width: calcW(0.06),
         borderRadius: calcH(0.1),
         alignItems :'center',
         justifyContent: 'center'
     },
    editIcon: {
        
       height:calcW(0.04),
       width: calcW(0.04),
       resizeMode:'contain',       
    },
    pageTitle : {
        marginTop: calcH(0.01),
    },
    subheader: {
        textAlign:'center',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',
    },

    formContainer: {
        alignItems: 'center',
        marginTop: calcH(0.04)
    },
   
    inputContainer: {
        width: calcW(0.8),
        height: calcH(0.07),
        marginBottom:calcH(0.02),
        borderRadius:calcH(0.01),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.57,
        shadowRadius: 15.19,       
        elevation: 23,
        backgroundColor:'#ffffff',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between'
        
    },
    inputContainer2:{
        width: calcW(0.8),
        height: calcH(0.07),
        marginBottom:calcH(0.02),
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        borderBottomColor:'#e1e1e1',
        borderBottomWidth:1
    },
    inputSubContainer:{
        width:calcW(0.67),
        marginLeft:calcH(0.03)
    },

    btnContainer:{
        alignItems:'center',
        marginTop:calcH(0.04),
        marginBottom: calcH(0.12)
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
        fontSize:13,
        color:STYLES.THIRD_COLOR,
        fontWeight:'500'
     },
    

})

export default styles;