import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {Header} from '../../components/Header/Header';
import OctIcon from 'react-native-vector-icons/Octicons';

const ProfileScreen = props => {
  // state variables
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [currentJobType, setCurrentJobType] = useState(0);

  const jobType = ['All', 'Public Job', 'Private Job'];

 

  const _renderJobType = () => {
    const selectedItemStyle = {
      borderColor: '#8FCD2D',
      borderWidth: 1,
      borderRadius: 50,
    };
    return (
      <View style={{flexDirection: 'row', marginTop: 20, marginHorizontal: 20}}>
        {jobType.map((e, i) => {
          return (
            <TouchableOpacity
              onPress={() => setCurrentJobType(i)}
              style={[
                i === currentJobType && selectedItemStyle,
                styles.currentJobType,
                {marginLeft: i > 0 ? 12 : 0},
              ]}>
              <Text
                style={[
                  styles.currentJobTypeTitle,
                  {color: i === currentJobType ? '#8FCD2D' : '#000'},
                ]}>
                {e}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const _renderJobData = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <Header {...props} title="Account" />
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
            <View style={styles.editIconContainer}>
              <OctIcon name="pencil" size={16} color="#8FCD2D" />
            </View>
          </View>
          <Text
            style={
              styles.usernameText
            }>{`${detailsView.firstname} ${detailsView.lastname}`}</Text>
          <Text style={styles.memberText}>{'Member Since sep 2016'}</Text>
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteTitle}>{'Quote'}</Text>
            <Text style={styles.quote}>
              {'Price is what you pay. value is what you get ~'}
            </Text>
            <Text style={styles.quoteAuthor}>{'Warren Buffet'}</Text>
          </View>
          <View style={styles.jobTypeContainer}>
            <TouchableOpacity
              // onPress={}
              activeOpacity={0.8}
              style={[
                styles.jobType,
                {backgroundColor: currentJobIndex === 0 ? '#8FCD2D' : '#fff'},
              ]}>
              <Text
                style={[
                  styles.jobTitle,
                  {color: currentJobIndex === 0 ? '#fff' : '#000'},
                ]}>
                {'Chat'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentJobIndex(1)}
              activeOpacity={0.8}
              style={[
                styles.jobType,
                {backgroundColor: currentJobIndex === 1 ? '#8FCD2D' : '#fff'},
              ]}>
              <Text
                style={[
                  styles.jobTitle,
                  {color: currentJobIndex === 1 ? '#fff' : '#000'},
                ]}>
                {'Hire'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* {_renderJobType()} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
