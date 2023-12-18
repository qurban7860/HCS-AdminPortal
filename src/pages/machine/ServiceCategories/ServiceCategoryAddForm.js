import * as Yup from 'yup';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Container } from '@mui/material';
// slice
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { addServiceCategory } from '../../../redux/slices/products/serviceCategory';
// schema
// import { AddMachineSchema } from '../../schemas/document';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// // asset
// import { countries } from '../../../assets/data';
// util
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
// import { Snacks } from '../../../constants/document-constants';

// ----------------------------------------------------------------------

export default function ServiceCategoryAddForm() {
  // const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
    }),
    []
  );

  const ServiceCategorySchema = Yup.object().shape({
    name: Yup.string().min(2, 'Name must be at least 2 characters long').max(50).required('Name is required').trim(),
    description: Yup.string().max(5000).trim(),
    isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(ServiceCategorySchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.serviceCategories.list);
  };

  const onSubmit = async (data) => {
    try {
      await dispatch(addServiceCategory(data));
      reset();
      enqueueSnackbar('Service Category Added Successfully!');
      navigate(PATH_MACHINE.machines.settings.serviceCategories.list);
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: `error` });
      console.error(error);
    }
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer><Cover name={FORMLABELS.COVER.MACHINE_CHECK_ITEM_SERVICE_CATEGORY_ADD}/></StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} sx={{ mt: 3 }}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)'}}>
                  <RHFTextField name="name" label="Name*" />
                  <RHFTextField name="description" label="Description" minRows={7} multiline />
                </Box>
                <ToggleButtons isMachine name={FORMLABELS.isACTIVE.name}/>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
