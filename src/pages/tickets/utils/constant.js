const issueTypeOptions = ['System Problem', 'Change Request', 'System Incident', 'Service Request'];
const typeOptions = ['Standard', 'Normal', 'Emergency'];
const reasonOptions = [
  'High impact incident',
  'Recurring incident',
  'Non-routine incident',
  'Other',
];
const priorityOptions = ['High', 'Medium', 'Low'];
const impactOptions = [
  'Extensive / Widespread',
  'Significant / Large',
  'Moderate / Limited',
  'Minor / Localized',
];
const changeReasonOptions = ['Repair', 'Upgrade', 'Maintenance', 'New functionality', 'Other'];
const sharingOptions = ['Sharing with TerminusTech', 'No one'];

export default {
  sharingOptions,
  changeReasonOptions,
  impactOptions,
  priorityOptions,
  reasonOptions,
  typeOptions,
  issueTypeOptions,
};
