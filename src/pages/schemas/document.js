import * as Yup from 'yup';
import { Snacks, fileTypesMessage, allowedExtensions } from '../../constants/document-constants';
import validateFileType from '../documents/util/validateFileType';

const maxFiles = JSON.parse( localStorage.getItem('configurations'))?.find( ( c )=> c?.name === 'MAX_UPLOAD_FILES' )

export const AddInniSchema = Yup.object().shape({
  iniJson: Yup.string().test("json", "Invalid JSON format", (value) => {
    try {
      JSON.parse(value);
      return true;
    } catch (error) {
      return false;
    }
  }),
  isActive: Yup.boolean(),
});

export const documentSchema = ( selectedValue ) => Yup.object().shape({
  documentVal: Yup.object().when({
    is: () => selectedValue === "newVersion",
    then: Yup.object().nullable().required().label('Document'),
    otherwise: Yup.object().nullable(),
  }),
  documentCategory: Yup.object().when( {
    is: () => selectedValue === "new",
    then: Yup.object().nullable().required().label('Document Category'),
    otherwise: Yup.object().nullable(),
  }),
  documentType: Yup.object().when( {
    is: () => selectedValue === "new",
    then: Yup.object().nullable().required().label('Document Type'),
    otherwise: Yup.object().nullable(),
  }),
  displayName: Yup.string().when( {
    is: () => selectedValue === "new",
    then: Yup.string().nullable().required().label('Document Name'),
    otherwise: Yup.string().nullable(),
  }),
  files: Yup.mixed()
  .required('File is required!')
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    function (value) {
      return validateFileType({ _this:this, files:value, doc:true, image:true, required:true });
    }
  ).nullable(true),
  referenceNumber: Yup.string().max( 200 )
  .test('Reference number', 'Reference number can not have spaces', numValue =>!(numValue.includes(' '))),

  versionNo: Yup.number()
  .typeError('Version number must be a number')
  .positive("Version number must be a positive number")
  .test('no-spaces', 'Version number cannot have spaces', value => !(value && /\s/.test(value.toString())))
  .max(1000, 'Version number must be less than or equal to 1000')
  .nullable(),

  description: Yup.string().max(10000),
  isActive: Yup.boolean(),
});

export const AddDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(40, Snacks.docMaxSize),
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
export const DocumentCategorySchema = Yup.object().shape({
  name: Yup.string().min(2).max(40).required('Name Field is required!'),
  description: Yup.string().max(10000),
  isActive: Yup.boolean(),
  isDefault: Yup.boolean(),
  customerAccess: Yup.boolean(),
});

export const EditDocumentNameSchema = Yup.object().shape({
  name: Yup.string().max(40),
  description: Yup.string().max(10000),
  isActive: Yup.boolean(),
  customerAccess: Yup.boolean(),
});

export const DocumentTypeSchema = Yup.object().shape({
  category: Yup.object().required().label('Document Category').nullable(),
  name: Yup.string().min(2).max(40).required('Name is required!'),
  description: Yup.string().max(10000),
  isActive: Yup.boolean(),
  isDefault: Yup.boolean(),
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
  description: Yup.string().max(5000),
  isActive: Yup.boolean(),
  isDefault: Yup.boolean(),
  connections: Yup.boolean(),
});
