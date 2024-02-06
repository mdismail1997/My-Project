// import React, { Component } from "react";
// // import { Container, Header, Content, Text, Button, Toast } from "native-base"
// import Toast from 'react-native-toast-native';
// import { Platform } from 'react-native';
// import {calcH, calcW, STYLES} from './common'
// // import { calcH, calcW, STYLES } from '../../utils/constants/common';

// function CommonToast({
//     text,
//     buttonText,
//     position="bottom",
//     toastFor,
//     duration=2000
// }={}){

//     if(toastFor==="error"){
//         // return Toast.show({
//         //     text: text,
//         //     // buttonText: buttonText,
//         //     position: position,
//         //     textStyle: { color: STYLES.THIRD_COLOR ,fontWeight:'500'},
//         //     style:{backgroundColor:STYLES.SECONDARY_COLOR},
//         // duration:duration
//         // })
//         return Toast.show(text, Toast.SHORT, Toast.TOP,{
//             backgroundColor: "#00FF7F",
//             width: 5,
//             height: Platform.OS === ("ios") ? calcH(1) : calcH(1),
//             color: "#ffffff",
//             fontSize: 115,
//             lineHeight: 200,
//             lines: 400,
//             borderRadius: 150,
//             fontWeight:'500',
//             yOffset: 400
//         });
//     }else{
//         return Toast.show("Hello", Toast.SHORT, Toast.TOP,{
//             backgroundColor: "#00FF7F",
//             width: 300,
//             height: Platform.OS === ("ios") ? 50 : 100,
//             color: "#ffffff",
//             fontSize: 15,
//             lineHeight: 2,
//             lines: 4,
//             borderRadius: 15,
//             fontWeight: "bold",
//             yOffset: 40
//         });
//         // return Toast.show({
//         //     text: text,
//         //    // buttonText: buttonText,
//         //     position: position,
//         //     textStyle: { color: STYLES.SECONDARY_COLOR,fontWeight:'500' },
//         //     style:{backgroundColor:STYLES.THIRD_COLOR},
//         //     duration:duration
//         //   })
//     }

// }

// export default CommonToast;
