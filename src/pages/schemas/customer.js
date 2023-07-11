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
  name: Yup.string().min(2).max(40).required('Name is required'),
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
