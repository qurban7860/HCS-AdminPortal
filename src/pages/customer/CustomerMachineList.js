import { Helmet } from 'react-helmet-async';
import { paramCase } from 'change-case';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import {
  Card,
  Grid,
  Dialog,
  Typography,
  Accordion,
  AccordionSummary,
  Link,
  Stack,
  Breadcrumbs,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useTable, getComparator, TableNoData } from '../../components/table';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import FormLabel from '../components/FormLabel';
import DialogLabel from '../components/Dialog/DialogLabel';
import DialogLink from '../components/Dialog/DialogLink';
import AddButtonAboveAccordion from '../components/AddButtonAboveAcoordion';
// sections
import { getCustomerMachines, getMachine, resetMachine } from '../../redux/slices/products/machine';

// import ContactViewForm from './contact/ContactViewForm';
import _mock from '../../_mock';
import ViewFormField from '../components/ViewFormField';

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
    defaultOrderBy: '-createdAt',
  });
  const [controlled, setControlled] = useState(false);
  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
  };
  const dispatch = useDispatch();
  const { customer, error, initial, responseMessage } = useSelector((state) => state.customer);
  const { customerMachines, machine } = useSelector((state) => state.machine);

  console.log('customerMachines : ', customerMachines);
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
  const address = {};
  // console.log("machineData", machineData);
  const handleOpenMachine = () => setOpenMachine(true);
  const handleCloseMachine = () => setOpenMachine(false);
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
  const handleDescriptionExpandedToggle = () => {
    setDescriptionExpanded(!descriptionExpanded);
  };
  useEffect(() => {
    dispatch(getCustomerMachines(customer._id));
  }, [dispatch, checked, customer]);

  useEffect(() => {
    if (initial) {
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
  const isNotFound = !customerMachines.length;
  const handleViewMachine = (id) => {
    navigate(PATH_MACHINE.machine.view(id));
  };

  return (
    <>
      <AddButtonAboveAccordion isCustomer="true" />
      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={5} mb={1}>
        <Breadcrumbs
          aria-label="breadcrumb"
          separator="›"
          sx={{ fontSize: '12px', color: 'text.disabled' }}
        >
          <BreadcrumbsLink to={PATH_DASHBOARD.customer.list} name="Customers" />
          <BreadcrumbsLink to={PATH_DASHBOARD.customer.view} name={customer.name} />
          <BreadcrumbsLink
            to={PATH_DASHBOARD.customer.document}
            name={
              <Stack>
                {customerMachines.length > 0 ? customerMachines.length : 'No Machines'}{' '}
                {customerMachines.length > 1
                  ? 'Machines'
                  : customerMachines.length > 0 && 'Machine'}
              </Stack>
            }
          />
        </Breadcrumbs>
      </Stack>
      <Grid item lg={12}>
        <TableNoData isNotFound={isNotFound} />
      </Grid>
      <Card>
        {customerMachines.map((customerMachine, index) => {
          address.city = customerMachine?.instalationSite?.address?.city;
          address.region = customerMachine?.instalationSite?.address?.region;
          address.country = customerMachine?.instalationSite?.address?.country;
          const borderTopVal = index !== 0 ? '1px solid lightGray' : '';
          return (
            <Accordion
              expanded={false}
              focusVisible={false}
              key={customerMachine._id}
              // expanded={expanded === index}
              // onChange={handleChange(index)}
              sx={{ borderTop: borderTopVal }}
            >
              <AccordionSummary
                aria-controls="panel1a-content"
                focusVisible={false}
                sx={{ cursor: 'unset !important' }}
                //  sx={{ pointerEvents: "none"}}
                // expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                // onClick={() => handleAccordianClick(index)}
              >
                {index !== activeIndex ? (
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={2}>
                      {customerMachine?.serialNo && (
                        <Link
                          onClick={() => {
                            setDescriptionExpanded(false);
                            setOpenMachine(true);
                            setMachineData(customerMachine);
                          }}
                          href="#"
                          underline="none"
                        >
                          <Typography>{customerMachine?.serialNo}</Typography>
                        </Link>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <Typography>{customerMachine?.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} display={{ sm: 'none', md: 'block' }}>
                      <Typography>{customerMachine?.machineModel?.name}</Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={5}
                      md={5}
                      display={{ sm: 'none', md: 'none', lg: 'block' }}
                    >
                      <Typography>
                        {Object.values(address ?? {})
                          .map((value) => (typeof value === 'string' ? value.trim() : ''))
                          .filter((value) => value !== '')
                          .join(', ')}
                      </Typography>
                      {/* {customerMachine?.instalationSite?.address?.city ? customerMachine?.instalationSite?.address?.city : ""}
                        {customerMachine?.instalationSite?.address?.region?.trim() !== undefined  ? ", " : ''}
                        {customerMachine?.instalationSite?.address?.region ? customerMachine?.instalationSite?.address?.region : ""}
                        {customerMachine?.instalationSite?.address?.country?.trim() !== undefined   ? ", " : ''}
                        {customerMachine?.instalationSite?.address?.country ? customerMachine?.instalationSite?.address?.country : ""} */}
                    </Grid>
                  </Grid>
                ) : null}
              </AccordionSummary>
            </Accordion>
          );
        })}

        <Dialog
          maxWidth="md"
          open={openMachine}
          onClose={handleCloseMachine}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <DialogLabel content="Machine" onClick={() => handleCloseMachine()} />
          <Grid container sx={{ px: 2, pt: 2 }}>
            <ViewFormField sm={6} heading="Serial No" param={machineData?.serialNo} />
            <ViewFormField sm={6} heading="Name" param={machineData?.name} />
            <ViewFormField
              sm={6}
              heading="Previous Machine Serial No"
              param={machineData?.parentSerialNo}
            />
            <ViewFormField
              sm={6}
              heading="Previous Machine"
              param={machineData?.parentMachine?.name}
            />
            <ViewFormField sm={6} heading="Supplier" param={machineData?.supplier?.name} />
            <ViewFormField sm={6} heading="Machine Model" param={machineData?.machineModel?.name} />
            {/* <ViewFormField sm={6} heading="Status"                      param={machineData?.status?.name} /> */}
            {/* <ViewFormField sm={6} heading="Work Order / Perchase Order" param={machineData?.workOrderRef} /> */}
            {/* <ViewFormField sm={12} heading="Customer"                   param={machineData?.customer?.name }/> */}
            <ViewFormField
              sm={6}
              heading="Installation Site"
              param={machineData?.instalationSite?.name}
            />
            <ViewFormField sm={6} heading="Billing Site" param={machineData?.billingSite?.name} />
            <ViewFormField sm={12} heading="Nearby Milestone" param={machineData?.siteMilestone} />
            {/* <Grid item xs={12} sm={12} sx={{ px:2,py:1, overflowWrap: "break-word", }}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}> Description </Typography>
            {machineData?.description && <Typography variant="body1" component="p" >
                {descriptionExpanded ? machineData?.description : `${machineData?.description.slice(0, 90)}...`}{machineData?.description?.length > 90 && (
                <Button onClick={handleDescriptionExpandedToggle} color="primary">
                  {descriptionExpanded ? 'See Less' : 'See More'}
                </Button>)}
            </Typography>}
          </Grid> */}
          </Grid>
          <Grid item container sx={{ px: 2, pb: 3 }}>
            <FormLabel content="Howick Resources" />
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
          <DialogLink content="Go to Machine" onClick={() => handleViewMachine(machineData._id)} />
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
      (customerMachine) =>
        customerMachine.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((customerMachine) =>
      filterStatus.includes(customerMachine.status)
    );
  }

  return inputData;
}
