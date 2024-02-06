import React, { useEffect, useState } from 'react';
import { RefreshControl } from 'react-native';
import {
  Button,
  Center,
  Fab,
  Icon,
  ScrollView,
  Stack,
  Text,
  View,
} from 'native-base';
import { useSelector } from 'react-redux';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { useNavigation, useTheme } from '@react-navigation/native';
import { globalStyle } from '../utils/globalStyles';
import { QueryCard } from '../components/QueryCard';
import { appTheme } from '../colorScheme';
import { getQuery } from '../api/auth';

type QueryType = {
  _id: string;
  comment: string;
  email: string;
  name: string;
  reply?: string;
};

export const QueryScreen = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { colors } = useTheme();
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [queryList, setQueryList] = useState<QueryType[]>([]);

  const getQueries = async () => {
    try {
      const res = await getQuery();
      console.log('==========>', res.data.data);
      setQueryList(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQueries();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    getQueries();
    setRefreshing(false);
  };

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flex: 1,
          justifyContent: queryList.length === 0 ? 'center' : undefined,
        }}
        refreshControl={
          <RefreshControl
            tintColor="grey"
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {queryList.length === 0 ? (
          <Stack space={2} m={2} key="no-data-found">
            <Stack space={2}>
              <Center>
                <FontAwesome5Icon name="tasks" size={50} color={colors.text} />
              </Center>
              <Center>
                <Text style={globalStyle.headingStyle}>No data available</Text>
              </Center>
              <Center>
                <Text>
                  Previous you not submitted any query. if any questions in your
                  mind add query
                </Text>
              </Center>
            </Stack>
            <Center>
              <Button
                colorScheme="blue"
                onPress={() => {
                  navigation.navigate('AddQuery');
                }}
                borderRadius={30}
                size="full"
                height={10}
                style={{ margin: 10 }}
              >
                ADD NEW QUERY
              </Button>
            </Center>
          </Stack>
        ) : (
          <Stack space={2} m={2} height="full" key="data-found">
            <Stack space={2}>
              {queryList.map((el, index) => (
                <QueryCard
                  key={index}
                  id={el._id}
                  title={el.name}
                  description={el.comment}
                  reply={el.reply}
                />
              ))}
            </Stack>
            <Fab
              onPress={() => {
                navigation.navigate('AddQuery');
              }}
              renderInPortal={false}
              shadow={2}
              size="sm"
              icon={<Icon color="white" as={AntDesign} name="plus" size="sm" />}
            />
          </Stack>
        )}
      </ScrollView>
    </View>
  );
};
