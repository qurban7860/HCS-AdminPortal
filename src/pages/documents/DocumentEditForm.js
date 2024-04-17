import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {  useEffect, useLayoutEffect, useMemo, useState, memo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Autocomplete, TextField } from '@mui/material';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFTextField, RHFAutocomplete } from '../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// slice
import {
  getDocument,
  updateDocument,
  getDocumentHistory,
} from '../../redux/slices/document/document';
import { Snacks } from '../../constants/document-constants';
import { PATH_CRM, PATH_DOCUMENT, PATH_MACHINE, PATH_MACHINE_DRAWING } from '../../routes/paths';

// ----------------------------------------------------------------------
DocumentEditForm.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  drawingPage: PropTypes.bool,
};
function DocumentEditForm({ customerPage, machinePage, drawingPage }) {
  
  const { document } = useSelector((state) => state.document);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  // States
  const [ customerAccessVal, setCustomerAccessVal ] = useState(false);
  const [ isActive, setIsActive ] = useState(false);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, customerId, id } = useParams();
  const dispatch = useDispatch();

  useLayoutEffect(()=>{
    if( id ){
      dispatch(getDocument(id))
    }
  },[ dispatch, id ])

  useEffect(() => {
    setCustomerAccessVal(document?.customerAccess);
    setIsActive(document?.isActive);
  }, [dispatch, document]);

  const EditDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(500).label('Document Name').required(),
    description: Yup.string().max(10000),
    referenceNumber: Yup.string().label('Reference Number').max(200),
    stockNumber: Yup.string().label('Stock Number').max(200),
    versionNo: Yup.string().label('Version No').max(10),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      documentCategory: document?.docCategory || null,
      documentType: document?.docType || null,
      displayName: document?.displayName || '',
      description: document?.description || '',
      referenceNumber: document?.referenceNumber || '',
      stockNumber: document?.stockNumber || '',
      versionNo: document?.versionNo || '',
      isActive: document?.isActive,
    }),
    [ document ]
  );

  const methods = useForm({
    resolver: yupResolver(EditDocumentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    if( customerPage && customerId && id ){
      navigate(PATH_CRM.customers.documents.view.root( customerId, id ));
    } else if( machinePage && machineId && id ){
      navigate(PATH_MACHINE.machines.documents.view.root(machineId, id));
    } else if( drawingPage && machineId && id ){
      navigate(PATH_MACHINE.machines.drawings.view.root(machineId, id));
    }else if( !customerPage && !drawingPage && !machinePage && id ){
      navigate(PATH_DOCUMENT.document.view.root(id))
    }
  }

  const onSubmit = async (data) => {
    
    try {
      data.customerAccess = customerAccessVal;
      data.isActive = isActive;
      await dispatch( updateDocument( id, data, customerPage ? customerId : null, machinePage ? machineId : null ) );
      await toggleCancel();
      await reset();
      enqueueSnackbar(`${drawingPage?"Drawing ":""} ${Snacks.updatedDoc}`, { variant: `success` });
      
    } catch (err) {
      enqueueSnackbar(Snacks.failedUpdateDoc, { variant: `error` });
      console.error(err.message);
    }
  };

  const handleChange = () => {
    setCustomerAccessVal(!customerAccessVal);
  };
  
  const handleIsActiveChange = () => {
    setIsActive(!isActive);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >

                  <RHFAutocomplete
                    disabled
                    name="documentCategory"
                    label="Document Category*"
                    options={activeDocumentCategories}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option.name}
                  />

                  <RHFAutocomplete
                    disabled
                    name="documentType"
                    label="Document Type*"
                    options={activeDocumentTypes}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option.name}
                  />

                </Box>

                <RHFTextField name="displayName" label="Document Name*" multiline />

                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name='referenceNumber' label='Reference Number' />
                  <RHFTextField name='stockNumber' label='Stock Number' />
                </Box>

                <RHFTextField name="description" label="Description" minRows={3} multiline />

                  <ToggleButtons
                    isDocument
                    customerAccessVal={customerAccessVal}
                    handleChange={handleChange}
                    isActive={isActive}
                    handleIsActiveChange={handleIsActiveChange}
                  />

                <AddFormButtons customerPage={customerPage} machinePage={machinePage} drawingPage={drawingPage} isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
    </FormProvider>
  );
}

export default memo(DocumentEditForm)