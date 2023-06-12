import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button ,Tooltip} from '@mui/material';
// redux
import { deleteDocumentCategory  } from '../../../../redux/slices/document/documentCategory';
// paths
import { PATH_DASHBOARD, PATH_DOCUMENT } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import { fDate,fDateTime } from '../../../../utils/formatTime';
import ViewFormAudit from '../../../components/ViewFormAudit';
import ViewFormField from '../../../components/ViewFormField';
import ViewFormSWitch from '../../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function DocumentViewForm() {
  const { documentCategory } = useSelector((state) => state.documentCategory);
// console.log("documentCategory : ",documentCategory)
  const navigate = useNavigate();

  const dispatch = useDispatch(); 
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try{
      await dispatch(deleteDocumentCategory(documentCategory?._id));
      navigate(PATH_DOCUMENT.documentCategory.list);
      enqueueSnackbar('Document Category delete Successfully!');

    }catch(error){
      enqueueSnackbar('Document Category delete failed!', { variant: `error` });
      console.error(error);
    }
  };

  const  handleEdit = async () => {
    navigate(PATH_DOCUMENT.documentCategory.edit(documentCategory._id))
  };

  const defaultValues = useMemo(
    () => (
      {
        isActive:                 documentCategory?.isActive,
        customerAccess:           documentCategory?.customerAccess,
        name:                     documentCategory?.name,
        description:              documentCategory?.description || "",
        createdAt:                documentCategory?.createdAt || "",
        createdByFullName:        documentCategory?.createdBy?.name || "",
        createdIP:                documentCategory?.createdIP || "",
        updatedAt:                documentCategory?.updatedAt || "",
        updatedByFullName:        documentCategory?.updatedBy?.name || "",
        updatedIP:                documentCategory?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentCategory]
  );

  return (
    <Card sx={{p:2}}>
      <Grid >
        <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
          <Grid sm={12} display="flex">
            <Tooltip>
              <ViewFormField  documentIsActive={defaultValues.isActive}  />
            </Tooltip>
            <Tooltip>
              <ViewFormField  customerAccess={defaultValues?.customerAccess} />
            </Tooltip>
          </Grid>
        <Grid container>
            <ViewFormField sm={6} heading="Name" param={defaultValues.name} />
            <ViewFormField sm={12} heading="Description" param={defaultValues.description} />
            {/* <ViewFormSWitch heading="isActive" disabled isActive={defaultValues.isActive}/> */}
            <ViewFormAudit  defaultValues={defaultValues}/>
        </Grid>
      </Grid>
    </Card>
  );
}
