import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Container} from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../../components/snackbar';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// schema
import { DocumentCategorySchema } from '../../../schemas/document';
// slice
import { addDocumentCategory } from '../../../../redux/slices/document/documentCategory';
// components
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
import ToggleButtons from '../../../../components/DocumentForms/ToggleButtons';
// styles
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../../constants/default-constants';
import { Snacks, FORMLABELS as formLABELS } from '../../../../constants/document-constants';

// ----------------------------------------------------------------------
DocumentCategoryAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentCategoryAddForm({ currentDocument }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [state, setState] = useState({
    customer: false,
    machine: false,
    drawing: false,
    all: false,
  });

  const handleChangeType = (event) => {
    if (event.target.name === "all" && event.target.checked === true) {
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

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
      isDefault: false,
      customerAccess: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(DocumentCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {
      data.type = state
      await dispatch(addDocumentCategory(data));
      reset();
      enqueueSnackbar(Snacks.docSaved);
      navigate(PATH_MACHINE.documents.documentCategory.list);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_MACHINE.documents.documentCategory.list);
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.NEW_DOCUMENT_CATEGORY} // New Document Category
          backLink={PATH_MACHINE.documents.documentCategory.list}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
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
