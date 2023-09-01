import * as Yup from 'yup';
import { Snacks } from '../../constants/machine-constants';
import { allowedExtensions, fileTypesMessage } from '../../constants/document-constants';

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

export const MachineServiceParamsSchema = Yup.object().shape({
  name: Yup.string().required().max(50).label('Name'),
  printName: Yup.string().max(50).label('Print Name'),
  description: Yup.string().max(5000).label('Description'),
  helpHint: Yup.string().max(50).label('Help Hint'),
  linkToUserManual: Yup.string().max(50).label('Link To User Manual'),
  isRequired: Yup.boolean(),
  inputType: Yup.string().max(50).required().label('Input Type'),
  unitType: Yup.string().max(50).label('Unit Type'),    
  minValidation: Yup.string().max(50).label('Minimum Validation'),
  maxValidation: Yup.string().max(50).label('Max Validation'),
  isActive: Yup.boolean(),
})

export const MachineServiceRecordSchema = Yup.object().shape({
  recordType:Yup.date().label('Record Type'),
  serviceRecordConfig: Yup.object().label('Service Record Configuration'),
  serviceDate: Yup.date().label('Service Date'),
  customer: Yup.object().label('Customer'), 
  site: Yup.object().label('Site'),
  machine: Yup.object().label('Machine'),
  decoiler: Yup.object().label('Decoiler'),
  technician: Yup.object().label('Technician'),
  // checkParams:
  serviceNote: Yup.string().label('Service Note'),
  maintenanceRecommendation: Yup.string().label('Maintenance Recommendation'),
  suggestedSpares: Yup.string().label('Suggested Spares'),
  files: Yup.array().label('Files'),
  operator: Yup.object().label('Operator'),
  operatorRemarks: Yup.string().label('Operator Remarks'),
  isActive: Yup.boolean(),
})