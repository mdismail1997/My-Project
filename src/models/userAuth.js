import { z as zod } from 'zod';

export const FullPasswordRegex =
  /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*#.!@$%^&(){}[\]:;<>,.?/~_+\-=|\\]).{8,32}$/;

export const User = zod.object({
  userName: zod.string().optional(),
  email: zod
    .string()
    .trim()
    .email()
    .nonempty('Email is required')
    .transform((val) => val.toLowerCase()),

  // password: zod.string(),
  password: zod
    .string()

    .nonempty('Password is required')
    .regex(FullPasswordRegex, 'Password feild is required'),
});

export const forgetPasswordUser = zod.object({
  email: zod
    .string()
    .trim()
    .email()
    .nonempty('Password is required')
    .transform((val) => val.toLowerCase()),
});
export const changePassword = zod.object({
  newpassword: zod.string().regex(FullPasswordRegex, 'Invalid Password'),
  conpassword: zod.string().regex(FullPasswordRegex, 'Invalid Password'),
});
