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
import AddButtonAboveAccordion from '../components/AddButtonAboveAcoordion';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { TableNoData } from '../../components/table';
// sections
import { getContacts, setContactFormVisibility } from '../../redux/slices/customer/contact';
import ContactAddForm from './contact/ContactAddForm';
import ContactEditForm from './contact/ContactEditForm';
import ContactViewForm from './contact/ContactViewForm';
import BreadcrumbsProducer from '../components/BreadcrumbsProducer';
import DetailsSection from '../components/sections/DetailsSection';
import AvatarSection from '../components/sections/AvatarSection';
import useResponsive from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

export default function CustomerContactList(currentContact = null) {
  const { customer } = useSelector((state) => state.customer);
  const [openContact, setOpenContact] = useState(false);
  const dispatch = useDispatch();
  const { contacts, error, initial, responseMessage, contactEditFormVisibility, formVisibility } =
    useSelector((state) => state.contact);
  const [checked, setChecked] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCardIndex, setCardActiveIndex] = useState(null);
  const [currentContactData, setCurrentContactData] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useResponsive('down', 'sm');

  const toggleChecked = () => {
    setChecked((value) => !value);
    if (checked || contactEditFormVisibility) {
      dispatch(setContactFormVisibility(false));
      enqueueSnackbar('Please close the form before opening a new one', {
        variant: 'warning',
      });
      setIsExpanded(false);
    } else {
      dispatch(setContactFormVisibility(true));
      setCardActiveIndex(null);
      setIsExpanded(false);
    }
  };

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
      <Stack alignItems="flex-end" sx={{ mt: 4, padding: 2 }}>
        <AddButtonAboveAccordion
          name="New Contact"
          toggleChecked={toggleChecked}
          FormVisibility={formVisibility}
          toggleCancel={toggleCancel}
        />
        <BreadcrumbsProducer
          underline="none"
          step={1}
          step2
          step3
          step4
          path={PATH_DASHBOARD.customer.list}
          name="Customers"
          path2={PATH_DASHBOARD.customer.root}
          name2={customer.name}
          path3={PATH_DASHBOARD.customer.contacts}
          name3="Contacts"
          path4={PATH_DASHBOARD.customer.contacts}
          name4={
            <Stack>
              {contactEditFormVisibility
                ? `Edit ${currentContactData.firstName}`
                : isExpanded && currentContactData.firstName}
              {formVisibility && !isExpanded && 'Add new contact'}
            </Stack>
          }
        />
      </Stack>
      <Grid container spacing={1} direction="row" justifyContent="flex-start">
        <Grid item lg={12}>
          <TableNoData isNotFound={isNotFound} />
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={4}
          sx={{ display: formVisibility && isMobile && 'none' }}
        >
          <StyledScrollbar
            snap
            snapOffset={100}
            onClick={(e) => e.stopPropagation()}
            snapAlign="start"
            contacts={contacts.length}
          >
            <Grid container justifyContent="flex-start" direction="column" gap={1}>
              {contacts.map((contact, index) => {
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
                          handleActiveCard(index);
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
                            disabled={contactEditFormVisibility}
                          >
                            <Link
                              underline="none"
                              disabled={contactEditFormVisibility}
                              onClick={() => {
                                setCurrentContactData(contact);
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

        {/* Conditional View Forms */}
        {!isMobile && (
          <GridBaseViewForm item lg={8}>
            {shouldShowContactView && (
              <CardBase>
                <ContactViewForm currentContact={currentContactData} />
              </CardBase>
            )}
            {shouldShowContactEdit && <ContactEditForm />}
            {shouldShowContactAdd && <ContactAddForm />}
          </GridBaseViewForm>
        )}

        {/* View form for mobile */}
        {isMobile && (
          <Grid item xs={12} lg={12}>
            {shouldShowContactView && (
              <CardBase>
                <ContactViewForm currentContact={currentContactData} />
              </CardBase>
            )}
            {shouldShowContactEdit && <ContactEditForm />}
            {shouldShowContactAdd && <ContactAddForm />}
          </Grid>
        )}
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------
