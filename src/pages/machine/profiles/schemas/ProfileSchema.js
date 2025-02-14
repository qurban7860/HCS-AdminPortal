import * as Yup from 'yup';
import { validateFileType } from '../../../documents/util/Util';
import { fileTypesMessage } from '../../../../constants/document-constants';

export const ProfileSchema = Yup.object().shape({
  defaultName: Yup.string().trim().required('Default name is required'),
  names: Yup.array(),
  web: Yup.string(),
  flange: Yup.string(),
  thicknessStart: Yup.string(),
  thicknessEnd: Yup.string(),
  type: Yup.string(),
  files: Yup.mixed()
    .test('fileType', fileTypesMessage, validateFileType)
    .nullable(true),
  isActive: Yup.boolean(),
});
