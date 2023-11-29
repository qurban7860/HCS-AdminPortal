import { useMemo, memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'
// @mui
import {  Card, Grid, Stack, Skeleton } from '@mui/material';
// redux
import { setHistoricalConfigurationViewFormVisibility } from '../../../redux/slices/products/historicalConfiguration';
// components
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

function HistoricalConfigurationsViewForm() {

  const { historicalConfiguration, isLoading } = useSelector((state) => state.historicalConfiguration);
  const [jsonObjectTree, setJsonObjectTree] = useState({});
  
  const dispatch = useDispatch();
  
  useEffect(() => {
      setJsonObjectTree(historicalConfiguration);
  }, [historicalConfiguration]);


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
