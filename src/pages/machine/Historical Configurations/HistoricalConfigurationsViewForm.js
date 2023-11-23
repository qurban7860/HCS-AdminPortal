import { useMemo, memo, useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useDispatch, useSelector } from 'react-redux';
import ReactJson from 'react-json-view'
// @mui
import {  Card, Grid, Stack } from '@mui/material';
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
  const [filterName, setFilterName] = useState('');


  const isFiltered = filterName !== ''
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  function filterJsonObjectByName(obj) {

    if (Array.isArray(obj)) {
      // If it's an array, filter each element
      const filteredArray = obj.map(element => filterJsonObjectByName(element)).filter(Boolean);
      return filteredArray.length > 0 ? filteredArray : null;
    }
  
    if (typeof obj === 'object' && obj !== null) {
      // If it's an object (and not null), filter each property
      const filteredObject = {};
      Object.keys(obj).forEach(key => {
        const filteredValue = filterJsonObjectByName(obj[key]);
        if (
          key.includes(filterName) ||
          (filteredValue !== null && Object.keys(filteredValue).length > 0) ||
          obj[key] === filterName
        ) {
          filteredObject[key] = filteredValue;
        }
      });
      return Object.keys(filteredObject).length > 0 ? filteredObject : null;
    }
  
    // Base case: leaf node, return if it matches the filter name or is null
    return filterName !== '' && (obj === filterName || obj === null) ? obj : null;
  }

  const handleFilterJsonTree = () => {
    const filteredValue = filterJsonObjectByName(historicalConfiguration, filterName);
    if( filterName !== '' || filterName !== undefined ){
        setJsonObjectTree(filteredValue);
    }
  };

  const debouncedSearch = useRef(debounce(value => {
    handleFilterJsonTree();
  }, 500)).current;

  const handleFilterName = event => {
    setFilterName(event.target.value);
    debouncedSearch(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
  };

  useEffect(() => {
    debouncedSearch.cancel();
  }, [debouncedSearch]);

  useEffect(() => {
    if(filterName === '' || filterName === undefined )
      setJsonObjectTree(historicalConfiguration);
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
          <SearchBarCombo
            isFiltered={isFiltered}
            value={filterName}
            onChange={handleFilterName}
            onClick={handleResetFilter}
          />
          <ReactJson enableClipboard src={jsonObjectTree} />
        </Stack>
          <ViewFormAudit  defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

export default memo(HistoricalConfigurationsViewForm)
