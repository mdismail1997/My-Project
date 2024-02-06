import {View, Text, SafeAreaView, Image, Modal} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {Header} from '../../components/Header/Header';
import StepIndicator from 'react-native-step-indicator';
import CustomButton from '../../components/CustomButton';

const RecognitionScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={'Recognition'} />
      <Text style={styles.topText}>
        We will <Text style={{color: '#8FCD2D'}}>recognize</Text> your face
      </Text>
      <Image
        source={require('../../Assets/Face/face.png')}
        style={styles.faceImg}
      />
      <View style={{marginTop: 57}}>
        <StepIndicator
          stepCount={3}
          stepStrokeCurrentColor={'red'}
          currentPosition={1}
          customStyles={{
            stepIndicatorSize: 28,
            currentStepIndicatorSize: 28,
            separatorStrokeWidth: 4,
            currentStepStrokeWidth: 0,
            stepStrokeCurrentColor: '#8FCD2D',
            stepStrokeWidth: 0,
            stepStrokeFinishedColor: '#8FCD2D',
            stepStrokeUnFinishedColor: '#D9D9D9',
            separatorFinishedColor: '#8FCD2D',
            separatorUnFinishedColor: '#D9D9D9',
            stepIndicatorFinishedColor: '#8FCD2D',
            stepIndicatorUnFinishedColor: '#D9D9D9',
            stepIndicatorCurrentColor: '#8FCD2D',
            stepIndicatorLabelFontSize: 13,
            currentStepIndicatorLabelFontSize: 13,
            stepIndicatorLabelCurrentColor: '#fff',
            stepIndicatorLabelFinishedColor: '#ffffff',
            stepIndicatorLabelUnFinishedColor: '#000',
          }}
        />
        <Text style={styles.boldText}>
          Please wait and complete all three step
        </Text>
        <Text style={styles.descText}>
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.{' '}
        </Text>
      </View>
      <Modal visible={isModalVisible} transparent animationType="S">
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
            }}>
            <Image
              source={require('../../Assets/faceCheck/faceCheck.png')}
              style={styles.faceCheckImg}
            />
            <Text style={styles.checkText}>
              {'We will successfully recognize\nyour face'}
            </Text>
            <CustomButton
              onPress={() => setIsModalVisible(!isModalVisible)}
              title={'Continue'}
              buttonStyle={{
                borderColor: '#8FCD2D',
                borderWidth: 2,
                backgroundColor: '#fff',
                marginTop: 26,
                marginBottom: 32,
              }}
              titleStyle={{
                color: '#8FCD2D',
              }}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RecognitionScreen;
