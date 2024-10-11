import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// routes
import { PATH_CUSTOMER_REGISTRATION } from '../../../routes/paths';
// hooks
import { useSnackbar } from '../../../components/snackbar';
// slices
import {
  updateCustomerRegistration,
} from '../../../redux/slices/customer/customerRegistration';
// components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function CustomerViewForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customerRegistration, isLoading } = useSelector((state) => state.customerRegistration);
  const { enqueueSnackbar } = useSnackbar();
  const { customerId } = useParams();
  const defaultValues = useMemo(
    () => ({
      customerName: customerRegistration?.customerName || "",
      contactPersonName: customerRegistration?.contactPersonName || "",
      email: customerRegistration?.email || "",
      phoneNumber: customerRegistration?.phoneNumber || "",
      status: customerRegistration?.status || "",
      customerNote: customerRegistration?.customerNote || "",
      internalRemarks: customerRegistration?.internalRemarks || "",
      machineSerialNos: customerRegistration?.machineSerialNos || "",

      address: customerRegistration?.address || "",

      isActive: customerRegistration?.isActive || false,
      createdAt: customerRegistration?.createdAt || '',
      createdByFullName: customerRegistration?.createdBy?.name || '',
      createdIP: customerRegistration?.createdIP || '',
      updatedAt: customerRegistration?.updatedAt || '',
      updatedByFullName: customerRegistration?.updatedBy?.name || '',
      updatedIP: customerRegistration?.updatedIP || '',
    }),
    [ customerRegistration ]
  );
  
  const handleEdit = async () =>  customerId && navigate(PATH_CUSTOMER_REGISTRATION.edit(customerId));
  
  const onArchive = async () => {
      try {
        const data = {
          ...defaultValues,
          isActive: false,
          isArchived: true,
        }
        await dispatch( updateCustomerRegistration( customerId, data ) );
        navigate(PATH_CUSTOMER_REGISTRATION.root);
      } catch (err) {
        enqueueSnackbar(err, { variant: `error` });
        console.log('Error:', err);
      }
  };

  return (
  <Grid container direction="row" >
    <Card sx={{ p: '1rem', mb:3 }}>
            <ViewFormEditDeleteButtons
              isActive={ defaultValues.isActive}
              handleEdit={ handleEdit }
              onArchive={  onArchive }
              backLink={() => navigate(PATH_CUSTOMER_REGISTRATION.root)}
            />
                <Grid container >
                  <ViewFormField isLoading={isLoading} sm={6} heading='Customer Name' param={defaultValues?.customerName} />
                  <ViewFormField isLoading={isLoading} sm={6} heading='Contact Person Name' param={defaultValues?.contactPersonName} />
                  <ViewFormField isLoading={isLoading} sm={6} heading='Email' param={defaultValues?.email} />
                  <ViewFormField isLoading={isLoading} sm={12} heading="Address" param={defaultValues?.address } />
                  <ViewFormField isLoading={isLoading} sm={6} heading='Phone Number' param={defaultValues?.phoneNumber} />
                  <ViewFormField isLoading={isLoading} sm={6} heading='Status' param={defaultValues?.status} />
                  <ViewFormField isLoading={isLoading} sm={12} heading='Customer Note' param={defaultValues?.customerNote} />
                  <ViewFormField isLoading={isLoading} sm={12} heading='Internal Remarks' param={defaultValues?.internalRemarks} />
                  <ViewFormField isLoading={isLoading} sm={12} heading='Machine Serial Nos' param={defaultValues?.machineSerialNos} />
                  <ViewFormAudit defaultValues={defaultValues} />
                </Grid>
          </Card>
  </Grid>
  );
}
