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

// ----------------- Document Category -----------------
export const AddDocumentCategorySchema = Yup.object().shape({
  name: Yup.string().min(2).max(40).required('Name Field is required!'),
  description: Yup.string().max(10000),
  isActive: Yup.boolean(),
  customerAccess: Yup.boolean(),
});

export const EditDocumentNameSchema = Yup.object().shape({
  name: Yup.string().max(40),
  description: Yup.string().max(1500),
  isActive: Yup.boolean(),
  customerAccess: Yup.boolean(),
});

export const AddDocumentTypeSchema = Yup.object().shape({
  // category: Yup.string().min(2).required("Category is required!"),
  name: Yup.string().min(2).max(40).required('Name is required!'),
  description: Yup.string().max(10000),
  isActive: Yup.boolean(),
  customerAccess: Yup.boolean(),
});
// -------------------Machine Documents---------------------
export const EditMachineDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(50),
  description: Yup.string().max(10000),
  // image: Yup.mixed().required("Image Field is required!"),
  isActive: Yup.boolean(),
});

export const AddMachineSchema = Yup.object().shape({
  name: Yup.string().min(2).max(50).required('Name is required'),
  description: Yup.string().max(2000),
  isActive: Yup.boolean(),
  connections: Yup.boolean(),
});
