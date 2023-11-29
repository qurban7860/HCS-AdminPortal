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
// import ObjectPrinter from './ObjectPrinter';

function HistoricalConfigurationsViewForm() {

  const { historicalConfiguration, historicalConfigurationViewFormFlag, isLoading } = useSelector((state) => state.historicalConfiguration);
  const { machine } = useSelector((state) => state.machine)
  const [jsonObjectTree, setJsonObjectTree] = useState({});
  const [filterName, setFilterName] = useState("");
  const isFiltered = filterName !== ''
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();


//  find DEPTH of the node tree
  const findTreeDepth = (node) => {
      if (!node || typeof node !== 'object' || Object.keys(node).length === 0) {
        return 0;
      }
      const childDepths = Object.values(node).map(findTreeDepth);
    return 1 + Math.max(...childDepths);
  };

console.log(findTreeDepth(historicalConfiguration))

  const debouncedSearch = useRef(debounce(value => {
    // handleSearch();
  }, 500)).current;

  const handleFilterName = event => {
    setFilterName(event.target.value );
    // debouncedSearch(event.target.value);
    console.log("filterName : ",filterName)
    window.getSelection.toString(filterName)
    console.log(`Selected text: ${window.getSelection().toString()}`);
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
          <SearchBarCombo
            isFiltered={isFiltered}
            value={filterName}
            onChange={handleFilterName}
            onClick={handleResetFilter}
          />
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
          : 
            ''
          }
        </Stack>
          <ViewFormAudit  defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

export default memo(HistoricalConfigurationsViewForm)
