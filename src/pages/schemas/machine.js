import * as Yup from 'yup';
import { Snacks } from '../../constants/machine-constants';

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
