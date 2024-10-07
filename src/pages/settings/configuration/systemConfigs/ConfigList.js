import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Table, TableBody, Container, TableContainer } from '@mui/material';
import debounce from 'lodash/debounce';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
// routes
import { PATH_SETTING } from '../../../../routes/paths';
// components
import Scrollbar from '../../../../components/scrollbar';
import { Cover } from '../../../../components/Defaults/Cover';
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../../components/table';
// sections
import ConfigListTableToolbar from './ConfigListTableToolbar';
import ConfigListTableRow from './ConfigListTableRow';
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

const TABLE_HEAD = [
  { id: 'name', label: 'Config Name'},
  { id: 'value', label: 'Config Value'},
  { id: 'type', visibility: 'xs1', label: 'Type'},
  { id: 'isActive', label: 'Active', align: 'center' },
  { id: 'updateBy', visibility: 'md1', label: 'Update By'},
  { id: 'updateAt', visibility: 'md2', label: 'Update At', align: 'right' },
];

// ----------------------------------------------------------------------

export default function ConfigList() {
  const {
    order,
    orderBy,
    setPage,
    //
    onSort,
  } = useTable({
    defaultOrderBy: 'updateAt', defaultOrder: 'desc'
  });

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  const dispatch = useDispatch();

  const { configs, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.config);

  const navigate = useNavigate();
  const [filterName, setFilterName] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    dispatch(getConfigs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dispatch ]);

  const dataFiltered = applyFilter({
    inputData: configs || [],
    comparator: getComparator(order, orderBy),
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
    setPage(0);
  };
  
  useEffect(() => {
      debouncedSearch.current.cancel();
  }, [debouncedSearch]);
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleViewRow = (id) => {
    navigate(PATH_SETTING.configs.view(id));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
    setFilterRole('all');
    setFilterStatus('all');
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
          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>

            <Scrollbar>
              <Table size="small" sx={{ minWidth: 360 }}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={onSort}
                />
                <TableBody>
                  {(isLoading ? [...Array(rowsPerPage)] : dataFiltered)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) =>
                      row ? (
                        <ConfigListTableRow
                          key={row.id}
                          index={index}
                          page={page}
                          row={row}
                          onViewRow={() => handleViewRow(row?._id)}
                          style={index % 2 ? { background: 'red' } : { background: 'green' }}
                        />
                      ) : (
                        !isNotFound && <TableSkeleton key={index} sx={{ height: 60 }} />
                      )
                    )}
                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          {!isNotFound && <TablePaginationCustom
            count={dataFiltered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={onChangePage}
            onRowsPerPageChange={onChangeRowsPerPage}
          />}
        </TableCard>
      </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({ inputData, comparator, filterName, filterStatus }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (config) =>
        config?.name?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        config?.value?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(config?.updateAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  return inputData;
}
