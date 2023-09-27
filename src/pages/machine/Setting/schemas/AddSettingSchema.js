import * as Yup from 'yup';

export const AddSettingSchema = Yup.object().shape({
  category: Yup.string().max(40),
  isActive: Yup.boolean(),
});
