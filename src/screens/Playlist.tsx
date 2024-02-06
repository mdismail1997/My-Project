import React from 'react';
import { ListRenderItem, StyleSheet } from 'react-native';
import {
  View,
  Accordion,
  ScrollView,
  FlatList,
  Text,
  Center,
} from 'native-base';
import { useSelector } from 'react-redux';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {
  CombineReducersType,
  InitialAppStateType,
  InitialUserDetailsType,
} from '../models';

interface PlaylistProps {
  playlistType: 'lecture' | 'podcast' | 'video';
  renderItem: ListRenderItem<Record<string, any>>;
  horizontal?: boolean;
}

export const Playlist: React.FC<PlaylistProps> = ({
  renderItem,
  playlistType,
  horizontal,
}) => {
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

  console.log(globalState.userData.playlist);

  return (
    <View flex={1}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={styles.ScrollViewStyle}
      >
        {!globalState.userData?.playlist ? (
          <Text textAlign="center">No Playlist found</Text>
        ) : (
          Object.keys(globalState.userData?.playlist ?? {}).map((el, i) => (
            <Accordion m="2" key={el}>
              <Accordion.Item key={i}>
                <Accordion.Summary
                  _expanded={{
                    _dark: {
                      backgroundColor: '#8ba8a4',
                    },
                    _light: {
                      backgroundColor: 'darkBlue.500',
                    },
                  }}
                >
                  {el}
                  <Accordion.Icon as={AntDesignIcon} name="down" />
                </Accordion.Summary>
                <Accordion.Details>
                  <FlatList
                    data={(
                      globalState.userData.playlist[el] as Record<string, any>[]
                    ).filter(
                      (element) => element.playlistType === playlistType
                    )}
                    ListEmptyComponent={
                      <Center>
                        <Text>No item found.</Text>
                      </Center>
                    }
                    horizontal={horizontal}
                    renderItem={renderItem}
                    keyExtractor={(item) => item?.id}
                  />
                </Accordion.Details>
              </Accordion.Item>
            </Accordion>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollViewStyle: {
    flex: 1,
  },
});
