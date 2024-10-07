import { memo, useEffect } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
// @mui
import { Container, Card, Grid, Box } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import {  
  getHistoricalConfigurationRecords,
  resetCompareHistoricalConfigurationRecords
} from '../../../redux/slices/products/historicalConfiguration';
// components
import JsonEditorMerge from '../../../components/CodeMirror/JsonEditorMerge';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import MachineTabContainer from '../util/MachineTabContainer';
import FormProvider, { RHFAutocomplete } from '../../../components/hook-form';

function HistoricalConfigurationsViewForm() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { machineId } = useParams();
  
  const { 
    isLoading,
    isLoadingINI,
    selectedINIs, 
    isLoadingCompareINI,
    isLoadingCompareINIs,
    historicalConfiguration,
    historicalConfigurations,
    compareHistoricalConfiguration,
    compareHistoricalConfigurations,
  } = useSelector((state) => state.historicalConfiguration, shallowEqual );

  const { machine, activeMachines, isLoadingMachines } = useSelector((state) => state.machine);

  const methods = useForm({
    defaultValues: {
      machine: null,
      INI: null,
      compareINI: null,
      customerMachine: null,
    },
  });

  const {
    watch,
    setValue,
    reset
  } = methods;

  const { INI, compareINI, customerMachine } = watch();

  useEffect(() => {
    reset({
      machine,
      INI: historicalConfiguration || null,
      compareINI: compareHistoricalConfiguration || null,
      customerMachine: selectedINIs?.length === 2 ? machine : null,
    });
  }, [machine, historicalConfiguration, compareHistoricalConfiguration, selectedINIs, reset]);

  const handleChangeMachine = (option, newValue) => {
    if( newValue?._id ){
      if(customerMachine?._id !== newValue?._id){
        setValue('compareINI',null )
        dispatch(resetCompareHistoricalConfigurationRecords());
        dispatch(getHistoricalConfigurationRecords(newValue._id, false , true ));
        setValue('customerMachine',newValue)
      }
    }else{
      setValue('customerMachine',null )
      setValue('compareINI',null )
      dispatch(resetCompareHistoricalConfigurationRecords());
    }
  };

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='ini' />
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          backLink={()=> navigate(PATH_MACHINE.machines.ini.root(machineId))} 
        />
          <FormProvider methods={methods} >
            <Box
              rowGap={2} columnGap={2} display="grid" my={2}
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
            >
              <RHFAutocomplete
                size='small' 
                label="Machine" 
                name="machine" 
                readOnly
                freeSolo
                options={ [ machine ] }
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
                renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}</li> )}
              />

              <RHFAutocomplete 
                name="INI"
                label="INI"
                size='small'
                loading={ isLoading }
                options={ historicalConfigurations }
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => `${option?.backupid || ''}`}
                renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.backupid || ''}`}</li> )}
              />

              <RHFAutocomplete 
                name="customerMachine"
                label="Machine"
                size='small'
                options={ activeMachines }
                loading={ isLoadingMachines }
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
                renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}</li> )}
                onChange={handleChangeMachine}
              />

              <RHFAutocomplete 
                name="compareINI"
                size='small'
                label="INI"
                loading={ isLoadingCompareINIs }
                options={ compareHistoricalConfigurations }
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => `${option.backupid || ''}`}
                renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.backupid || ''}`}</li> )}
              />

            </Box>

            <JsonEditorMerge 
              readOnly 
              isLoadingOriginal={ isLoadingINI } 
              value={ INI } 
              isLoadingModified={ isLoadingCompareINI } 
              modifiedValue={ compareINI } 
            />  

          </FormProvider>
      </Grid>
    </Card>
    </Container>
  );
}

export default memo(HistoricalConfigurationsViewForm)
