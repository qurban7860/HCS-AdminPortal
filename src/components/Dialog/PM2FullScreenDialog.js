import { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Button, DialogTitle, DialogContent, Select, MenuItem, FormControl, InputLabel, Grid, Typography } from '@mui/material';
import { TableSkeleton } from '../table';
import { getPm2Logs, resetPm2Logs, setPM2FullScreenDialog, setPm2LinesPerPage } from '../../redux/slices/logs/pm2Logs';
import JsonEditor from '../CodeMirror/JsonEditor';
import SkeletonLine from '../skeleton/SkeletonLine';

function PM2FullScreenDialog() {
  const dispatch = useDispatch();
  const { pm2Lines, pm2LogType, pm2Environment, pm2Logs, pM2FullScreenDialog, isLoading } = useSelector((state) => state.pm2Logs);
  const handleCloseDialog = ()=> dispatch(setPM2FullScreenDialog(false));

  const fetchPm2Logs = useCallback(()=>{
    if (pm2Environment && pm2LogType) {
      dispatch(getPm2Logs(pm2Lines, pm2LogType, pm2Environment));
    }
  },[ dispatch, pm2LogType, pm2Environment, pm2Lines])

  useEffect(() => {
    fetchPm2Logs();
    return () => {
      dispatch(resetPm2Logs());
    }
  }, [dispatch, fetchPm2Logs]);

  return (
    <Dialog fullScreen open={pM2FullScreenDialog} onClose={handleCloseDialog}>
      <DialogTitle variant='h3'>
      <Grid container>
        <Grid md={4} display='flex'>
          <Typography variant='h3'>PM2 Logs</Typography>
          <FormControl sx={{width:250, ml:2}}>
            <InputLabel id="demo-simple-select-label">Lines</InputLabel>
              <Select
                fullWidth
                size='small'
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="pm2Lines"
                value={pm2Lines}
                label="Lines"
                onChange={(event) => {
                  if (event.target.value) {
                    dispatch(setPm2LinesPerPage(event.target.value));
                  }
                }}
              >
                <MenuItem value={100}>100</MenuItem>
                <MenuItem value={250}>250</MenuItem>
                <MenuItem value={500}>500</MenuItem>
                <MenuItem value={1000}>1000</MenuItem>
                <MenuItem value={2000}>2000</MenuItem>
              </Select>
            </FormControl>
        </Grid>
        <Grid md={8} display='flex' justifyContent='flex-end'>
          <Button size='medium' variant='outlined' onClick={handleCloseDialog}>Close</Button>
        </Grid>
      </Grid>
      </DialogTitle>
      <DialogContent sx={{p:0}}>
        {(isLoading?
        ( Array.from({ length: 25 }).map((_, index) => (
          <SkeletonLine key={index} />
          ))
        ): <JsonEditor value={pm2Logs?.data} readOnly autoHeight />)}
      </DialogContent>
    </Dialog>
  );
}



export default PM2FullScreenDialog;
