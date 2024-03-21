import * as Yup from 'yup';
import { Snacks } from '../../../../../constants/machine-constants';

export const LicenseSchema = Yup.object().shape({
  version: Yup.string().max(50, 'Version must be at most 50 characters'),
  licenseKey: Yup.string().max(2000).required(Snacks.licenseKeyRequired),
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
