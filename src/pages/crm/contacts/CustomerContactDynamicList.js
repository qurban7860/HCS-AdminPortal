import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import { Stack, Grid, Container, Autocomplete, TextField } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { CardBase, GridBaseViewForm, StyledScrollbar } from '../../../theme/styles/customer-styles';
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
  setCardActiveIndex,
  setIsExpanded
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
import ContactSiteCard from '../../../components/sections/ContactSiteCard';
import { exportCSV } from '../../../utils/exportCSV';
import { useAuthContext } from '../../../auth/useAuthContext';
import CustomerTabContainer from '../customers/util/CustomerTabContainer';

// ----------------------------------------------------------------------

CustomerContactDynamicList.propTypes = {
  contactAddForm: PropTypes.bool,
  contactEditForm: PropTypes.bool,
  contactViewForm: PropTypes.bool,
  contactMoveForm: PropTypes.bool,
};

export default function CustomerContactDynamicList({ contactAddForm, contactEditForm, contactViewForm, contactMoveForm }) {

  const { contact, contacts, activeCardIndex, isExpanded } = useSelector((state) => state.contact);
  const { isAllAccessAllowed } = useAuthContext()
  const { customer } = useSelector((state) => state.customer);
  const { customerId } = useParams() 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filterFormer, setFilterFormer] = useState('All');
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const { order, orderBy } = useTable({ defaultOrderBy: '-createdAt' });
  // ------------------------------------------------------------
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
  };

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
    filterFormer,
  });

  useEffect(() => {
    dispatch(getContacts(customerId));
    return ()=>{
      dispatch(resetContacts());
      dispatch(setCardActiveIndex(null));
      dispatch(setIsExpanded(false));
    }
  }, [ dispatch, customerId ]);

  useEffect(() => {
    setTableData(contacts);
  }, [contacts ]);

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
                    ? `Edit ${contact?.firstName || '' }`
                    : isExpanded && contact?.firstName || '' }
                  {contactAddForm && !isExpanded && 'Add new contact'}
                </Stack>
              }
            />
          </BreadcrumbsProvider>
        </Grid>
        <Grid item xs={12} md={6} style={{display:'flex', justifyContent:"flex-end"}}>
          <Stack direction='row' alignContent='flex-end' spacing={1}>
            <Autocomplete 
              freeSolo
              value={ filterFormer }
              options={[ 'All', 'Former Employee', 'Current Employee' ]}
              isOptionEqualToValue={(option, val) => option === val}
              onChange={(event, newValue) => {
                if (newValue) {
                  setFilterFormer(newValue);
                } else {
                  setFilterFormer('');
                }
              }}
              sx={{ width: '240px' }}
              renderInput={(params) => <TextField {...params} size='small' label="Filter Contacts" />}
            />  
            {isAllAccessAllowed && contacts.length>0 &&
              <LoadingButton variant='contained' onClick={onExportCSV} loading={exportingCSV} startIcon={<Iconify icon={BUTTONS.EXPORT.icon} />} >
                  {BUTTONS.EXPORT.label}
              </LoadingButton>
            }
             <AddButtonAboveAccordion
              name={BUTTONS.NEWCONTACT}
              toggleChecked={toggleChecked}
              FormVisibility={contactAddForm}
              toggleCancel={toggleCancel}
              disabled={contactEditForm || contactMoveForm}
            />
          </Stack>            
        </Grid>
      </Grid>
      <Grid container spacing={1} direction="row" justifyContent="flex-end">
        {contacts.length === 0 && (
          <Grid item lg={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <TableNoData isNotFound={isNotFound} />
          </Grid>
        )}
        {contacts.length > 0 && (
          <Grid item xs={12} sm={12} md={12} lg={5} xl={4} sx={{ display: contactAddForm && isMobile && 'none' }} >
            {contacts.length > 5 && (
              <Grid item md={12}>
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
            <StyledScrollbar
              snap
              snapOffset={100}
              onClick={(e) => e.stopPropagation()}
              snapAlign="start"
              contacts={contacts.length}
              disabled={contactEditForm || contactAddForm || contactMoveForm}
            >
              <Grid container direction="column" gap={1}>
                {dataFiltered.map((_contact, index) => (
                  <ContactSiteCard
                    key={_contact?._id || index }
                    isFormerEmployee={_contact?.formerEmployee}
                    disableClick={ contactMoveForm || contactEditForm || contactAddForm }
                    isActive={_contact._id === activeCardIndex}
                    handleOnClick={() => handleCardClick(_contact) }
                    name={`${_contact.firstName || ''} ${_contact.lastName || ''}`} title={_contact.title} email={_contact.email}
                    phone={_contact?.phone || null }
                  />)
                )}
              </Grid>
            </StyledScrollbar>
          </Grid>
        )}

        {/* Conditional View Forms */}
          <GridBaseViewForm item xs={12} sm={12} md={12} lg={7} xl={8} >
            { contactViewForm && !contactEditForm && !contactMoveForm && !contactAddForm  && (
              <CardBase>
                <ContactViewForm />
              </CardBase>
            )}
            { !contactViewForm && contactEditForm && !contactAddForm && !contactMoveForm && <ContactEditForm setIsExpanded={setIsExpanded} />}
            { !contactViewForm && contactAddForm && !contactEditForm && !contactMoveForm && <ContactAddForm setIsExpanded={setIsExpanded}/>}
            { !contactViewForm && contactMoveForm && !contactAddForm && !contactEditForm && <ContactMoveForm setIsExpanded={setIsExpanded} />}
          </GridBaseViewForm>
      </Grid>
    </Container>
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
  } else if(filterFormer?.toLowerCase() === 'not former employee'){
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
