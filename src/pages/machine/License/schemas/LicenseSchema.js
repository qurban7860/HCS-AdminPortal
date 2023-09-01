import * as Yup from 'yup';
import { Snacks } from '../../../../constants/machine-constants';

export const LicenseSchema = Yup.object().shape({
  licenseKey: Yup.string().max(1000).required(Snacks.licenseKeyRequired),
  isActive: Yup.boolean(),
});
