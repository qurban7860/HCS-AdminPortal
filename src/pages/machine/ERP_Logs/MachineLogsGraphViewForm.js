import { useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// @mui
import { Card, Grid, CardHeader, Divider, IconButton } from '@mui/material';
// slices
import { getERPLogs } from '../../../redux/slices/dashboard/count';
import { setMachineErpLogAddFormVisibility, setMachineErpLogListViewFormVisibility } from '../../../redux/slices/products/machineErpLogs';
// utils
import { fDate } from '../../../utils/formatTime';
import ChartStacked from '../../components/Charts/ChartStacked';
import { SkeletonGraph } from '../../../components/skeleton';
import EmptyContent from '../../../components/empty-content';
import Iconify from '../../../components/iconify/Iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

export default function MachineLogsGraphViewForm() {

    const dispatch = useDispatch();
    const { erpLogs, isLoading } = useSelector((state) => state.count);
    const { machine } = useSelector((state) => state.machine);
    const [ disable, setDisable ] = useState(false);
    const erpLogsTime = [];
    const erpLogsLength = [];
    const erpLogsWaste = [];

    useEffect(() => {
        dispatch(getERPLogs(machine?._id,  ));
    }, [dispatch, machine?._id ]);
    
    if (erpLogs.length !== 0) {
        erpLogs.map((log) => {
            erpLogsTime.push(fDate(log._id,'MMM yyyy'));
            erpLogsLength.push(log.componentLength);
            erpLogsWaste.push(log.waste);
            return null;
        });
    }

    useLayoutEffect(() => {
        if (machine?.status?.slug === 'transferred') {
            setDisable(true);
        } else {
            setDisable(false);
        }
    }, [dispatch, machine]);

    const openRecordsList = () => { dispatch(setMachineErpLogListViewFormVisibility(true)) }
    const addLogRecord = () => { dispatch(setMachineErpLogAddFormVisibility(true)) }

    return (
        <Grid container direction="row">
        <Card sx={{ width: '100%'}}>
            <Grid item sx={{display: {md: 'flex', xs:'block', justifyContent: 'space-between'}}}>
                <Grid item sx={{display: 'flex'}}>
                    <CardHeader titleTypographyProps={{variant:'h4'}} title="ERP Logs" sx={{mb:2}} />
                </Grid>
                <Grid item sx={{ display: 'flex', px:2.5, pt:4, pb:2 , ml: 'auto'}}>
                    <StyledTooltip title="Log List" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                        <IconButton disabled={disable} onClick={openRecordsList} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', mx:2, p:'8.5px 14px',
                            '&:hover': {
                                background:"#103996", 
                                color:"#fff"
                            }
                        }}>
                            <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon='material-symbols-light:lists-rounded' />
                        </IconButton>
                    </StyledTooltip>
                    
                    <StyledTooltip title="Add Log" placement="top" disableFocusListener tooltipcolor="#103996" color="#103996">
                        <IconButton  disabled={disable} onClick={addLogRecord} color="#fff" sx={{background:"#2065D1", borderRadius:1, height:'1.7em', p:'8.5px 14px',
                            '&:hover': {
                                background:"#103996", 
                                color:"#fff"
                            }
                        }}>
                        <Iconify color="#fff" sx={{ height: '24px', width: '24px'}} icon='eva:plus-fill' />
                        </IconButton>
                    </StyledTooltip>
                </Grid>
            </Grid>
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
                {!isLoading && erpLogsTime.length===0 && <EmptyContent title="No Graph Data Found!" sx={{color: '#DFDFDF'}} />}
                    
            </Grid>
            </Grid>
        </Card>
    </Grid>
    );
}