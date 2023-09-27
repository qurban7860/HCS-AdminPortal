import * as Yup from 'yup';
import { Snacks } from '../../../../constants/machine-constants';

export const NoteSchema = Yup.object().shape({
  note: Yup.string().max(10000).required('Note Field is required!'),
  isActive: Yup.boolean(),
});