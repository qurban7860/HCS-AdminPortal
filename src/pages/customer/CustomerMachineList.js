import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Typography, Accordion, AccordionSummary, Link, Stack } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
// routes
import { PATH_CUSTOMER, PATH_MACHINE } from '../../routes/paths';
// hooks
import { TableNoData } from '../../components/table';
// components
import MachineDialog from '../components/Dialog/MachineDialog';
import BreadcrumbsProvider from '../components/Breadcrumbs/BreadcrumbsProvider';
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
// sections
import { getCustomerMachines, setMachineDialog } from '../../redux/slices/products/machine';
// constants
import { BREADCRUMBS } from '../../constants/default-constants';

// ----------------------------------------------------------------------

export default function CustomerContactList() {

  const { customer } = useSelector((state) => state.customer);
  const { customerMachines } = useSelector((state) => state.machine);

  const [machineData, setMachineData] = useState({});
  // hooks
  const address = {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --------------------------hooks--------------------------------------
  useEffect(() => {
    dispatch(setMachineDialog(false));
    dispatch(getCustomerMachines(customer._id));
  }, [dispatch, customer]);

  // --------------------------handle functions--------------------------------------

  const handleMachineDialog = (MachineData) => { 
    dispatch(setMachineDialog(true)); setMachineData(MachineData)
  }

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
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6} md={2}>
                      {customerMachine?.serialNo && (
                        <Link
                          onClick={() => { handleMachineDialog(customerMachine) } }
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
              </AccordionSummary>
            </Accordion>
          );
        })}

        <MachineDialog
          machineData={ machineData }
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
