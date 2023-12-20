import * as Yup from 'yup';

export const AddSettingSchema = Yup.object().shape({
  category: Yup.object().label().nullable().required('Category is required'),
  techParamVal: Yup.object().label().nullable().required('Technical Parameter is required'),
  techParamValue: Yup.string().max(50).required().label('Technical Parameter Value'),
  isActive: Yup.boolean(),
});
