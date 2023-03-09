import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getMachinestatuses, getMachineStatus} from '../../../redux/slices/statuses';
import StatusEditForm from './StatusEditForm';
// redux

// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections



// ----------------------------------------------------------------------

export default function StatusEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  console.log(id);

  
  const { machinestatus } = useSelector((state) => state.machinestatus);

  useLayoutEffect(() => {
     dispatch(getMachineStatus(id));
  }, [dispatch, id]);

  
  return (
    <>
      <Helmet>
        <title> Machine Status: Edit Page | Machine ERP</title>
      </Helmet>
      

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Status"
          links={[
            { name: 'Dashboard', href: PATH_MACHINE.root },
            {
              name: 'Status',
              href: PATH_MACHINE.techParam.list,
            },
            { name: machinestatus?.name },
          ]}
        />

        <StatusEditForm/>
      </Container>
    </>
  );
}
