import * as Yup from 'yup';

export const AddSettingSchema = Yup.object().shape({
  category: Yup.object().label().nullable().required('Category is required'),
  techParamVal: Yup.object().label().max(50).nullable().required('Technical Parameter is required'),
  isActive: Yup.boolean(),
});
