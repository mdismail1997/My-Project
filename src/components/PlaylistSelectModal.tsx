import React, { Component } from 'react';
import {
  Stack,
  View,
  Text,
  Select,
  CheckIcon,
  Button,
  AddIcon,
  PresenceTransition,
  Center,
  Input,
} from 'native-base';
import Modal from 'react-native-modal';
import type { Theme } from '@react-navigation/native';
import { addToPlaylist } from '../api/auth';

interface PlaylistSelectModalProps {
  playlists: string[];
  playlistFile: { id: string; [key: string]: any };
  isModalVisible: boolean;
  onClose?: () => void;
  theme: Theme;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
  oldPlaylistName?: string;
  playlistType: 'lecture' | 'podcast' | 'video';
}

interface StateType {
  allPlaylist: string[];
  selectedPlaylist?: string;
  createNewPlaylist: boolean;
  newPlaylistName?: string;
  isSubmitting: boolean;
}

export class PlaylistSelectModal extends Component<
  PlaylistSelectModalProps,
  StateType
> {
  constructor(props: PlaylistSelectModalProps) {
    super(props);
    this.state = {
      allPlaylist: this.props.playlists,
      selectedPlaylist: this.props.playlists[0],
      createNewPlaylist: false,
      newPlaylistName: '',
      isSubmitting: false,
    };
  }

  render() {
    const {
      isModalVisible,
      onClose,
      theme: { colors },
      playlistFile,
      onSuccess,
      onError,
      playlistType,
    } = this.props;

    const handleCreateNewPlaylist = () => {
      if (!this.state.createNewPlaylist) {
        this.setState({ createNewPlaylist: true });
      } else {
        if (this.state.newPlaylistName) {
          this.setState(
            (prevState) => ({
              allPlaylist: [
                ...prevState.allPlaylist,
                this.state.newPlaylistName as string,
              ],
            }),
            () => {
              this.setState({ selectedPlaylist: this.state.newPlaylistName });
            }
          );
        }
        this.setState({ createNewPlaylist: false });
      }
    };

    const handleAddPlaylistName = (value: string) => {
      this.setState({ newPlaylistName: value });
    };

    const handleSubmit = async () => {
      try {
        if (this.state.selectedPlaylist && playlistFile) {
          this.setState({ isSubmitting: true });
          console.log(this.state.selectedPlaylist, playlistFile);
          const response = await addToPlaylist({
            playlistName: this.state.selectedPlaylist,
            playlistFile: {
              ...playlistFile,
              playlistName: this.state.selectedPlaylist,
              playlistType: playlistType,
            },
          });
          onSuccess?.(response.data);
          this.setState({ isSubmitting: false });
        }
      } catch (error) {
        console.error(error);
        onError?.(error);
      }
    };

    return (
      <View>
        <Modal
          onBackdropPress={onClose}
          isVisible={isModalVisible}
          animationIn="zoomIn"
          animationOut="zoomOut"
        >
          <Stack
            padding="4"
            space="2"
            borderRadius="md"
            backgroundColor={colors.card}
          >
            <Text>Choose playlist</Text>
            <Select
              selectedValue={this.state.selectedPlaylist}
              minWidth="200"
              accessibilityLabel="Choose Service"
              placeholder="Choose Service"
              _selectedItem={{
                bg: 'teal.600',
                endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={(itemValue) =>
                this.setState({ selectedPlaylist: itemValue })
              }
            >
              {this.state.allPlaylist.map((el) => (
                <Select.Item key={el} label={el} value={el} />
              ))}
            </Select>
            {this.state.createNewPlaylist && (
              <PresenceTransition
                visible={this.state.createNewPlaylist}
                initial={{
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  opacity: 1,
                  transition: {
                    duration: 250,
                  },
                }}
              >
                <Center w="100%" mt="1">
                  <Input
                    placeholder="Playlist name"
                    w="100%"
                    value={this.state.newPlaylistName}
                    onChangeText={handleAddPlaylistName}
                  />
                </Center>
              </PresenceTransition>
            )}
            <Button
              leftIcon={!this.state.createNewPlaylist ? <AddIcon /> : undefined}
              onPress={handleCreateNewPlaylist}
            >
              {!this.state.createNewPlaylist
                ? 'Create playlist'
                : 'Save playlist'}
            </Button>
            <Button
              colorScheme="red"
              onPress={handleSubmit}
              isLoading={this.state.isSubmitting}
              isLoadingText="Submitting"
            >
              Submit
            </Button>
          </Stack>
        </Modal>
      </View>
    );
  }
}
