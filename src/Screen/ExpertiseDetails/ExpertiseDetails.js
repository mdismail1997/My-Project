import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './Styles';
import {Header} from '../../components/Header/Header';
import AntIcon from 'react-native-vector-icons/dist/AntDesign';
import {COLORS} from '../../utils/Const';
import CustomButton from '../../components/CustomButton';
import {Card, Chip, Paragraph, Text, Title} from 'react-native-paper';
import {hp, wp} from '../../utils/ResponsiveLayout';

const ExpertiseDetailsScreen = props => {
  // state variables
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [currentJobType, setCurrentJobType] = useState(0);

  const detailsView = props.route.params.details;
  console.log('detailsView', detailsView);

  return (
    <SafeAreaView style={styles.container}>
      <Header {...props} title="Expertise Details" />
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1}}>
          <View>
            <View style={styles.profileImgContainer}>
              <Image
                source={{uri: detailsView.profileimage}}
                style={{height: 140, width: 140, borderRadius: 140}}
                resizeMode={'contain'}
              />
            </View>
          </View>
          <Text style={styles.usernameText}>{`${detailsView.firstname}`}</Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <AntIcon name="star" size={15} color={'#FADB11'} />
            <Text>4.5 - 39 view</Text>
          </View>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Chat"
              buttonStyle={styles.buttonStyle}
              onPress={() =>
                props.navigation.navigate('ChatScreen', {
                  details: detailsView._id,
                })
              }
            />
            <CustomButton
              title="Hire Now"
              buttonStyle={[
                styles.buttonStyle,
                {backgroundColor: COLORS.WHITE},
              ]}
              titleStyle={{color: COLORS.YELLOW_GREEN}}
            />
          </View>
          <Card style={[styles.jobItemContainer, {marginTop: hp(25)}]}>
            <Card.Content>
              <Chip
                style={
                  styles.dayStyle
                }>{`$${detailsView.expectedCost.value}/${detailsView.expectedCost.type}`}</Chip>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text variant="headlineMedium" style={{flex: 0.45}}>
                  Full Name
                </Text>
                <Text style={{flex: 0.1}}>:</Text>
                <Paragraph
                onPress={()=> props.navigation.navigate('ProfileView', {details: detailsView})}
                  style={{
                    flex: 0.6,
                    color: COLORS.LAPSI_LAZULI
                  }}>{`${detailsView.firstname} ${detailsView.lastname}`}</Paragraph>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text variant="headlineMedium" style={{flex: 0.45}}>
                  Email Id
                </Text>
                <Text style={{flex: 0.1}}>:</Text>
                <Paragraph
                  // numberOfLines={1}
                  onPress={()=> Linking.openURL(`mailto:${detailsView.email}`)}
                  style={{flex: 0.6,color: COLORS.LAPSI_LAZULI}}>{`${detailsView.email}`}</Paragraph>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text variant="headlineMedium" style={{flex: 0.45}}>
                  Phone No
                </Text>
                <Text style={{flex: 0.1}}>:</Text>
                <Paragraph
                  numberOfLines={1}
                  onPress={()=>Linking.openURL(`tel:${detailsView.phone_number}`)}
                  style={{
                    flex: 0.6,
                    color: COLORS.LAPSI_LAZULI
                  }}>{`${detailsView.phone_number}`}</Paragraph>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text variant="headlineMedium" style={{flex: 0.4}}>
                  Status
                </Text>
                <Text style={{flex: 0.1}}>:</Text>
                {detailsView.is_active === true ? (
                  <Chip
                    style={{backgroundColor: COLORS.YELLOW_GREEN, flex: 0.35}}>
                    Available
                  </Chip>
                ) : (
                  <Chip
                    style={{backgroundColor: COLORS.YELLOW_GREEN, flex: 0.6}}>
                    Disable
                  </Chip>
                )}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text variant="headlineMedium" style={{flex: 0.45}}>
                  Gender
                </Text>
                <Text style={{flex: 0.1}}>:</Text>
                <Paragraph
                  numberOfLines={1}
                  style={{flex: 0.6}}>{`${detailsView.gender}`}</Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text variant="headlineMedium" style={{flex: 0.45}}>
                  Address
                </Text>
                <Text style={{flex: 0.1}}>:</Text>
                <Text
                  // numberOfLines={1}
                  style={{flex: 0.6}}>{`${detailsView.address}`}</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExpertiseDetailsScreen;
