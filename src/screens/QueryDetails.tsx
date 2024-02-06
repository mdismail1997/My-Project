import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, ScrollView, Accordion, Center, Stack, View } from 'native-base';
import { useSelector } from 'react-redux';
import { RouteProp, useRoute, useTheme } from '@react-navigation/native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RootStackParamList } from '../types';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { appTheme } from '../colorScheme';

export const QueryDetails = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { params } = useRoute<RouteProp<RootStackParamList, 'QueryDetails'>>();
  const { colors } = useTheme();
  const [adminReply, setAdminReply] = useState<string>();

  useEffect(() => {
    setAdminReply(params.reply);

    return () => {};
  }, [params.reply]);

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewStyle}
      >
        <Stack height="100%">
          <Accordion m="4">
            <Accordion.Item>
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
                {params.title}
                <Accordion.Icon as={AntDesignIcon} name="down" />
              </Accordion.Summary>
              <Accordion.Details>
                <Text>{params.description}</Text>
              </Accordion.Details>
            </Accordion.Item>
            {adminReply ? (
              <Accordion.Item>
                <Accordion.Summary>
                  <Text>Admin's reply</Text>
                  <Accordion.Icon as={AntDesignIcon} name="down" />
                </Accordion.Summary>
                <Accordion.Details>
                  <Text>{adminReply}</Text>
                </Accordion.Details>
              </Accordion.Item>
            ) : (
              <></>
            )}
          </Accordion>
          {!adminReply && (
            <Stack justifyContent="center" flex={1}>
              <Center>
                <MaterialIcons name="timer" size={50} color={colors.text} />
              </Center>
              <Center>
                <Text>Admin will reply back shortly</Text>
              </Center>
            </Stack>
          )}
        </Stack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  ScrollViewStyle: {
    flex: 1,
  },
});
