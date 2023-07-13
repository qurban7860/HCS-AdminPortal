import * as Yup from 'yup';

export const AddSettingSchema = Yup.object().shape({
  techParamValue: Yup.string().max(20),
  isActive: Yup.boolean(),
});
