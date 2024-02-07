import * as Yup from 'yup';

export const addUserSchema = Yup.object().shape({
    customer: Yup.object().required().label('Customer').nullable(),
    contact: Yup.object().nullable().label('Contact'),
    name: Yup.string().required().max(200).label('Full Name'),
    phone: Yup.string().label('Phone Number'),
    email: Yup.string().email().label('Email Address').trim().required().max(200),
    password: Yup.string().min(8, 'Password must be at least 8 characters').label('Password').trim(),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .label('Password Confirmation')
      .trim()
      .required('Password confirmation is required'),
    roles: Yup.array().nullable().label('Roles'),
    regions: Yup.array().nullable(),
    customers: Yup.array().nullable(),
    machines: Yup.array().nullable(),
    isActive: Yup.boolean(),
    multiFactorAuthentication: Yup.boolean(),
    currentEmployee: Yup.boolean()
  });

  export const editUserSchema = Yup.object().shape({
    customer: Yup.object().required().label('Customer').nullable(),
    contact: Yup.object().nullable().label('Contact'),
    name: Yup.string().required().max(200).label('Full Name'),
    phone: Yup.string().label('Phone Number'),
    email: Yup.string().email().label('Email Address').trim().required().max(200),
    loginEmail: Yup.string().email().label('Login Email Address').trim().required().max(200),
    roles: Yup.array().nullable().label('Roles'),
    regions: Yup.array().nullable(),
    customers: Yup.array().nullable(),
    machines: Yup.array().nullable(),
    isActive: Yup.boolean(),
    multiFactorAuthentication: Yup.boolean(),
    currentEmployee: Yup.boolean()
  });