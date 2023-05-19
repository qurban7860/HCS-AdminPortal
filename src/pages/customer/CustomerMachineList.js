import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { Switch, Stack, Card, Grid, Table, Button, Tooltip, TableBody, Container, IconButton, TableContainer, DialogTitle, Dialog,  Typography, Accordion, AccordionSummary, AccordionDetails, Link } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useTable, getComparator, emptyRows, TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom, TableSelectedAction, TablePaginationCustom, } from '../../components/table';
import Iconify from '../../components/iconify';
// sections
import { getCustomerMachines, getMachine, resetMachine } from '../../redux/slices/products/machine';

// import ContactViewForm from './contact/ContactViewForm';
import _mock from '../../_mock';
import EmptyContent from '../../components/empty-content';
import ViewFormField from '../components/ViewFormField';
import ListSwitch from '../components/ListSwitch';

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
  const { customer, error, initial, responseMessage, } = useSelector((state) => state.customer);
  const { customerMachines, machine } = useSelector((state) => state.machine);
  // console.log("customerMachines : ",customerMachines)
  const [checked, setChecked] = useState(false);
  // const toggleChecked = () =>
  //   {
  //     setChecked(value => !value);
  //     dispatch(setContactFormVisibility(!formVisibility));
  //   };
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [openMachine, setOpenMachine] = useState(false);
  const [machineData, setMachineData] = useState({});
  // console.log("machineData", machineData);
  const handleOpenMachine = () =>  setOpenMachine(true);
  const handleCloseMachine = () => setOpenMachine(false);
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
  const handleDescriptionExpandedToggle = () => {
    setDescriptionExpanded(!descriptionExpanded);
  };
  useEffect(() => {
      dispatch(getCustomerMachines(customer._id));
  }, [dispatch, checked, customer, ]);

  useEffect(() => {
    if (initial) {
      // if (contacts && !error) {
      //   enqueueSnackbar(responseMessage);
      // } else {
      //   enqueueSnackbar(error, { variant: `error` });
      // }
      setTableData(customerMachines);
    }
  }, [customerMachines, error, responseMessage, enqueueSnackbar, initial]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const dataInPage = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const denseHeight = dense ? 60 : 80;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = !customerMachines.length ;
  const handleViewMachine = (id) => {
    navigate(PATH_MACHINE.machine.view(id));
  };

  return (
    <>
      {/* {!contactEditFormVisibility && (
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
      )} */}
      <Card>
        {customerMachines.map((customerMachine, index) => {
            const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
            return (
              <Accordion
                key={customerMachine._id}
                // expanded={expanded === index}
                // onChange={handleChange(index)}
                sx={{ borderTop: borderTopVal }}
                >
                {/* <AccordionSummary
                  // expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                  // onClick={() => handleAccordianClick(index)}
                > */}
                  {index !== activeIndex ? (
                    <Grid container spacing={0} sx={{p:1}}>
                      <Grid item xs={12} sm={6} md={2} >
                        {customerMachine?.serialNo && 
                          <Link 
                          onClick={()=>{ 
                            setDescriptionExpanded(false);
                            setOpenMachine(true);
                            setMachineData(customerMachine)
                          }}
                          href="#"
                          underline="none">
                          {customerMachine?.serialNo}
                          </Link>}
                      </Grid>
                      <Grid item xs={12} sm={6} md={2}>
                        {customerMachine?.name && customerMachine?.name}
                      </Grid>
                      <Grid item xs={12} sm={6} md={2} display={{ sm: 'none', md: 'block' }}  >
                        {customerMachine?.machineModel?.name && customerMachine?.machineModel?.name}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={6}
                        display={{ sm: 'none', md: 'none', lg: 'block' }}
                      >
 
                      </Grid>
                    </Grid>
                  ) : null}
                {/* </AccordionSummary> */}
                {/* <AccordionDetails sx={{ mt: -5 }}> */}
                  {/* <ContactViewForm currentContact={customerMachine} /> */}
                {/* </AccordionDetails> */}
              </Accordion>
            );
          })}
        {isNotFound && <EmptyContent title="No data" sx={{ color: '#DFDFDF' }} />}
        <Dialog
        maxWidth="md"
        open={openMachine}
        onClose={handleCloseMachine}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        >
        <Grid
          container
          item
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            padding: '10px',
          }}
        >
          <Typography variant="h4" sx={{ px: 2 }}>
            Machine{' '}
          </Typography>{' '}
          <Link onClick={() => handleCloseMachine()} href="#" underline="none" sx={{ ml: 'auto' }}>
            {' '}
            <Iconify icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        <Grid container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={6} heading="Serial No"                   param={machineData?.serialNo} isActive={machineData.isActive} />
          <ViewFormField sm={6} heading="Name"                        param={machineData?.name} />
          <ViewFormField sm={6} heading="Previous Machine Serial No"  param={machineData?.parentSerialNo}/>
          <ViewFormField sm={6} heading="Previous Machine"            param={machineData?.parentMachine?.name} />
          <ViewFormField sm={6} heading="Supplier"                    param={machineData?.supplier?.name} />
          <ViewFormField sm={6} heading="Machine Model"               param={machineData?.machineModel?.name} />
          {/* <ViewFormField sm={6} heading="Status"                      param={machineData?.status?.name} /> */}
          {/* <ViewFormField sm={6} heading="Work Order / Perchase Order" param={machineData?.workOrderRef} /> */}
          {/* <ViewFormField sm={12} heading="Customer"                   param={machineData?.customer?.name }/> */}
          <ViewFormField sm={6} heading="Installation Site"           param={machineData?.instalationSite?.name}/>
          <ViewFormField sm={6} heading="Billing Site"                param={machineData?.billingSite?.name}/>
          <ViewFormField sm={12} heading="Nearby Milestone"           param={machineData?.siteMilestone} />
          <Grid item xs={12} sm={12} sx={{ px:2,py:1, overflowWrap: "break-word", }}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}> Description </Typography>
            {machineData?.description && <Typography variant="body1" component="p" >
                {descriptionExpanded ? machineData?.description : `${machineData?.description.slice(0, 90)}...`}{machineData?.description?.length > 90 && (
                <Button onClick={handleDescriptionExpandedToggle} color="primary">
                  {descriptionExpanded ? 'See Less' : 'See More'}
                </Button>)}
            </Typography>}
          </Grid>
          
        </Grid>
        <Grid item container sx={{ px: 2, pb: 3 }}>
          <Grid item container sx={{ py: '2rem' }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.lighter} ,  white)`,
              }}
            >
              <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'primary.contrastText' }}>
                Howick Resources{' '}
              </Typography>
            </Grid>
          </Grid>
          <ViewFormField
            sm={6}
            heading="Account Manager"
            param={machineData?.accountManager?.firstName}
            secondParam={machineData?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={machineData?.projectManager?.firstName}
            secondParam={machineData?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={machineData?.supportManager?.firstName}
            secondParam={machineData?.supportManager?.lastName}
          />
        </Grid>
        <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} sm={12}>
          <Link
            onClick={() => handleViewMachine(machineData._id)}
            href="#"
            underline="none"
            sx={{
              ml: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 3,
              pb: 3,
            }}
          >
            {' '}
            <Typography variant="body" sx={{ px: 2 }}>
              Go to Machine
            </Typography>
            <Iconify icon="mdi:share" />
          </Link>
        </Grid>
      </Dialog>
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
      (customerMachine) => customerMachine.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customerMachine) => filterStatus.includes(customerMachine.status));
  }

  return inputData;
}
