import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../utils/constants/common';

const styles = StyleSheet.create({
    topContainer: {
        alignItems: 'center',
        marginTop: calcH(0.1),
    },
    logoContainer: {
        width: calcW(0.25),
        height: calcW(0.25),
        //marginTop: calcW(0.04)
        //marginRight: calcW(0.04),
        //backgroundColor:'#f5f5f5',
       // borderRadius:1000,
    },
    logoImg: {
        width: calcW(0.22),
        height: calcW(0.22),
        resizeMode: 'contain'
    },
    topText: {
        fontSize: 17,
        color: '#000000',
        fontWeight: '700',
        paddingTop: calcH(0.01)

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
    forgotContainer:{
        alignItems:'center',
        marginTop:calcH(0.01)
    },
    forgotText:{
        fontSize:12,
        color:'#c4c2c2',
        fontWeight:'500'
    },
     btnContainer:{
        alignItems:'center',
        marginTop:calcH(0.04)
     },
     btnSubContainer:{
         width:calcW(0.42),
         height:calcH(0.07),
         borderRadius:calcH(0.03),
         backgroundColor:'#000000',
         justifyContent:'center',
         alignItems:'center'
     },
     btnText:{
        fontSize:13,
        color:STYLES.THIRD_COLOR,
        fontWeight:'500'
     },
     socialBtnContaier:{
        justifyContent:'center',
        marginTop:calcH(0.06),
        flexDirection:'row'
     },
     socialBtn:{
         width:calcH(0.04),
         height:calcH(0.04),
         justifyContent:'center',
         alignItems:'center',
         borderWidth:1,
         borderColor:'#e1e1e1',
         marginRight:calcW(0.03)
     },
     socialImg:{
        width:calcH(0.02),
        height:calcH(0.02),
        resizeMode:'contain'
     },
     bottomContainer:{
        width:calcH(0.25),
        justifyContent:'center',
        marginTop:calcH(0.04),
        flexDirection:'row',
        marginBottom:calcH(0.1),
        //backgroundColor:'red',

     },
     bottomContainer2:{
        top:-30,
         width:calcH(0.35),
        justifyContent:'center',
        //marginTop:calcH(0.04),
        flexDirection:'row',
        //marginBottom:calcH(0.1),

     },
     bottomContainer1:{
        justifyContent:'center',
        marginTop:calcH(0.02),
        flexDirection:'row',
        marginBottom:calcH(0.1)
     },
     bottomtext:{
      
        fontSize:12,
        color:'black',
        fontWeight:'500',
        //top:-20,
        //backgroundColor:'red',
     },
     bottomtext1:{
        top:-30,
        fontSize:12,
        color:'blue',
        fontWeight:'500',
        paddingLeft:calcW(0.01)
        
     },
     bottomtext3:{
        top:-30,
        fontSize:14,
        color:'black',
        fontWeight:'500',
        paddingRight:calcW(0.4)

     },
     bottomtext2:{
        fontSize:12,
        color:'blue',
        fontWeight:'500',
        paddingLeft:calcW(0.01)
     },

     datePickerStyle: {
        width: 230,
      },

      radio: {
        flexDirection: 'row',
      },
      img: {
        height: 20,
        width: 20,
        marginHorizontal: 5,
      },
      btn: {
        marginTop:15,
        flexDirection: 'row',
        alignItems: 'center',
      },

})

export default styles;