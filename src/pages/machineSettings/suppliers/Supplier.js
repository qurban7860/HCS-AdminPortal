import * as Yup from 'yup';

export const SupplierSchema = Yup.object().shape({
    name: Yup.string().max(50).required('Name is required'),
    isActive: Yup.boolean(),
    isDefault: Yup.boolean(),
    contactName: Yup.string().max(50),
    contactTitle: Yup.string().max(50),
    // phone: Yup.string().nullable(),
    // fax: Yup.string().nullable(),
    email: Yup.string().email(),
    website: Yup.string(),
    street: Yup.string().max(50),
    suburb: Yup.string().max(50),
    region: Yup.string().max(50),
    country: Yup.object().label('Country').nullable(),
    city: Yup.string().max(50),
    postcode: Yup.string().max(20),
  });