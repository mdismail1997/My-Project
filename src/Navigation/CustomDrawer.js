import {Avatar, Divider} from 'native-base';
import React, {Component} from 'react';
import {Text, StyleSheet, View, ScrollView} from 'react-native';
import {assetsImages} from '../utils/assets';
import {mainColor} from '../utils/Color';
import {calcH, calcW} from '../utils/Common';
import {Font} from '../utils/font';
import DrawerItem from '../Component/ScreenComponenet/DrawerItem';
import routes from './routes';

const CustomDrawer = (props) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.firstContainer}>
          <Avatar source={assetsImages.user} bg="cyan.500" size="md" />
          <View>
            <Text
              style={{
                color: mainColor,
                fontSize: calcW(0.06),
                fontFamily: Font.Bold,
              }}>
              Richard Wilson
            </Text>
            <Text
              style={{
                color: '#fff',
                fontSize: calcW(0.04),
                fontFamily: Font.Regular,
              }}>
              richardwilson@gmail.com
            </Text>
          </View>
        </View>
        {/* <Divider/> */}
        <View style={styles.secondContainer}>
        <DrawerItem name={'lock-outline'} menuName={'Home'} onPress={()=> props.navigation.navigate(routes.Home)}/>

          <DrawerItem name={'lock-outline'} menuName={'Change Password'} onPress={()=> props.navigation.navigate(routes.ChangePassword)}/>
          <DrawerItem name={'cog-outline'} menuName={'Settings'} />
          <DrawerItem name={'cart-check'} menuName={'Order'} />
          <DrawerItem
            name={'file-document-outline'}
            menuName={'Terms & Condition'}
          />
          <DrawerItem
            name={'message-text-outline'}
            menuName={'Help and Support'}
          />
          <DrawerItem
            name={'logout'}
            menuName={'Logout'}
            onPress={()=> props.navigation.navigate(routes.SignIn)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#013667',
  },
  firstContainer: {
    flexDirection: 'row',
    // flex: 1,
    padding: 15,
    justifyContent: 'space-between',
    backgroundColor: '#064681',
  },
  secondContainer: {
    marginTop: calcH(0.02),
    padding: 15,
  },
});
