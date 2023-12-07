import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// redux
import {

  deleteTool,
} from '../../../redux/slices/products/tools';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

ToolViewForm.propTypes = {
  currentTool: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ToolViewForm({ currentTool = null }) {
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { tool, isLoading } = useSelector((state) => state.tool);
  const { id } = useParams();
  
  const dispatch = useDispatch();
  
  const handleEdit = () => {
    navigate(PATH_MACHINE.machines.settings.tool.edit(id));
  };
  
  const defaultValues = useMemo(
    () => ({
      name: tool?.name || '',
      description: tool?.description || '',
      isActive: tool?.isActive,
      createdByFullName: tool?.createdBy?.name || '',
      createdAt: tool?.createdAt || '',
      createdIP: tool?.createdIP || '',
      updatedByFullName: tool?.updatedBy?.name || '',
      updatedAt: tool?.updatedAt || '',
      updatedIP: tool?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTool, tool]
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteTool(id));
      navigate(PATH_MACHINE.machines.settings.tool.list);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.log(error);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} handleEdit={handleEdit} onDelete={onDelete} backLink={() => navigate(PATH_MACHINE.machines.settings.tool.list)}/>
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
