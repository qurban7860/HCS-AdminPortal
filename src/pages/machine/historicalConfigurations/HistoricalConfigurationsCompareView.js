import { memo, useLayoutEffect, useCallback } from 'react';
import { useDispatch, shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
// redux
import { 
  getHistoricalConfigurationRecord, 
  getHistoricalConfigurationRecords,
  resetHistoricalConfigurationRecord, 
  resetHistoricalConfigurationRecords,
  resetCompareHistoricalConfigurationRecord,
  resetCompareHistoricalConfigurationRecords
} from '../../../redux/slices/products/historicalConfiguration';
import { getActiveMachines } from '../../../redux/slices/products/machine';
import HistoricalConfigurationsCompareViewForm from './HistoricalConfigurationsCompareViewForm';

function HistoricalConfigurationsView() {
  const dispatch = useDispatch();
  const { machineId } = useParams();

  const { selectedINIs } = useSelector((state) => state.historicalConfiguration, shallowEqual);

  const loadCustomerMachines = useCallback(() => {
      dispatch(getActiveMachines());
  }, [dispatch]);

  const loadHistoricalConfigurations = useCallback(() => {
    if (machineId) {
      dispatch(getHistoricalConfigurationRecords(machineId, false, false ));
      if (selectedINIs?.length === 1) {
        dispatch(getHistoricalConfigurationRecord(machineId, selectedINIs[0], true));
      } else if (selectedINIs?.length === 2) {
        dispatch(getHistoricalConfigurationRecord(machineId, selectedINIs[0], true, false));
        dispatch(getHistoricalConfigurationRecord(machineId, selectedINIs[1], false, true));
        dispatch(getHistoricalConfigurationRecords(machineId, false, true));
      }
    }
  }, [dispatch, machineId, selectedINIs]);

  useLayoutEffect(() => {
    loadCustomerMachines();
    loadHistoricalConfigurations();

    return () => {
      dispatch(resetHistoricalConfigurationRecord());
      dispatch(resetHistoricalConfigurationRecords());
      dispatch(resetCompareHistoricalConfigurationRecord());
      dispatch(resetCompareHistoricalConfigurationRecords());
    };
  }, [loadCustomerMachines, loadHistoricalConfigurations, dispatch]);

  return <HistoricalConfigurationsCompareViewForm />;
}

export default memo(HistoricalConfigurationsView);
