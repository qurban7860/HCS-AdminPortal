import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Switch ,Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getTool, setToolEditFormVisibility , deleteTool } from '../../../redux/slices/products/tools';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

import { fDate } from '../../../utils/formatTime';

import ToolEditForm from './ToolEditForm';

import Iconify from '../../../components/iconify/Iconify';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';
import ViewFormSwitch from '../../components/ViewFormSwitch';



// ----------------------------------------------------------------------


ToolViewForm.propTypes = {
  currentTool: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ToolViewForm({ currentTool = null }) {


  const [editFlag, setEditFlag] = useState(false);

  const handleEdit = () => {
    // dispatch(setToolEditFormVisibility(true));
    navigate(PATH_MACHINE.tool.tooledit(id));
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { tool } = useSelector((state) => state.tool);
  // const tool = tools
  const { id } = useParams();

  const dispatch = useDispatch()
  // useLayoutEffect(() => {
  //   console.log(id,"useEffectNow")
  //   if(id != null){
  //     dispatch(getTool(id));
  //   }
  // }, [dispatch, id]);

  const defaultValues = useMemo(
    () => (
      {
        name:tool?.name || '',
        description:tool?.description || '',
        isActive: tool?.isActive ,
        createdByFullName:        tool?.createdBy?.name || "",
        createdAt:                tool?.createdAt || "",
        createdIP:                tool?.createdIP || "",
        updatedByFullName:        tool?.updatedBy?.name || "",
        updatedAt:                tool?.updatedAt || "",
        updatedIP:                tool?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTool, tool]
    );

    const onDelete = () => {
      dispatch(deleteTool(id))
      navigate(PATH_MACHINE.tool.list)
    }

  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
      <Grid container>
        <ViewFormField  sm={12} heading="Name" param={defaultValues.name ? defaultValues.name : ''} isActive={defaultValues.isActive}/>
        <ViewFormField  sm={12} heading="Description" param={defaultValues.description ? defaultValues.description : ''} />
        <ViewFormSwitch isActive={defaultValues.isActive} />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>

      </Grid>
    </Card>
  );
}
