import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Card, Grid, Stack, Typography, Container, FormControl, RadioGroup, Radio, FormControlLabel, FormLabel, FormGroup, Switch, FormHelperText} from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { useSnackbar } from '../../../components/snackbar';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// schema
import { AddDocumentCategorySchema } from '../../schemas/document';
// slice
import { addDocumentCategory } from '../../../redux/slices/document/documentCategory';
// components
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../components/Defaults/Cover';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// assets
import { countries } from '../../../assets/data';
// styles
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import { Snacks, FORMLABELS as formLABELS } from '../../../constants/document-constants';

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
      const allValue = event.target.checked;
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

console.log("state : ", state);
  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
      customerAccess: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddDocumentCategorySchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
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
      navigate(PATH_SETTING.documentCategory.list);
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.documentCategory.list);
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={FORMLABELS.COVER.NEW_DOCUMENT_CATEGORY} // New Document Category
          generalSettings
          backLink={PATH_SETTING.documentCategory.list}
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
                />
                
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
