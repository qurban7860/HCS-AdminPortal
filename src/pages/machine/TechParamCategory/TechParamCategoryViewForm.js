import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getTechparamcategory, updateTechparamcategory } from '../../../redux/slices/products/machineTechParamCategory';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
// Iconify
import { fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify/Iconify';
import ViewFormAudit from '../../components/ViewFormAudit';

// ----------------------------------------------------------------------

TechParamCategoryViewForm.propTypes = {
  currentTechparamcategory: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function TechParamCategoryViewForm({ currentTechparamcategory = null }) {
  const [editFlag, setEditFlag] = useState(false);
  
  const toggleEdit = () => {
    navigate(PATH_MACHINE.techParam.techparamcategoryedit(id));
  }
  
  const navigate = useNavigate();
  
  const { enqueueSnackbar } = useSnackbar();
  
  const { techparamcategory } = useSelector((state) => state.techparamcategory);
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
        name:techparamcategory?.name || "",
        description:techparamcategory?.description || "",
        isActive: techparamcategory.isActive ,
        createdAt:                techparamcategory?.createdAt || "",
        createdByFullname:        techparamcategory?.createdBy?.name || "",
        createdIP:                techparamcategory?.createdIP || "",
        updatedAt:                techparamcategory?.updatedAt || "",
        updatedByFullname:        techparamcategory?.updatedBy?.name || "",
        updatedIP:                techparamcategory?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTechparamcategory, techparamcategory]
    );
    console.log(defaultValues)

    // console.log(tool, "test")

  return (
    <Card sx={{ px: 5 }}>
      <Stack alignItems="flex-end" sx={{ mt: 2, mb: -4 }}>
        <Button
          onClick={() => { 
              toggleEdit(); 
          }}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>

      </Stack>
      <Grid container>

        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Name
          </Typography>

          <Typography variant="body2">{defaultValues.name}</Typography>

        </Grid>


        <Grid item xs={12} sm={12} sx={{ mb: 1}}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Description
          </Typography>

          <Typography variant="body2">{defaultValues.description}</Typography>

        </Grid>

        <Grid item xs={12} sm={12} >
         <Switch sx={{mb:1}} checked = { defaultValues.isActive } disabled  />
        </Grid>

        <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
      </Grid>
    </Card>
  );
}
