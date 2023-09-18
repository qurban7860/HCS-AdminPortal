import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
// @mui
import {
  Grid,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
// routes
// components
import { useSettingsContext } from '../../../components/settings';
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

import {
  getProfile, 
  getProfiles,
  ChangeRowsPerPage,
  ChangePage,
  setFilterBy,
  setProfileViewFormVisibility } from '../../../redux/slices/products/profile';
import { fDate } from '../../../utils/formatTime';
import TableCard from '../../components/ListTableTools/TableCard';

export default function ProfileList() {
  const {
    order,
    orderBy,
    setPage,
    onSort,
  } = useTable({
    defaultOrderBy: 'deafultName',
  });

  const dispatch = useDispatch();
  useSettingsContext();
  const [filterName, setFilterName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const { machine } = useSelector((state) => state.machine);

  const { profiles, filterBy, page, rowsPerPage, isLoading } = useSelector((state) => state.profile );
  const TABLE_HEAD = [
    { id: 'deafultName', label: 'Deafult Name', align: 'left' },
    { id: 'xs1', label: 'Other Names', align: 'left' },
    { id: 'xs2', label: 'Type', align: 'left' },
    { id: 'WebxFlange', label: 'Web X Flange', align: 'left' },
    { id: 'createdAt', label: 'Created At', align: 'right' },
  ];

  const onChangeRowsPerPage = (event) => {
    dispatch(ChangePage(0));
    dispatch(ChangeRowsPerPage(parseInt(event.target.value, 10))); 
  };

  const  onChangePage = (event, newPage) => { dispatch(ChangePage(newPage)) }

  useEffect(() => {
    if(machine?._id){
      dispatch(getProfiles(machine?._id));
    }
  }, [dispatch, machine]);

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
  
  useEffect(()=>{
      setFilterName(filterBy)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };


  const handleViewRow = (profileid) => {
      dispatch(getProfile(machine._id,profileid));
      dispatch(setProfileViewFormVisibility(true));
  };

  const handleResetFilter = () => {
    dispatch(setFilterBy(''))
    setFilterName('');
  };

  return (
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
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
        <Grid md={12}>
          <TableNoData isNotFound={isNotFound} />
        </Grid>
      </TableCard>
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
        (`${profileg?.web}X${profileg?.flang}`.toLowerCase()).indexOf(filterName.toLowerCase()) >= 0 ||
        fDate(profileg?.createdAt)?.toLowerCase().indexOf(filterName.toLowerCase()) >= 0
    );
  }

  if (filterStatus.length) {
    inputData = inputData.filter((profileg) => filterStatus.includes(profileg.status));
  }

  return inputData;
}
