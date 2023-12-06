import { useMemo, memo, useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {  Card, Grid, Stack, Skeleton } from '@mui/material';
import JsonEditor from './JsonEditor';
// redux
import { setHistoricalConfigurationViewFormVisibility, getHistoricalConfigurationRecord, getHistoricalConfigurationRecords } from '../../../redux/slices/products/historicalConfiguration';
// components
import { useSnackbar } from '../../../components/snackbar';
import { FORMLABELS } from '../../../constants/default-constants';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormNoteField from '../../components/ViewForms/ViewFormNoteField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { fDate } from '../../../utils/formatTime';
import SearchBarCombo from '../../components/ListTableTools/SearchBarCombo';


function HistoricalConfigurationsViewForm() {

  const { historicalConfiguration, historicalConfigurationViewFormFlag, isLoading } = useSelector((state) => state.historicalConfiguration);
  const { machine } = useSelector((state) => state.machine)
  const [jsonObjectTree, setJsonObjectTree] = useState({});
  const [filterName, setFilterName] = useState("");

  const isFiltered = filterName !== ''
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    if(!filterName){
      setJsonObjectTree(historicalConfiguration);
    }
    // else{
    //   const filteredValue = filterJsonObjectByName(historicalConfiguration, filterName);
    //   setJsonObjectTree(filteredValue);
    // }
  }, [historicalConfiguration, filterName]);


  const defaultValues = useMemo(
    () => ({
      isActive:                             historicalConfiguration?.isActive,
      createdAt:                            historicalConfiguration?.createdAt || '',
      createdByFullName:                    historicalConfiguration?.createdBy?.name || '',
      createdIP:                            historicalConfiguration?.createdIP || '',
      updatedAt:                            historicalConfiguration?.updatedAt || '',
      updatedByFullName:                    historicalConfiguration?.updatedBy?.name || '',
      updatedIP:                            historicalConfiguration?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ historicalConfiguration]
  );
  

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons backLink={()=> dispatch(setHistoricalConfigurationViewFormVisibility(false))} />
        <Stack spacing={2} sx={{p:2}}>

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
           :  <JsonEditor  value={JSON.stringify(jsonObjectTree?.configuration,null,2)} readOnly />  
           }
        </Stack>
          <ViewFormAudit  defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

export default memo(HistoricalConfigurationsViewForm)
