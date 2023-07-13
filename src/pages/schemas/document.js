import * as Yup from 'yup';
import { Snacks, fileTypesMessage, allowedExtensions } from '../../constants/document-constants';
import validateFileType from '../document/util/validateFileType';

export const AddDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(40, Snacks.docMaxSize),
  // .test('length', 'Document Name must not exceed 40 characters', (value)=>  console.log("value : ",value)),
  description: Yup.string().max(10000),
  multiUpload: Yup.mixed()
    .required(Snacks.fileRequired)
    .test('fileType', fileTypesMessage, validateFileType)
    .nullable(true),
  isActive: Yup.boolean(),
});

export const AddCustomerDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(40),
  description: Yup.string().max(10000),
  images: Yup.mixed()
    .required(Snacks.fileRequired)
    .test('fileType', fileTypesMessage, (value) => {
      if (value && value?.name) {
        const fileExtension = value?.name?.split('.').pop().toLowerCase();
        return allowedExtensions.includes(fileExtension);
      }
      return false;
    })
    .nullable(true),
  isActive: Yup.boolean(),
});

export const EditCustomerDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(40),
  description: Yup.string().max(10000),
  // image: Yup.mixed().required("Image Field is required!"),
  isActive: Yup.boolean(),
});
