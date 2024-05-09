import {  useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid, Container } from '@mui/material';
// import { RHFSwitch } from '../../../components/hook-form';
// redux
import {
  getGroup,
  deleteGroup,
} from '../../../redux/slices/products/group';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
//  components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { Cover } from '../../../components/Defaults/Cover';

// ----------------------------------------------------------------------

export default function GroupViewForm() {
 
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { group, isLoading } = useSelector((state) => state.group);

  useLayoutEffect(() => {
    if (id) {
      dispatch(getGroup(id));
    }
  }, [dispatch, id]);

  const defaultValues = useMemo(
    () => ({
      name: group?.name || '',
      categories: group?.categories || [],
      isActive: group.isActive,
      isDefault: group?.isDefault,
      createdByFullName: group?.createdBy?.name || '',
      createdAt: group?.createdAt || '',
      createdIP: group?.createdIP || '',
      updatedByFullName: group?.updatedBy?.name || '',
      updatedAt: group?.updatedAt || '',
      updatedIP: group?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [group]
  );

  const handleEdit = () => navigate(PATH_MACHINE.machines.machineSettings.groups.edit(group?._id));

  const handleDelete = async () => {
    try {
      await dispatch(deleteGroup(id));
      enqueueSnackbar('Group Archived Successfully!');
      navigate(PATH_MACHINE.machines.machineSettings.groups.root);
    } catch (err) {
      enqueueSnackbar("Group Archive Failed", { variant: `error` });
      console.log('Error:', err);
    }
  };

  return (
    <Container maxWidth={false}>
        <StyledCardContainer><Cover name={defaultValues?.name} setting /></StyledCardContainer>
        <Card sx={{ p: 2 }}>
          <ViewFormEditDeleteButtons 
            isActive={defaultValues.isActive} 
            isDefault={defaultValues.isDefault} 
            handleEdit={handleEdit} 
            onDelete={handleDelete} 
            backLink={() => navigate(PATH_MACHINE.machines.machineSettings.groups.root)}
            machineSettingPage
            />
          <Grid container sx={{mt:2}}>
            <ViewFormField isLoading={isLoading} sm={12} heading="Group" param={defaultValues?.name} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Categories" chips={defaultValues?.categories.map(category => category?.name)} />
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Card>
    </Container>
  );
}
