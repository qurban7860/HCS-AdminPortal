import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getTechparam} from '../../../redux/slices/products/machineTechParam';
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

export default function ParameterEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 

  
  const { techparam } = useSelector((state) => state.techparam);

  // useLayoutEffect(() => {
  //   //  dispatch(getTechparam(id));
  // }, [dispatch, id]);

  
  return (
    <>
      <Container maxWidth={false }>


        <ParameterEditForm/>
      </Container>
    </>
  );
}
