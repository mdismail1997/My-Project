import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Center,
  HStack,
  Text,
  View,
  VStack,
  Button,
  Image,
  ScrollView,
} from 'native-base';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import { useNavigation, useTheme } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setDataIntoStorage } from '../storage';
import {
  RadioButton,
  RadioButtonItem,
  RadioButtonProps,
} from '../components/RadioButton';
import { assetImages } from '../utils/assets';
import { StackNavigationProp } from '@react-navigation/stack';
import { globalStyle } from '../utils/globalStyles';
import { RootStackParamList } from '../types';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
} from '../models';
import { EQUIPRO_SELECTED_LANGUAGE } from '../utils/constants';
import { setAppLanguage } from '../redux';
import { appTheme } from '../colorScheme';

type LangType = 'en' | 'de';

export const SelectLanguage: React.FC = () => {
  const isMount = useRef<boolean>(true);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();

  const [selectedLanguage, setSelectedLanguage] = useState<LangType>(
    globalState.language
  );

  useEffect(() => {
    isMount.current = true;
    if (isMount.current === true) {
      i18n.changeLanguage(selectedLanguage);
    }
    return () => {
      isMount.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange: RadioButtonProps['onChange'] = (value) => {
    i18n.changeLanguage(value as LangType);
    setSelectedLanguage(value as LangType);
  };

  const handleSubmit = async () => {
    dispatch(setAppLanguage(selectedLanguage));
    await setDataIntoStorage(EQUIPRO_SELECTED_LANGUAGE, selectedLanguage);
    navigation.navigate('LogIn');
  };

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewStyle}
      >
        <VStack height="full" space={4} mx={2} justifyContent="center">
          <Center>
            <Text style={globalStyle.customFont} fontSize="4xl">
              {t('Select Language')}
            </Text>
          </Center>
          <Center>
            <Text fontSize="sm" textAlign="center">
              {t('Select your language and continue.')}
            </Text>
          </Center>
          <Center>
            <RadioButton
              value={selectedLanguage}
              onChange={handleChange}
              itemAlign="column"
            >
              <RadioButtonItem
                style={styles.radioBtnItem}
                value="en"
                render={() => (
                  <View>
                    <HStack
                      justifyContent={'space-between'}
                      alignItems="center"
                    >
                      <Text style={styles.textStyle}>{t('English')}</Text>
                      <AntDesignIcons
                        name="checkcircle"
                        size={20}
                        color={colors.text}
                      />
                    </HStack>
                  </View>
                )}
              />
              <RadioButtonItem
                style={styles.radioBtnItem}
                value="de"
                render={() => (
                  <View>
                    <HStack
                      justifyContent={'space-between'}
                      alignItems="center"
                    >
                      <Text style={styles.textStyle}>{t('German')}</Text>
                      <AntDesignIcons
                        name="checkcircle"
                        size={20}
                        color={colors.text}
                      />
                    </HStack>
                  </View>
                )}
              />
            </RadioButton>
          </Center>
          <Center>
            <Button
              colorScheme="blue"
              borderRadius={30}
              onPress={handleSubmit}
              size={'full'}
              height={'12'}
            >
              {t('CONTINUE')}
            </Button>
          </Center>
          <Center>
            <Image
              source={assetImages[`logo-${globalState.colorScheme}`]}
              alt="EquiPro"
              size="2xl"
              resizeMode="contain"
            />
          </Center>
        </VStack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  radioBtnItem: {
    borderRadius: 30,
  },
  textStyle: {
    fontSize: 15,
  },
});
