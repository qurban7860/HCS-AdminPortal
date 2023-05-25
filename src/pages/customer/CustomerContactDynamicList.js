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
  Box,
  Link,
  CardActionArea,
  CardContent,
  CardMedia,
  Breadcrumbs,
  DialogTitle,
  Dialog,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useTable, getComparator, emptyRows, TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom, TableSelectedAction, TablePaginationCustom, } from '../../components/table';
import Iconify from '../../components/iconify';
// sections
import { getContacts, setContactFormVisibility } from '../../redux/slices/customer/contact';
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

export default function CustomerContactList() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const [controlled, setControlled] = useState(false);
  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
  };
  const dispatch = useDispatch();
  const { contacts, error, initial, responseMessage, contactEditFormVisibility, formVisibility } = useSelector((state) => state.contact);
  const { customer } = useSelector((state) => state.customer);
  const [checked, setChecked] = useState(false);
  const toggleChecked = () =>
    {
      setChecked(value => !value);
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
   if(accordianIndex === activeIndex ){
    setActiveIndex(null)
   }else{
    setActiveIndex(accordianIndex)
   }
  };

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // console.log("Expended : ",expanded)
  };
  useLayoutEffect(() => {
    // dispatch(setFormVisibility(checked));
    if(!formVisibility && !contactEditFormVisibility){
      dispatch(getContacts(customer._id));
    }
  }, [dispatch, checked, customer, formVisibility, contactEditFormVisibility]);

  useEffect(() => {
    if (initial) {
      if (contacts && !error) {
        enqueueSnackbar(responseMessage);
      } else {
        enqueueSnackbar(error, { variant: `error` });
      }
      setTableData(contacts);
    }
  }, [contacts, error, responseMessage, enqueueSnackbar, initial]);

    const AccordionDetailsCustom = styled((props) => <AccordionDetails {...props} />)(
      ({ theme }) => ({
        padding: theme.spacing(1),
        // borderTop: `solid 1px ${theme.palette.divider}`,
      })
    );

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
          <Grid container>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link
                underline="hover"
                variant="subtitle2"
                color="inherit"
                href={PATH_DASHBOARD.customer.root}
              >
                Customer
              </Link>
              <Link
                underline="hover"
                variant="subtitle2"
                color="inherit"
                href={PATH_DASHBOARD.customer.sites}
              >
                Sites
              </Link>
            </Breadcrumbs>
          </Grid>
        </Stack>
      )}
      <Box
        sx={{
          display: 'block',
          alignItems: 'center',
        }}
        >
        {contactEditFormVisibility && <ContactEditForm />}
        {formVisibility && !contactEditFormVisibility && <ContactAddForm />}
        {!formVisibility &&
          !contactEditFormVisibility &&
          contacts.map((contact, index) => {
            const borderTopVal = index !== 0 ? '0px solid white' : '';
            return (
              <Accordion
                key={contact._id}
                expanded={expanded === index}
                onChange={handleChange(index)}
                sx={{
                  padding: '0px',
                  borderTop: borderTopVal,
                  borderBottom: '0px solid white',
                  boxShadow: 'none',
                  borderRadius: '0px',
                  '&:before': {
                    display: 'none',
                  },
                }}
                >
                <AccordionSummary
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  onClick={() => handleAccordianClick(index)}
                  // expandIcon={<Avatar alt={site.name} src={site.logo} sx={{ m: 1 }} />}
                  sx={{
                    animation: 'transition.expandIn',
                    ease: 'ease-in',
                    transition: 'all 0.10s ease-in',
                  }}
                  >
                  <Grid container xs={12} lg={4}>
                    {index !== activeIndex ? (
                      <Card sx={{ display: 'block', width: 'auto' }}>
                        <CardActionArea>
                          <Box lg={4} sx={{ display: 'inline-flex' }}>
                            <Box justifyContent="flex-start" sx={{ width: '200px' }}>
                              <CardContent sx={{ flex: '1 0 auto' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                  {contact.name}
                                </Typography>
                                <Typography variant="body2">
                                  {contact.email ? contact.email : <br />}
                                </Typography>
                              </CardContent>
                            </Box>
                            <Box lg={4}>
                              <CardMedia
                                component="img"
                                sx={{ width: 151, display: 'flex', justifyContent: 'flex-end' }}
                                image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                                alt="customer's site photo was here"
                              />
                            </Box>
                          </Box>
                        </CardActionArea>
                      </Card>
                    ) : null}
                  </Grid>
                </AccordionSummary>
                <AccordionDetailsCustom
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  aria-controls="panel1a-content"
                  sx={{ mt: -5 }}
                >
                  <Grid container lg={12} justifyContent="flex-start" alignItems="flex-start">
                    <Grid item lg={4}>
                      <Card sx={{ width: 'auto', height: '100%', m: 2 }}>
                        <CardActionArea>
                          <CardMedia
                            component="img"
                            sx={{ height: '100%', display: 'block' }}
                            image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                            alt="customer's site photo was here"
                          />
                        </CardActionArea>
                      </Card>
                    </Grid>
                    <Grid item lg={8}>
                      <ContactViewForm currentContact={contact} />
                    </Grid>
                  </Grid>
                </AccordionDetailsCustom>
              </Accordion>
            );
          })}
        <TableNoData isNotFound={isNotFound} />
      </Box>
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
