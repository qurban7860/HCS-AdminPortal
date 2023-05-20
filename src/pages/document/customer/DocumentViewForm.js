import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import Image from 'mui-image';
// eslint-disable-next-line import/no-anonymous-default-export
import { Switch, Card, Grid, Stack, Typography, Button ,Box, CardMedia} from '@mui/material';
// redux
import { setCustomerDocumentEditFormVisibility , deleteCustomerDocument , getCustomerDocuments , getCustomerDocument} from '../../../redux/slices/document/customerDocument';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
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
  const { customer, customers } = useSelector((state) => state.customer);

  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const onDelete = async () => {
    // console.log("currentCustomerDocument : ",currentCustomerDocument)
    await dispatch(deleteCustomerDocument(currentCustomerDocument._id));
    dispatch(getCustomerDocuments(customer._id))
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
        customer:                 currentCustomerDocument?.customer?.name || "",
        customerAccess:           currentCustomerDocument?.customerAccess,
        documentVersion:          currentCustomerDocument?.documentVersion,
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
            <ViewFormField sm={6} heading="Version" numberParam={defaultValues?.documentVersion} />
            <ViewFormField sm={6} heading="Customer Access" param={defaultValues?.customerAccess === true ? "Yes" : "No"} />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
            {/* { currentCustomerDocument?.type.startsWith("image")  && (currentCustomerDocument?.customerAccess === true || currentCustomerDocument?.customerAccess === "true") ? 
          <Box
            component="img"
            sx={{
              m:2
            }}
            alt={defaultValues.name}
            src={`data:image/png;base64, ${currentCustomerDocument?.content}`}
            />:""} */}
            { currentCustomerDocument?.type.startsWith("image")  && (currentCustomerDocument?.customerAccess === true || currentCustomerDocument?.customerAccess === "true") ?
            <Image alt={defaultValues.name} src={currentCustomerDocument?.path} /> : null}
            <ViewFormSWitch isActive={defaultValues.isActive}/>
            <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
      </Grid>
    </>
  );
}
