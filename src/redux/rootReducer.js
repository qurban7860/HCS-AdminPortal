import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import userReducer from './slices/securityUser/securityUser';
import customerReducer from './slices/customer/customer';
import siteReducer from './slices/customer/site';
import contactReducer from './slices/customer/contact';
import customerNoteReducer from './slices/customer/customerNote';
import machineReducer from './slices/products/machine';
import supplierReducer from './slices/products/supplier';
import licenseReducer from './slices/products/license'; 
import profileReducer from './slices/products/profile';
import groupReducer from './slices/products/group';
import categoryReducer from './slices/products/category';
import toolReducer from './slices/products/tools';
import techparamcategoryReducer from './slices/products/machineTechParamCategory';
import machinenoteReducer from './slices/products/machineNote';
import serviceReportCommentsReducer from './slices/products/machineServiceReportComments';
import machinestatusReducer from './slices/products/statuses';
import machinemodelReducer from './slices/products/model';
import techparamReducer from './slices/products/machineTechParam';
import techparamReportReducer from './slices/products/machineTechParamReport';
import machineSettingReducer from './slices/products/machineSetting';
import toolInstalledReducer from './slices/products/toolInstalled';
import roleReducer from './slices/securityUser/role';
import countReducer from './slices/dashboard/count';
import documentTypeReducer from './slices/document/documentType';
import documentCategoryReducer from './slices/document/documentCategory';
import customerDocumentReducer from './slices/document/customerDocument';
import machineDocumentReducer from './slices/document/machineDocument';
import documentReducer from './slices/document/document';
import documentFileReducer from './slices/document/documentFile';
import machineConnectionsReducer from './slices/products/machineConnections';
import documentVersionReducer from './slices/document/documentVersion';
import regionReducer from './slices/region/region';
import releasesReducer from './slices/reports/releases';
import moduleReducer from './slices/module/module';
import drawingReducer from './slices/products/drawing';
import configReducer from './slices/config/config';
import checkItemsReducer from './slices/products/machineCheckItems'
import machineServiceReportReducer from './slices/products/machineServiceReport';
import serviceReportTemplateReducer from './slices/products/serviceReportTemplate';
import serviceReportStatusesReducer from './slices/products/serviceReportStatuses';
import serviceCategoryReducer from './slices/products/serviceCategory';
import userInviteReducer from './slices/securityUser/invite';
import blockedCustomerReducer from './slices/securityConfig/blockedCustomers';
import blockedUserReducer from './slices/securityConfig/blockedUsers';
import blacklistIPReducer from './slices/securityConfig/blacklistIP';
import whitelistIPReducer from './slices/securityConfig/whitelistIP';
import departmentReducer from './slices/department/department';
import historicalConfigurationReducer from './slices/products/historicalConfiguration';
import configurationReducer from './slices/products/configuration';
import machineErpLogsReducer from './slices/products/machineErpLogs';
import pm2logsReducer from './slices/logs/pm2Logs';
import dbBackupLogsReducer from './slices/logs/dbBackupLogs';
import machineJiraReducer from './slices/products/machineJira';
import emailsReducer from './slices/email/emails';
import eventReducer from './slices/event/event';
import ticketsReducer from './slices/ticket/tickets';
import ticketIssueTypesReducer from './slices/ticket/ticketSettings/ticketIssueTypes';
import ticketStatusTypesReducer from './slices/ticket/ticketSettings/ticketStatusTypes';
import ticketRequestTypesReducer from './slices/ticket/ticketSettings/ticketRequestTypes';
import ticketChangeReasonsReducer from './slices/ticket/ticketSettings/ticketChangeReasons';
import ticketFaultsReducer from './slices/ticket/ticketSettings/ticketFaults';
import ticketChangeTypesReducer from './slices/ticket/ticketSettings/ticketChangeTypes';
import ticketImpactsReducer from './slices/ticket/ticketSettings/ticketImpacts';
import ticketInvestigationReasonsReducer from './slices/ticket/ticketSettings/ticketInvestigationReasons';
import ticketPrioritiesReducer from './slices/ticket/ticketSettings/ticketPriorities';
import ticketStatusesReducer from './slices/ticket/ticketSettings/ticketStatuses';
import ticketCommentsReducer from './slices/ticket/ticketComments/ticketComment';
import ticketWorkLogsReducer from './slices/ticket/ticketWorkLogs/ticketWorkLog';
import ticketHistoriesReducer from './slices/ticket/ticketHistories/ticketHistory';
import ticketReportsReducer from './slices/ticket/ticketReports/ticketReports';
import customerJiraReducer from './slices/customer/customerJira';
import jiraReducer from './slices/jira/jira';
import apilogsReducer from './slices/logs/apiLogs';
import portalRegistrationReducer from './slices/customer/portalRegistration';
import serviceReportNotesReducer from './slices/products/serviceReportNotes';
import machineDashboardReducer from './slices/products/machineDashboard';
import jobsReducer from "./slices/jobs/jobs"
import articleReducer from "./slices/support/knowledgeBase/article";
import articleCategoryReducer from "./slices/support/supportSettings/articleCategory";
import projectReducer from "./slices/support/project/project";

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const assetPersistConfig = {
  key: 'asset',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const userPersistConfig = {
  key: 'user',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const customerPersistConfig = {
  key: 'customer',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'customers', 'customer']
};

export const contactPersistConfig = {
  key: 'contact',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'contacts', 'contact']
};

export const sitePersistConfig = {
  key: 'site',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'sites', 'site']
};

export const customerNotePersistConfig = {
  key: 'customerNote',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'notes']
};

export const machinePersistConfig = {
  key: 'machine',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'machine', 'machines']
};
export const suppplierPersistConfig = {
  key: 'supplier',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const licensePersistConfig = {
  key: 'license',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const profilePersistConfig = {
  key: 'profile',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const groupPersistConfig = {
  key: 'group',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const categoryPersistConfig = {
  key: 'category',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const toolPersistConfig = {
  key: 'tool',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const techparamcategoryPersistConfig = {
  key: 'techparamcategory',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const machineNotePersistConfig = {
  key: 'machineNote',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const machineDashboardPersistConfig = {
  key: 'machineDashboard',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};

export const serviceReportCommentsPersistConfig = {
  key: 'serviceReportComments',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'comment', 'comments']
};

export const machinestatusPersistConfig = {
  key: 'machinestatus',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machineServiceReportStatusPersistConfig = {
  key: 'serviceReportStatuses',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machinemodelPersistConfig = {
  key: 'machinemodel',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const techparamPersistConfig = {
  key: 'techparam',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const techparamReportPersistConfig = {
  key: 'techparamReport',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machineSettingPersistConfig = {
  key: 'machineSetting',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machineToolInstalledPersistConfig = {
  key: 'toolInstalled',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const userRolesPersistConfig = {
  key: 'role',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'userRoleTypes']
};
export const configPersistConfig = {
  key: 'config',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const countPersistConfig = {
  key: 'count',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const documentTypePersistConfig = {
  key: 'documentType',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const documentCategoryPersistConfig = {
  key: 'documentCategory',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machineDocumentPersistConfig = {
  key: 'machineDocument',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const documentPersistConfig = {
  key: 'document',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const customerDocumentPersistConfig = {
  key: 'customerDocument',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const documentFilePersistConfig = {
  key: 'documentFile',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
};
export const machineConnectionsPersistConfig={
  key: 'machineConnections',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const documentVersionPersistConfig={
  key: 'documentVersion',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const regionPersistConfig={
  key: 'region',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const releasesPersistConfig={
  key: 'releases',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const modulePersistConfig={
  key: 'module',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const drawingPersistConfig={
  key: 'drawing',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const checkItemsPersistConfig={
  key: 'checkItems',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const machineServiceReportPersistConfig={
  key: 'machineServiceReport',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage', 'machineServiceReport', 'machineServiceReports']
}
export const serviceReportTemplatePersistConfig={
  key: 'serviceReportTemplate',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const serviceCategoryPersistConfig={
  key: 'serviceCategory',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const userInvitePersistConfig={
  key: 'userInvite',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const blockedCustomerPersistConfig={
  key: 'blockedCustomer',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const blockedUserPersistConfig={
  key: 'blockedUser',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const blacklistIPPersistConfig={
  key: 'blacklistIP',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const whitelistIPPersistConfig={
  key: 'whitelistIP',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const departmentPersistConfig={
  key: 'department',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const historicalConfigurationPersistConfig={
  key: 'historicalConfiguration',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const configurationPersistConfig = {
  key: 'configuration',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const machineErpLogsPersistConfig = {
  key: 'machineErpLogs',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const machineIntegrationPersistConfig = {
  key: 'machineIntegrationRecord',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const pm2LogsPersistConfig = {
  key: 'pm2Logs',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const dbBackupLogsPersistConfig = {
  key: 'pm2Logs',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const apiLogsPersistConfig = {
  key: 'apiLogs',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const machineJiraPersistConfig = {
  key: 'machineJira',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const emailsPersistConfig = {
  key: 'emails',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const eventPersistConfig = {
  key: 'event',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketsPersistConfig = {
  key: 'tickets',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketIssueTypesPersistConfig = {
  key: 'ticketIssueTypes',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const jobsPersistConfig = {
  key: 'jobs',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketStatusTypesPersistConfig = {
  key: 'ticketStatusTypes',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketRequestTypesPersistConfig = {
  key: 'ticketRequestTypes',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketChangeReasonsPersistConfig = {
  key: 'ticketChangeReasons',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketFaultsPersistConfig = {
  key: 'ticketFaults',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketChangeTypesPersistConfig = {
  key: 'ticketChangeTypes',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketImpactsPersistConfig = {
  key: 'ticketImpacts',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketInvestigationReasonsPersistConfig = {
  key: 'ticketInvestigationReasons',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketPrioritiesPersistConfig = {
  key: 'ticketPriorities',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketStatusesPersistConfig = {
  key: 'ticketStatuses',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketCommentsPersistConfig = {
  key: 'ticketComments',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketWorkLogsPersistConfig = {
  key: 'ticketWorkLogs',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketHistoriesPersistConfig = {
  key: 'ticketHistories',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const ticketReportsPersistConfig = {
  key: 'ticketReports',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const customerJiraPersistConfig = {
  key: 'customerJira',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}
export const jiraPersistConfig = {
  key: 'jira',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const portalRegistrationPersistConfig = {
  key: 'PortalRegistration',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const serviceReportNotesPersistConfig = {
  key: 'serviceReportNotes',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const articlePersistConfig = {
  key: 'article',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const articleCategoryPersistConfig = {
  key: 'articleCategory',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

export const projectPersistConfig = {
  key: 'project',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error', 'initial', 'responseMessage']
}

const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  customer: persistReducer(customerPersistConfig, customerReducer),
  site: persistReducer(sitePersistConfig, siteReducer),
  contact: persistReducer(contactPersistConfig, contactReducer),
  customerNote: persistReducer(customerNotePersistConfig, customerNoteReducer),
  machine: persistReducer(machinePersistConfig, machineReducer),
  supplier: persistReducer(suppplierPersistConfig,supplierReducer),
  license: persistReducer(licensePersistConfig,licenseReducer),
  profile: persistReducer(profilePersistConfig,profileReducer),
  category: persistReducer(categoryPersistConfig,categoryReducer),
  group: persistReducer(groupPersistConfig,groupReducer),
  tool: persistReducer(toolPersistConfig,toolReducer),
  techparamcategory: persistReducer(techparamcategoryPersistConfig,techparamcategoryReducer),
  machineNote: persistReducer(machineNotePersistConfig, machinenoteReducer),
  machineDashboard: persistReducer(machineDashboardPersistConfig, machineDashboardReducer),
  serviceReportComments: persistReducer(serviceReportCommentsPersistConfig, serviceReportCommentsReducer),
  machinestatus: persistReducer(machinestatusPersistConfig, machinestatusReducer),
  machinemodel: persistReducer(machinemodelPersistConfig, machinemodelReducer),
  techparam: persistReducer(techparamPersistConfig, techparamReducer),
  techparamReport: persistReducer(techparamReportPersistConfig, techparamReportReducer),
  machineSetting: persistReducer(machineSettingPersistConfig, machineSettingReducer),
  toolInstalled: persistReducer(machineToolInstalledPersistConfig, toolInstalledReducer),
  role: persistReducer(userRolesPersistConfig, roleReducer),
  count: persistReducer(countPersistConfig, countReducer),
  documentType: persistReducer(documentTypePersistConfig, documentTypeReducer),
  documentCategory: persistReducer(documentCategoryPersistConfig, documentCategoryReducer),
  customerDocument: persistReducer(customerDocumentPersistConfig, customerDocumentReducer),
  machineDocument: persistReducer(machineDocumentPersistConfig, machineDocumentReducer),
  document: persistReducer(documentPersistConfig, documentReducer),
  documentFile: persistReducer(documentFilePersistConfig, documentFileReducer),
  machineConnections: persistReducer(machineConnectionsPersistConfig, machineConnectionsReducer),
  documentVersion: persistReducer(documentVersionPersistConfig, documentVersionReducer),
  region: persistReducer(regionPersistConfig, regionReducer),
  releases: persistReducer(releasesPersistConfig, releasesReducer),
  module: persistReducer(modulePersistConfig, moduleReducer),
  drawing: persistReducer(drawingPersistConfig, drawingReducer),
  config: persistReducer(configPersistConfig, configReducer),
  serviceReportTemplate: persistReducer(serviceReportTemplatePersistConfig, serviceReportTemplateReducer),
  serviceReportStatuses: persistReducer(machineServiceReportStatusPersistConfig, serviceReportStatusesReducer),
  checkItems: persistReducer(checkItemsPersistConfig, checkItemsReducer),
  machineServiceReport: persistReducer(machineServiceReportPersistConfig, machineServiceReportReducer),
  serviceCategory: persistReducer(serviceCategoryPersistConfig, serviceCategoryReducer),
  userInvite: persistReducer(userInvitePersistConfig, userInviteReducer),
  blockedCustomer: persistReducer(blockedCustomerPersistConfig, blockedCustomerReducer),
  blockedUser: persistReducer(blockedUserPersistConfig, blockedUserReducer),
  blacklistIP: persistReducer(blacklistIPPersistConfig, blacklistIPReducer),
  whitelistIP: persistReducer(whitelistIPPersistConfig, whitelistIPReducer),
  department: persistReducer(departmentPersistConfig, departmentReducer),
  historicalConfiguration: persistReducer(historicalConfigurationPersistConfig, historicalConfigurationReducer),
  configuration: persistReducer(configurationPersistConfig, configurationReducer),
  machineErpLogs: persistReducer(machineErpLogsPersistConfig, machineErpLogsReducer),
  pm2Logs: persistReducer(pm2LogsPersistConfig, pm2logsReducer),
  apiLogs: persistReducer(apiLogsPersistConfig, apilogsReducer),
  dbBackupLogs: persistReducer(dbBackupLogsPersistConfig, dbBackupLogsReducer),
  machineJira: persistReducer(machineJiraPersistConfig, machineJiraReducer),
  emails: persistReducer(emailsPersistConfig, emailsReducer),
  event: persistReducer(eventPersistConfig, eventReducer),
  tickets: persistReducer(ticketsPersistConfig, ticketsReducer),
  ticketIssueTypes: persistReducer(ticketIssueTypesPersistConfig, ticketIssueTypesReducer),
  jobs: persistReducer(jobsPersistConfig, jobsReducer),
  ticketRequestTypes: persistReducer(ticketRequestTypesPersistConfig, ticketRequestTypesReducer),
  ticketStatusTypes: persistReducer(ticketStatusTypesPersistConfig, ticketStatusTypesReducer),
  ticketChangeReasons: persistReducer(ticketChangeReasonsPersistConfig, ticketChangeReasonsReducer),
  ticketFaults: persistReducer(ticketFaultsPersistConfig, ticketFaultsReducer),
  ticketChangeTypes: persistReducer(ticketChangeTypesPersistConfig, ticketChangeTypesReducer),
  ticketImpacts: persistReducer(ticketImpactsPersistConfig, ticketImpactsReducer),
  ticketInvestigationReasons: persistReducer(ticketInvestigationReasonsPersistConfig, ticketInvestigationReasonsReducer),
  ticketPriorities: persistReducer(ticketPrioritiesPersistConfig, ticketPrioritiesReducer),
  ticketStatuses: persistReducer(ticketStatusesPersistConfig, ticketStatusesReducer),
  ticketComments: persistReducer(ticketCommentsPersistConfig, ticketCommentsReducer),
  ticketWorkLogs: persistReducer(ticketWorkLogsPersistConfig, ticketWorkLogsReducer),
  ticketHistories: persistReducer(ticketHistoriesPersistConfig, ticketHistoriesReducer),
  ticketReports: persistReducer(ticketReportsPersistConfig, ticketReportsReducer),
  customerJira: persistReducer(customerJiraPersistConfig, customerJiraReducer),
  jira: persistReducer(jiraPersistConfig, jiraReducer),
  portalRegistration: persistReducer( portalRegistrationPersistConfig, portalRegistrationReducer ),
  serviceReportNotes: persistReducer( serviceReportNotesPersistConfig, serviceReportNotesReducer ),
  article: persistReducer(articlePersistConfig, articleReducer),
  articleCategory: persistReducer(articleCategoryPersistConfig, articleCategoryReducer),
  project: persistReducer(projectPersistConfig, projectReducer),
});

export default rootReducer;
