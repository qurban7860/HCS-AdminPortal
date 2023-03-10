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

  const handleSearchMachine = () => {
    navigate(PATH_MACHINE.machine.list);
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
                title="Machine"
                color="primary"
                icon="eva:search-fill"
                onClick={handleSearchMachine}
                sx={{ '&:hover': { opacity: 0.72 } }}

              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <MachineWidget
                title="Sites"
                color="info"
                icon="eva:search-fill"
                onClick={handleSearchSite}
                sx={{ '&:hover': { opacity: 0.72 } }}

              />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
              <MachineWidget
                title="Contacts"
                color="success"
                icon="eva:search-fill"
                onClick={handleSearchContact}
                sx={{ '&:hover': { opacity: 0.72 } }}

              />
          </Grid>
    </>
  );
}
