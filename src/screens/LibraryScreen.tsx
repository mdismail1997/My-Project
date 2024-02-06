import React, { useState } from 'react';
import {
  GestureResponderEvent,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import {
  Box,
  HStack,
  IconButton,
  PlayIcon,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base';
import { useSelector } from 'react-redux';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import TrackPlayer, {
  Capability,
  State,
  usePlaybackState,
} from 'react-native-track-player';
import { Chip } from '../components/Chip';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { appTheme } from '../colorScheme';
import { Playlist } from './Playlist';
import { getAssetURLFromPath } from '../utils/utility';
import { VideoPlayer } from '../modules/VideoPayer';
import { setDataIntoStorage } from '../storage';
import { EQUIPRO_LAST_PLAYED_AUDIO_ID } from '../utils/constants';

const chipData = ['Lecture', 'Podcast', 'Video'] as const;

export function LibraryScreen() {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { width } = useWindowDimensions();
  const playbackState = usePlaybackState();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedValue, setSelectedValue] =
    useState<typeof chipData[number]>('Lecture');
  const [playingAudioID, setPlayingAudioID] = useState<string>();

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const init = async () => {
    try {
      const check = await TrackPlayer.isServiceRunning();
      if (!check) {
        // Player setup
        await TrackPlayer.setupPlayer();
        // Update options
        await TrackPlayer.updateOptions({
          stoppingAppPausesPlayback: true,
          capabilities: [Capability.Play, Capability.Pause, Capability.Stop],
          // Capabilities that will show up when the notification is in the compact form on Android
          compactCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.Stop,
          ],
          progressUpdateEventInterval: 2,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    init();
  }, []);

  const handlePress = (event: GestureResponderEvent, value: string) => {
    setSelectedValue(value as typeof chipData[number]);
  };

  const playPausePlayer = async (item: any) => {
    if (playbackState !== State.Playing) {
      try {
        // Add a track to the queue
        await TrackPlayer.add({
          id: item.id,
          url: getAssetURLFromPath(item?.path),
          title: item.filename,
          artist: 'equipro',
        });
        // Start playing it
        await TrackPlayer.play();
        setPlayingAudioID(item.id);
        await setDataIntoStorage(EQUIPRO_LAST_PLAYED_AUDIO_ID, item.id);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        // Stop playing it
        await TrackPlayer.pause();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <VStack m={2} space={4}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {chipData.map((el, i) => (
            <Chip
              key={i}
              title={el}
              value={el}
              selected={selectedValue}
              onPress={handlePress}
              width={width / 2 - 30}
            />
          ))}
        </ScrollView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          refreshControl={
            <RefreshControl
              tintColor="grey"
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <Box>
            {selectedValue === 'Podcast' && (
              <Playlist
                playlistType="podcast"
                renderItem={({ item, index }) => {
                  return (
                    <HStack
                      key={index}
                      alignItems="center"
                      space="2"
                      padding="3"
                      backgroundColor={index % 2 !== 0 ? 'gray.300' : undefined}
                    >
                      <IconButton
                        onPress={() => playPausePlayer(item)}
                        variant="ghost"
                        _icon={{
                          as: AntDesignIcons,
                          name:
                            item.id === playingAudioID &&
                            playbackState === State.Playing
                              ? 'pausecircleo'
                              : 'playcircleo',
                        }}
                      />
                      <Text>{item?.filename}</Text>
                    </HStack>
                  );
                }}
              />
            )}
            {selectedValue === 'Lecture' && (
              <Playlist
                playlistType="lecture"
                renderItem={({ item, index }) => {
                  return (
                    <HStack
                      alignItems="center"
                      space="2"
                      padding="3"
                      backgroundColor={index % 2 !== 0 ? 'gray.300' : undefined}
                    >
                      <PlayIcon />
                      <Text>{item?.filename}</Text>
                    </HStack>
                  );
                }}
              />
            )}
            {selectedValue === 'Video' && (
              <Playlist
                playlistType="video"
                horizontal
                renderItem={({ item, index }) => {
                  return (
                    <VStack
                      key={index}
                      justifyContent="center"
                      alignItems="center"
                      space={2}
                    >
                      <VideoPlayer
                        video={{
                          uri: getAssetURLFromPath(item?.path),
                        }}
                        videoWidth={1600}
                        videoHeight={900}
                        thumbnail={{
                          uri: 'https://nodeserver.mydevfactory.com:7096/assets/img/equestrian_492200620_1000-79881-new-upload.jpeg',
                        }}
                        showDuration
                      />
                      <Text>{item?.filename}</Text>
                    </VStack>
                  );
                }}
              />
            )}
          </Box>
        </ScrollView>
      </VStack>
    </View>
  );
}
