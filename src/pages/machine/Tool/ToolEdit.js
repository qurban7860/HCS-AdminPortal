import { Helmet } from 'react-helmet-async';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { useDispatch,useSelector } from 'react-redux';
import { Container } from '@mui/material';
import { getTools, getTool } from '../../../redux/slices/tools';
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
  console.log(id);

  
  const { tool } = useSelector((state) => state.tool);

  useLayoutEffect(() => {
     dispatch(getTool(id));
  }, [dispatch, id]);

  
  return (
    <>
      <Helmet>
        <title> Tool: Edit Page | Machine ERP</title>
      </Helmet>
      

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Tool"
          links={[
            { name: 'Dashboard', href: PATH_MACHINE.root },
            {
              name: 'Tool',
              href: PATH_MACHINE.tool.list,
            },
            { name: tool?.name },
          ]}
        />

        <ToolEditForm/>
      </Container>
    </>
  );
}
