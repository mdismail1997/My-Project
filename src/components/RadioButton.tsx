import React, { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet, ViewProps } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { View, Text } from 'native-base';

const styles = StyleSheet.create({
  RadioButtonStyle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    marginBottom: 20,
    fontSize: 20,
  },
});

export interface RadioButtonItemProps {
  value: string | number;
  style?: ViewProps['style'];
  render: (color: string | undefined) => JSX.Element;
  disabled?: boolean;
}

/**
 * ### Always use this component inside `RadioButton` tag.
 * @param {RadioButtonItemProps} props
 * @returns {JSX.Element} `JSX.Element`
 */
export const RadioButtonItem = (props: RadioButtonItemProps): JSX.Element => {
  const {
    render,
    value,
    style,
    disabled,
    selectedOptionColor,
    _setValue,
    _value,
  } = props as RadioButtonItemProps & {
    selectedOptionColor: string;
    _setValue?: React.Dispatch<React.SetStateAction<string | number>>;
    _value?: string | number;
  };
  const { colors } = useTheme();
  if (_setValue === undefined || _value === undefined) {
    // eslint-disable-next-line no-console
    console.error(
      '`RadioButtonItem` can only be used as a child of `RadioButton`'
    );
  }

  const selectedColor = value === _value ? selectedOptionColor : undefined;
  const handleRadioBtnPress = () => {
    _setValue?.(value);
  };

  return (
    <TouchableOpacity onPress={handleRadioBtnPress} disabled={disabled}>
      <View
        my={2}
        style={{
          backgroundColor: selectedColor,
          borderColor: selectedColor ?? colors.border,
          ...(style as object),
          borderWidth: 0.6,
          padding: 15,
        }}
      >
        {render(selectedColor)}
      </View>
    </TouchableOpacity>
  );
};

/**
 * Radio Button component
 */
export interface RadioButtonProps {
  value: string | number;
  onChange?: (value: string | number) => void;
  heading?: string;
  itemAlign?: 'row' | 'column';
  selectedOptionColor?: string;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  children,
  value,
  heading,
  onChange,
  itemAlign = 'row',
  selectedOptionColor = '#9EB1AE',
}) => {
  const [_value, _setValue] = useState<RadioButtonItemProps['value']>(value);

  useEffect(() => {
    const isMount = { status: true };
    if (isMount.status === true) {
      onChange?.(_value);
    }
    return () => {
      isMount.status = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_value]);

  const childrenWithProps = React.Children.map<
    React.ReactNode,
    React.ReactNode
  >(children, (child) => {
    return React.cloneElement(
      child as
        | React.ReactElement<any, string | React.JSXElementConstructor<any>>
        | React.ReactPortal,
      {
        _value,
        _setValue,
        selectedOptionColor,
      }
    );
  });
  return (
    <View width="full" style={styles.RadioButtonStyle}>
      {heading !== undefined ? (
        <Text style={styles.textStyle}>{heading}</Text>
      ) : null}
      <View
        width="full"
        style={{
          flexDirection: itemAlign,
          justifyContent: itemAlign === 'row' ? 'space-around' : 'center',
        }}
      >
        {childrenWithProps}
      </View>
    </View>
  );
};
