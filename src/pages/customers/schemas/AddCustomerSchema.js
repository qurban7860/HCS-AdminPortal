import * as Yup from 'yup';

export const AddCustomerSchema = Yup.object().shape({
  name: Yup.string().min(2).max(40).required('Name is required'),
  tradingName: Yup.string(),
  mainSite: Yup.string(),
  sites: Yup.array(),
  contacts: Yup.array(),
  accountManager: Yup.string().nullable(),
  projectManager: Yup.string().nullable(),
  supportManager: Yup.string().nullable(),
  // site details
  billingSite: Yup.string(),
  // phone: Yup.string(),
  email: Yup.string()
    .trim('The contact name cannot include leading and trailing spaces')
    .email('Email must be a valid email address'),
  // fax: Yup.string(),
  website: Yup.string(),
  street: Yup.string(),
  suburb: Yup.string(),
  city: Yup.string(),
  postcode: Yup.string(),
  region: Yup.string(),
  // country: Yup.string().nullable(true),

  // billing contact details
  billingFirstName: Yup.string(),
  billingLastName: Yup.string(),
  billingTitle: Yup.string(),
  billingContactTypes: Yup.array(),
  // billingContactPhone: Yup.string(),
  billingContactEmail: Yup.string().email('Email must be a valid email address'),

  // technical contact details
  technicalFirstName: Yup.string(),
  technicalLastName: Yup.string(),
  technicalTitle: Yup.string(),
  technicalContactTypes: Yup.array(),
  // technicalContactPhone: Yup.string(),
  technicalContactEmail: Yup.string().email('Email must be a valid email address'),
  isActive: Yup.boolean(),
});
