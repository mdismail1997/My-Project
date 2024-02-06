import { z as zod } from 'zod';

export const AddQuerySchema = zod.object({
  name: zod.string().min(1),
  comment: zod.string().min(1),
  type: zod.array(zod.string()).optional(),
  images: zod.array(zod.string()).optional(),
});
export type AddQuerySchema = zod.infer<typeof AddQuerySchema>;
