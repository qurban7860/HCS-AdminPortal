import * as Yup from 'yup';
import { isNumberLatitude , isNumberLongitude } from '../customer/site/util/index'

// @root - DocumentEditForm
export const EditCustomerDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(50),
  description: Yup.string().max(10000),
  // image: Yup.mixed().required("Image Field is required!"),
  isActive: Yup.boolean(),
});

// @root - EditCustomerSchema
export const EditCustomerSchema = Yup.object().shape({
  code: Yup.string().max(20),
  name: Yup.string().trim('Leading and trailing spaces are not allowed')
  .min(2, 'Name must be at least 2 characters long').max(40).required('Name is required'),
  tradingName: Yup.string().max(40),
  // mainSite: Yup.string().nullable(),
  // sites: Yup.array().nullable(),
  isActive: Yup.boolean(),
  // contacts: Yup.array().nullable(),
  accountManager: Yup.array(),
  projectManager: Yup.array(),
  supportManager: Yup.array(),
  // primaryBillingContact: Yup.string().nullable(),
  // primaryTechnicalContact: Yup.string().nullable(),
});

// @root - ContactSchema
export const ContactSchema = Yup.object().shape({
  // customer: Yup.string(),
  firstName: Yup.string().max(40).required(),
  lastName: Yup.string().max(40),
  title: Yup.string(),
  contactTypes: Yup.array(),
  // phone: Yup.string(),
  email: Yup.string()
    .trim('The contact name cannot include leading and trailing spaces')
    .email('Email must be a valid email address'),
  reportingTo: Yup.object().nullable().label('Report to'),
  department: Yup.object().nullable().label('Department'),
  street: Yup.string(),
  suburb: Yup.string(),
  city: Yup.string(),
  region: Yup.string(),
  postcode: Yup.string(),
  isActive: Yup.boolean(),
  country: Yup.object().nullable()
  // isPrimary: Yup.boolean(),
});

export const SiteSchema = Yup.object().shape({
  name: Yup.string().min(2).max(40).required().label('Name'),
  customer: Yup.string(),
  billingSite: Yup.string(),
  // phone: Yup.string().matches(phoneRegExp, {message: "Please enter valid number.", excludeEmptyString: true}).max(15, "too long"),
  email: Yup.string().trim('The contact name cannot include leading and trailing spaces'),
  // fax: Yup.string(),
  website: Yup.string(),
  lat: Yup.string().nullable()
  .max(25, 'Latitude must be less than or equal to 90.9999999999999999999999')
  .test('lat-validation', 'Invalid Latitude!, Latitude must be between -90 to 90 Degree only!', (value) =>{
    if(typeof value === 'string' && value.length > 0 && !(isNumberLatitude(value))){
      return false;
    }
    return true;
  }),
  long: Yup.string().nullable()
  .max(25, 'Longitude must be less than or equal to 180.999999999999999999999')
  .test('long-validation', 'Invalid Longitude!, Longitude must be between -180 to 180 Degree only!', (value) =>{
    if(typeof value === 'string' && value.length > 0 && !(isNumberLongitude(value))){
      return false;
    }
    return true;
  }),
  street: Yup.string(),
  suburb: Yup.string(),
  city: Yup.string(),
  region: Yup.string(),
  postcode: Yup.string(),
  country: Yup.object().nullable(),
  primaryBillingContact: Yup.object().nullable().label('Primary Billing Contact'),
  primaryTechnicalContact: Yup.object().nullable().label('Primary Technical Contact'),
  isActive: Yup.boolean(),
});

export const NoteSchema = Yup.object().shape({
  site: Yup.object().nullable(),
  contact: Yup.object().nullable(),
  note: Yup.string().max(5000).required('Note Field is required!'),
  isActive: Yup.boolean(),
});