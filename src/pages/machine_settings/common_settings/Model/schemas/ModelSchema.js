import * as Yup from 'yup';
import { Snacks } from '../../../../../constants/machine-constants';

export const ModelSchema = Yup.object().shape({
  name: Yup.string().min(2).max(50).required(Snacks.nameRequired),
  category: Yup.object().required().label('Category').nullable(),
  description: Yup.string().max(5000),
  isDisabled: Yup.boolean(),
});
