import React, { useState, useEffect } from 'react';
import { View, Text, Image,BackHandler, TouchableOpacity, StatusBar ,TextInput, FlatList} from 'react-native';
import styles from './style'
import { STYLES, calcH, calcW } from '../../utils/constants/common'
import { Screen,InputComponent , HeaderComponent} from '../../components'
import ScrollView from 'react-native-gesture-handler'
import { Input } from 'react-native-elements';

function CreateGroupScreen({ route, navigation }) {    
    const [name, setName] = useState("");

  return (
     <Screen>  
        <View style={styles.topContainer}> 
            <HeaderComponent navigation={navigation} type='Visible'/>     
            <View style = {styles.lineStyle} />
        
            <View style={styles.pageTitle}>
                <TouchableOpacity  onPress={()=>navigation.navigate('TripGroupScreen')}>
                   <Text style={styles.subheader}>Creating Group</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.groupConatiner}>
                <View style={styles.detailsRow}>
                    <Text style={styles.leftInfo}>Group Name</Text>  
                    <Text style={styles.middleInfo}>:</Text>
                    <Input
                        placeholder='Switzerland Trip'
                        style={styles.rightInfo}
                        inputContainerStyle={{ paddingBottom: 0 }}
                        containerStyle={{ paddingHorizontal: 0, marginBottom: -25 ,marginLeft:-10}}
                        //inputStyle={{ fontSize: 18, fontFamily: "Roboto-Regular" }}
                        //leftIconContainerStyle={{ marginLeft: 15 }}
                       // leftIcon={<Image source={require('../../Assets/email.png')} style={{ width: 25, height: 25 }} />}
                        //onChangeText={(e) => this.setState({ email: e }, () => this.conditions())}
                        //errorMessage={this.state.emailerror}
                    />
                    {/* <Text style={styles.rightInfo}>Switzerland Trip</Text> */}
                </View>
                  
                <View style={styles.detailsRow}>
                    <Text style={styles.leftInfo}>Desired Destination</Text>  
                    <Text style={styles.middleInfo1}>:</Text>
                    <Input
                        placeholder='Canada'
                        style={styles.rightInfo}
                        inputContainerStyle={{ paddingBottom: 0 }}
                        containerStyle={{ paddingHorizontal: 0, marginBottom: -25 ,marginLeft:-10}}
                        //inputStyle={{ fontSize: 18, fontFamily: "Roboto-Regular" }}
                        //leftIconContainerStyle={{ marginLeft: 15 }}
                       // leftIcon={<Image source={require('../../Assets/email.png')} style={{ width: 25, height: 25 }} />}
                        //onChangeText={(e) => this.setState({ email: e }, () => this.conditions())}
                        //errorMessage={this.state.emailerror}
                    />
                    {/* <Text style={styles.rightInfo}>Canada</Text> */}
                </View> 
               
                <View style={styles.detailsRow}>
                    <Text style={styles.leftInfo}>Budget</Text>  
                    <Text style={styles.middleInfo}>:</Text>
                    <Input
                        placeholder='$4000'
                        style={styles.rightInfo}
                        inputContainerStyle={{ paddingBottom: 0 }}
                        containerStyle={{ paddingHorizontal: 0, marginBottom: -25 ,marginLeft:-10}}
                        //inputStyle={{ fontSize: 18, fontFamily: "Roboto-Regular" }}
                        //leftIconContainerStyle={{ marginLeft: 15 }}
                       // leftIcon={<Image source={require('../../Assets/email.png')} style={{ width: 25, height: 25 }} />}
                        //onChangeText={(e) => this.setState({ email: e }, () => this.conditions())}
                        //errorMessage={this.state.emailerror}
                    />
                    {/* <Text style={styles.rightInfo}>$4000</Text> */}
                </View>  
               
                <View style={styles.detailsRow}>
                    <Text style={styles.leftInfo}>Interest In</Text>  
                    <Text style={styles.middleInfo}>:</Text>
                    <Input
                        placeholder='Cricket'
                        style={styles.rightInfo}
                        inputContainerStyle={{ paddingBottom: 0 }}
                        containerStyle={{ paddingHorizontal: 0, marginBottom: -25 ,marginLeft:-10}}
                        //inputStyle={{ fontSize: 18, fontFamily: "Roboto-Regular" }}
                        //leftIconContainerStyle={{ marginLeft: 15 }}
                       // leftIcon={<Image source={require('../../Assets/email.png')} style={{ width: 25, height: 25 }} />}
                        //onChangeText={(e) => this.setState({ email: e }, () => this.conditions())}
                        //errorMessage={this.state.emailerror}
                    />
                    {/* <Text style={styles.rightInfo}>Cricket</Text> */}
                </View> 
                {/* <View style = {styles.lineStyle} />       */}
            </View>  
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.btnSubContainer} onPress={()=>navigation.navigate('PartnerListScreen')}>
                 <Text style={styles.btnText}>Search Partner</Text>               
              </TouchableOpacity>
           </View>
                        
       </View>   
    </Screen>
  );
}

export default CreateGroupScreen;
