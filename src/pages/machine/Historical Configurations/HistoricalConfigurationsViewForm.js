import { useMemo, memo, useState, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { useDispatch, useSelector } from 'react-redux';
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
// @mui
import {  Card, Grid, Stack, Skeleton } from '@mui/material';
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

 
    function filterJsonObjectByName(node) {

      if (!node) {
        return null;
      }
    
      if (Array.isArray(node)) {
        // If node is an array, recursively filter each element
        const filteredArray = node.map(element => filterJsonObjectByName(element, filterName)).filter(n => n);
        return filteredArray.length ? filteredArray : null;
      }
    
      if (!node.tree) {
        // Check if any key-value pair matches the filterName
        const matchingPairs = Object.entries(node).filter(([key, value]) =>
          key.toLowerCase().includes(filterName.toLowerCase()) &&
          value && typeof value === 'string' && value.toLowerCase().includes(filterName.toLowerCase())
        );
    
        return matchingPairs.length ? Object.fromEntries(matchingPairs) : null;
      }
    
      // Recursively filter tree property
      node.tree = node.tree.map(childNode => filterJsonObjectByName(childNode, filterName)).filter(n => n);
      return node.tree.length ? node : null;

    // if (Array.isArray(obj)) {
    //   // If it's an array, filter each element
    //   const filteredArray = obj.map(element => filterJsonObjectByName(element)).filter(Boolean);
    //   return filteredArray.length > 0 ? filteredArray : null;
    // }
  
    // if (typeof obj === 'object' && obj !== null) {
    //   // If it's an object (and not null), filter each property
    //   const filteredObject = {};
    //   Object.keys(obj).forEach(key => {
    //     const filteredValue = filterJsonObjectByName(obj[key]);
    //     if (
    //       key.includes(filterName) ||
    //       (filteredValue !== null && Object.keys(filteredValue).length > 0) ||
    //       obj[key] === filterName
    //     ) {
    //       filteredObject[key] = filteredValue;
    //     }
    //   });
    //   return Object.keys(filteredObject).length > 0 ? filteredObject : null;
    // }
  
    // // Base case: leaf node, return if it matches the filter name or is null
    // return filterName !== '' && (obj === filterName || obj === null) ? obj : null;
  }

  const handleFilterJsonTree = () => {
    console.log("filterName outer : ",filterName)
    // if(filterName !== '' ){
    //   console.log("filterName iner : ",filterName)
        const filteredValue = filterJsonObjectByName(historicalConfiguration, filterName);
        setJsonObjectTree(filteredValue);
    // }
  };

  const debouncedSearch = useRef(debounce(value => {
    handleFilterJsonTree();
  }, 500)).current;

  const handleFilterName = event => {
    setFilterName(event.target.value );
    debouncedSearch(event.target.value);
  };

  const handleResetFilter = () => {
    setFilterName('');
    setJsonObjectTree(historicalConfiguration);
  };

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
          {/* <SearchBarCombo
            isFiltered={isFiltered}
            value={filterName}
            onChange={handleFilterName}
            onClick={handleResetFilter}
          /> */}
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
           : <JsonView displaySize src={jsonObjectTree} />}
        </Stack>
          <ViewFormAudit  defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

export default memo(HistoricalConfigurationsViewForm)
