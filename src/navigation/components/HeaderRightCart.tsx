import React from 'react';
import { StyleSheet } from 'react-native';
import { Badge, Pressable, Box } from 'native-base';
import { useNavigation, useTheme } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { CombineReducersType, InitialUserDetailsType } from '../../models';

export const HeaderRightCart = () => {
  const globalState = useSelector<
    CombineReducersType,
    { cart: InitialUserDetailsType['userData']['cart'] }
  >((state) => ({
    cart: state.userDetails.userData.cart,
  }));
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <Box px={2}>
      <Pressable
        position="relative"
        onPress={() => {
          navigation.navigate('Cart');
        }}
      >
        {({ isPressed }) => (
          <Box
            style={[
              styles.rootStyle,
              isPressed
                ? { borderRadius: 30, backgroundColor: '#06b6d43b' }
                : undefined,
            ]}
          >
            <MaterialIcons name="cart-outline" color={colors.text} size={26} />
            <Badge
              colorScheme="danger"
              position="absolute"
              rounded="full"
              variant="solid"
              top={0}
              right={-2}
            >
              {globalState.cart}
            </Badge>
          </Box>
        )}
      </Pressable>
    </Box>
  );
};

const styles = StyleSheet.create({
  rootStyle: {
    padding: 10,
  },
});
