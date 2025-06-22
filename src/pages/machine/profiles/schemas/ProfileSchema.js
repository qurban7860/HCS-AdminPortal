import * as Yup from 'yup';
import validateFileType from '../../../documents/util/validateFileType';

export const ProfileSchema = Yup.object().shape({
  defaultName: Yup.string().trim().required('Default name is required'),
  names: Yup.array(),
  web: Yup.string(),
  flange: Yup.string(),
  thicknessStart: Yup.string(),
  thicknessEnd: Yup.string(),
  type: Yup.string(),
  files: Yup.mixed()
    .test('fileType', '', function (value) {
      return validateFileType({ _this: this, files: value, image: true, doc: true, others: true });
    })
    .nullable(true),
  isActive: Yup.boolean(),
});
