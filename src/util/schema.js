import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

export const loginSchema = yupResolver(
  Yup.object().shape({
    email: Yup.string()
      .nullable()
      .required('This field is required')
      .email('Invalid email')
      .required('This field is required'),
    password: Yup.string().nullable().required('This field is required'),
  }),
);
export const signUpSchema = yupResolver(
  Yup.object().shape({
    name: Yup.string().nullable().required('This field is required'),
    email: Yup.string()
      .nullable()
      .required('This field is required')
      .email('Invalid email')
      .required('This field is required'),
    password: Yup.string()
      .nullable()
      .min(5, 'At least 5 characters long')
      .max(20, 'Maximum 20 characters are allowed')
      .required('This field is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm password is required'),
  }),
);
