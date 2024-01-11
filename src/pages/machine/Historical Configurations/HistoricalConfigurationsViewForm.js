import { useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import {  Card, Grid, Stack, Skeleton } from '@mui/material';
import JsonEditor from '../../components/CodeMirror/JsonEditor';
// redux
import { setHistoricalConfigurationViewFormVisibility } from '../../../redux/slices/products/historicalConfiguration';
// components
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';


function HistoricalConfigurationsViewForm() {

  const { historicalConfiguration, isLoading } = useSelector((state) => state.historicalConfiguration);

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
        <ViewFormEditDeleteButtons backLink={()=> dispatch(setHistoricalConfigurationViewFormVisibility(false))} />
        <Stack spacing={2} sx={{p:1}}>

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
           :  <JsonEditor  value={JSON.stringify( historicalConfiguration?.configuration, null, 2 )} readOnly />  
           }
        </Stack>
          <ViewFormAudit  defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}

export default memo(HistoricalConfigurationsViewForm)
