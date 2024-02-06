import { z as zod } from 'zod';
import { t } from 'i18next';

export const PhoneNumberRegex =
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
export const FullPasswordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+\-=|\\]).{8,32}$/;

export const User = zod.object({
  fullName: zod.string().optional(),
  publicID: zod
    .string()
    .trim()
    .email()
    .transform((val) => val.toLowerCase()),
  /**
   * Ref: https://stackoverflow.com/a/16699507/6163934
   * E.g.:
   * 123-456-7890
   * (123) 456-7890
   * 123 456 7890
   * 123.456.7890
   * +91 (123) 456-7890
   * 1234567890
   */
  mobileNo: zod
    .string()
    .regex(PhoneNumberRegex, t('phone_validation_message'))
    .optional(),
  /**
   * Ref: https://www.ocpsoft.org/tutorials/regular-expressions/password-regular-expression/
   * At least one digit [0-9]
   * At least one lowercase character [a-z]
   * At least one uppercase character [A-Z]
   * At least one special character [*.!@#$%^&(){}[]:;<>,.?/~_+-=|\]
   * At least 8 characters in length, but no more than 32.
   */
  password: zod.string().regex(FullPasswordRegex, t('Invalid password')),
  avatarURL: zod.string().optional(),
  isTermAccepted: zod.boolean().optional(),
});
export type User = zod.infer<typeof User>;

export const ForgotPasswordSchema = zod.object({
  publicID: zod.union([
    zod
      .string()
      .trim()
      .email()
      .transform((val) => val.toLowerCase()),
    zod.string().regex(PhoneNumberRegex, t('phone_validation_message')),
  ]),
});
export type ForgotPasswordSchema = zod.infer<typeof ForgotPasswordSchema>;

export const UpdatePasswordSchema = zod
  .object({
    newPassword: zod.string().regex(FullPasswordRegex, t('Invalid password')),
    confirmPassword: zod
      .string()
      .regex(FullPasswordRegex, t('Invalid password')),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword;
    },
    { message: t('Passwords do not match'), path: ['confirmPassword'] }
  );
export type UpdatePasswordSchema = zod.infer<typeof UpdatePasswordSchema>;

export const ChangePasswordSchema = zod
  .object({
    currentPassword: zod
      .string()
      .regex(FullPasswordRegex, t('Invalid password')),
    newPassword: zod.string().regex(FullPasswordRegex, t('Invalid password')),
    confirmPassword: zod
      .string()
      .regex(FullPasswordRegex, t('Invalid password')),
  })
  .refine(
    (data) => {
      return data.newPassword === data.confirmPassword;
    },
    { message: t('Passwords do not match'), path: ['confirmPassword'] }
  );
export type ChangePasswordSchema = zod.infer<typeof ChangePasswordSchema>;
