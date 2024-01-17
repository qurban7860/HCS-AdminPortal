import { useState, useEffect } from 'react';
// @mui
import { Stack, Grid, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CardBase, GridBaseViewForm, StyledScrollbar } from '../../theme/styles/customer-styles';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CUSTOMER } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { TableNoData, useTable, getComparator } from '../../components/table';
// sections
import {
  getContacts,
  setContactFormVisibility,
  getContact,
  resetContactFormsVisiblity,
} from '../../redux/slices/customer/contact';
import ContactAddForm from './contact/ContactAddForm';
import ContactEditForm from './contact/ContactEditForm';
import ContactViewForm from './contact/ContactViewForm';
import ContactMoveForm from './contact/ContactMoveForm';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import useResponsive from '../../hooks/useResponsive';
import SearchInput from '../components/Defaults/SearchInput';
import { fDate } from '../../utils/formatTime';
import { Snacks } from '../../constants/customer-constants';
import { BUTTONS, BREADCRUMBS } from '../../constants/default-constants';
import Iconify from '../../components/iconify';
import ContactSiteCard from '../components/sections/ContactSiteCard';
import { exportCSV } from '../../utils/exportCSV';

// ----------------------------------------------------------------------

export default function CustomerContactList(currentContact = null) {

  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');

  const { order, orderBy } = useTable({ defaultOrderBy: '-createdAt' });
  const { customer } = useSelector((state) => state.customer);
  const dispatch = useDispatch();
  const {
    contact: currentContactData,
    contacts,
    error,
    // initial,
    responseMessage,
    contactEditFormVisibility,
    contactMoveFormVisibility,
    formVisibility,
  } = useSelector((state) => state.contact);
  const [checked, setChecked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [activeCardIndex, setCardActiveIndex] = useState('');
  // for filtering contacts -------------------------------------
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState([]);
  const [tableData, setTableData] = useState([]);
  const isFiltered = filterName !== '' || !!filterStatus.length;
  // ------------------------------------------------------------
  const isMobile = useResponsive('down', 'sm');

  const toggleChecked = () => {
    setChecked((value) => !value);
    if (contactEditFormVisibility) {
      dispatch(setContactFormVisibility(false));
      enqueueSnackbar(Snacks.CONTACT_CLOSE_CONFIRM, {variant: 'warning'});
      setIsExpanded(false);
      setCardActiveIndex('');
    } else {
      dispatch(setContactFormVisibility(true));
      setCardActiveIndex('');
      setIsExpanded(false);
    }
  };

  // -----------------------Filtering----------------------------

  const handleFilterName = (e) => {
    setFilterName(e.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setFilterStatus([]);
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });

  useEffect(() => {
    dispatch(resetContactFormsVisiblity());
  }, [dispatch]);

  useEffect(() => {
    setTableData(contacts);
  }, [contacts, error, responseMessage]);

  // ------------------------------------------------------------

  const toggleCancel = () => {
    dispatch(setContactFormVisibility(false));
    setChecked(false);
  };

  const handleActiveCard = (index) => {
    if (!contactEditFormVisibility && !contactMoveFormVisibility) {
      setCardActiveIndex(index);
    }
  };

  const handleExpand = (index) => {
    setIsExpanded(true);
  };

  useEffect(() => {
    if (!formVisibility && !contactEditFormVisibility && !contactMoveFormVisibility) {
      dispatch(getContacts(customer._id));
    }
  }, [dispatch, checked, customer, formVisibility, contactEditFormVisibility, contactMoveFormVisibility]);

  const isNotFound = !contacts.length && !formVisibility && !contactEditFormVisibility;
  const shouldShowContactView = isExpanded && !contactEditFormVisibility && !contactMoveFormVisibility;
  const shouldShowContactEdit = contactEditFormVisibility && !formVisibility && !contactMoveFormVisibility;
  const shouldShowContactAdd = formVisibility && !contactEditFormVisibility && !contactMoveFormVisibility;
  const shouldShowContactMove = contactMoveFormVisibility && !formVisibility && !contactEditFormVisibility;
  
  const [exportingCSV, setExportingCSV] = useState(false);
  const onExportCSV = async () => {
    setExportingCSV(true);
    const params = {
      isArchived: false,
      orderBy : {
        createdAt:-1
      }
    };
    
    const response = dispatch(await exportCSV('CustomerContactsCSV',`crm/customers/${customer?._id}/contacts/export`, params));
    response.then((res) => {
      setExportingCSV(false);
      enqueueSnackbar(res.message, {variant:`${res.hasError?"error":""}`});
    });
  };

  const handleCardClick = async (contact)=>{
      await dispatch(getContact(customer._id, contact._id));
      if (!contactMoveFormVisibility && !contactEditFormVisibility && !formVisibility) {
        handleActiveCard(contact._id);
        handleExpand(contact._id);
      }
  }


  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_CUSTOMER.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CUSTOMER.view} name={customer.name} />
            <BreadcrumbsLink
              to={PATH_CUSTOMER.contacts}
              name={
                <Stack>
                  {!formVisibility && !contactEditFormVisibility && !isExpanded && 'Contacts'}
                  {contactEditFormVisibility
                    ? `Edit ${currentContactData?.firstName}`
                    : isExpanded && currentContactData?.firstName}
                  {formVisibility && !isExpanded && 'Add new contact'}
                </Stack>
              }
            />
          </BreadcrumbsProvider>
        </Grid>
        <Grid item xs={12} md={6} style={{display:'flex', justifyContent:"flex-end"}}>
          <Stack direction='row' alignContent='flex-end' spacing={1}>
            {isSuperAdmin && contacts.length>0 &&
              <LoadingButton variant='contained' onClick={onExportCSV} loading={exportingCSV} startIcon={<Iconify icon={BUTTONS.EXPORT.icon} />} >
                  {BUTTONS.EXPORT.label}
              </LoadingButton>
            }
             <AddButtonAboveAccordion
              name={BUTTONS.NEWCONTACT}
              toggleChecked={toggleChecked}
              FormVisibility={formVisibility}
              toggleCancel={toggleCancel}
              disabled={contactEditFormVisibility || contactMoveFormVisibility}
            />
          </Stack>            
        </Grid>
      </Grid>
      <Grid container spacing={1} direction="row" justifyContent="flex-start">
        {contacts.length === 0 && (
          <Grid item lg={12}>
            <TableNoData isNotFound={isNotFound} />
          </Grid>
        )}
        {contacts.length > 0 && (
          <Grid item xs={12} sm={12} md={12} lg={5} xl={4} sx={{ display: formVisibility && isMobile && 'none' }} >
            {contacts.length > 5 && (
              <Grid item md={12}>
                <SearchInput
                  // searchFormVisibility={formVisibility || contactEditFormVisibility || contactMoveFormVisibility}
                  disabled={formVisibility || contactEditFormVisibility || contactMoveFormVisibility}
                  filterName={filterName}
                  handleFilterName={handleFilterName}
                  isFiltered={isFiltered}
                  handleResetFilter={handleResetFilter}
                  toggleChecked={toggleChecked}
                  toggleCancel={toggleCancel}
                  FormVisibility={formVisibility}
                  sx={{ position: 'fixed', top: '0px', zIndex: '1000' }}
                />
              </Grid>
            )}
            <StyledScrollbar
              snap
              snapOffset={100}
              onClick={(e) => e.stopPropagation()}
              snapAlign="start"
              contacts={contacts.length}
              disabled={contactEditFormVisibility || formVisibility || contactMoveFormVisibility}
              maxHeight={100}
            >
              <Grid container direction="column" gap={1}>
                {dataFiltered.map((contact, index) => (
                  <ContactSiteCard
                    isActive={contact._id === activeCardIndex}
                    handleOnClick={() => handleCardClick(contact) }
                    disableClick={contactEditFormVisibility || formVisibility || contactMoveFormVisibility}
                    name={`${contact.firstName || ''} ${contact.lastName || ''}`} title={contact.title} email={contact.email}
                  />)
                )}
              </Grid>
            </StyledScrollbar>
          </Grid>
        )}

        {/* Conditional View Forms */}
        {!isMobile && (
          <GridBaseViewForm item xs={12} sm={12} md={12} lg={7} xl={8} >
            {shouldShowContactView && (
              <CardBase>
                <ContactViewForm setIsExpanded={setIsExpanded} />
              </CardBase>
            )}
            {shouldShowContactEdit && <ContactEditForm setIsExpanded={setIsExpanded} />}
            {shouldShowContactAdd && <ContactAddForm setIsExpanded={setIsExpanded}/>}
            {shouldShowContactMove && <ContactMoveForm setIsExpanded={setIsExpanded} />}
          </GridBaseViewForm>
        )}

        {/* View form for mobile */}
        {isMobile && (
          <Grid item xs={12} lg={12}>
            {shouldShowContactView && (
              <CardBase>
                <ContactViewForm setIsExpanded={setIsExpanded} />
              </CardBase>
            )}
            {shouldShowContactEdit && <ContactEditForm isExpanded={isExpanded} />}
            {shouldShowContactAdd && <ContactAddForm />}
            {shouldShowContactMove && <ContactMoveForm />}
          </Grid>
        )}
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------

export function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

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
