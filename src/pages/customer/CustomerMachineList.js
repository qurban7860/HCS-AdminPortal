import { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Typography, Accordion, AccordionSummary, Link, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CUSTOMER, PATH_MACHINE } from '../../routes/paths';
// hooks
import { useSnackbar } from '../../components/snackbar';
import { useSettingsContext } from '../../components/settings';
import { useTable, TableNoData } from '../../components/table';
// components
import DialogMachine from '../components/Dialog/Dialogs/DialogMachine';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import FormLabel from '../components/DocumentForms/FormLabel';
import DialogLabel from '../components/Dialog/DialogLabel';
import DialogLink from '../components/Dialog/DialogLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
// sections
import { getCustomerMachines, getMachine, resetMachine } from '../../redux/slices/products/machine';
// constants
import { BREADCRUMBS } from '../../constants/default-constants';
// import ContactViewForm from './contact/ContactViewForm';

// ----------------------------------------------------------------------

export default function CustomerContactList() {
  const { dense, page, order, orderBy, rowsPerPage } = useTable({
    defaultOrderBy: '-createdAt',
  });
  const [controlled, setControlled] = useState(false);

  const { customer, error, initial, responseMessage } = useSelector((state) => state.customer);
  const { customerMachines, machine } = useSelector((state) => state.machine);

  const [checked, setChecked] = useState(false);

  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [openMachine, setOpenMachine] = useState(false);
  const [machineData, setMachineData] = useState({});
  // hooks
  const address = {};
  const dispatch = useDispatch();
  const { themeStretch } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // --------------------------hooks--------------------------------------
  useEffect(() => {
    dispatch(getCustomerMachines(customer._id));
  }, [dispatch, checked, customer]);

  useEffect(() => {
    if (initial) {
      setTableData(customerMachines);
    }
  }, [customerMachines, error, responseMessage, enqueueSnackbar, initial]);

  // --------------------------handle functions--------------------------------------

  const handleOpenMachine = () => setOpenMachine(true);
  const handleCloseMachine = () => setOpenMachine(false);
  const handleChangeControlled = (panel) => (event, isExpanded) => {
    setControlled(isExpanded ? panel : false);
  };
  const handleAccordianClick = (accordianIndex) => {
    if (accordianIndex === activeIndex) {
      setActiveIndex(null);
    } else {
      setActiveIndex(accordianIndex);
    }
  };

  const isNotFound = !customerMachines.length;
  const handleViewMachine = (id) => {
    navigate(PATH_MACHINE.machines.view(id));
  };

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <BreadcrumbsProvider>
            <BreadcrumbsLink to={PATH_CUSTOMER.list} name={BREADCRUMBS.CUSTOMERS} />
            <BreadcrumbsLink to={PATH_CUSTOMER.view} name={customer.name} />
            <BreadcrumbsLink
              to={PATH_CUSTOMER.document}
              name={
                <Stack>
                  {customerMachines.length > 0 ? customerMachines.length : 'No Machines'}{' '}
                  {customerMachines.length > 1
                    ? 'Machines'
                    : customerMachines.length > 0 && 'Machine'}
                </Stack>
              }
            />
          </BreadcrumbsProvider>
        </Grid>
        <AddButtonAboveAccordion isCustomer="true" />
      </Grid>
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

        {/* dialog for machine */}
        <DialogMachine
          open={openMachine}
          onClose={handleCloseMachine}
          machine={machineData}
          onClick={() => handleViewMachine(machineData._id)}
        />
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

// will be used later
// function applyFilter({ inputData, comparator, filterName, filterStatus }) {
//   const stabilizedThis = inputData.map((el, index) => [el, index]);

//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) return order;
//     return a[1] - b[1];
//   });

//   inputData = stabilizedThis.map((el) => el[0]);

//   if (filterName) {
//     inputData = inputData.filter(
//       (customerMachine) =>
//         customerMachine.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
//     );
//   }

//   if (filterStatus.length) {
//     inputData = inputData.filter((customerMachine) =>
//       filterStatus.includes(customerMachine.status)
//     );
//   }

//   return inputData;
// }
