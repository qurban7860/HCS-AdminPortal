import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getTechparam} from '../../../redux/slices/products/parameters';
// import StatusEditForm from './StatusEditForm';
// redux

// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
import ParameterEditForm from './ParameterEditForm';

// ----------------------------------------------------------------------

export default function StatusEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 
  console.log(id);

  
  const { techparam } = useSelector((state) => state.techparam);

  useLayoutEffect(() => {
     dispatch(getTechparam(id));
  }, [dispatch, id]);

  
  return (
    <>
      <Helmet>
        <title> Machine Parameter: Edit Page | Machine ERP</title>
      </Helmet>
      

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Tech Parameter"
          sx={{ mb: -2, mt: 3 }}
        />

        <ParameterEditForm/>
      </Container>
    </>
  );
}
