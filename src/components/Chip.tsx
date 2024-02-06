import React from 'react';
import { Badge, Center, Pressable, Text, IBadgeProps } from 'native-base';
import { useTheme } from '@react-navigation/native';
import { GestureResponderEvent } from 'react-native';

export interface ChipProps {
  title: string;
  value: string;
  onPress?: (event: GestureResponderEvent, value: string) => void;
  selected?: string;
  width?: IBadgeProps['width'];
}

export const Chip: React.FC<ChipProps> = ({
  title,
  onPress,
  value,
  selected,
  width,
}) => {
  const { colors } = useTheme();

  const onSelect = (ev: GestureResponderEvent) => {
    onPress?.(ev, value);
  };

  return (
    <Pressable onPress={onSelect} m={1}>
      {({ isPressed }) => (
        <Badge
          rounded="full"
          style={{
            backgroundColor:
              selected === value ? colors.notification : colors.border,
            transform: [
              {
                scale: isPressed ? 0.96 : 1,
              },
            ],
          }}
          variant="solid"
          minWidth="24"
          minHeight="12"
          padding="2"
          width={width}
        >
          <Center>
            <Text
              color={selected === value ? colors.background : undefined}
              fontSize="md"
            >
              {title}
            </Text>
          </Center>
        </Badge>
      )}
    </Pressable>
  );
};
