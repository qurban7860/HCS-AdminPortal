import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../../utils/axios';
import { CONFIG } from '../../../config-global';

// ----------------------------------------------------------------------
const initialState = {
  intial: false,
  formVisibility: false,
  contactEditFormVisibility: false,
  contactMoveFormVisibility: false,
  responseMessage: null,
  activeCardIndex: '',
  contactsListView: false,
  isExpanded: false,
  success: false,
  isLoading: false,
  error: null,
  contacts: [],
  allContacts: [],
  customersContacts: [],
  activeContacts: [],
  spContacts: [],
  activeSpContacts: [],
  contactDialog: false,
  contact: null,
  filterBy: '',
  page: 0,
  rowsPerPage: 100,
  reportHiddenColumns: {
    "isActive": false,
    "formerEmployee": false,
    "customer.name": false,
    "firstName": false,
    "title": false,
    "phoneNumbers": false,
    "email": false,
    "address.country": false,
    "createdAt": false,
    "isArchived": false,
  },
};

const slice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
      state.error = null;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
      state.initial = true;
    },

    // SET TOGGLE
    setContactFormVisibility(state, action) {
      state.formVisibility = action.payload;
    },

    // SET TOGGLE
    setContactEditFormVisibility(state, action) {
      state.contactEditFormVisibility = action.payload;
    },

    // ACTIVE CARD INDEX
    setCardActiveIndex(state, action) {
      state.activeCardIndex = action.payload;
    },


    // CARD IS EXPENDED
    setIsExpanded(state, action) {
      state.isExpanded = action.payload;
    },

    // SET TOGGLE
    setContactMoveFormVisibility(state, action) {
      state.contactMoveFormVisibility = action.payload;
    },

    // SET TOGGLE
    setContactDialog(state, action) {
      state.contactDialog = action.payload;
    },

    // RESET CONTACT
    resetContact(state) {
      state.contact = null;
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    setContactsView(state, action) {
      state.contactsListView = action.payload;
    },
    // RESET CONTACTS
    resetContacts(state) {
      state.contacts = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    // RESET ACTIVE CONTACTS
    resetActiveContacts(state) {
      state.activeContacts = [];
      state.responseMessage = null;
      state.success = false;
      state.isLoading = false;
    },

    resetContactFormsVisiblity(state) {
      state.contactEditFormVisibility = false;
      state.contactMoveFormVisibility = false;
      state.formVisibility = false;
    },

    // GET Customers Contacts
    getCustomersContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.customersContacts = action.payload;
      state.initial = true;
    },

    // RESET ACTIVE CONTACTS
    resetCustomersContacts(state) {
      state.customersContacts = [];
    },
    // RESET ALL CONTACTS
    resetAllContacts(state) {
      state.allContacts = [];
      state.isLoading = false;
    },
    // GET Contacts
    getContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.contacts = action.payload;
      state.initial = true;
    },

    // GET All Contacts
    getAllContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.allContacts = action.payload;
      state.initial = true;
    },

    // GET Contacts
    getActiveContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeContacts = action.payload;
      state.initial = true;
    },

    // GET SP Contacts
    getSPContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.spContacts = action.payload;
      state.initial = true;
    },

    // GET SP Contacts
    getActiveSPContactsSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeSpContacts = action.payload;
      state.initial = true;
    },

    // RESET ACTIVE SP Contacts
    resetActiveSPContacts(state, action) {
      state.isLoading = false;
      state.success = true;
      state.activeSpContacts = [];
      state.initial = true;
    },

    // GET Contact
    getContactSuccess(state, action) {
      state.isLoading = false;
      state.success = true;
      state.contact = action.payload;
      state.initial = true;
    },


    setResponseMessage(state, action) {
      state.responseMessage = action.payload;
      state.isLoading = false;
      state.success = true;
      state.initial = true;
    },

    // Set FilterBy
    setFilterBy(state, action) {
      state.filterBy = action.payload;
    },
    // Set PageRowCount
    ChangeRowsPerPage(state, action) {
      state.rowsPerPage = action.payload;
    },
    // Set PageNo
    ChangePage(state, action) {
      state.page = action.payload;
    },

    setReportHiddenColumns(state, action) {
      state.reportHiddenColumns = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  setContactFormVisibility,
  setContactEditFormVisibility,
  setContactMoveFormVisibility,
  setCardActiveIndex,
  setListActiveIndex,
  setIsExpanded,
  setContactsView,
  resetContact,
  resetContacts,
  resetAllContacts,
  resetActiveContacts,
  resetActiveSPContacts,
  resetCustomersContacts,
  resetContactFormsVisiblity,
  setResponseMessage,
  setFilterBy,
  ChangeRowsPerPage,
  ChangePage,
  setContactDialog,
  setReportHiddenColumns,
} = slice.actions;

// ----------------------------------------------------------------------

export function addContact(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      /* eslint-disable */
      let data = {
        customer: params.customer,
        firstName: params.firstName,
        lastName: params.lastName,
        customer: params.customer,
        title: params.title,
        contactTypes: params.contactTypes,
        phoneNumbers: params?.phoneNumbers?.filter(pN => pN?.contactNumber !== '' || pN?.contactNumber !== undefined) || [],
        email: params.email,
        reportingTo: params.reportingTo?._id || null,
        department: params.department?._id || null,
        isActive: params.isActive,
        formerEmployee: params.formerEmployee,
        address: {}
      };

      /* eslint-enable */
      if (params.street) {
        data.address.street = params.street;
      }
      if (params.suburb) {
        data.address.suburb = params.suburb;
      }
      if (params.city) {
        data.address.city = params.city;
      }
      if (params.region) {
        data.address.region = params.region;
      }
      if (params.postcode) {
        data.address.postcode = params.postcode;
      }
      if (params?.country?.label && params?.country !== null) {
        data.address.country = params.country.label;
      }

      const response = await axios.post(`${CONFIG.SERVER_URL}crm/customers/${params.customer}/contacts`,
        data,
      );
      dispatch(getContact(response?.data?.customerCategory?.customer, response?.data?.customerCategory?._id));
      dispatch(slice.actions.setContactFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Site saved successfully'));
      return response;
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function updateContact(customerId, contactId, params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.setContactEditFormVisibility(false));

    try {
      /* eslint-disable */
      let data = {
        customer: customerId,
        firstName: params.firstName,
        lastName: params.lastName,
        customer: params.customer,
        title: params.title,
        contactTypes: params.contactTypes,
        phoneNumbers: params?.phoneNumbers?.filter(pN => pN?.contactNumber !== '' || pN?.contactNumber !== undefined) || [],
        email: params.email,
        reportingTo: params.reportingTo?._id || null,
        department: params.department?._id || null,
        isActive: params.isActive,
        formerEmployee: params.formerEmployee,
        address: {}
      };

      /* eslint-enable */

      if (params.street) {
        data.address.street = params.street;
      }
      if (params.suburb) {
        data.address.suburb = params.suburb;
      }
      if (params.city) {
        data.address.city = params.city;
      }
      if (params.region) {
        data.address.region = params.region;
      }
      if (params.postcode) {
        data.address.postcode = params.postcode;
      }
      if (params?.country?.label && params.country !== null) {
        data.address.country = params?.country?.label;
      }

      await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerId}/contacts/${contactId}`,
        data
      );
      dispatch(slice.actions.setResponseMessage('Contact updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getSPContacts(cancelToken) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/sp/contacts`,
        {
          params: {
            isArchived: false,
            isActive: true
          },
          cancelToken: cancelToken?.token,
        }
      );
      dispatch(slice.actions.getSPContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      // throw error;
    }
  };
}


// ----------------------------------------------------------------------

export function getCustomerContacts(customerID, isCustomerArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: {
          firstName: 1
        }
      }

      if (isCustomerArchived) {
        params.archivedByCustomer = true;
        params.isArchived = true;
      } else {
        params.isArchived = false;
      }

      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts`, { params });
      dispatch(slice.actions.getCustomersContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ----------------------------------------------------------------------

export function getAllContacts(isArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        isArchived: isArchived || false,
        orderBy: {
          firstName: 1
        },
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/contacts/all`, { params });
      dispatch(slice.actions.getAllContactsSuccess(response.data));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getContacts(customerID, isCustomerArchived) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        orderBy: {
          firstName: 1
        }
      }

      if (isCustomerArchived) {
        params.archivedByCustomer = true;
        params.isArchived = true;
      } else {
        params.isArchived = false;
      }


      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts`, { params });
      dispatch(slice.actions.getContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ------------------------------ get Active Contacts ----------------------------------------

export function getActiveSPContacts(reportingTo) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const params = {
        isActive: true,
        isArchived: false
      }
      if (reportingTo) {
        params.reportingTo = reportingTo;
      }
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/sp/contacts`, { params });
      dispatch(slice.actions.getActiveSPContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ------------------------------ get Active Contacts ----------------------------------------

export function getActiveContacts(customerID) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts`,
        {
          params: {
            isActive: true,
            isArchived: false
          }
        }
      );
      dispatch(slice.actions.getActiveContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}


// ------------------------------ get Contacts against CustomerArray ----------------------------------------

export function getCustomerArrayActiveContacts(customerArr) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/contacts/search`,
        {
          params: {
            isActive: true,
            isArchived: false,
            customerArr
          }
        }
      );
      dispatch(slice.actions.getActiveContactsSuccess(response.data));
      dispatch(slice.actions.setResponseMessage('Contacts loaded successfully'));
    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function getContact(customerID, id) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts/${id}`);
      dispatch(slice.actions.getContactSuccess(response.data));
      // dispatch(slice.actions.setResponseMessage('Contacts Loaded Successfuly'));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function archiveContact(customerID, id) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts/${id}`,
        {
          isArchived: true,
        });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function restoreContact(customerID, id) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axios.patch(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts/${id}`,
        {
          isArchived: false,
        });
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

// ----------------------------------------------------------------------

export function deleteContact(customerID, id) {
  return async (dispatch) => {
    // dispatch(slice.actions.startLoading());
    try {
      const response = await axios.delete(`${CONFIG.SERVER_URL}crm/customers/${customerID}/contacts/${id}`);
      dispatch(slice.actions.setResponseMessage(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

export function moveCustomerContact(params) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    dispatch(slice.actions.setContactEditFormVisibility(false));

    try {
      /* eslint-disable */
      let data = {
        contact: params?.contact,
        customer: params?.customer?._id,
      };

      await axios.post(`${CONFIG.SERVER_URL}crm/customers/${params?.customer?._id}/contacts/moveContact`, data);
      dispatch(slice.actions.setContactMoveFormVisibility(false));
      dispatch(slice.actions.setResponseMessage('Contact updated successfully'));

    } catch (error) {
      console.log(error);
      dispatch(slice.actions.hasError(error.Message));
      throw error;
    }
  };
}

