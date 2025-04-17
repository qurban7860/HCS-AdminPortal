import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack,Container } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../../components/snackbar';
// schema
import { DocumentCategorySchema } from '../../../schemas/document';
// routes
import { PATH_MACHINE, PATH_SETTING } from '../../../../routes/paths';
// components
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import {
  getDocumentCategory,
  updateDocumentCategory,
} from '../../../../redux/slices/document/documentCategory';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../../../components/DocumentForms/FormHeading';
import ToggleButtons from '../../../../components/DocumentForms/ToggleButtons';
import { Cover } from '../../../../components/Defaults/Cover';
// styles
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { FORMLABELS } from '../../../../constants/default-constants';
import { Snacks, FORMLABELS as formLABELS } from '../../../../constants/document-constants';

// ----------------------------------------------------------------------

export default function DocumentCategoryeEditForm() {
  const { documentCategory } = useSelector((state) => state.documentCategory);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [state, setState] = useState({
    customer: false,
    machine: false,
    drawing: false,
    all: false,
  });

  const handleChangeType = (event) => {
    if (event.target.name === "all" && event.target.checked === true) {
      // const allValue = event.target.checked;
      setState({
        customer: true,
        machine: true,
        drawing: true,
        all: true,
        
      })
    } else if(event.target.name === "all" && event.target.checked === false){
      setState({
        customer: false,
        machine: false,
        drawing: false,
        all: false,
      })
    } else {
      setState({
        ...state,
        [event.target.name]: event.target.checked, 
      });
    }
  };

  useEffect(()=>{
    if((!state.customer || !state.machine || !state.drawing) && state.all){
      setState({
        ...state,
        all: false, 
      });
    }else if(state.customer && state.machine && state.drawing){
      setState({
        ...state,
        all: true, 
      });
    }
  },[state]);

  useEffect(()=>{
    setState({
      customer: documentCategory.customer,
      machine: documentCategory.machine,
      drawing: documentCategory.drawing,
      all:  documentCategory.customer && documentCategory.machine && documentCategory.drawing,
    })
  },[documentCategory]);

  const defaultValues = useMemo(
    () => ({
      name: documentCategory?.name || '',
      description: documentCategory?.description || '',
      isActive: documentCategory?.isActive,
      isDefault: documentCategory?.isDefault || false,
      customerAccess: documentCategory?.customerAccess,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(DocumentCategorySchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

    watch();

  const toggleCancel = () => {
    navigate(PATH_MACHINE.documents.documentCategory.view(documentCategory._id));
  };

  const onSubmit = async (data) => {
    try {
      data.type = state
      await dispatch(updateDocumentCategory(documentCategory._id, data));
      dispatch(getDocumentCategory(documentCategory._id));
      navigate(PATH_MACHINE.documents.documentCategory.view(documentCategory._id));
      enqueueSnackbar(Snacks.updatedDocCategory, { variant: `success` });
      reset();
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={documentCategory?.name}
          backLink={PATH_MACHINE.documents.documentCategory.view(documentCategory?._id)}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormHeading heading={FORMLABELS.COVER.EDIT_DOCUMENT_CATEGORY} />
                <RHFTextField name={formLABELS.CATEGORY.name} label={formLABELS.CATEGORY.label} />
                <RHFTextField
                  name={formLABELS.CATEGORY_DESC.name}
                  label={formLABELS.CATEGORY_DESC.label}
                  minRows={8}
                  multiline
                />
                <ToggleButtons
                  isMachine
                  isRHF
                  name={FORMLABELS.isACTIVE.name}
                  RHFName={FORMLABELS.isCUSTOMER_ACCESS.name}
                  isCATEGORY={state}
                  handleChangeType={handleChangeType}
                  isDefault
                  defaultName='isDefault'
                />
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
