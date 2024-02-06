import { StyleSheet } from "react-native";
import { DefaultTheme } from "@react-navigation/native";
import { fontFamily } from "../fonts";
import { color } from "../colors/color";
/*
 * Provides universal color configs used in the app.
 * Provides universal fonts used in the app.
 */


export const TabBarStyle = StyleSheet.create({
    lblTab: {
        fontFamily :fontFamily.Regular,
        textTransform: "none",
        textAlign: 'center',
        color: color.lblTab,
    },
    
    tabBarStyle: {
        justifyContent: "center",
        backgroundColor: color.bgTab,
        borderColor: color.bgTab,
        // borderWidth: 3,
        borderRadius: 5,
        padding: 0,
        maxHeight: 45,
        minHeight: 10,
        overflow: 'hidden',
    },
    
    tabBarIndicatorMiddleStyle: {
        height: "100%",
        backgroundColor: color.white,
        borderWidth: 6,
        borderRadius: 10,
        borderColor: color.bgTab,
        overflow: 'hidden',
    },
   
});


