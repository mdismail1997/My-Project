import React, { useState } from 'react';
import {
  Button,
  Center,
  FormControl,
  Icon,
  IconButton,
  Input,
  Stack,
  Text,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { ForgotPasswordSchema } from '../models';
import { globalStyle } from '../utils/globalStyles';
import { Formik, FormikConfig, FormikErrors } from 'formik';
import { ZodError, ZodIssueCode } from 'zod';
import { forgotPassword } from '../api/auth';
import { DropdownAlert, DropdownAlertProps } from './DropdownAlert';
import { useTranslation } from 'react-i18next';

interface ForgotPasswordProps extends ForgotPasswordSchema {
  onClose: () => void;
}
const ForgotPasswordNames: Record<
  keyof ForgotPasswordProps,
  keyof ForgotPasswordProps
> = {
  publicID: 'publicID',
  onClose: 'onClose',
};
const ForgotPasswordLabels: Record<keyof ForgotPasswordProps, string> = {
  publicID: 'User ID',
  onClose: '',
};

const validateHandler: FormikConfig<ForgotPasswordProps>['validate'] = (
  values
) => {
  let formikErrors: FormikErrors<ForgotPasswordProps> = {};
  try {
    ForgotPasswordSchema.parse(values);
  } catch (e) {
    const { errors } = e as ZodError;
    errors.forEach((subError) => {
      const path = subError.path.join('.');
      let { message } = subError;
      if (
        path === ForgotPasswordNames.publicID &&
        subError.code === ZodIssueCode.invalid_union
      ) {
        message = 'Invalid email address or phone number.';
      }
      formikErrors = { ...formikErrors, [path]: message };
    });
    return formikErrors;
  }
};

export const ForgotPassword: React.FC<ForgotPasswordProps> = (props) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [showAlert, setShowAlert] = useState<{
    isShowing: DropdownAlertProps['isVisible'];
    status: DropdownAlertProps['status'];
    message: DropdownAlertProps['message'];
  }>({
    isShowing: false,
    status: 'error',
    message: '',
  });

  const onSubmitHandler: FormikConfig<ForgotPasswordProps>['onSubmit'] = async (
    values
  ) => {
    try {
      const output = ForgotPasswordSchema.parse(values);
      console.log(output);

      const data = {
        email: output.publicID,
      };
      const res = await forgotPassword(data);
      if (res.status === 200) {
        navigation.navigate('VerifyOTP', {
          email: output.publicID,
        });
        props.onClose?.();
        return;
      }
    } catch (err: any) {
      if (err.response) {
        setShowAlert({
          isShowing: true,
          message: err.response.data.msg,
          status: 'error',
        });
      }
    }
  };

  const handleModalClose = () => {
    setShowAlert((prevData) => ({ ...prevData, isShowing: false }));
  };

  return (
    <>
      {showAlert.isShowing && (
        <DropdownAlert
          isVisible={showAlert.isShowing}
          status={showAlert.status}
          message={showAlert.message}
          autoClose
          onClose={handleModalClose}
        />
      )}
      <VStack space={3} width="full">
        <IconButton
          onPress={props.onClose}
          alignSelf="flex-end"
          variant="ghost"
          _icon={{
            as: EntypoIcons,
            name: 'cross',
          }}
        />
        <Center>
          <Text style={globalStyle.headingStyle}>
            {t('Forgot Your Password?')}
          </Text>
        </Center>
        <Formik
          initialValues={props}
          onSubmit={onSubmitHandler}
          validate={validateHandler}
        >
          {function FormComponent({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
            isSubmitting,
          }) {
            return (
              <VStack space={2} width="full">
                <Center>
                  <FormControl
                    isRequired
                    isInvalid={
                      touched.publicID && errors.publicID !== undefined
                    }
                  >
                    <Stack>
                      <Input
                        minHeight="12"
                        type="text"
                        defaultValue={values.publicID}
                        placeholder={t(ForgotPasswordLabels.publicID)}
                        onChangeText={handleChange(
                          ForgotPasswordNames.publicID
                        )}
                        onBlur={handleBlur(ForgotPasswordNames.publicID)}
                        variant="rounded"
                        InputLeftElement={
                          <Icon
                            as={<AntDesignIcons name="mail" />}
                            size={5}
                            ml="2"
                            color="muted.400"
                          />
                        }
                      />
                      {touched.publicID === true &&
                        errors.publicID !== undefined && (
                          <FormControl.ErrorMessage
                            ml={2}
                            leftIcon={<WarningOutlineIcon size="xs" />}
                          >
                            {errors.publicID}
                          </FormControl.ErrorMessage>
                        )}
                    </Stack>
                  </FormControl>
                </Center>
                <Center>
                  <Button
                    colorScheme="blue"
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    isLoadingText="SUBMITTING"
                    borderRadius={30}
                    size="full"
                    height={10}
                    style={{ margin: 10 }}
                  >
                    {t('SUBMIT')}
                  </Button>
                </Center>
              </VStack>
            );
          }}
        </Formik>
      </VStack>
    </>
  );
};
