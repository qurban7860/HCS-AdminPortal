import * as Yup from 'yup';

export const AddSettingSchema = Yup.object().shape({
  techParamValue: Yup.string().max(40),
  isActive: Yup.boolean(),
});
