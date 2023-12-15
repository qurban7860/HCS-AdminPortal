import * as Yup from 'yup';
import { Snacks } from '../../../../constants/machine-constants';
import { pastDate, today,future20yearDate, formatDate } from '../../util/index';

export const LicenseSchema = Yup.object().shape({
  version: Yup.string().max(50, 'Version must be at most 50 characters'),
  licenseKey: Yup.string().max(2000).required(Snacks.licenseKeyRequired),
  extensionTime: Yup.date()
  .max(future20yearDate,`Extension Date field must be at earlier than ${formatDate(future20yearDate)}!`)
  .min(pastDate,`Extension Date field must be at after than ${formatDate(pastDate)}!`)
  .nullable().required('Extension Date is required!'),

  requestTime: Yup.date()
  .max(future20yearDate,`Request Date field must be at earlier than ${formatDate(future20yearDate)}!`)
  .min(pastDate,`Request Date field must be at after than ${formatDate(pastDate)}!`)
  .nullable().required('Request Date is required!'),
  production: Yup.number().max(999999999999999,'Production must be less than or equal to 999999999999999').typeError('Production must be a number').transform((value, originalValue) => {
    if (typeof originalValue === 'string' && originalValue.trim() === '') return undefined;
    return parseFloat(value);
  }).test('no-spaces', 'Production cannot have spaces', value => !(value && value.toString().includes(' '))),
  waste: Yup.number().max(999999999999999,'Production must be less than or equal to 999999999999999').typeError('Waste must be a number').transform((value, originalValue) => {
    if (typeof originalValue === 'string' &&  originalValue.trim() === '') return undefined;
    return parseFloat(value);
  }).test('no-spaces', 'Waste cannot have spaces', value => !(value && value.toString().includes(' '))),
  isActive: Yup.boolean(),
});
