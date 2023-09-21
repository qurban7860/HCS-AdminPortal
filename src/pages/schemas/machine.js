import * as Yup from 'yup';
import { Snacks } from '../../constants/machine-constants';
import { allowedExtensions, fileTypesMessage } from '../../constants/document-constants';
import { NotRequiredValidateFileType } from '../document/documents/Utills/Util'

export const EditMachineSchema = Yup.object().shape({
  serialNo: Yup.string().required(Snacks.serialNoRequired).max(6),
  name: Yup.string().max(50),
  // parentMachine: Yup.string(),
  // parentSerialNo: Yup.string(),
  // supplier: Yup.string(),
  // machineModel: Yup.string(),
  // status: Yup.string(),
  workOrderRef: Yup.string().max(50),
  // customer:Yup.string(),
  // instalationSite: Yup.string(),
  // billingSite: Yup.string(),
  // accountManager: Yup.string(),
  // projectManager: Yup.string(),
  // supportManager: Yup.string(),
  siteMilestone: Yup.string().max(1500),
  description: Yup.string().max(1500),
  customerTags: Yup.array(),
  isActive: Yup.boolean(),
});

export const AddMachineDocumentSchema = Yup.object().shape({
  displayName: Yup.string().max(50),
  description: Yup.string().max(10000),
  images: Yup.mixed()
    .required(Snacks.DOC_REQUIRED)
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

export const CheckItemsSchema = Yup.object().shape({
  name: Yup.string().required().max(200).label('Name'),
  serviceCategory: Yup.object().label('Service Category').nullable(),
  printName: Yup.string().max(1000).label('Print Name'),
  description: Yup.string().max(5000).label('Description'),
  helpHint: Yup.string().max(50).label('Help Hint'),
  linkToUserManual: Yup.string().max(50).label('Link To User Manual'),
  isRequired: Yup.boolean(),
  inputType: Yup.object().required().label('Input Type').nullable(),
  unitType: Yup.object().label('Unit Type').nullable(),
  // minValidation: Yup.number().min(0).max(100).label('Minimum Validation').nullable(),
  // maxValidation: Yup.number().min(0).max(100).label('Max Validation').nullable(),
  isActive: Yup.boolean(),
})
const currentDate = new Date();
const day = currentDate.getDate();
const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
const year = currentDate.getFullYear();

const dateCheck = `${year}-${month}-${day+1}`;
export const MachineServiceRecordSchema = Yup.object().shape({
  recordType:Yup.object().label('Record Type').nullable(),
  serviceRecordConfig: Yup.object().label('Service Record Configuration').nullable().required(),
  // serviceDate: Yup.date().label('Service Date').nullable().required,
  serviceDate: Yup.date()
  .max(dateCheck).nullable()
  .required().label('Service Date'),
  // customer: Yup.object().label('Customer'), 
  site: Yup.object().label('Site').nullable(),
  // machine: Yup.object().label('Machine'),
  decoiler: Yup.object().label('Decoiler').nullable(),
  technician: Yup.object().label('Technician').nullable(),
  // checkParams:
  serviceNote: Yup.string().label('Service Note'),
  maintenanceRecommendation: Yup.string().label('Maintenance Recommendation'),
  suggestedSpares: Yup.string().label('Suggested Spares'),
  files: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),

  checkParamFiles: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles1: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles2: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles3: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles4: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles5: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles6: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles7: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles8: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles9: Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  checkParamFiles10:Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true), 
  checkParamFiles11:Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true), 
  checkParamFiles12:Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true), 
  checkParamFiles13:Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true), 
  checkParamFiles14:Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true), 
  checkParamFiles15:Yup.mixed()
  .test(
    'fileType',
    'Only the following formats are accepted: .jpeg, .jpg, gif, .bmp, .webp, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx',
    NotRequiredValidateFileType
  ).nullable(true),
  operator: Yup.object().label('Operator').nullable(),
  operatorRemarks: Yup.string().label('Operator Remarks'),
  isActive: Yup.boolean(),
})

export const ServiceRecordConfigSchema = Yup.object().shape({
  recordType: Yup.object().label('Record Type').required().nullable(),
  docTitle: Yup.string().max(200).required().label('Document Title'),
  machineModel: Yup.object().label('Model').nullable(),
  category: Yup.object().label('Category').nullable(),
  textBeforeCheckItems: Yup.string().max(4000),
  // Check Params
  // paramListTitle: Yup.string().max(200).label('Item List Title').required(),
  // paramList : Yup.array(),

  textAfterCheckItems: Yup.string().max(4000),
  isOperatorSignatureRequired: Yup.boolean(),
  enableNote: Yup.boolean(),
  enableMaintenanceRecommendations: Yup.boolean(),
  enableSuggestedSpares: Yup.boolean(),

  // header
  headerType: Yup.object().label('Header Type').nullable(),
  headerLeftText: Yup.string().max(200),
  headerCenterText: Yup.string().max(200),
  headerRightText: Yup.string().max(200),

  // footer
  footerType: Yup.object().label('Footer Type').nullable(),
  footerLeftText: Yup.string().max(200),
  footerCenterText: Yup.string().max(200),
  footerRightText: Yup.string().max(200),

  isActive: Yup.boolean()
});
