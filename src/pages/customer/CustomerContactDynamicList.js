import { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  Card,
  Grid,
  Link,
  CardActionArea,
  CardContent,
  CardMedia,
  Breadcrumbs,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import AddButtonAboveAccordion from '../components/AddButtonAboveAcoordion';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useTable, getComparator, TableNoData } from '../../components/table';
// sections
import { getContacts, setContactFormVisibility } from '../../redux/slices/customer/contact';
import ContactAddForm from './contact/ContactAddForm';
import ContactEditForm from './contact/ContactEditForm';
import ContactViewForm from './contact/ContactViewForm';
import ContactDialog from './contact/util/ContactDialog';
import Scrollbar from '../../components/scrollbar';
import useResponsive from '../../hooks/useResponsive';

const CardBase = styled(Card)(({ theme }) => ({
  display: 'block',
  animation: 'fadeIn ease 0.8s',
  animationFillMode: 'forwards',
  position: 'relative',
  padding: '10px',
}));

const CustomAvatarBase = styled(CustomAvatar)(({ theme }) => ({
  width: '100px',
  height: '100px',
  display: 'flex',
  marginRight: 'auto',
  marginLeft: 'auto',
  marginBottom: '0px',
  boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)',
  fontSize: '40px',
  zIndex: '2',
}));

const CardMediaBase = styled(CardMedia)(({ theme }) => ({
  height: '250px',
  opacity: '0.5',
  display: 'flex',
  zIndex: '-1',
  position: 'absolute',
  top: '-5',
  left: '0',
  right: '0',
  bottom: '0',
  width: '100%',
  backgroundColor: 'secondary.main',
  objectFit: 'cover',
}));

const GridBaseViewForm = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  animation: 'fadeIn ease 0.8s',
  animationFillMode: 'forwards',
  position: 'relative',
  zIndex: '1',
  width: '100%',
  height: 'auto',
  overflow: 'hidden',
  borderRadius: '10px',
}));

const GridBaseCard1 = styled(Grid)(({ theme }) => ({
  display: 'block',
  textAlign: 'center',
  width: '200px',
}));

const GridBaseCard2 = styled(Grid)(({ theme }) => ({
  display: 'flex',
  textAlign: 'left',
  width: '200px',
}));

// ----------------------------------------------------------------------

export default function CustomerContactList(currentContact = null) {
  const { customer } = useSelector((state) => state.customer);
  const [openContact, setOpenContact] = useState(false);
  const { dense, page, order, orderBy, rowsPerPage } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const [controlled, setControlled] = useState(false);
  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
  };
  const dispatch = useDispatch();
  const { contacts, error, initial, responseMessage, contactEditFormVisibility, formVisibility } =
    useSelector((state) => state.contact);
  const [checked, setChecked] = useState(false);
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [initialCardState, setInitialCardState] = useState(true); // this is for the initial card state
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
      setCardActiveIndex(null);
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
    setCardActiveIndex(index);
  };

  const handleExpand = (index) => {
    // setExpanded(!expanded);
    setIsExpanded(true);
  };

  const handleCloseContact = () => setOpenContact(false);

  useLayoutEffect(() => {
    // dispatch(setFormVisibility(checked));
    if (!formVisibility && !contactEditFormVisibility) {
      dispatch(getContacts(customer._id));
    }
  }, [dispatch, checked, customer, formVisibility, contactEditFormVisibility]);

  useEffect(() => {
    if (initial) {
      setTableData(contacts);
    }
  }, [contacts, error, responseMessage, enqueueSnackbar, initial]);

  const isNotFound = !contacts.length && !formVisibility && !contactEditFormVisibility;
  const fullName = contacts.map((contact) => `${contact.firstName} ${contact.lastName || ''}`);

  // conditions for rendering the contact view, edit, and add forms
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
        <Grid container spacing={1}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              underline="none"
              variant="subtitle2"
              color="inherit"
              href={PATH_DASHBOARD.customer.root}
            >
              {customer.name}
            </Link>
            <Link
              underline="none"
              variant="subtitle2"
              color="inherit"
              href={PATH_DASHBOARD.customer.contacts}
            >
              Contacts
            </Link>
            <Link
              underline="none"
              variant="subtitle2"
              color="inherit"
              href={PATH_DASHBOARD.customer.contacts}
            >
              {Breadcrumbs.separator === activeIndex ? '›' : ''}
              {contactEditFormVisibility
                ? `Edit ${currentContactData.firstName}`
                : isExpanded && currentContactData.firstName}
              {formVisibility && !isExpanded && 'Add new contact'}
            </Link>
          </Breadcrumbs>
        </Grid>
      </Stack>
      <Grid container spacing={1} direction="row" justifyContent="flex-start">
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={4}
          sx={{ display: formVisibility && isMobile && 'none' }}
        >
          <Scrollbar
            snap
            snapOffset={100}
            // if click on scrollbar do not close the accordion
            onClick={(e) => e.stopPropagation()}
            snapAlign="start"
            sx={{
              height: { xs: '20vh', md: 'calc(100vh - 100px)' },
              scrollSnapType: 'y mandatory',
              scrollSnapAlign: 'start',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
              '& .simplebar-content': { height: { xs: 'calc(100vh - 200px)', md: '100%' } },
              border: '1px solid #D9D9D9',
              borderRadius: '15px',
            }}
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
                        {/*  */}
                        <Card
                          sx={{
                            opacity: activeCardIndex !== index ? 1 : 0.6,
                            border: activeCardIndex === index && '2px solid #D9D9D9',
                            boxShadow:
                              activeCardIndex === index && '0px 4px 4px rgba(127, 5, 35, 0.25)',

                            backgroundColor: activeCardIndex === index && '#EDE7D9',
                            height: isMobile ? '100px' : '200px',
                            width: '100%',
                          }}
                        >
                          <CardActionArea active={activeIndex === index}>
                            <Link
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
                              underline="none"
                            >
                              <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                              >
                                {!isMobile && (
                                  <GridBaseCard1 item lg={4} justifyContent="center">
                                    <CardContent
                                      component={Stack}
                                      display="block"
                                      height="170px"
                                      sx={{ position: 'relative', zIndex: '1' }}
                                    >
                                      <CustomAvatarBase
                                        name={fullName[index]}
                                        alt={fullName[index]}
                                      />

                                      <CardMediaBase
                                        component="img"
                                        image="/assets/images/covers/bg.jpg"
                                        alt="customer's contact cover photo was here"
                                      />
                                    </CardContent>
                                  </GridBaseCard1>
                                )}

                                <GridBaseCard2 item lg={8} justifyContent="flex-start">
                                  <CardContent
                                    component={Stack}
                                    display="block"
                                    justifyContent="center"
                                    height="200px"
                                    my={{ xs: 0, lg: 2 }}
                                  >
                                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                      {fullName[index].length >= 15
                                        ? contact.firstName
                                        : fullName[index]}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                      {contact.title ? contact.title : <br />}
                                    </Typography>
                                    <Typography variant="overline" color="text.secondary" pt={2}>
                                      {contact.email ? contact.email : <br />}
                                    </Typography>
                                  </CardContent>
                                </GridBaseCard2>
                              </Grid>
                            </Link>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    )}
                  </>
                );
              })}
            </Grid>
          </Scrollbar>
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
        {/* option 1 */}
        {/* {isMobile && (
          <>
            <ContactDialog
              openContact={openContact}
              currentContactData={currentContactData}
              handleCloseContact={handleCloseContact}
            />
            <GridBaseViewForm item lg={12}>
              {shouldShowContactEdit && <ContactEditForm />}
            </GridBaseViewForm>
          </>
        )} */}

        {/* option 2 */}
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
        <Grid item lg={12}>
          <TableNoData isNotFound={isNotFound} />
        </Grid>
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (contact) => contact.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((contact) => filterStatus.includes(contact.status));
  }

  return inputData;
}
