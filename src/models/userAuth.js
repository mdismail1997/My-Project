import {z as zod} from 'zod';

export const FullPasswordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+\-=|\\]).{8,32}$/;

export const User = zod.object({
  userName: zod.string().optional(),
  email: zod
    .string()
    .trim()
    .email()
    .transform(val => val.toLowerCase()),
  password: zod.string().regex(FullPasswordRegex, 'Invalid Password'),
});

export const forgetPasswordUser = zod.object({
  email: zod
    .string()
    .trim()
    .email()
    .transform(val => val.toLowerCase()),
});
