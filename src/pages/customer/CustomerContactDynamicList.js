import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useMemo, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  Card,
  Grid,
  Button,
  Link,
  CardActionArea,
  CardContent,
  CardMedia,
  Breadcrumbs,
  Dialog,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import ViewFormAudit from '../components/ViewFormAudit';
import ViewFormEditDeleteButtons from '../components/ViewFormEditDeleteButtons';
import ViewFormField from '../components/ViewFormField';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useTable, getComparator, TableNoData } from '../../components/table';
import Iconify from '../../components/iconify';
// sections
import {
  getContacts, getContact, setContactFormVisibility } from '../../redux/slices/customer/contact';
import ContactAddForm from './contact/ContactAddForm';
import ContactEditForm from './contact/ContactEditForm';
import ContactViewForm from './contact/ContactViewForm';
import _mock from '../../_mock';
import EmptyContent from '../../components/empty-content';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Site', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'website', label: 'Website', align: 'left' },
  { id: 'isverified', label: 'Disabled', align: 'left' },
  { id: 'created_at', label: 'Created At', align: 'left' },
  { id: 'action', label: 'Actions', align: 'left' },
];

const _accordions = [...Array(8)].map((_, index) => ({
  id: _mock.id(index),
  value: `panel${index + 1}`,
  heading: `Site ${index + 1}`,
  subHeading: _mock.text.title(index),
  detail: _mock.text.description(index),
}));

// ----------------------------------------------------------------------

export default function CustomerContactList(currentContact = null) {
  const { customer } = useSelector((state) => state.customer);
  const { dense, page, order, orderBy, rowsPerPage } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const [openContact, setOpenContact] = useState(false);
  const [controlled, setControlled] = useState(false);
  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
  };
  const dispatch = useDispatch();
  const { contacts, error, initial, responseMessage, contactEditFormVisibility, formVisibility } =
    useSelector((state) => state.contact);
  const [checked, setChecked] = useState(false);
  const toggleChecked = () => {
    setChecked((value) => !value);
    dispatch(setContactFormVisibility(!formVisibility));
  };
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [currentContactData, setCurrentContactData] = useState({});
  const [expanded, setExpanded] = useState(false);
  // open the dialog and set the current contact to the contact that was clicked
  const handleOpenContact = (index) => {
    if(index === activeIndex){
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
      setOpenContact(true);
    }}
  const handleCloseContact = () => setOpenContact(false);

  const handleAccordianClick = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // console.log("Expended : ",expanded)
  };

  useLayoutEffect(() => {
    // dispatch(setFormVisibility(checked));
    if (!formVisibility && !contactEditFormVisibility) {
      dispatch(getContacts(customer._id));
    }
  }, [dispatch, checked, customer, formVisibility, contactEditFormVisibility]);

  useEffect(() => {
    if (initial) {
      // if (contacts && !error) {
      //   enqueueSnackbar(responseMessage);
      // } else {
      //   enqueueSnackbar(error, { variant: `error` });
      // }
      setTableData(contacts);
    }
  }, [contacts, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 60 : 80;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = !contacts.length && !formVisibility && !contactEditFormVisibility;
  const fullName = contacts.map((contact) => `${contact.firstName} ${contact.lastName || ''}`);

  return (
    <>
      {!contactEditFormVisibility && (
        <Stack alignItems="flex-end" sx={{ mt: 3, padding: 2 }}>
          <Button
            onClick={toggleChecked}
            variant="contained"
            startIcon={
              !formVisibility ? <Iconify icon="eva:plus-fill" /> : <Iconify icon="eva:minus-fill" />
            }
            >
            {' '}
            New Contact{' '}
          </Button>

          <Grid container>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                underline="none"
                variant="subtitle2"
                color="inherit"
                href={PATH_DASHBOARD.customer.root}
              >
                Customer
              </Link>
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
            </Breadcrumbs>
          </Grid>
        </Stack>
      )}
      {contactEditFormVisibility && <ContactEditForm />}
      {formVisibility && !contactEditFormVisibility && <ContactAddForm />}
      <Grid
        container
        lg={12}
        spacing={3}
        justifyContent="flex-start"
        grid-template-rows="repeat(3, 1fr)"
        grid-template-columns="repeat(3, 1fr)"
        >
        {!formVisibility &&
          !contactEditFormVisibility &&
          contacts.map((contact, index) => {
            const borderTopVal = index !== 0 ? '0px solid white' : '';
            return (
              <>
                <Grid item sx={{ display: 'inline-block' }}>
                  {index !== activeIndex ? (
                    <Card sx={{ display: 'flex', height: '300px', width: '200px' }}>
                      <Link
                        onClick={() => {
                          setCurrentContactData(contact);
                          setOpenContact(true);
                        }}
                        underline="none"
                      >
                        <CardActionArea>
                          <Grid
                            container
                            justifyContent="center"
                            alignContent="center"
                            sx={{ display: 'block' }}
                          >
                            <Grid
                              item
                              justifyContent="center"
                              sx={{ bgcolor: 'blue', alignContent: 'center' }}
                            >
                              <CardContent
                                component={Stack}
                                display="block"
                                height="170px"
                                sx={{ position: 'relative', zIndex: '1' }}
                              >
                                <CustomAvatar
                                  sx={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'flex',
                                    marginTop: '60px',
                                    marginRight: 'auto',
                                    marginLeft: 'auto',
                                    marginBottom: '0px',
                                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)',
                                    fontSize: '40px',
                                    zIndex: '2',
                                  }}
                                  name={fullName[index]}
                                  alt={fullName[index]}
                                />
                                <CardMedia
                                  component="img"
                                  sx={{
                                    height: '170px',
                                    opacity: '0.5',
                                    display: 'block',
                                    zIndex: '-1',
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    right: '0',
                                    bottom: '0',
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                  }}
                                  image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                                  alt="customer's contact cover photo was here"
                                />
                              </CardContent>
                            </Grid>
                            <Grid
                              item
                              justifyContent="center"
                              sx={{ display: 'block', textAlign: 'center', width: '200px' }}
                            >
                              <CardContent
                                component={Stack}
                                display="block"
                                justifyContent="center"
                                height="130px"
                              >
                                <Typography variant="body1" sx={{ fontWeight: 'bold', p: 1 }}>
                                  {fullName[index] ? fullName[index] : <br />}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {contact.title ? contact.title : <br />}
                                </Typography>
                                <Typography variant="overline" color="secondary.main" pt={2}>
                                  {contact.email ? contact.email : <br />}
                                </Typography>
                              </CardContent>
                            </Grid>
                          </Grid>
                        </CardActionArea>
                      </Link>
                    </Card>
                  ) : null}
                </Grid>
                <Dialog
                  open={openContact}
                  onClose={handleCloseContact}
                  aria-labelledby="alert-dialog-title"
                  aria-describedby="alert-dialog-description"
                >
                  <Grid container lg={12} justifyContent="center">
                    <Grid item lg={12}>
                      <Card sx={{ width: 'auto', height: 'auto', m: 2 }}>
                        <CardActionArea>
                          {/* <CustomAvatar
                            sx={{
                              width: '100px',
                              height: '100px',
                              display: 'flex',
                              marginTop: '60px',
                              marginRight: 'auto',
                              marginLeft: 'auto',
                              marginBottom: '0px',
                              boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)',
                              fontSize: '40px',
                              zIndex: '2',
                            }}
                            name={fullName[index]}
                            alt={fullName[index]}
                          /> */}
                          <CardMedia
                            component="img"
                            sx={{
                              height: '200px',
                              width: '100%',
                              display: 'block',
                              top: '0',
                              left: '0',
                              right: '0',
                              bottom: '0',
                              zIndex: '-1',
                              objectFit: 'cover',
                            }}
                            image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                            alt="customer's site photo was here"
                          />
                        </CardActionArea>
                      </Card>
                    </Grid>
                    <Grid container lg={12}>
                      <ContactViewForm currentContact={currentContactData} />
                    </Grid>
                  </Grid>
                </Dialog>
              </>
            );
          })}
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
