import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  Card,
  Grid,
  Button,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useTable, getComparator, TableNoData } from '../../components/table';
import Iconify from '../../components/iconify';
// sections
import { getContacts, setContactFormVisibility } from '../../redux/slices/customer/contact';
import ContactAddForm from './contact/ContactAddForm';
import ContactEditForm from './contact/ContactEditForm';
import ContactViewForm from './contact/ContactViewForm';

// ----------------------------------------------------------------------

export default function CustomerContactList() {
  const { dense, page, order, orderBy, rowsPerPage } = useTable({
    defaultOrderBy: '-createdAt',
  });
  const [controlled, setControlled] = useState(false);
  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
  };
  const dispatch = useDispatch();
  const { contacts, error, initial, responseMessage, contactEditFormVisibility, formVisibility } =
    useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
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
  const [expanded, setExpanded] = useState(false);

  const handleAccordianClick = (accordianIndex) => {
    if (accordianIndex === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(accordianIndex);
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
        </Stack>
      )}
      <Card>
        {contactEditFormVisibility && <ContactEditForm />}
        {formVisibility && !contactEditFormVisibility && <ContactAddForm />}
        {/* {!formVisibility && !contactEditFormVisibility && <Block title="Available Sites"> */}
        {!formVisibility &&
          !contactEditFormVisibility &&
          contacts.map((contact, index) => {
            const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
            return (
              <Accordion
                key={contact._id}
                expanded={expanded === index}
                onChange={handleChange(index)}
                sx={{ borderTop: borderTopVal }}
              >
                <AccordionSummary
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  onClick={() => handleAccordianClick(index)}
                >
                  {index !== activeIndex ? (
                    <Grid container spacing={0}>
                      <Grid item xs={12} sm={6} md={3}>
                        {contact?.firstName} {contact.lastName}{' '}
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        {contact?.email && <Typography>{contact.email}</Typography>}
                      </Grid>
                      <Grid item xs={12} sm={9} md={2} display={{ sm: 'none', md: 'block' }}>
                        {contact?.phone && <Typography>{contact.phone}</Typography>}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={9}
                        md={2}
                        display={{ sm: 'none', md: 'none', lg: 'block' }}
                      >
                        {contact?.title && <Typography>{contact.title}</Typography>}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={9}
                        md={2}
                        display={{ sm: 'none', md: 'none', lg: 'block' }}
                      >
                        {contact?.contactTypes && (
                          <Typography>{Object.values(contact.contactTypes)?.join(', ')}</Typography>
                        )}
                      </Grid>
                    </Grid>
                  ) : null}
                </AccordionSummary>
                <AccordionDetails sx={{ mt: -5 }}>
                  <ContactViewForm currentContact={contact} />
                </AccordionDetails>
              </Accordion>
            );
          })}
        <TableNoData isNotFound={isNotFound} />
      </Card>
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
