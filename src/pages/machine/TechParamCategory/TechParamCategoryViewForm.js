import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// Iconify
import { deleteTechparamcategory} from '../../../redux/slices/products/machineTechParamCategory';
import { fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify/Iconify';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
// ----------------------------------------------------------------------

TechParamCategoryViewForm.propTypes = {
  currentTechparamcategory: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function TechParamCategoryViewForm({ currentTechparamcategory = null }) {

  const toggleEdit = () => {navigate(PATH_MACHINE.techParam.techparamcategoryedit(id))}
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { techparamcategory } = useSelector((state) => state.techparamcategory);

  const { id } = useParams();

  const defaultValues = useMemo(
    () => (
      {
        name:                     techparamcategory?.name || "",
        description:              techparamcategory?.description || "",
        isActive:                 techparamcategory.isActive ,
        createdAt:                techparamcategory?.createdAt || "",
        createdByFullName:        techparamcategory?.createdBy?.name || "",
        createdIP:                techparamcategory?.createdIP || "",
        updatedAt:                techparamcategory?.updatedAt || "",
        updatedByFullName:        techparamcategory?.updatedBy?.name || "",
        updatedIP:                techparamcategory?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTechparamcategory, techparamcategory]
    );
    const onDelete = () => {
      dispatch(deleteTechparamcategory(id))
      navigate(PATH_MACHINE.techParam.list)
    }
  return (
    <Card sx={{ p: 3 }}>
        <ViewFormEditDeleteButtons handleEdit={toggleEdit} onDelete={onDelete} />
      <Grid container>
        <ViewFormField sm={12}   heading='Name'                 param={defaultValues?.name} />
        <ViewFormField sm={12}   heading='Description'          param={defaultValues?.description}/>
        <ViewFormField />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
      </Grid>
    </Card>
  );
}
