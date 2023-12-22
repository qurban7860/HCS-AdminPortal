import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Link, Chip, CardHeader, Divider} from '@mui/material';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// slices
import { getERPLogs } from '../../redux/slices/dashboard/count';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';
// components
import ViewFormField from '../components/ViewForms/ViewFormField';
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
import FormLabel from '../components/DocumentForms/FormLabel';
import NothingProvided from '../components/Defaults/NothingProvided';
import GoogleMaps from '../../assets/GoogleMaps';
// constants
import { TITLES, FORMLABELS } from '../../constants/default-constants';
import { Snacks } from '../../constants/machine-constants';
// utils
import { fDate } from '../../utils/formatTime';
import ChartStacked from '../components/Charts/ChartStacked';
import { SkeletonGraph } from '../../components/skeleton';
import EmptyContent from '../../components/empty-content';
// ----------------------------------------------------------------------

export default function MachineLogsViewForm() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { erpLogs, isLoading } = useSelector((state) => state.count);
  const { machine } = useSelector((state) => state.machine);
  
  const erpLogsTime = [];
  const erpLogsLength = [];
  const erpLogsWaste = [];

  useEffect(() => {
    dispatch(getERPLogs(machine?._id));
  }, [dispatch, machine]);

  if (erpLogs.length !== 0) {
    erpLogs.map((log) => {
      erpLogsTime.push(fDate(log._id));
      erpLogsLength.push(log.componentLength);
      erpLogsWaste.push(log.waste);
      return null;
    });
  }

  return (
      <Grid container direction="row">
        <Card sx={{ width: '100%'}}>
          <CardHeader titleTypographyProps={{variant:'h5'}} title="Erp Logs" sx={{mb:2}} />
          <Divider />
          <Grid container display='flex' direction='row'>
            <Grid item xs={12}>
                {!isLoading ?(
                  <>
                    {erpLogsTime.length>0 && 
                      <ChartStacked 
                        chart={{
                          categories: erpLogsTime,
                          series: [ { name: 'Length', data: erpLogsLength }, { name: 'Waste', data: erpLogsWaste } ]
                        }}
                      />
                    }
                  </>
                ):(
                  <SkeletonGraph />
                )}

                {!isLoading && erpLogsTime.length===0 && <EmptyContent title="No Data Found" sx={{color: '#DFDFDF'}} />}
                    
            </Grid>
            </Grid>
        </Card>
        
      </Grid>
  );
}
