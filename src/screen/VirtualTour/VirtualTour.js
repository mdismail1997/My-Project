import React, { useState } from 'react';
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Button,
} from 'react-native';
import { HeaderComponent } from '../../components';
import { getHeight } from '../../global/common';
import Video from 'react-native-video';
const { width, height } = Dimensions.get('window');

const images = [
  require('../../assets/image/room-big-img.png'),
  require('../../assets/image/room-img-1.png'),
  require('../../assets/image/room-img-2.png'),
  require('../../assets/image/room-img-3.png'),
  require('../../assets/image/room-img-4.png'),
  require('../../assets/image/room-img-5.png'),
];

const vid = [
  require('../../assets/image/roomVideo2.mp4'),
  require('../../assets/image/roomVideo.mp4'),
  require('../../assets/image/earth.mp4')

];

// const videos = [
//   require('../../assets/image/index/roomVideo1.mp4'),
//   require('../../assets/image/index/roomVideo2.mp4'),

// ];

const VirtualTour = ({ navigation }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true); 

  const handleImagePress = index => {
    setSelectedImageIndex(index);
  };
  const handleVideoPress = index => {
    setSelectedVideoIndex(index);
  };

  return (
    <View style={styles.container}>
      <HeaderComponent navigation={navigation} />
      <ScrollView style={{  marginBottom: height / 9,  }}>

      <Text style={styles.virtualtourtext}>Virtual Tour</Text>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={event => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / windowWidth);
          setSelectedImageIndex(index);
        }}
        scrollEventThrottle={200}
        contentOffset={{ x: windowWidth * selectedImageIndex }}>
        {images.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image source={image} style={styles.image} />
            <View style={styles.transparent}>
              <Text style={styles.roompics}>Room Photos</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              index === selectedImageIndex && styles.activeDot,
            ]}
            onPress={() => handleImagePress(index)}
          />
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.previewContainer}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.previewItem,
              index === selectedImageIndex && styles.previewItemActive,
            ]}
            onPress={() => handleImagePress(index)}>
            <Image source={image} style={styles.previewImage} />
          </TouchableOpacity>
        ))}
      </ScrollView>




      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={event => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / windowWidth);
          setSelectedVideoIndex(index);
        }}
        scrollEventThrottle={200}
        contentOffset={{ x: windowWidth * selectedVideoIndex }}>
        {vid.map((video, index) => (
          <View key={index} style={styles.imageContainer}>

<Video source={video}
        //onBuffer={onBuffer}
        //onError={onError}
        style={styles.image}
        resizeMode="cover"
        paused={!isPlaying}  
        repeat={true}
        //paused={ currIndex!== index}
        //paused={!showModal}
        //repeat
        poster={'https://source.unsplash.com/1024x768/?any'}
        posterResizeMode="cover"
      />
      
      {/* <Button
                onPress={() => setIsPlaying(p => !p)}  
                title={isPlaying ? 'Stop' : 'Play'}  
            />   */}

            {/* <Image source={video} style={styles.image} /> */}
            <View style={styles.transparent}>
              <Text style={styles.roompics}>Room Videos</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dotsContainer}>
        {vid.map((video, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              index === selectedVideoIndex && styles.activeDot,
            ]}
            onPress={() => handleVideoPress(index)}
          />
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.previewContainer}>
        {vid.map((video, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.previewItem,
              index === selectedVideoIndex && styles.previewItemActive,
            ]}
            onPress={() => handleVideoPress(index)}>
               <Video source={video}
        //onBuffer={onBuffer}
        //onError={onError}
        
        style={{...styles.previewImage}}
        resizeMode="cover"
        paused={false}
        repeat={true}
        //paused={ currIndex!== index}
        //paused={!showModal}
        //repeat
        poster={'https://source.unsplash.com/1024x768/?any'}
        posterResizeMode="cover"
      />
            {/* <Image source={image} style={styles.previewImage} /> */}
          </TouchableOpacity>
        ))}
      </ScrollView>




     

      </ScrollView>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    //flex:1,
  },
  imageContainer: {
    width: windowWidth,
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  imageContainerVideo: {
    width: windowWidth,
    height: 230,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  image: {
    width: '90%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 5,
    alignSelf: 'center',
  },
  previewContainer: {
    flexDirection: 'row',
    alignSelf:'center'
   // marginTop: 10,
  },
  previewItem: {
    width: 100,
    height: 80,
    marginHorizontal: 5,
    overflow: 'hidden',
    opacity: 0.5,
  },
  previewItemActive: {
    // borderWidth: 2,
    // borderColor: 'blue',
    opacity: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transparent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // opacity: 0.5,
    width: '90%',
    height: 40,
    position: 'relative',
    bottom: 40,
    zIndex: 1,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    justifyContent: 'center',
    alignContent: 'center',
  },
  roompics: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'relative',
    bottom: 30,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginHorizontal: 5,
    backgroundColor: 'gray',
  },
  activeDot: {
    backgroundColor: 'red',
  },
  virtualtourtext: {
    marginTop: getHeight(10),
    alignSelf: 'center',
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default VirtualTour;
