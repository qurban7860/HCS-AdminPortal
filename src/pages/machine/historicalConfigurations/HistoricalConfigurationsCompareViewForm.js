import { memo, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Container, Card, Grid, Stack, Skeleton, Autocomplete, TextField, Box } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { getHistoricalConfigurationRecord, getHistoricalConfigurationRecordCompare, getHistoricalConfigurationRecords, resetHistoricalConfigurationRecord, resetHistoricalConfigurationRecords } from '../../../redux/slices/products/historicalConfiguration';
import { getCustomerMachines } from '../../../redux/slices/products/machine';
// components
import JsonEditorMerge from '../../../components/CodeMirror/JsonEditorMerge';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import MachineTabContainer from '../util/MachineTabContainer';

function HistoricalConfigurationsViewForm() {
  const { machineId } = useParams();
  
  const { 
    selectedINIs, 
    historicalConfigurationCompare, 
    historicalConfiguration, 
    historicalConfigurations, 
    isLoading 
  } = useSelector((state) => state.historicalConfiguration);

  const { machine, customerMachines } = useSelector((state) => state.machine);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  
  const [currentMachineINIs, setCurrentMachineINIs] = useState([]);
  const [INIsLoaded, setINIsLoaded] = useState(false);
  
  const [firstINI, setFirstINI] = useState(null);
  const [secondINI, setSecondINI] = useState(null);
  
  useLayoutEffect(() => {
    dispatch(resetHistoricalConfigurationRecord());
    if(machineId){
      if(selectedINIs.length===1){
        dispatch(getHistoricalConfigurationRecord(machineId, selectedINIs[0] ))
      }
      
      if(selectedINIs.length===2){
        dispatch(getHistoricalConfigurationRecord(machineId, selectedINIs[0] ))
        dispatch(getHistoricalConfigurationRecordCompare(machineId, selectedINIs[1] ))
      }
    }
  },[ dispatch, machineId, selectedINIs ])


  useEffect(()=>{
    setFirstINI(historicalConfiguration)
  },[historicalConfiguration])

  useEffect(()=>{
    setSecondINI(historicalConfigurationCompare)
  },[historicalConfigurationCompare])

  useLayoutEffect(()=>{
    dispatch(getCustomerMachines());
  },[ dispatch, machineId ])

  useLayoutEffect(()=>{
    if(!INIsLoaded){
      setCurrentMachineINIs(historicalConfigurations);
      setINIsLoaded(true);
    }
  },[INIsLoaded, historicalConfigurations])

  const handleChangeMachine = (option, newValue) => {
      if(newValue?._id){
        dispatch(getHistoricalConfigurationRecords(newValue._id));
      }else{
        dispatch(resetHistoricalConfigurationRecords());
      }

      setSecondINI(null);
  };

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='ini' />
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          backLink={()=> navigate(PATH_MACHINE.machines.ini.root(machineId))} 
        />
          <Box
            rowGap={2} columnGap={2} display="grid" my={2}
            gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(4, 1fr)' }}
          >
            <TextField size='small' label="Machine" disabled value={machine?.name} />
            <Autocomplete 
              name="firstINI"
              label="INIs"
              size='small'
              options={currentMachineINIs}
              value={firstINI || null}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              getOptionLabel={(option) => `${option.backupid || ''}`}
              renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.backupid || ''}`}</li> )}
              renderInput={(params) => <TextField {...params} label="INIs" />}
              onChange={(option, newValue)=> setFirstINI(newValue)}
            />

            <Autocomplete 
              name="machine"
              label="Machines"
              size='small'
              options={customerMachines}
              defaultValue={machine || null}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              getOptionLabel={(option) => `${option.name || ''}`}
              renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
              renderInput={(params) => <TextField {...params} label="Machines" />}
              onChange={handleChangeMachine}
            />

            <Autocomplete 
              name="secondINI"
              size='small'
              label="INI"
              options={historicalConfigurations}
              value={secondINI || null}
              isOptionEqualToValue={(option, value) => option?._id === value?._id}
              getOptionLabel={(option) => `${option.backupid || ''}`}
              renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.backupid || ''}`}</li> )}
              renderInput={(params) => <TextField {...params} label="INIs" />}
              onChange={(option, newValue)=> setSecondINI(newValue)}
            />
            
          </Box>
        <Stack spacing={2} >
          {isLoading ? 
          <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
            <Skeleton animation={false} />
          </>
           :  <JsonEditorMerge  value={ firstINI } modifiedValue={ secondINI } readOnly />  
           }
        </Stack>

      </Grid>
    </Card>
    </Container>
  );
}

export default memo(HistoricalConfigurationsViewForm)
