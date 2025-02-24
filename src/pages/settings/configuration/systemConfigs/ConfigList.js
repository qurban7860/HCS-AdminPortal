import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Box, Typography, Divider } from '@mui/material';
import debounce from 'lodash/debounce';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// components
import { Cover } from '../../../../components/Defaults/Cover';
import { TablePaginationCustom } from '../../../../components/table';
// sections
import ConfigListTableToolbar from './ConfigListTableToolbar';
import ConfigCard from './ConfigCard';
import {
  getConfigs,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy
} from '../../../../redux/slices/config/config';
import { fDate } from '../../../../utils/formatTime';
// constants
import TableCard from '../../../../components/ListTableTools/TableCard';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

const ROLE_OPTIONS = ['Administrator', 'Normal User', 'Guest User', 'Restriced User'];

// ----------------------------------------------------------------------

export default function ConfigList() {
  const dispatch = useDispatch();

  const { configs, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.config);

  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(getConfigs());
  }, [dispatch]);

  const dataFiltered = applyFilter({
    inputData: configs || [],
    filterName,
    filterRole,
    filterStatus,
  });

  const isFiltered = filterName !== '' || filterRole !== 'all' || filterStatus !== 'all';
  const isNotFound = (!isLoading && !dataFiltered.length);

  const debouncedSearch = useRef(debounce((value) => {
    dispatch(ChangePage(0))
    dispatch(setFilterBy(value))
  }, 500))

  const handleFilterName = (event) => {
    debouncedSearch.current(event.target.value);
    setFilterName(event.target.value)
  };
  
  useEffect(() => {
    debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
    setFilterName(filterBy)
  },[filterBy])

  const handleFilterRole = (event) => {
    setFilterRole(event.target.value);
  };

  const handleViewConfig = (id) => {
    navigate(PATH_SETTING.configs.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
  };

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const onChangePage = (event, newPage) => { 
    dispatch(ChangePage(newPage)) 
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover generalSettings name="Configs" icon="ph:users-light" />
      </StyledCardContainer>
      <TableCard>
        <ConfigListTableToolbar
          isFiltered={isFiltered}
          filterName={filterName}
          filterRole={filterRole}
          optionsRole={ROLE_OPTIONS}
          onFilterName={handleFilterName}
          onFilterRole={handleFilterRole}
          onResetFilter={handleResetFilter}
        />
        
        {!isNotFound && (
          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            sx={{ px: 2, py: 1 }}
          />
        )}

        <Box sx={{ p: { xs: 1.5, md: 2 } }}>
          {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((config, index, array) => (
              <Box 
                key={config?.id || index}
                sx={{
                  '&:not(:last-child)': {
                    mb: 2
                  }
                }}
              >
                {config ? (
                  <ConfigCard
                    config={config}
                    onClick={() => handleViewConfig(config?._id)}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 100,
                      bgcolor: 'background.neutral',
                      borderRadius: 2,
                    }}
                  />
                )}
              </Box>
            ))}

          {isNotFound && (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                No configs found
              </Typography>
            </Box>
          )}
        </Box>

        {!isNotFound && (
          <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
            sx={{ px: 2, py: 2 }}
          />
        )}
      </TableCard>
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, filterName, filterStatus }) {
  let filteredData = [...inputData];

  if (filterName) {
    filteredData = filteredData.filter(
      (config) =>
        config?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        config?.value?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(config?.updateAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return filteredData;
}
