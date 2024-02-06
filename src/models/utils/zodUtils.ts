import { z as zod } from 'zod';
import type { FormikErrors } from 'formik';
import { set } from 'lodash-es';

export type ZodObject = zod.ZodObject<zod.ZodRawShape>;
export type ZodObjectWithEffects =
  | ZodObject
  | zod.ZodEffects<ZodObject>
  | zod.ZodEffects<zod.ZodEffects<ZodObject>>;

/**
 * Checks whether a given Zod error has a sunion type sub error
 * @param err
 */
function findZodUnionError(
  err?: zod.ZodError
): zod.ZodInvalidUnionIssue | undefined {
  let unionError: zod.ZodInvalidUnionIssue | undefined;
  if (err !== undefined) {
    unionError = err.errors.find((subErr) => {
      return subErr.code === zod.ZodIssueCode.invalid_union;
    }) as zod.ZodInvalidUnionIssue | undefined;
  }
  return unionError;
}

/**
 * Finds the smallest array in array of Zod errors.
 * In case 2 errors have the same length, returns the first one.
 * @param errors
 */
function findSmallestZodError(
  errors?: zod.ZodError[]
): zod.ZodError | undefined {
  let smallestError: zod.ZodError | undefined;
  if (errors !== undefined) {
    const errorLengths = errors.map((err) => {
      return err.errors.length;
    });
    const smallestErrorLength = Math.min(...errorLengths);
    smallestError = errors.find((err) => {
      return err.errors.length === smallestErrorLength;
    }) as zod.ZodError;
  }
  return smallestError;
}

export const CustomZodErrorMap: zod.ZodErrorMap = (issue, ctx) => {
  let output = { message: issue.message ?? ctx.defaultError };
  if (issue.code === zod.ZodIssueCode.invalid_type) {
    if (
      (['nan', 'null', 'undefined'].includes(issue.expected) === false &&
        ['nan', 'null', 'undefined'].includes(issue.received) === true) ||
      (issue.expected === 'number' &&
        issue.received === 'string' &&
        ctx.data === '')
    ) {
      output = { message: 'This is a required field' };
    }
  }
  return output;
};

/**
 * Map Zod errors to Formik errors
 * @param zodError
 */
function mapZodErrorsToFormikErrors<T>(
  zodError: zod.ZodError
): FormikErrors<T> {
  const formErrors: FormikErrors<T> = {};
  const subErrors = zodError.errors;
  subErrors.forEach((subError) => {
    if (subError.code !== zod.ZodIssueCode.invalid_union) {
      set(formErrors, subError.path, subError.message);
    } else if (subError.unionErrors.length > 0) {
      const smallestError = findSmallestZodError(subError.unionErrors);
      const unionError = findZodUnionError(smallestError);
      if (unionError !== undefined) {
        set(
          formErrors,
          unionError.path,
          unionError.unionErrors[0].errors[0].message
        );
      } else if (smallestError !== undefined) {
        set(
          formErrors,
          smallestError.errors[0].path,
          smallestError.errors[0].message
        );
      }
    }
  });

  return formErrors;
}

/**
 * Generate formik errors for forms
 * @param zodObject
 * @param values
 * @returns
 */
export function generateFormikErrors<T>(
  zodObject: ZodObjectWithEffects,
  values: T
): FormikErrors<T> {
  let formErrors: FormikErrors<T> = {};
  try {
    zodObject.parse(values, {
      errorMap: CustomZodErrorMap,
    });
  } catch (e) {
    formErrors = mapZodErrorsToFormikErrors<T>(e as zod.ZodError);
  }
  return formErrors;
}
