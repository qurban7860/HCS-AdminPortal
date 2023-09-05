import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid} from '@mui/material';
// redux
import {

  deleteTool,
} from '../../../redux/slices/products/tools';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

// import { fDate } from '../../../utils/formatTime';

// import ToolEditForm from './ToolEditForm';

// import Iconify from '../../../components/iconify/Iconify';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

ToolViewForm.propTypes = {
  currentTool: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ToolViewForm({ currentTool = null }) {
  // const [editFlag, setEditFlag] = useState(false);

  const handleEdit = () => {
    // dispatch(setToolEditFormVisibility(true));
    navigate(PATH_MACHINE.machines.settings.tool.edit(id));
  };

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { tool } = useSelector((state) => state.tool);
  // const tool = tools
  const { id } = useParams();

  const dispatch = useDispatch();
  // useLayoutEffect(() => {
  //   console.log(id,"useEffectNow")
  //   if(id != null){
  //     dispatch(getTool(id));
  //   }
  // }, [dispatch, id]);

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

  const onDelete = () => {
    try {
      dispatch(deleteTool(id));
      navigate(PATH_MACHINE.machines.settings.tool.list);
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('Tool delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
      <Grid container>
        <ViewFormField isActive={defaultValues.isActive} />
        <ViewFormField sm={12} heading="Name" param={defaultValues?.name} />
        <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
