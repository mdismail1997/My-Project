import React from 'react';
import { Divider, HStack, Text } from 'native-base';

export interface DividerWithTextProps {
  message: string;
  color?: string;
}

export function DividerWithText({
  message,
  color,
}: DividerWithTextProps): JSX.Element {
  return (
    <HStack alignItems="center">
      <Divider color={color} flex={2} />

      <Text color={color} textAlign="center" variant="caption" flex={1}>
        {message}
      </Text>
      <Divider color={color} flex={2} />
    </HStack>
  );
}
