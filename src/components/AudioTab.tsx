import React, { useEffect, useState } from 'react';
import { Platform, Share, Alert } from 'react-native';
import {
  Center,
  VStack,
  Text,
  HStack,
  IconButton,
  Button,
  Icon,
  Slider,
  View,
  Skeleton,
  Box,
  Spinner,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import TrackPlayer, {
  useProgress,
  usePlaybackState,
  State,
  Capability,
} from 'react-native-track-player';
import { useTheme } from '@react-navigation/native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'rn-fetch-blob';
import { globalStyle } from '../utils/globalStyles';
import { getAssetURLFromPath } from '../utils/utility';
import { setDataIntoStorage } from '../storage';
import { EQUIPRO_LAST_PLAYED_AUDIO_ID } from '../utils/constants';
import { PlaylistSelectModal } from './PlaylistSelectModal';
import {
  CombineReducersType,
  InitialAppStateType,
  InitialUserDetailsType,
} from '../models';
import { setUserData } from '../redux';
import { deleteFromPlaylist } from '../api/auth';

interface AudioTabProps {
  id: string;
  file?: Record<string, any>;
  audioArtWork?: string;
  reInitialize: boolean;
}

const formatTime = (secs: number) => {
  let minutes = Math.floor(secs / 60);
  let seconds: string | number = Math.ceil(secs - minutes * 60);

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
};

const getFileName = (name: string) => {
  const nameArr = name.split('-');
  const output = nameArr.slice(0, nameArr.length - 2);
  return output.join('');
};

export const AudioTab: React.FC<AudioTabProps> = ({
  id,
  file,
  audioArtWork = '',
  reInitialize = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const globalState = useSelector<
    CombineReducersType,
    {
      language: InitialAppStateType['appLanguage'];
      userData: InitialUserDetailsType['userData'];
    }
  >((state) => ({
    language: state.appDetails.appLanguage,
    userData: state.userDetails.userData,
  }));
  const dispatch = useDispatch();
  const progress = useProgress(1000);
  const playbackState = usePlaybackState();

  const [fileName, setFileName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playlist, setPlaylist] = useState<Record<string, any>>();

  const init = async () => {
    try {
      const check = await TrackPlayer.isServiceRunning();
      console.log('=====check=====>', check);
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
      console.error('=====setupPlayer====>', error);
    }
  };

  useEffect(() => {
    const data = (
      Object.values(globalState.userData?.playlist ?? {})?.flatMap(
        (el) => el
      ) as Record<string, any>[]
    )?.reduce((acc, cur) => {
      return { ...(acc ?? {}), [cur?.id]: cur };
    }, {});
    setPlaylist(data ?? {});
  }, [globalState.userData.playlist]);

  useEffect(() => {
    if (reInitialize) {
      init();
    }
  }, [reInitialize]);

  useEffect(() => {
    const file_name = getFileName(file?.filename ?? '');
    setFileName(file_name);
  }, [file?.filename]);

  const playPausePlayer = async () => {
    if (playbackState !== State.Playing) {
      try {
        // Add a track to the queue
        await TrackPlayer.add({
          id: id,
          url: getAssetURLFromPath(file?.path),
          artwork: audioArtWork,
          title: fileName,
          artist: 'equipro',
        });
        // Start playing it
        await TrackPlayer.play();
        await setDataIntoStorage(EQUIPRO_LAST_PLAYED_AUDIO_ID, id);
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

  const handleSliderChange = (value: number) => {
    TrackPlayer.seekTo(value);
  };

  const handleTenSecBackward = () => {
    if (progress.position > 10) {
      TrackPlayer.seekTo(progress.position - 10);
    }
  };

  const handleTenSecForward = () => {
    if (progress.position < progress.duration - 10) {
      TrackPlayer.seekTo(progress.position + 10);
    }
  };

  const handleMediaDownload = () => {
    const dirs = Platform.select({
      android: RNFetchBlob.fs.dirs.DownloadDir,
      ios: RNFetchBlob.fs.dirs.DocumentDir,
    });
    RNFetchBlob.config({
      fileCache: true,
      path: `${dirs}/${file?.filename}`,
      addAndroidDownloads: {
        useDownloadManager: true,
        title: fileName,
        description: 'An audio that will be download',
        notification: true,
      },
    })
      .fetch('GET', encodeURI(getAssetURLFromPath(file?.path)))
      .then((res) => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        Alert.alert(`The file saved to: ${res.path()}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: getAssetURLFromPath(file?.path),
        url: fileName,
        title: fileName,
      });
      if (result.action === Share.sharedAction) {
        console.log(result);
        // if (result.activityType) {
        // shared with activity type of result.activityType
        // } else {
        // shared
        // }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleAddSuccess = (data: any) => {
    console.log(data);
    setIsModalVisible(false);
    dispatch(
      setUserData({
        ...globalState.userData,
        ...data.data,
      })
    );
  };

  const handleError = (data: any) => {
    console.log(data);
  };

  const deleteFromList = async () => {
    try {
      if (!playlist?.[id]) {
        setIsModalVisible(true);
      } else {
        console.log(playlist?.[id]);
        const response = await deleteFromPlaylist({
          id,
          playlistName: playlist?.[id].playlistName,
          filename: playlist?.[id].filename,
        });
        dispatch(
          setUserData({
            ...globalState.userData,
            ...response.data.data,
          })
        );
        console.log(response.data);
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  };

  console.log('=====playbackState===>>', playbackState);

  return (
    <>
      <PlaylistSelectModal
        isModalVisible={isModalVisible}
        playlists={Object.keys(globalState.userData?.playlist ?? {})}
        playlistFile={{ ...file, id }}
        theme={theme}
        onClose={handleClose}
        onSuccess={handleAddSuccess}
        onError={handleError}
        playlistType="podcast"
      />
      <VStack key="audio" space={4}>
        <Center>
          <FontAwesomeIcons name="microphone" color={colors.text} size={50} />
        </Center>
        <Center>
          {fileName ? (
            <Text style={globalStyle.headingStyle}>{fileName}</Text>
          ) : (
            <Skeleton.Text lines={1} width="50%" />
          )}
        </Center>
        <Center>
          {fileName ? (
            <Text textAlign="center">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </Text>
          ) : (
            <Skeleton.Text lines={2} />
          )}
        </Center>
        <VStack>
          <Slider
            width="full"
            value={progress.position}
            minValue={0}
            maxValue={progress.duration <= 0 ? 100 : progress.duration}
            onChange={handleSliderChange}
          >
            <Slider.Track>
              <View
                position="absolute"
                width={`${progress.buffered * (100 / progress.duration ?? 1)}%`}
                height="full"
                backgroundColor="gray.500"
                rounded="md"
              />
              <Slider.FilledTrack />
            </Slider.Track>
            <Slider.Thumb />
          </Slider>
          <HStack justifyContent="space-between">
            <Text>{formatTime(progress.position)}</Text>
            <Text>{formatTime(progress.duration)}</Text>
          </HStack>
        </VStack>
        <HStack justifyContent="center">
          <IconButton
            onPress={handleTenSecBackward}
            variant="ghost"
            _icon={{
              as: AntDesignIcons,
              name: 'fastbackward',
              color: colors.text,
            }}
          />
          <Box position="relative" justifyContent="center" alignItems="center">
            {playbackState === State.Connecting ? (
              <Spinner
                marginTop={Platform.OS === 'ios' ? 1 : undefined}
                marginLeft={Platform.OS === 'ios' ? 0.5 : undefined}
                size="lg"
              />
            ) : (
              <Box marginX="18px" />
            )}
            <IconButton
              onPress={playPausePlayer}
              variant="ghost"
              position="absolute"
              _icon={{
                as: AntDesignIcons,
                name:
                  playbackState === State.Playing
                    ? 'pausecircleo'
                    : 'playcircleo',
                color: colors.text,
              }}
            />
          </Box>
          <IconButton
            onPress={handleTenSecForward}
            variant="ghost"
            _icon={{
              as: AntDesignIcons,
              name: 'fastforward',
              color: colors.text,
            }}
          />
        </HStack>
        <Button
          onPress={deleteFromList}
          leftIcon={
            <Icon
              as={AntDesignIcons}
              name="heart"
              size="sm"
              color={playlist?.[id] ? colors.primary : colors.text}
            />
          }
          variant="ghost"
          justifyContent="flex-start"
          colorScheme={colors.text}
        >
          Add to my library
        </Button>
        <Button
          leftIcon={<Icon as={AntDesignIcons} name="download" size="sm" />}
          variant="ghost"
          justifyContent="flex-start"
          colorScheme={colors.text}
          onPress={handleMediaDownload}
        >
          Download the library
        </Button>
        <Button
          leftIcon={<Icon as={FontAwesomeIcons} name="share" size="sm" />}
          variant="ghost"
          justifyContent="flex-start"
          colorScheme={colors.text}
          onPress={handleShare}
        >
          Share
        </Button>
      </VStack>
    </>
  );
};
