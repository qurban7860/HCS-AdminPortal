import * as Yup from 'yup';

// @root - DocumentEditForm
export const EditCustomerDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(50),
  description: Yup.string().max(10000),
  // image: Yup.mixed().required("Image Field is required!"),
  isActive: Yup.boolean(),
});

// @root - EditCustomerSchema
export const EditCustomerSchema = Yup.object().shape({
  name: Yup.string().trim('Leading and trailing spaces are not allowed')
  .min(2, 'Name must be at least 2 characters long').max(40).required('Name is required'),
  tradingName: Yup.string().max(40),
  // mainSite: Yup.string().nullable(),
  // sites: Yup.array().nullable(),
  isActive: Yup.boolean(),
  // contacts: Yup.array().nullable(),
  // accountManager: Yup.string().nullable(),
  // projectManager: Yup.string().nullable(),
  // supportManager: Yup.string().nullable(),
  // primaryBillingContact: Yup.string().nullable(),
  // primaryTechnicalContact: Yup.string().nullable(),
});

// @root - EditContactSchema
export const EditContactSchema = Yup.object().shape({
  // customer: Yup.string(),
  firstName: Yup.string().max(40).required(),
  lastName: Yup.string().max(40),
  title: Yup.string(),
  contactTypes: Yup.array(),
  // phone: Yup.string(),
  email: Yup.string()
    .trim('The contact name cannot include leading and trailing spaces')
    .email('Email must be a valid email address'),
  street: Yup.string(),
  suburb: Yup.string(),
  city: Yup.string(),
  region: Yup.string(),
  postcode: Yup.string(),
  isActive: Yup.boolean(),
  // country: Yup.string().nullable()
  // isPrimary: Yup.boolean(),
});

