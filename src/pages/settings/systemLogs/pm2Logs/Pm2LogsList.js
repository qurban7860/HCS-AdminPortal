import { useState, useEffect, useCallback, } from 'react';
// @mui
import { Table, Container } from '@mui/material';
import { Cover } from '../../../../components/Defaults/Cover';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// components
import {
  TableNoData,
} from '../../../../components/table';
import Pm2LogsListTableToolbar from './Pm2LogsListTableToolbar';
import { getPm2Logs, resetPm2Logs, getPm2Environments, resetPm2Environments, setPM2FullScreenDialog } from '../../../../redux/slices/logs/pm2Logs';
import TableCard from '../../../../components/ListTableTools/TableCard';
import JsonEditor from '../../../../components/CodeMirror/JsonEditor';
import PM2FullScreenDialog from '../../../../components/Dialog/PM2FullScreenDialog';
import SkeletonLine from '../../../../components/skeleton/SkeletonLine';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

export default function Pm2LogsList() {
  
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState("");
  const { pm2Logs, pm2Environment, pm2LogType, pm2Lines, isLoading, initial } = useSelector((state) => state.pm2Logs );

  useEffect(() => {
      dispatch(getPm2Environments());
      return () => {
        dispatch(resetPm2Environments());
      }
  }, [ dispatch ]);

  const fetchPm2Logs = useCallback(()=>{
    if (pm2Environment && pm2LogType) {
      dispatch(getPm2Logs(pm2Lines, pm2LogType, pm2Environment));
    }else{
      dispatch(resetPm2Logs());
    }
  },[ dispatch, pm2LogType, pm2Environment, pm2Lines])

  const handleFullScreen = ()=>{
    dispatch(setPM2FullScreenDialog(true));
  }

  // useEffect(() => {
  //   fetchPm2Logs();
  //   return () => {
  //     dispatch(resetPm2Logs());
  //   }
  // }, [dispatch, fetchPm2Logs]);

  useEffect(() => {
    if (initial) {
      setTableData(pm2Logs?.data || "" ); 
    }
  }, [ initial, pm2Logs ]);

  const isNotFound = !tableData;

  return (
    <>
      <Container maxWidth={false}>
        <StyledCardContainer>
          <Cover name="PM2 Logs" icon="simple-icons:pm2" />
        </StyledCardContainer>
        <TableCard>
          <Pm2LogsListTableToolbar isPm2Environments handleRefresh={ fetchPm2Logs } handleFullScreen={handleFullScreen} />
            {(isLoading?
              ( Array.from({ length: 15 }).map((_, index) => (
                  <SkeletonLine key={index} />
                ))
              ): !isNotFound && <JsonEditor value={tableData} readOnly />)}
            {!isLoading && isNotFound && <Table><TableNoData isNotFound={isNotFound} /></Table>}
        </TableCard>
      </Container>
      <PM2FullScreenDialog />
    </>
  );
}