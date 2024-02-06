import React from 'react';
import { Center, Text, Stack, Button, Icon } from 'native-base';
import { VideoPlayer } from '../modules/VideoPayer';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import { getAssetURLFromPath } from '../utils/utility';
import { useTheme } from '@react-navigation/native';
import { PlaylistSelectModal } from './PlaylistSelectModal';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux';
import { CombineReducersType, InitialUserDetailsType } from '../models';
import { deleteFromPlaylist } from '../api/auth';

interface VideoTabProps {
  id: string;
  file?: Record<string, any>;
}

export const VideoTab: React.FC<VideoTabProps> = ({ id, file }) => {
  const theme = useTheme();
  const globalState = useSelector<
    CombineReducersType,
    {
      userData: InitialUserDetailsType['userData'];
    }
  >((state) => ({
    userData: state.userDetails.userData,
  }));
  const dispatch = useDispatch();

  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [playlist, setPlaylist] = React.useState<Record<string, any>>();

  React.useEffect(() => {
    const data = (
      Object.values(globalState.userData?.playlist ?? {})?.flatMap(
        (el) => el
      ) as Record<string, any>[]
    )?.reduce((acc, cur) => {
      return { ...(acc ?? {}), [cur?.id]: cur };
    }, {});
    setPlaylist(data ?? {});
  }, [globalState.userData.playlist]);

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

  const handleError = () => {};

  return (
    <Stack space="2">
      <PlaylistSelectModal
        isModalVisible={isModalVisible}
        playlists={Object.keys(globalState.userData?.playlist ?? {})}
        playlistFile={{ ...file, id }}
        theme={theme}
        onClose={handleClose}
        onSuccess={handleAddSuccess}
        onError={handleError}
        playlistType="video"
      />
      <Center>
        <Text fontSize="lg">Here is your video training</Text>
      </Center>
      <VideoPlayer
        video={{
          uri: getAssetURLFromPath(file?.path),
        }}
        videoWidth={1600}
        videoHeight={900}
        thumbnail={{
          uri: 'https://nodeserver.mydevfactory.com:7096/assets/img/equestrian_492200620_1000-79881-new-upload.jpeg',
        }}
        showDuration
      />
      <Button
        onPress={deleteFromList}
        leftIcon={
          <Icon
            as={AntDesignIcons}
            name="heart"
            size="sm"
            color={playlist?.[id] ? theme.colors.primary : theme.colors.text}
          />
        }
        variant="ghost"
        justifyContent="flex-start"
        colorScheme={theme.colors.text}
      >
        Add to my library
      </Button>
    </Stack>
  );
};
