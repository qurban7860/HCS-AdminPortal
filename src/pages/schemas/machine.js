import * as Yup from 'yup';
import { Snacks } from '../../constants/machine-constants';
import { allowedExtensions, fileTypesMessage } from '../../constants/document-constants';
import { NotRequiredValidateFileType } from '../documents/util/Util'
import { future5yearDate, tomorrow, pastDate } from '../machine/util/index';
import { fDate } from '../../utils/formatTime';

export const machineSchema = Yup.object().shape({
  serialNo: Yup.string().max(6).required().label('Serial Number'),
  name: Yup.string().max(250),
  parentSerialNo: Yup.object().shape({
    serialNo: Yup.string()
  }).nullable(),
  previousMachine: Yup.string(),
  supplier: Yup.object().shape({
    serialNo: Yup.string()
  }).nullable(),
  machineModel: Yup.object().shape({
    name: Yup.string()
  }).nullable(),
  customer: Yup.object().shape({
    name: Yup.string()
  }).nullable().required("Customer Is Required"),
  status: Yup.object().shape({
    name: Yup.string()
  }).nullable(),
  workOrderRef: Yup.string().max(50),
  purchaseDate: Yup.date().typeError('Date Should be Valid').nullable().label('Purchase Date'),
  shippingDate: Yup.date().typeError('Date Should be Valid').max(future5yearDate,`Shipping Date field must be at earlier than ${fDate(future5yearDate)}`)
  .min(pastDate,`Shipping Date field must be at after than ${fDate(pastDate)}`).nullable().label('Shipping Date'),
  installationDate: Yup.date()
  .typeError('Date Should be Valid')
  .max(future5yearDate,`Shipping Date field must be at earlier than ${fDate(future5yearDate)}`)
  .min(pastDate,`Shipping Date field must be at after than ${fDate(pastDate)}`).nullable().label('Installation Date'),
  supportExpireDate: Yup.date()
  .typeError('Date Should be Valid')
  // .min(today,`Support Expiry Date field must be at after than ${fDate(today)}`)
  .nullable().label('Support Expiry Date'),
  installationSite: Yup.object().shape({
    name: Yup.string()
  }).nullable(),
  billingSite: Yup.object().shape({
    name: Yup.string()
  }).nullable(),
  accountManager: Yup.array(),
  projectManager: Yup.array(),
  supportManager: Yup.array(),
  siteMilestone: Yup.string().max(1500),
  description: Yup.string().max(5000),
  isActive: Yup.boolean(),
});

export const machineTransferSchema = Yup.object().shape({
  customer: Yup.object().shape({
    name: Yup.string()
  }).nullable().required("Customer Is Required"),
  
  financialCompany: Yup.object().shape({
    name: Yup.string()
  }).nullable(),

  billingSite: Yup.object().shape({
    name: Yup.string()
  }).nullable(),

  installationSite: Yup.object().shape({
    name: Yup.string()
  }).nullable(),

  shippingDate: Yup.date().typeError('Date Should be Valid').max(future5yearDate,`Shipping Date field must be at earlier than ${fDate(future5yearDate)}`)
  .min(pastDate,`Shipping Date field must be at after than ${fDate(pastDate)}`).nullable().label('Shipping Date'),
  
  installationDate: Yup.date()
  .typeError('Date Should be Valid')
  .max(future5yearDate,`Shipping Date field must be at earlier than ${fDate(future5yearDate)}`)
  .min(pastDate,`Shipping Date field must be at after than ${fDate(pastDate)}`).nullable().label('Installation Date'),
  supportExpireDate: Yup.date()
  .typeError('Date Should be Valid')
  // .min(today,`Support Expiry Date field must be at after than ${fDate(today)}`)
  .nullable()
  .label('Support Expiry Date'),
  status: Yup.object().shape({
    name: Yup.string()
  }).nullable().required("Status Is Required"),

  machineConnection: Yup.array().nullable(),

  machineDocuments: Yup.array().nullable(),

});

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
  description: Yup.string().max(5000),
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

export const MachineServiceRecordSchema = Yup.object().shape({
  recordType:Yup.object().label('Record Type').nullable(),
  serviceRecordConfiguration: Yup.object().label('Service Record Configuration').nullable().required(),
  // serviceDate: Yup.date().label('Service Date').nullable().required,
  serviceDate: Yup.date()
  .typeError('Date Should be Valid')
  .max(tomorrow, `Service Date must be earlier ${fDate(tomorrow,'dd/MM/yyyy')}`).nullable()
  .required().label('Service Date'),
  // customer: Yup.object().label('Customer'), 
  site: Yup.object().label('Site').nullable(),
  // machine: Yup.object().label('Machine'),
  decoiler: Yup.object().label('Decoiler').nullable(),
  technician: Yup.object().label('Technician').nullable(),
  // checkParams:
  serviceNote: Yup.string().max(5000).label('Service Note'),
  maintenanceRecommendation: Yup.string().max(5000).label('Maintenance Recommendation'),
  internalComments: Yup.string().max(5000).label('Internal Comments'),
  suggestedSpares: Yup.string().max(5000).label('Suggested Spares'),
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
  operatorRemarks: Yup.string().max(5000).label('Operator Remarks'),
  isActive: Yup.boolean(),
})

export const ServiceRecordConfigSchema = Yup.object().shape({
  docTitle: Yup.string().max(200).required().label('Document Title'),
  recordType: Yup.object().label('Record Type').required().nullable(),
  docVersionNo: Yup.number().min(1).label('Version No.').required().typeError('Version No. must be a number'),
  noOfApprovalsRequired: Yup.number().min(1).label('Required Approvals').required().typeError('Required Approvals must be a number'),
  // status: Yup.object().label('Status').required().nullable,
  // parentConfig: Yup.object().label('Parent Configuration').nullable(),
  machineModel: Yup.object().label('Model').nullable(),
  category: Yup.object().label('Category').nullable(),
  textBeforeCheckItems: Yup.string().max(5000),
  // Check Params
  // paramListTitle: Yup.string().max(200).label('Item List Title').required(),
  // paramList : Yup.array(),

  textAfterCheckItems: Yup.string().max(5000),
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
