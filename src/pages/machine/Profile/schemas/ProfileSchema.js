import * as Yup from 'yup';

export const ProfileSchema = Yup.object().shape({
  defaultName: Yup.string().trim().required('Default name is required'),
  isActive: Yup.boolean(),
});
