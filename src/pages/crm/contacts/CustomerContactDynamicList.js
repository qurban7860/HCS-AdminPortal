import PropTypes from 'prop-types';
import { useState, useEffect, useCallback } from 'react';
// @mui
import { Stack, Grid, Container, Autocomplete, TextField, Table, TableBody, Button, ButtonGroup } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { CardBase, GridBaseViewForm } from '../../../theme/styles/customer-styles';
import AddButtonAboveAccordion from '../../../components/Defaults/AddButtonAboveAcoordion';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
import { PATH_CRM } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { TableNoData, useTable, getComparator } from '../../../components/table';
// sections
import {
  getContacts,
  resetContacts,
  setContactsView,
  setCardActiveIndex,
  setIsExpanded,
} from '../../../redux/slices/customer/contact';
import ContactAddForm from './ContactAddForm';
import ContactEditForm from './ContactEditForm';
import ContactViewForm from './ContactViewForm';
import ContactMoveForm from './ContactMoveForm';
import BreadcrumbsProvider from '../../../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../../../components/Breadcrumbs/BreadcrumbsLink';
import useResponsive from '../../../hooks/useResponsive';
// import useLimitString from '../../../hooks/useLimitString';
import SearchInput from '../../../components/Defaults/SearchInput';
import { fDate } from '../../../utils/formatTime';
import { Snacks } from '../../../constants/customer-constants';
import { BUTTONS, BREADCRUMBS } from '../../../constants/default-constants';
import Iconify from '../../../components/iconify';
import CustomerContactList from '../reports/contacts/CustomerContactList';
import ContactSiteCard from '../../../components/sections/ContactSiteCard';
import { exportCSV } from '../../../utils/exportCSV';
import { useAuthContext } from '../../../auth/useAuthContext';
import CustomerTabContainer from '../customers/util/CustomerTabContainer';
import ContactSiteScrollbar from '../../../components/scrollbar/ContactSiteScrollbar';

// ----------------------------------------------------------------------

CustomerContactDynamicList.propTypes = {
  contactAddForm: PropTypes.bool,
  contactEditForm: PropTypes.bool,
  contactViewForm: PropTypes.bool,
  contactMoveForm: PropTypes.bool,
};

export default function CustomerContactDynamicList({ contactAddForm, contactEditForm, contactViewForm, contactMoveForm }) {

  const { contact: activeContact, contacts, activeCardIndex, isExpanded, contactsListView } = useSelector((state) => state.contact);
  const { isAllAccessAllowed } = useAuthContext()
  const { customer } = useSelector((state) => state.customer);
  const { customerId, id } = useParams() 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filterFormer, setFilterFormer] = useState('All');
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const { order, orderBy } = useTable({ defaultOrderBy: '-createdAt' });
  // ------------------------------------------------------------a
  const isMobile = useResponsive('down', 'sm');

  const toggleChecked = () => {
    if (contactEditForm) {
      enqueueSnackbar(Snacks.CONTACT_CLOSE_CONFIRM, {variant: 'warning'});
      dispatch(setIsExpanded(false));
      dispatch(setCardActiveIndex(''));
      navigate(PATH_CRM.customers.contacts.new(customerId))
    } else {
      navigate(PATH_CRM.customers.contacts.new(customerId))
      dispatch(setCardActiveIndex(''));
      dispatch(setIsExpanded(false));
    }
  };

  // -----------------------Filtering----------------------------

  const handleFilterName = (e) => {
    setFilterName(e.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
    // dispatch(resetContacts());
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterFormer,
  });

  useEffect(() => {
    if( customerId && customerId !== "undefined" ){
      dispatch(getContacts(customerId, customer?.isArchived));
    }
    return ()=>{
      dispatch(resetContacts());
      dispatch(setCardActiveIndex(null));
      dispatch(setIsExpanded(false));
    }
  }, [ dispatch, customerId, customer?.isArchived ]);


const navigateToContact = useCallback((contactId) => {
  if (customerId && contactId && !contactsListView) {
    navigate(PATH_CRM.customers.contacts.view(customerId, contactId));
  }
}, [customerId, navigate, contactsListView]);

// Handle filter change logic
const handleFilterChange = (event, newValue) => {
  const selectedFilter = newValue || 'All'; 
  setFilterFormer(selectedFilter);

  if (contacts.length > 0 && !contactsListView) {
    let contactToNavigate = null;

    if (selectedFilter === 'Former Employee') {
      const formerEmployeeContact = contacts.find(contact => contact.formerEmployee);
      if (formerEmployeeContact) {
        contactToNavigate = formerEmployeeContact._id;
      }
    } else if (selectedFilter === 'Current Employee') {
      const currentEmployeeContact = contacts.find(contact => !contact.formerEmployee);
      if (currentEmployeeContact) {
        contactToNavigate = currentEmployeeContact._id;
      }
    } else if (selectedFilter === 'All') {
      contactToNavigate = contacts[0]?._id; 
    }
    if (contactToNavigate) {
      navigateToContact(contactToNavigate);
    }
  }
};

useEffect(() => {
  setTableData(contacts);
}, [contacts]);

const toggleContactView = (view) => {
  if (view !== contactsListView) {
    dispatch(setContactsView(view));
    if (view === 'card') {
      if (contacts.length > 0) {
        const firstContactId = contacts[0]._id;
        navigateToContact(firstContactId);
      } else {
        navigate(PATH_CRM.customers.contacts.root(customerId));
      }
    } else {
      navigate(PATH_CRM.customers.contacts.root(customerId));
    }
  }
};

useEffect(() => {
  if ( contacts.length > 0 && !id && !contactsListView && !contactAddForm && !contactEditForm && !contactMoveForm && !contactViewForm) {
    navigateToContact(contacts[0]._id);
  }
}, [contacts, navigateToContact, id, contactsListView, contactAddForm, contactEditForm, contactMoveForm, contactViewForm]);

  // ------------------------------------------------------------

  const toggleCancel = () => navigate(PATH_CRM.customers.contacts.root(customer?._id));
  const isNotFound = !contacts.length && !contactAddForm && !contactEditForm;
  
  const [exportingCSV, setExportingCSV] = useState(false);
  const onExportCSV = async () => {
    setExportingCSV(true);
    const response = dispatch(await exportCSV('CustomerContacts', customerId ));
    response.then((res) => {
      setExportingCSV(false);
      enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
    });
  };
  
  const handleCardClick = async (_contact)=>{ if(customerId && _contact?._id) navigate(PATH_CRM.customers.contacts.view(customerId, _contact?._id)) };

  return (
    <>
    <Container maxWidth={ false } >
      <CustomerTabContainer currentTabValue="contacts" />
      <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{mb:2}}>
  <Grid item xs={12} md={6}>
    <BreadcrumbsProvider>
      <BreadcrumbsLink to={PATH_CRM.customers.list} name={BREADCRUMBS.CUSTOMERS} />
      <BreadcrumbsLink to={PATH_CRM.customers.view(customerId)} name={ customer.name } />
      <BreadcrumbsLink
        to={PATH_CRM.customers.contacts.root(customerId)}
        name={
          <Stack>
            {!contactAddForm && !contactEditForm && !isExpanded && 'Contacts'}
            {contactEditForm
              ? `Edit ${activeContact?.firstName || '' }`
              : isExpanded && activeContact?.firstName || '' }
            {contactAddForm && !isExpanded && 'Add new contact'}
          </Stack>
        }
      />
    </BreadcrumbsProvider>
  </Grid>
  <Grid item xs={12} sm={12} md={8} lg={8} xl={6}>
    <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={1}>
      {contacts.length > 0 && contactsListView && (<Autocomplete
        freeSolo
        disableClearable
        value={ filterFormer }
        options={[ 'All', 'Former Employee', 'Current Employee' ]}
        isOptionEqualToValue={(option, val) => option === val}
        onChange={(event, newValue) => {
          if (newValue) {
            if( newValue !== filterFormer ){
              navigate(PATH_CRM.customers.contacts.root(customerId)); 
            }
            setFilterFormer(newValue);
          } else {
            setFilterFormer('');
          }
        }}
        sx={{ flex: 1, maxWidth: '400px' }} 
        renderInput={(params) => (
          <TextField {...params} size="small" label="Filter Contacts" />
        )}
      />   
      )}
    <ButtonGroup variant="outlined" aria-label="Basic button group">
      <Button onClick={() => toggleContactView(false)} startIcon={<Iconify icon="mdi:view-grid" />} sx={{ backgroundColor: !contactsListView ? 'primary.main' : 'grey.450', color: !contactsListView ? 'white' : 'black',  '&:hover': { color: 'rgba(0, 0, 0, 0.7)' } }}>Card</Button>
      <Button onClick={() => toggleContactView(true)} startIcon={<Iconify icon="mdi:view-list" />} sx={{ backgroundColor: contactsListView ? 'primary.main' : 'grey.450', color: contactsListView ? 'white' : 'black', '&:hover': { color: 'rgba(0, 0, 0, 0.7)' } }}>List</Button>
    </ButtonGroup>
      
      {!customer?.isArchived && isAllAccessAllowed && contacts.length > 0 && (
        <LoadingButton
          variant="contained"
          onClick={onExportCSV}
          loading={exportingCSV}
          startIcon={<Iconify icon={BUTTONS.EXPORT.icon} />}
          sx={{ whiteSpace: 'nowrap', minWidth: '80px' }} 
        >
          {!isMobile && BUTTONS.EXPORT.label}
        </LoadingButton>
      )}
      
      {!customer?.isArchived && (
        <AddButtonAboveAccordion
          name={BUTTONS.NEWCONTACT}
          toggleChecked={toggleChecked}
          FormVisibility={contactAddForm}
          toggleCancel={toggleCancel}
          disabled={contactEditForm || contactMoveForm}
          sx={{ whiteSpace: 'nowrap', minWidth: '80px' }} 
        >
          {!isMobile && BUTTONS.NEWCONTACT.label}
        </AddButtonAboveAccordion>
      )}
    </Stack>
  </Grid>
</Grid>
  
      <Grid container spacing={1} direction="row" justifyContent="flex-end">
        {contacts.length === 0 && !contactsListView &&(
          <Grid item lg={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Table>
              <TableBody>
                <TableNoData isNotFound={isNotFound} />
              </TableBody>
            </Table>
          </Grid>
        )}
        {contacts.length > 0 && !contactsListView && !contactAddForm && (
          <>
          <Grid item xs={12} sm={12} md={12} lg={5} xl={4} sx={{ display: contactAddForm && isMobile && 'none' }} >
            {contacts.length > 5 && (
              <Grid item md={12} sx={{ mb: 2 }}>
                <SearchInput
                  disabled={contactAddForm || contactEditForm || contactMoveForm}
                  filterName={filterName}
                  handleFilterName={handleFilterName}
                  isFiltered={isFiltered}
                  handleResetFilter={handleResetFilter}
                  toggleChecked={toggleChecked}
                  toggleCancel={toggleCancel}
                  FormVisibility={contactAddForm}
                  sx={{ position: 'fixed', top: '0px', zIndex: '1000' }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={12} md={12} lg={5} xl={12}>
            <Autocomplete
              freeSolo
              disableClearable
              value={filterFormer}
              options={['All', 'Former Employee', 'Current Employee']}
              isOptionEqualToValue={(option, val) => option === val}
              onChange={handleFilterChange}
              sx={{ flex: 1, mb: 2 }}
              renderInput={(params) => (
             <TextField {...params} size="small" label="Filter Contacts" />
              )}
            />
            </Grid>
            <ContactSiteScrollbar
              onClick={(e) => e.stopPropagation()}
              // snapAlign="start"
              disabled={contactEditForm || contactAddForm || contactMoveForm}
            >
              <Grid container direction="column" gap={1}>
                {dataFiltered.map((_contact, index) => (
                  <ContactSiteCard
                    key={_contact?._id || index }
                    isActiveEmplyee={_contact?.isActive }
                    isFormerEmployee={_contact?.formerEmployee }
                    disableClick={ contactMoveForm || contactEditForm || contactAddForm }
                    isActive={_contact._id === activeCardIndex }
                    handleOnClick={() => handleCardClick(_contact) }
                    name={`${_contact.firstName || ''} ${_contact.lastName || ''}`} title={_contact.title} email={_contact.email}
                    phone={_contact?.phone || null }
                  />)
                )}
              </Grid>
            </ContactSiteScrollbar>
          </Grid>

          { !contactsListView && <GridBaseViewForm item xs={12} sm={12} md={12} lg={7} xl={8} >
            { contactViewForm && !contactEditForm && !contactMoveForm && !contactAddForm  && (
              <CardBase>
                <ContactViewForm />
              </CardBase>
            )}
            { !contactsListView && !contactViewForm && contactEditForm && !contactAddForm && !contactMoveForm && <ContactEditForm setIsExpanded={setIsExpanded} />}
            { !contactsListView && !contactViewForm && contactMoveForm && !contactAddForm && !contactEditForm && <ContactMoveForm setIsExpanded={setIsExpanded} />}
          </GridBaseViewForm>  }
          </>
        )}
      </Grid>
      { !contactsListView && !contactViewForm && contactAddForm && !contactEditForm && !contactMoveForm && <ContactAddForm setIsExpanded={setIsExpanded}/>}

     {/* /////////////////////////List View////////////////////////////// */}
      { contactsListView && id && !contactEditForm && !contactMoveForm && !contactAddForm  && (     
     <CardBase>
       <ContactViewForm isCustomerContactPage/>
     </CardBase> )}
      { contactsListView && !contactViewForm && contactEditForm && !contactAddForm && !contactMoveForm && <ContactEditForm setIsExpanded={setIsExpanded} />}
      { contactsListView && !contactViewForm && contactAddForm && !contactEditForm && !contactMoveForm && <ContactAddForm setIsExpanded={setIsExpanded}/>}
      { contactsListView && !contactViewForm && contactMoveForm && !contactAddForm && !contactEditForm && <ContactMoveForm setIsExpanded={setIsExpanded} />}
    </Container>
    { contactsListView && !id && !contactAddForm && <CustomerContactList isCustomerContactPage filterFormer={filterFormer}/>}
    </>
  );
}

// ----------------------------------------------------------------------

export function applyFilter({ inputData, comparator, filterName, filterStatus, filterFormer }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if(filterFormer?.toLowerCase() === 'former employee' ){
    inputData = inputData.filter((contact) => contact?.formerEmployee );
  } else if(filterFormer?.toLowerCase() === 'current employee'){
    inputData = inputData.filter((contact) => !contact?.formerEmployee );
  }

  if (filterName) {
    if(filterName.includes(" ")){
      const splittedFilterName = filterName.split(" ");
      inputData = inputData.filter(
        (contact) =>
        contact?.firstName?.toLowerCase().indexOf(splittedFilterName[0].toLowerCase()) >= 0 &&
        contact?.lastName?.toLowerCase().indexOf(splittedFilterName[1].toLowerCase()) >= 0 
      );
    }else{
      inputData = inputData.filter(
        (contact) =>
          contact?.firstName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          contact?.lastName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          contact?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
          fDate(contact?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
      );
    }
  }

  return inputData;
}
