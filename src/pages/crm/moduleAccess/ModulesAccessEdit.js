import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// @mui
import { Box, Card, Grid, Stack } from '@mui/material';
// hooks
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from '../../../components/snackbar';
// slice
import { updateCustomerModules } from '../../../redux/slices/customer/customer';
// components
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import FormProvider, { RHFAutocomplete } from '../../../components/hook-form';
// constants
import { FORMLABELS } from '../../../constants/customer-constants';
// schema
import FormLabel from '../../../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

export default function ModulesAccessEdit() {
    const { customer, allowedModules } = useSelector((state) => state.customer);
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const { customerId } = useParams();

    const defaultValues = useMemo(
        () => ({
            id: customerId || '',
            modules: customer?.modules || [],
        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [customer, customerId]
    );
    const methods = useForm({
        defaultValues,
    });

    const {
        reset,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        try {
            await dispatch(updateCustomerModules(data));
            enqueueSnackbar('Modules Access updated successfully!');
        } catch (err) {
            enqueueSnackbar(typeof err === "string" ? err : "Modules Access Update failed!", { variant: `error` });
        }
    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container>
                <Grid item xs={12} md={12}>
                    <Stack spacing={2}>

                        <Card sx={{ p: 3 }}>
                            <Stack spacing={2}>
                                <FormLabel content={FORMLABELS.CUSTOMER.MODULESACCESS} />

                                <RHFAutocomplete
                                    multiple
                                    disableCloseOnSelect
                                    filterSelectedOptions
                                    name="modules"
                                    label="Select Modules"
                                    options={allowedModules || []}
                                    ChipProps={{ size: 'small' }}
                                />

                                <AddFormButtons isSubmitting={isSubmitting} />
                            </Stack>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </FormProvider>
    );
}
