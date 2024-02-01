import PropTypes from 'prop-types';
import {  useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid, Chip, Container } from '@mui/material';
// import { RHFSwitch } from '../../../components/hook-form';
// redux
import {
  getCategoryGroup,
  deleteCategoryGroup,
} from '../../../redux/slices/products/categoryGroup';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
//  components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { Cover } from '../../../components/Defaults/Cover';

// ----------------------------------------------------------------------

export default function CategoryGroupViewForm() {
 
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { categoryGroup, isLoading } = useSelector((state) => state.categoryGroup);

  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getCategoryGroup(id));
    }
  }, [dispatch, id]);

  const defaultValues = useMemo(
    () => ({
      name: categoryGroup?.name || '',
      categories: categoryGroup?.categories || '',
      isActive: categoryGroup.isActive,
      isDefault: categoryGroup?.isDefault,
      createdByFullName: categoryGroup?.createdBy?.name || '',
      createdAt: categoryGroup?.createdAt || '',
      createdIP: categoryGroup?.createdIP || '',
      updatedByFullName: categoryGroup?.updatedBy?.name || '',
      updatedAt: categoryGroup?.updatedAt || '',
      updatedIP: categoryGroup?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoryGroup]
  );

  const handleEdit = () => {
    navigate(PATH_MACHINE.machines.settings.categoryGroups.edit(categoryGroup?._id));
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCategoryGroup(id));
      enqueueSnackbar('Category Group Deleted Successfully!');
      navigate(PATH_MACHINE.machines.settings.categoryGroups.list);
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.log('Error:', err);
    }
  };

  return (
    <Container maxWidth={false}>
        <StyledCardContainer><Cover name={defaultValues?.name} /></StyledCardContainer>
        <Card sx={{ p: 2 }}>
          <ViewFormEditDeleteButtons 
            isActive={defaultValues.isActive} 
            isDefault={defaultValues.isDefault} 
            handleEdit={handleEdit} 
            onDelete={handleDelete} 
            backLink={() => navigate(PATH_MACHINE.machines.settings.categoryGroups.list)}
            />
          <Grid container sx={{mt:2}}>
            <ViewFormField isLoading={isLoading} sm={12} heading="Group" param={defaultValues?.name} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Categories" chips={defaultValues?.categories?.map(category => category?.name)} />
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Card>
    </Container>
  );
}
