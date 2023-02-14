import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link as RouterLink, useNavigate } from 'react-router-dom';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, Container, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../config-global';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import Iconify from '../../components/iconify';

// slices
import { getCustomers, getCustomer } from '../../redux/slices/customer';








// ----------------------------------------------------------------------

export default function CustomerViewForm() {

  const { customer } = useSelector((state) => state.customer);
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const defaultValues = useMemo(
    () => ({
      id: customer?._id || 'N/A',
      name: customer?.name || 'N/A',
      tradingName: customer?.tradingName || 'N/A',
      accountManager: customer?.accountManager || 'N/A',
      projectManager: customer?.projectManager || 'N/A',
      supportManager: customer?.supportManager || 'N/A',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customer]
  );

  console.log(defaultValues); 




  return (
   
    //   <CustomBreadcrumbs
    //     heading="Customer List"
    //     links={[
    //       // { name: 'Dashboard', href: PATH_DASHBOARD.root },
    //       // {
    //       //   name: 'Customer',
    //       //   href: PATH_DASHBOARD.customer.list,
    //       // },
    //       // { name: 'List' },
    //     ]}
    //     action={
    //       <Button
    //         component={RouterLink}
    //         to={PATH_DASHBOARD.customer.new}
    //         variant="contained"
    //         // startIcon={<Iconify icon="eva:plus-fill" />}
    //       >
    //         New Customer
    //       </Button>
    //     }
    //   />
    // </>

      <Card sx={{ pt: 5, px: 5 }}>
        {/* <Grid container
          sx={{
            paddingBottom: 2
          }}>

          <Box
            rowGap={4}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(4, 1fr)',
              sm: 'repeat(4, 1fr)',
            }}
          >
            <Stack>
              <Button
                component={RouterLink}
                to={PATH_DASHBOARD.customer.edit()}
                variant="contained"
                startIcon={<Iconify icon="eva:edit-fill" />}
              >
                Edit Customer
              </Button>
      
      
            </Stack>
            <Stack>
              <Button
                component={<CustomerViewPage editPage/>}
                to={<CustomerViewPage editPage/>}
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
              >
                Add Customer
              </Button>
      
      
            </Stack>

          </Box>    
        </Grid> */}

        {/* <CustomBreadcrumbs */}
        {/* // heading="Customer List"
        // links={[
        //   { name: 'Dashboard', href: PATH_DASHBOARD.root },
        //   {
        //     name: 'Customer',
        //     href: PATH_DASHBOARD.customer.list,
        //   },
        //   { name: 'List' },
        // ]}
        // action={ */}
           {/* <Button
            component={RouterLink}
            to={PATH_DASHBOARD.customer.new}
            variant="contained"
            // startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Customer
          </Button> */} 
        {/* }/ */}
      {/* /> */}
    
        <Grid container>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Name
            </Typography>

            <Typography variant="body2">{defaultValues.name}</Typography>

          </Grid>


          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Trading Name
            </Typography>

            <Typography variant="body2">{defaultValues.tradingName}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Account Manager
            </Typography>

            <Typography variant="body2">{defaultValues.accountManager.firstName} {defaultValues.accountManager.lastName}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Project Manager
            </Typography>

            <Typography variant="body2">{defaultValues.projectManager.firstName} {defaultValues.projectManager.lastName}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
             Suppport Manager
            </Typography>

            <Typography variant="body2">{defaultValues.supportManager.firstName} {defaultValues.supportManager.lastName}</Typography>
            
          </Grid>

          {/* <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Department
            </Typography>
            
            <Typography variant="body2">{defaultValues.department}</Typography>
            
          </Grid> */}

            </Grid>
            </Card>
  );
}
