import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import {
  Container,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// components
import {
  useTable,
  getComparator,
  TableNoData,
  TableSkeleton,
  TableHeadCustom,
  TablePaginationCustom,
} from '../../../components/table';
import Scrollbar from '../../../components/scrollbar';
// sections
import ProfileListTableRow from './ProfileListTableRow';
import ProfileListTableToolbar from './ProfileListTableToolbar';
import { getProfiles, resetProfiles, ChangeRowsPerPage, ChangePage, setFilterBy } from '../../../redux/slices/products/profile';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../../components/ListTableTools/TableCard';
import MachineTabContainer from '../util/MachineTabContainer';

export default function ProfileList() {
  const {
    order,
    orderBy,
    setPage,
    onSort,
  } = useTable({
    defaultOrderBy: 'createdAt',
    defaultOrder: 'desc',
  });

  const navigate = useNavigate();
  const { machineId } = useParams();
  const dispatch = useDispatch();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const { machine } = useSelector((state) => state.machine);
  const { profiles, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.profile);

  const TABLE_HEAD = [
    { id: 'defaultName', label: 'Default Name', align: 'left' },
    { id: 'names', visibility: 'xs1', label: 'Other Names', align: 'left' },
    { id: 'type', label: 'Type', align: 'left' },
    { id: 'web', label: 'Web X Flange', align: 'left' },
    { id: 'thicknessStart', label: 'Thickness', align: 'left' },
    { id: 'isActive', label: 'Active', align: 'left' },
    { id: 'updatedAt', label: 'Updated At', align: 'right' },
  ];

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10)));
  };

  const onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(() => {
    if (machineId) {
      dispatch(getProfiles(machineId, machine?.isArchived));
    }
    return () => {
      dispatch(resetProfiles());
    }
  }, [dispatch, machineId, machine]);

  useEffect(() => {
    setTableData(profiles);
  }, [profiles]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStatus,
  });
  const denseHeight = 60;
  const isFiltered = filterName !== '' || !!filterStatus.length;
  const isNotFound = (!dataFiltered.length && !!filterName) || (!isLoading && !dataFiltered.length);

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

  useEffect(() => {
    setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };


  const handleViewRow = (id) => navigate(PATH_MACHINE.machines.profiles.view(machineId, id));

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='profile' />
      <TableCard>
        <ProfileListTableToolbar
          filterName={filterName}
          filterStatus={filterStatus}
          onFilterName={handleFilterName}
          onFilterStatus={handleFilterStatus}
          isFiltered={isFiltered}
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
                      <ProfileListTableRow
                        key={row._id}
                        row={row}
                        onViewRow={() => handleViewRow(row?._id)}
                        style={index % 2 ? { background: 'red' } : { background: 'green' }}
                      />
                    ) : (
                      !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
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
  const stabilizedThis = inputData && inputData.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filterName) {
    inputData = inputData.filter(
      (profileg) =>
        profileg?.defaultName?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        profileg?.names?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        profileg?.thicknessStart?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        profileg?.thicknessEnd?.toString().toLowerCase().indexOf(filterName.toLowerCase()) >= 0 ||
        (`${profileg?.web}X${profileg?.flange}`.toLowerCase()).indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(profileg?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((profileg) => filterStatus.includes(profileg.status));
  }

  return inputData;
}
