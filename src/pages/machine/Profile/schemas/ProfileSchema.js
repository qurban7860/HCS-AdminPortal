import * as Yup from 'yup';

export const ProfileSchema = Yup.object().shape({
  defaultName: Yup.string().max(200).required('Default name is required'),
  isActive: Yup.boolean(),
});
