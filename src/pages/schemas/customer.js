import * as Yup from 'yup';
import { isNumberLatitude , isNumberLongitude } from '../crm/sites/util/index'

const stringLengthMessage = 'Trading name must not exceed 500 characters';

export const editPortalRegistrationSchema = Yup.object().shape({
  customerName: Yup.string().trim().max(200).label('Customer Name').required(),
  contactPersonName: Yup.string().trim().max(200).label('Contact Person Name'),
  email: Yup.string().email().label('Email').required(),
  phoneNumber: Yup.string().trim().matches(/^[+0-9 ]+$/, 'Phone number must be digits only!').max(20).label('Phone Number'),
  status: Yup.string().max(200).label('Status').nullable(),
  customerNote: Yup.string().trim().max(5000).label('Customer Note'),
  internalNote: Yup.string().trim().max(5000).label('Internal Note'),
  machineSerialNos: Yup.array().typeError("Invalid Machine Serial Nos!")
  .min(1, 'At least one machine serial number is required')
  // .test( 'all-valid-serial-numbers','Each serial number must be exactly 6 digits',
  // (value) => value?.every(serialNo => /^\d{6}$/.test(serialNo)))
  .label('Machine Serial Nos')
  .required('Machine serial numbers are required'),
  address: Yup.string().trim().max(200).label('Address'),
  isActive: Yup.boolean().label('IsActive'),
});

// @root - DocumentEditForm
export const EditCustomerDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(50),
  description: Yup.string().max(10000),
  // image: Yup.mixed().required("Image Field is required!"),
  isActive: Yup.boolean(),
});

export const AddCustomerSchema = Yup.object().shape({
  // Customer detail
  name: Yup.string().label('Customer Name').trim().min(2).max(500).required(),
  code: Yup.string().label('Customer Code').max(20),
  tradingName: Yup.array().label('Trading Name').max(20)
  .test('stringLength', stringLengthMessage, (value) => !(value && value.some( val => val.length > 500 ))),
  ref: Yup.string().label('Reference Number').max(200),
  // phone: Yup.string().label('Phone Number').max(16),
  // fax: Yup.string().label('Fax Number').max(16),
  email: Yup.string().label('Email').trim().email(),
  website: Yup.string().label('Web Site').trim().max(200),
  // Address Information
  street: Yup.string().label('Street').trim().max(200),
  suburb: Yup.string().label('Sub Urban').trim().max(200),
  city: Yup.string().label('City').trim().max(200),
  postcode: Yup.string().label('Post Code').trim().max(200),
  region: Yup.string().label('Region').trim().max(200),
  country: Yup.object().label('Country').nullable(),
  // Billing Information
  billingContactFirstName: Yup.string().label('First Name').trim().max(200),
  billingContactLastName: Yup.string().label('Last Name').trim().max(200),
  billingContactTitle: Yup.string().label('Billing Contact Title').trim().max(200),
  // billingContactPhone: Yup.string().label('Billing Contact Phone Number').trim().max(200),
  billingContactEmail: Yup.string().label('Billing Contact Email').trim().email(),
  // Is Same Contact
  isSameContact: Yup.boolean().label('Same as Billing Contact'),
  // Technical Information
  technicalContactFirstName: Yup.string().label('First Name').trim().max(200),
  technicalContactLastName: Yup.string().label('Last Name').trim().max(200),
  technicalContactTitle: Yup.string().label('Technical Contact Title').trim().max(200),
  // technicalContactPhone: Yup.string().label('Technical Contact Phone Number').trim().max(200),
  technicalContactEmail: Yup.string().label('Technical Contact Email').trim().email(),
  // Account Information
  accountManager: Yup.array(),
  projectManager: Yup.array(),
  supportManager: Yup.array(),
  isActive: Yup.boolean().label('Active'),
  supportSubscription: Yup.boolean().label('Support Subscription'),
  isFinancialCompany: Yup.boolean().label('Is Financial Company'),
  excludeReports: Yup.boolean().label('Exclude Reports'),
});

// @root - EditCustomerSchema
export const EditCustomerSchema = Yup.object().shape({
  name: Yup.string().label('Customer Name').min(2).max(500).required().trim(),
  code: Yup.string().label('Customer Code').max(20),
  tradingName: Yup.array().label('Trading Name').max(20)
  .test('stringLength', stringLengthMessage, (value) => !(value && value.some( val => val.length > 500 ))),
  mainSite: Yup.object().nullable(),
  primaryTechnicalContact: Yup.object().nullable(),
  primaryBillingContact: Yup.object().nullable(),
  accountManager: Yup.array(),
  projectManager: Yup.array(),
  supportManager: Yup.array(),
  updateProductManagers: Yup.boolean().label('Update Product Managers'),
  isActive: Yup.boolean().label('Active'),
  supportSubscription: Yup.boolean().label('Support Subscription'),
  isFinancialCompany: Yup.boolean().label('Is Financial Company'),
  excludeReports: Yup.boolean().label('Exclude Reports'),
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
  formerEmployee: Yup.boolean(),
  country: Yup.object().nullable(),
  phoneNumbers: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().label("Number Type")
      .when('contactNumber', {
        is: (contactNumber) => !!contactNumber,
        then: Yup.string().required('Type is required when contact number is defined!'),
      }).nullable(),
      countryCode: Yup.string().label("Country Code")
        .when('contactNumber', {
          is: (contactNumber) => !!contactNumber,
          then: Yup.string().required('Country code is required when contact number is defined!'),
        })
        .nullable(),
      contactNumber: Yup.string().label("Contact Number").nullable(),
      extensions: Yup.string().label("Extension").nullable(),
    })
  ),
  // isPrimary: Yup.boolean(),
});

export const SiteSchema = Yup.object().shape({
  name: Yup.string().min(2).max(40).required().label('Name'),
  customer: Yup.string(),
  billingSite: Yup.string(),
  email: Yup.string().trim('The contact name cannot include leading and trailing spaces'),
  phoneNumbers: Yup.array().of(
    Yup.object().shape({
      type: Yup.string().label("Number Type")
      .when('contactNumber', {
        is: (contactNumber) => !!contactNumber,
        then: Yup.string().required('Type is required when contact number is defined!'),
      }).nullable(),
      countryCode: Yup.string().label("Country Code")
        .when('contactNumber', {
          is: (contactNumber) => !!contactNumber,
          then: Yup.string().required('Country code is required when contact number is defined!'),
        }).nullable(),
      contactNumber: Yup.string().label("Contact Number").nullable(),
      extensions: Yup.string().label("Extension").nullable(),
    })
  ),
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
  isInternal: Yup.boolean(),
  isActive: Yup.boolean(),
});