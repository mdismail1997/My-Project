import React from 'react';
import { ScrollView, Stack, View } from 'native-base';
import { useSelector } from 'react-redux';
import { SearchBar } from '../components/SearchBar';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { SearchCard } from '../components/SearchCard';
import { DUMMY_IMAGE_URL } from '../utils/constants';
import { appTheme } from '../colorScheme';

export const SearchScreen = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Stack m={4} space="4">
          <SearchBar
            onSearch={(selectedItem, searchTerm) => {
              console.log(selectedItem, searchTerm);
            }}
          />
          <Stack space="2">
            <SearchCard
              title="New Item"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi laudantium consequuntur, enim id voluptas quidem aperiam corporis asperiores nesciunt officia fuga libero cupiditate itaque. Facilis ipsam corporis praesentium ab voluptatibus reiciendis magni iusto laudantium blanditiis maxime hic modi in dolorem, animi doloremque tempore."
              imageURL={DUMMY_IMAGE_URL}
            />
            <SearchCard
              title="New Item 2"
              description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi laudantium consequuntur, enim id voluptas quidem aperiam corporis asperiores nesciunt officia fuga libero cupiditate itaque. Facilis ipsam corporis praesentium ab voluptatibus reiciendis magni iusto laudantium blanditiis maxime hic modi in dolorem, animi doloremque tempore."
              imageURL={DUMMY_IMAGE_URL}
            />
          </Stack>
        </Stack>
      </ScrollView>
    </View>
  );
};
