import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {  useEffect, useMemo, useState, memo} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Autocomplete, TextField } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../../components/DocumentForms/ToggleButtons';
// slice
import {
  setDocumentEditFormVisibility,
  getDocument,
  updateDocument,
  getDocumentHistory,
} from '../../../redux/slices/document/document';
import { setDrawingEditFormVisibility, setDrawingViewFormVisibility } from '../../../redux/slices/products/drawing';
import { Snacks } from '../../../constants/document-constants';
import { PATH_CRM, PATH_DOCUMENT, PATH_MACHINE, PATH_MACHINE_DRAWING } from '../../../routes/paths';

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
  const { enqueueSnackbar } = useSnackbar();
  const [documentTypeVal, setDocumentTypeVal] = useState('');
  const [documentCategoryVal, setDocumentCategoryVal] = useState('');
  const [customerAccessVal, setCustomerAccessVal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const { machineId, customerId, id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    setDocumentCategoryVal(document?.docCategory);
    setDocumentTypeVal(document?.docType);
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
      displayName: document?.displayName || '',
      description: document?.description || '',
      referenceNumber: document?.referenceNumber || '',
      stockNumber: document?.stockNumber || '',
      versionNo: document?.versionNo || '',
      isActive: document?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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

  const onSubmit = async (data) => {
    try {
      data.customerAccess = customerAccessVal;
      data.isActive = isActive;
      await dispatch(
        updateDocument(
          document?._id,
          data,
          customerPage ? customer?._id : null,
          machinePage ? machine?._id : null
        )
      );
      if( customerPage && !machinePage ){
        await dispatch(getDocument(document?._id));
        navigate(PATH_CRM.customers.documents.view( customer?._id, document?._id ));
      } else if(drawingPage){
        await dispatch(getDocumentHistory(document?._id));
        dispatch(setDrawingViewFormVisibility(true));
        dispatch(setDrawingEditFormVisibility(false));
      }else{
        await dispatch(getDocument(document?._id));
        setDocumentCategoryVal('');
        setDocumentTypeVal('');
        reset();
      }

      enqueueSnackbar(`${drawingPage?"Drawing ":""} ${Snacks.updatedDoc}`, { variant: `success` });
      
    } catch (err) {
      enqueueSnackbar(Snacks.failedUpdateDoc, { variant: `error` });
      console.error(err.message);
    }
  };

  const toggleCancel = () => {
    if( customerPage ){
      navigate(PATH_CRM.customers.documents.root( customerId ));
    } else if( machinePage ){
      navigate(PATH_MACHINE.machines.documents.root(machineId));
    } else if( drawingPage ){
      navigate(PATH_MACHINE.machines.drawings.root(machineId));
    }else if( !customerPage && !drawingPage && !machinePage ){
      navigate(PATH_DOCUMENT.root())
    }
  }

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

                  <Autocomplete
                    // freeSolo
                    disabled
                    name="documentCategory"
                    value={documentCategoryVal || null}
                    options={activeDocumentCategories}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option.name}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} required label="Document Category" />
                    )}
                    ChipProps={{ size: 'small' }}
                  />

                  <Autocomplete
                    // freeSolo
                    disabled
                    name="documentType"
                    value={documentTypeVal || null}
                    options={activeDocumentTypes}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => option.name}
                    id="controllable-states-demo"
                    renderInput={(params) => (
                      <TextField {...params} required label="Document Type" />
                    )}
                    ChipProps={{ size: 'small' }}
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