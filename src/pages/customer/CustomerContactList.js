import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Stack,
  Card,
  Grid,
  Table,
  Button,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  DialogTitle,
  Dialog, 
  Typography,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from '../../components/table';
import Iconify from '../../components/iconify';
import Scrollbar from '../../components/scrollbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import ConfirmDialog from '../../components/confirm-dialog';
// sections
import SiteListTableRow from './site/SiteListTableRow';
import SiteListTableToolbar from './site/SiteListTableToolbar';
import { getContacts, setFormVisibility } from '../../redux/slices/customer/contact';
import ContactAddForm from './contact/ContactAddForm';
import ContactEditForm from './contact/ContactEditForm';
import ContactViewForm from './contact/ContactViewForm';


import _mock from '../../_mock';
import EmptyContent from '../../components/empty-content';
import { Block } from '../../sections/_examples/Block';



// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Site', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: 'website', label: 'Website', align: 'left' },
  { id: 'isverified', label: 'Disabled', align: 'left' },
  { id: 'created_at', label: 'Created At', align: 'left' },
  { id: 'action', label: 'Actions', align: 'left' },

];

const STATUS_OPTIONS = [
  // { id: '1', value: 'Order Received' },
  // { id: '2', value: 'In Progress' },
  // { id: '3', value: 'Ready For Transport' },
  // { id: '4', value: 'In Freight' },
  // { id: '5', value: 'Deployed' },
  // { id: '6', value: 'Archived' },
];

// const STATUS_OPTIONS = [
//   { value: 'all_sites', label: 'All Sites' },
//   { value: 'deployable', label: 'All Deployable' },
//   { value: 'pending', label: 'All Pending' },
//   { value: 'archived', label: 'All Archived' },
//   { value: 'undeployable', label: 'All Undeployable' }
// ];

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
      dispatch(setFormVisibility(!formVisibility));
    
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
      <Helmet>
        <title> Contact: List | Machine ERP </title>
      </Helmet>

        {!contactEditFormVisibility && <Stack alignItems="flex-end" sx={{ mt: 3, padding: 2 }}>
          <Button
              // alignItems 
              onClick={toggleChecked}

              variant="contained"
              startIcon={!formVisibility ? <Iconify icon="eva:plus-fill" /> : <Iconify icon="eva:minus-fill" />}
            >
              New Contact
            </Button>

        </Stack>}
        
        <Card>

          {contactEditFormVisibility && <ContactEditForm/>}

          {formVisibility && !contactEditFormVisibility && <ContactAddForm/>}

          {/* {!formVisibility && !contactEditFormVisibility && <Block title="Available Sites"> */}
          {!formVisibility && !contactEditFormVisibility && contacts.map((contact, index) => (
          
  
            <Accordion key={contact._id} expanded={expanded === index} onChange={handleChange(index)} sx={index !==0 ? {borderTop: '1px solid lightGray'}: ""}>
              <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />} onClick={()=>handleAccordianClick(index)} >
                {/* <Typography variant="subtitle1" sx={{ width: '33%', flexShrink: 0 }}>
                  {contact.firstName} {contact.lastName} 
                </Typography>
                {contact.email && <Typography sx={{ color: 'text.secondary' }}>
                  {contact.email}
                  </Typography>
                } */}
                { index !==  activeIndex ? 
              <Grid container spacing={0}>
                <Grid item xs={12} sm={3} md={2} >
                  {/* <Typography variant="body2" > */}
                  {contact?.firstName} {contact.lastName} 
                  {/* </Typography> */}
                </Grid>
                <Grid item xs={12} sm={9} md={3}>
                {contact?.email && <Typography variant="body2" >
                  {contact.email}
                  </Typography>
                }
                </Grid>

                <Grid item xs={12} sm={9} md={2} display={{ sm:"none", md:"block"}}>
                {contact?.phone && <Typography variant="body2" >
                  {contact.phone}
                  </Typography>
                }
                </Grid>

                <Grid item xs={12} sm={9} md={2} display={{ sm:"none", md:"none", lg:"block"}}>
                {contact?.title && <Typography variant="body2" >
                  {contact.title}
                  </Typography>
                }
                </Grid>

                <Grid item xs={12} sm={9} md={2} display={{ sm:"none", md:"none",  lg:"block"}}>
                {contact?.email && <Typography variant="body2" >
                  {contact.email}
                  </Typography>
                }
                </Grid>
              </Grid>
            : null }
              </AccordionSummary>
              <AccordionDetails  sx={{ mt:-5 }}>
                <ContactViewForm
                currentContact={contact}
                />
              </AccordionDetails>
            </Accordion>
            
          ))} 

          {isNotFound && <EmptyContent title="No Data"/>}

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
