import { useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {  Card, Grid, Box, Stack, Skeleton } from '@mui/material';
import JsonEditor from './JsonEditorMerge';
// redux
import { setHistoricalConfigurationCompareViewFormVisibility } from '../../../redux/slices/products/historicalConfiguration';
// components
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';


function HistoricalConfigurationsViewForm() {

  const { historicalConfiguration, historicalConfiguration2, isLoading } = useSelector((state) => state.historicalConfiguration);

  const dispatch = useDispatch();

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
        <ViewFormEditDeleteButtons backLink={()=> dispatch(setHistoricalConfigurationCompareViewFormVisibility(false))} />
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
           :  <JsonEditor  value={ historicalConfiguration } modifiedValue={ historicalConfiguration2 } readOnly />  
           }
        </Stack>

      </Grid>
    </Card>
  );
}

export default memo(HistoricalConfigurationsViewForm)
