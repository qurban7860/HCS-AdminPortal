export const Snacks = {
  SAVE_FAILED: 'Update failed',
  SAVE_SUCCESS: 'Update success',

  UPDATE_FAILED: 'Update failed',
  UPDATE_SUCCESS: 'Update success',

  CREATED_FAILED: 'Created failed',
  CREATED_SUCCESS: 'Created success',

  // @root - CustomerViewForm
  FAILED_DELETE: 'Customer Archive failed!',
  // failed verfify
  FAILED_VERIFY: 'Customer verify failed!',

  // @root - CustomerSiteDynamicList - toggkeChecked
  SITE_CLOSE_CONFIRM: 'Close the form before adding a new site',

  // @root - CustomerContactDynamicList - toggkeChecked
  CONTACT_CLOSE_CONFIRM: 'Close the form before adding a new contact',

  // @root - ContactAddForm - Schema
  EMAIL_WARN: 'The email name cannot include leading or trailing spaces',
  EMAIL_INVALID: 'Email must be a valid email address',
};

export const FORMLABELS = {
  SAME_AS: 'Same as billing contact',

  // @root - CustomerEditForm
  CUSTOMER: {
    CODE: {
      label: 'Customer Code',
      name: 'code',
    },
    NAME: {
      label: 'Customer Name*',
      name: 'name',
    },
    TRADING_NAME: {
      label: 'Trading Name / Alias',
      name: 'tradingName',
    },
    MAINSITE: {
      label: 'Main Site',
      name: 'main Site',
    },
    FAX: 'Fax',
    PHONE: 'Phone',
    EMAIL: 'Email',
    WEBSITE: 'Website',
    BILLING_CONTACT: 'Primary Billing Contact',
    TECHNICAL_CONTACT: 'Primary Technical Contact',
    ACCOUNT: 'Account Manager',
    PROJECT: 'Project Manager',
    SUPPORT: 'Support Manager',
    ADDCUSTOMER: 'Add Customer',
    ADDRESSINFORMATION: 'Site Information',
    EDITCUSTOMER: 'Edit Customer',
    CUSTOMERADDRESS: 'Address Information',
    BILLINGCONTACTINFORMATION: 'Billing Contact Information',
    TECHNICALCONTACTINFORMATION: 'Technical Contact Information',
    HOWICKRESOURCESS: 'Howick Recourses',
    MODULESACCESS: 'Customer Portal Access',
  },

  // @root - ContactAddForm
  REPORTINGTO: {
    label: 'Report to',
    name: 'reportingTo',
  },
  DEPARTMENT: {
    label: 'Department',
    name: 'department',
  },
  FIRSTNAME: {
    label: 'First Name*',
    name: 'firstName',
  },
  LASTNAME: {
    label: 'Last Name',
    name: 'lastName',
  },
  TITLE: {
    label: 'Title',
    name: 'title',
  },
  FAX: {
    label: 'Fax',
    name: 'fax',
    flagSize: 'medium',
    defaultCountry: 'NZ',
  },
  PHONE: {
    label: 'Phone',
    name: 'phone',
    flagSize: 'medium',
    defaultCountry: 'NZ',
  },
  CONTACT_TYPES: {
    label: 'Contact Types',
    name: 'contactTypes',
    options: [
      { value: 'Financial', label: 'Financial' },
      { value: 'Sales', label: 'Sales' },
      { value: 'Technical Support', label: 'Technical Support' },
      { value: 'Machine Operator', label: 'Machine Operator' },
      { value: 'Design Team', label: 'Design Team' },
      { value: 'Executive (MD, CEO, GM)', label: 'Executive (MD, CEO, GM)' },
    ],
  },
  EMAIL: {
    label: 'Email',
    name: 'email',
  },
  WEBSITE: {
    label: 'Website',
    name: 'website',
  },

  // @root - ContactAddForm - Address
  STREET: {
    label: 'Street',
    name: 'street',
  },
  SUBURB: {
    label: 'Suburb',
    name: 'suburb',
  },
  CITY: {
    label: 'City',
    name: 'city',
  },
  REGION: {
    label: 'Region',
    name: 'region',
  },
  POSTCODE: {
    label: 'Post Code',
    name: 'postcode',
  },
  COUNTRY: {
    label: 'Country',
    name: 'country',
    id: 'country-select-demo',
    select: 'Select Country',
  },

  BILLING_CONTACT: {
    FIRSTNAME: {
      label: 'First Name',
      name: 'billingFirstName',
    },
    LASTNAME: {
      label: 'Last Name',
      name: 'billingLastName',
    },
    TITLE: {
      label: 'Title',
      name: 'billingTitle',
    },
    PHONE: {
      label: 'Contact Phone',
      name: 'billingContactPhone',
      flagSize: 'medium',
      defaultCountry: 'NZ',
    },
    EMAIL: {
      label: 'Contact Email',
      name: 'billingContactEmail',
    },
  },

  TECHNICAL_CONTACT: {
    FIRSTNAME: {
      label: 'First Name',
      name: 'technicalFirstName',
    },
    LASTNAME: {
      label: 'Last Name',
      name: 'technicalFirstName',
    },
    TITLE: {
      label: 'Title',
      name: 'technicalTitle',
    },
    PHONE: {
      label: 'Contact Phone',
      name: 'technicalContactPhone',
      flagSize: 'medium',
      defaultCountry: 'NZ',
    },
    EMAIL: {
      label: 'Contact Email',
      name: 'technicalContactEmail',
    },
  },
  isACTIVE: {
    label: 'Active',
    name: 'isActive',
  },
};
