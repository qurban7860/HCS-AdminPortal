import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button ,Box} from '@mui/material';
// redux
import { setCustomerDocumentEditFormVisibility , deleteCustomerDocument , getCustomerDocuments , getCustomerDocument} from '../../../redux/slices/document/customerDocument';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { fDate,fDateTime } from '../../../utils/formatTime';
import Cover from '../../components/Cover';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------
DocumentViewForm.propTypes = {
  currentCustomerDocument: PropTypes.object,
};

export default function DocumentViewForm({ currentCustomerDocument = null }) {
  const { customerDocument } = useSelector((state) => state.customerDocument);
  // console.log("currentCustomerDocument : ",currentCustomerDocument)

  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const onDelete = async () => {
    console.log("currentCustomerDocument : ",currentCustomerDocument)
    await dispatch(deleteCustomerDocument(currentCustomerDocument._id));
    dispatch(getCustomerDocuments())
  };
  
  const  handleEdit = async () => {
    await dispatch(getCustomerDocument(currentCustomerDocument._id));
    dispatch(getCustomerDocument(currentCustomerDocument._id));
    dispatch(setCustomerDocumentEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => (
      {
        name:                     currentCustomerDocument?.name || "",
        documentName:             currentCustomerDocument?.documentName?.name || "",
        category:                 currentCustomerDocument?.category?.name || "",
        customer:                 currentCustomerDocument?.customer?.name,
        description:              currentCustomerDocument?.description,
        isActive:                 currentCustomerDocument?.isActive,
        createdAt:                currentCustomerDocument?.createdAt || "",
        createdByFullName:        currentCustomerDocument?.createdBy?.name || "",
        createdIP:                currentCustomerDocument?.createdIP || "",
        updatedAt:                currentCustomerDocument?.updatedAt || "",
        updatedByFullName:        currentCustomerDocument?.updatedBy?.name || "",
        updatedIP:                currentCustomerDocument?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCustomerDocument, customerDocument]
  );

  return (
    <>
      <Grid >
        <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
        <Grid container>
            <ViewFormField sm={6} heading="Name" param={defaultValues?.name} />
            <ViewFormField sm={6} heading="Document Name" param={defaultValues?.documentName} />
            <ViewFormField sm={6} heading="Category" param={defaultValues?.category} />
            <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
            { currentCustomerDocument?.type.startsWith("image")  && (currentCustomerDocument?.customerAccess === true || currentCustomerDocument?.customerAccess === "true") ? 
          <Box
        component="img"
        sx={{
          m:2,
          height: 233,
          width: 350,
          maxHeight: { xs: 233, md: 167 },
          maxWidth: { xs: 350, md: 250 },
        }}
        alt={defaultValues?.name}
        src={currentCustomerDocument?.path}
      />:""}
            <ViewFormSWitch isActive={defaultValues.isActive}/>
            <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
      </Grid>
    </>
  );
}
