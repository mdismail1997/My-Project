import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge, Icon, IconButton, Stack, Pressable, View } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useTheme } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootDrawerParamList, RootStackParamList } from '../../types';

interface HeaderRightProps {
  notificationCount: number;
}

export const HeaderRight: React.FC<HeaderRightProps> = ({
  notificationCount,
}) => {
  const { colors } = useTheme();
  const navigation =
    useNavigation<
      StackNavigationProp<RootStackParamList & RootDrawerParamList>
    >();

  return (
    <Stack direction="row" space={1} px="2" alignItems="center">
      <IconButton
        onPress={() => {
          navigation.navigate('Search');
        }}
        icon={<Icon as={MaterialIcons} name="search" />}
        borderRadius="full"
        _icon={{
          color: colors.text,
          size: 26,
        }}
      />
      <Pressable
        position="relative"
        onPress={() => {
          navigation.navigate('Notification');
        }}
      >
        {({ isPressed }) => (
          <View
            style={[
              styles.rootStyle,
              isPressed
                ? { borderRadius: 30, backgroundColor: '#06b6d43b' }
                : undefined,
            ]}
          >
            <MaterialIcons name="notifications" color={colors.text} size={26} />
            {notificationCount ? (
              <Badge
                colorScheme="danger"
                position="absolute"
                rounded="full"
                variant="solid"
                top={0}
                right={0}
              >
                {notificationCount}
              </Badge>
            ) : null}
          </View>
        )}
      </Pressable>
    </Stack>
  );
};

const styles = StyleSheet.create({
  rootStyle: {
    padding: 10,
  },
});
