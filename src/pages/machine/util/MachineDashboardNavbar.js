// @mui
import { Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// _mock_
import MachineWidget from './MachineWidget';

import { PATH_DASHBOARD, PATH_MACHINE } from '../../../routes/paths';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------

export default function MachineDashboardNavbar() {

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();



  const handleMachineAdd = () => {
    navigate(PATH_MACHINE.machine.new);
  };

  const handleSearchCustomer = () => {
    navigate(PATH_DASHBOARD.customer.list);
  };

  const handleSearchSite = () => {
    enqueueSnackbar('Under Construction');
    // navigate(PATH_DASHBOARD.site.list);
  };

  const handleSearchContact = () => {
    navigate(PATH_DASHBOARD.contact.list);
  };

  return (
    <>

          <Grid item xs={12} sm={6} md={3}>
              <MachineWidget
                title="Add Machine"
                color="primary"
                icon="eva:plus-fill"
                onClick={handleMachineAdd}
                sx={{ '&:hover': { opacity: 0.72 }, 
              }}

              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <MachineWidget
                title="Search Machine"
                color="primary"
                icon="eva:search-fill"
                onClick={handleSearchCustomer}
                sx={{ '&:hover': { opacity: 0.72 } }}

              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <MachineWidget
                title="Search Sites"
                color="info"
                icon="eva:search-fill"
                onClick={handleSearchSite}
                sx={{ '&:hover': { opacity: 0.72 } }}

              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <MachineWidget
                title="Search Contacts"
                color="success"
                icon="eva:search-fill"
                onClick={handleSearchContact}
                sx={{ '&:hover': { opacity: 0.72 } }}

              />
          </Grid>
    </>
  );
}
