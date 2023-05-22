import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getTools, getTool } from '../../../redux/slices/products/tools';
import ToolEditForm from './ToolEditForm';
// redux

// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs/CustomBreadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections



// ----------------------------------------------------------------------

export default function ToolEdit() {
  const { themeStretch } = useSettingsContext();

  const dispatch = useDispatch();

  const { id } = useParams(); 

  
  const { tool } = useSelector((state) => state.tool);

  useLayoutEffect(() => {
     dispatch(getTool(id));
  }, [dispatch, id]);

  
  return (
    <>
      <Container maxWidth={false }>
        <ToolEditForm/>
      </Container>
    </>
  );
}
