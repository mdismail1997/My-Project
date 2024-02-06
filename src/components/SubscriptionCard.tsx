import React from 'react';
import { Box, VStack, Text, View, Center, Pressable } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { globalStyle } from '../utils/globalStyles';

export const SubscriptionCard = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate('EquiProfession');
      }}
    >
      {({ isPressed }) => (
        <View alignItems="center">
          <Box
            width="full"
            borderWidth="1"
            backgroundColor="blueGray.300"
            _dark={{
              backgroundColor: 'blueGray.600',
            }}
            borderRadius="sm"
            style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
          >
            <VStack space={2} py="3">
              <Center>
                <Text style={globalStyle.headingStyle}>
                  {t('Get your subscription')}
                </Text>
              </Center>
              <Center>
                <Text isTruncated>{t('Start your 05-day free trial')}</Text>
              </Center>
            </VStack>
          </Box>
        </View>
      )}
    </Pressable>
  );
};
