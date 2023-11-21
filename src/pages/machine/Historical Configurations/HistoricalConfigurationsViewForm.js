import { useMemo, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JSONTree } from 'react-json-tree';
import ReactJson from 'react-json-view'
// @mui
import {  Card, Grid } from '@mui/material';
// redux
import { setHistoricalConfigurationViewFormVisibility, getHistoricalConfigurationRecord, getHistoricalConfigurationRecords } from '../../../redux/slices/products/historicalConfiguration';
// components
import { useSnackbar } from '../../../components/snackbar';
import { FORMLABELS } from '../../../constants/default-constants';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormNoteField from '../../components/ViewForms/ViewFormNoteField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
// import ObjectPrinter from './ObjectPrinter';
import { fDate } from '../../../utils/formatTime';

function HistoricalConfigurationsViewForm() {

  const { historicalConfiguration, historicalConfigurationViewFormFlag, isLoading } = useSelector((state) => state.historicalConfiguration);
  const { machine } = useSelector((state) => state.machine)

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();


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
  

  const printObject = (obj, depth = 0) => {
    const indent = '                     '.repeat(depth);
    const keys = Object.keys(obj);
console.log("printObject depth :",depth)
    return `{\n${keys.map(key => `${indent}  ${key}: ${printValue(obj[key], depth + 1)}`).join(',\n')}\n${indent}}`;
  };

  const printArray = (arr, depth) => {
console.log("printArray depth :",depth)

    const indent = '                     '.repeat(depth);
    return `[\n${arr.map(item => `${indent}  ${printValue(item, depth + 1)}`).join(',\n')}\n${indent}]`;
  };

  const printValue = (value, depth) => {
console.log("printValue depth :",depth)

    if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        return printArray(value, depth);
      } 
        return printObject(value, depth);
    } 
      return JSON.stringify(value);
    
  };

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons backLink={()=> dispatch(setHistoricalConfigurationViewFormVisibility(false))} />
        <Grid container>
          {/* <ObjectPrinter data={historicalConfiguration}/> */}
          {/* <ViewFormNoteField sm={12} param={printObject(historicalConfiguration)} /> */}
          <ReactJson enableClipboard src={historicalConfiguration} />
          <ViewFormAudit  defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}

export default memo(HistoricalConfigurationsViewForm)
