import * as Yup from 'yup';
import { Snacks } from '../../../../constants/customer-constants';

export const AddContactSchema = Yup.object().shape({
  firstName: Yup.string().max(40).required("First Name is required!"),
  lastName: Yup.string().max(40),
  title: Yup.string(),
  contactTypes: Yup.array(),
  // phone: Yup.string(),
  email: Yup.string().trim(Snacks.EMAIL_WARN).email(Snacks.EMAIL_INVALID),
  street: Yup.string(),
  suburb: Yup.string(),
  city: Yup.string(),
  region: Yup.string(),
  postcode: Yup.string(),
  isActive: Yup.boolean(),
  // country: Yup.string().nullable()
});
