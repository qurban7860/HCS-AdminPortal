import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Stack, Grid, Link, CardActionArea } from '@mui/material';
import {
  CardBase,
  GridBaseViewForm,
  StyledScrollbar,
  StyledCardWrapper,
} from '../../theme/styles/customer-styles';
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
} from '../../redux/slices/customer/contact';
import ContactAddForm from './contact/ContactAddForm';
import ContactEditForm from './contact/ContactEditForm';
import ContactViewForm from './contact/ContactViewForm';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import DetailsSection from '../components/Sections/DetailsSection';
import AvatarSection from '../components/Sections/AvatarSection';
import useResponsive from '../../hooks/useResponsive';
import SearchInput from '../components/Defaults/SearchInput';
import { fDate } from '../../utils/formatTime';
import { Snacks } from '../../constants/customer-constants';
import { BUTTONS, BREADCRUMBS } from '../../constants/default-constants';

// ----------------------------------------------------------------------

export default function CustomerContactList(currentContact = null) {
  const { order, orderBy } = useTable({ defaultOrderBy: 'name' });
  const { customer } = useSelector((state) => state.customer);
  const [openContact, setOpenContact] = useState(false);
  const dispatch = useDispatch();
  const {
    contact: currentContactData,
    contacts,
    error,
    initial,
    responseMessage,
    contactEditFormVisibility,
    formVisibility,
  } = useSelector((state) => state.contact);
  const [checked, setChecked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCardIndex, setCardActiveIndex] = useState(null);
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
    if (checked || contactEditFormVisibility) {
      dispatch(setContactFormVisibility(false));
      enqueueSnackbar(Snacks.CONTACT_CLOSE_CONFIRM, {
        variant: 'warning',
      });
      setIsExpanded(false);
      setCardActiveIndex(null);
    } else {
      dispatch(setContactFormVisibility(true));
      setCardActiveIndex(null);
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
    setTableData(contacts);
  }, [contacts, error, responseMessage]);

  // ------------------------------------------------------------

  const toggleCancel = () => {
    dispatch(setContactFormVisibility(false));
    setChecked(false);
  };

  const handleActiveCard = (index) => {
    if (!contactEditFormVisibility) {
      setCardActiveIndex(index);
    }
  };

  const handleExpand = (index) => {
    setIsExpanded(true);
  };

  useLayoutEffect(() => {
    if (!formVisibility && !contactEditFormVisibility) {
      dispatch(getContacts(customer._id));
    }
  }, [dispatch, checked, customer, formVisibility, contactEditFormVisibility]);

  const isNotFound = !contacts.length && !formVisibility && !contactEditFormVisibility;
  const fullName = contacts.map((contact) => `${contact.firstName} ${contact.lastName || ''}`);

  // var conditions for rendering the contact view, edit, and add forms
  const shouldShowContactView = isExpanded && !contactEditFormVisibility;
  const shouldShowContactEdit = contactEditFormVisibility && !formVisibility;
  const shouldShowContactAdd = formVisibility && !contactEditFormVisibility;

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
        <AddButtonAboveAccordion
          name={BUTTONS.NEWCONTACT}
          toggleChecked={toggleChecked}
          FormVisibility={formVisibility}
          toggleCancel={toggleCancel}
          disabled={contactEditFormVisibility}
        />
      </Grid>
      <Grid container spacing={1} direction="row" justifyContent="flex-start">
        {contacts.length === 0 && (
          <Grid item lg={12}>
            <TableNoData isNotFound={isNotFound} />
          </Grid>
        )}
        {contacts.length > 0 && (
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={4}
            sx={{ display: formVisibility && isMobile && 'none' }}
          >
            {contacts.length > 5 && (
              <Grid item md={12}>
                <SearchInput
                  // searchFormVisibility={formVisibility || contactEditFormVisibility}
                  filterName={filterName}
                  handleFilterName={handleFilterName}
                  isFiltered={isFiltered}
                  handleResetFilter={handleResetFilter}
                  toggleChecked={toggleChecked}
                  toggleCancel={toggleCancel}
                  FormVisibility={formVisibility}
                  disabled={contactEditFormVisibility || formVisibility}
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
              disabled={contactEditFormVisibility || formVisibility}
            >
              <Grid container justifyContent="flex-start" direction="column" gap={1}>
                {dataFiltered.map((contact, index) => {
                  const borderTopVal = index !== 0 ? '0px solid white' : '';
                  return (
                    <>
                      {index !== activeIndex && (
                        <Grid
                          item
                          key={index}
                          xs={12}
                          sm={12}
                          md={12}
                          lg={4}
                          display={{ xs: 'flex', lg: 'block' }}
                          onClick={() => {
                            if (!contactEditFormVisibility && !formVisibility) {
                              handleActiveCard(index);
                              handleExpand(index);
                            }
                          }}
                          sx={{
                            width: { xs: '100%', lg: '100%' },
                          }}
                        >
                          <StyledCardWrapper
                            condition1={activeCardIndex !== index}
                            condition2={activeCardIndex === index}
                            isMobile={isMobile}
                          >
                            <CardActionArea
                              active={activeIndex === index}
                              disabled={contactEditFormVisibility || formVisibility}
                            >
                              <Link
                                underline="none"
                                disabled={contactEditFormVisibility || formVisibility}
                                onClick={async () => {
                                  await dispatch(getContact(customer._id, contact._id));
                                  setOpenContact(true);
                                  if (!isExpanded && !formVisibility) {
                                    handleExpand(index);
                                    setContactFormVisibility(!formVisibility);
                                  } else if (
                                    isExpanded &&
                                    currentContactData !== contact &&
                                    !formVisibility
                                  ) {
                                    handleExpand(index);
                                  } else {
                                    setIsExpanded(false);
                                    index = null;
                                  }
                                }}
                              >
                                <Grid
                                  container
                                  direction="row"
                                  justifyContent="flex-start"
                                  alignItems="center"
                                >
                                  {!isMobile && (
                                    <AvatarSection
                                      name={fullName[index]}
                                      image="/assets/images/covers/bg.jpg"
                                    />
                                  )}
                                  <DetailsSection
                                    content={
                                      fullName[index].length >= 15
                                        ? contact.firstName
                                        : fullName[index]
                                    }
                                    content2={contact.title ? contact.title : <br />}
                                    content3={contact.email ? contact.email : <br />}
                                  />
                                </Grid>
                              </Link>
                            </CardActionArea>
                          </StyledCardWrapper>
                        </Grid>
                      )}
                    </>
                  );
                })}
              </Grid>
            </StyledScrollbar>
          </Grid>
        )}

        {/* Conditional View Forms */}
        {!isMobile && (
          <GridBaseViewForm item lg={contacts.length === 0 ? 12 : 8}>
            {shouldShowContactView && (
              <CardBase>
                <ContactViewForm setIsExpanded={setIsExpanded} />
              </CardBase>
            )}
            {shouldShowContactEdit && <ContactEditForm setIsExpanded={setIsExpanded} />}
            {shouldShowContactAdd && <ContactAddForm />}
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
    inputData = inputData.filter(
      (contact) =>
        contact?.firstName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.lastName?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        contact?.email?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(contact?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
