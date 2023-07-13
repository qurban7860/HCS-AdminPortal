import * as Yup from 'yup';
import { Snacks } from '../../../../constants/machine-constants';

export const AddLicenseSchema = Yup.object().shape({
  licenseKey: Yup.string().max(1000).required(Snacks.licenseKeyRequired),
  licenseDetail: Yup.string().max(10000).required(Snacks.licenseDetailRequired),
  isActive: Yup.boolean(),
});
