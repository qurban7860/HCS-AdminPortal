import * as Yup from 'yup';
import { Snacks } from '../../../../constants/machine-constants';

export const EditModelSchema = Yup.object().shape({
  name: Yup.string().min(2).max(50).required(Snacks.nameRequired),
  description: Yup.string().max(2000),
  isDisabled: Yup.boolean(),
});
