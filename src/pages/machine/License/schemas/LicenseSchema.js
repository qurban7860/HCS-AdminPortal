import * as Yup from 'yup';
import { Snacks } from '../../../../constants/machine-constants';

export const LicenseSchema = Yup.object().shape({
  licenseKey: Yup.string().max(1000).required(Snacks.licenseKeyRequired),
  production: Yup.number().typeError('Production must be a number').transform((value, originalValue) => {
    if (typeof originalValue === 'string' && originalValue.trim() === '') return undefined;
    return parseFloat(value);
  }).test('no-spaces', 'Production cannot have spaces', value => !(value && value.toString().includes(' '))),
  waste: Yup.number().typeError('Waste must be a number').transform((value, originalValue) => {
    if (typeof originalValue === 'string' &&  originalValue.trim() === '') return undefined;
    return parseFloat(value);
  }).test('no-spaces', 'Waste cannot have spaces', value => !(value && value.toString().includes(' '))),
  isActive: Yup.boolean(),
});
