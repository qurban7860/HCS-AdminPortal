import * as Yup from 'yup';

export const ProfileSchema = Yup.object().shape({
  defaultName: Yup.string().max(50,"Default name must be at most 50 characters").required('Default name is required'),
  isActive: Yup.boolean(),
});
