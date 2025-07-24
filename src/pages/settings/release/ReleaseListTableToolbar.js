import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import { Stack, Grid, Autocomplete, TextField, Button, ButtonGroup } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// constants
import { options } from '../../../theme/styles/default-styles';
import { releaseStatusOptions } from '../../../utils/constants';
import { getActiveProjects, resetActiveProjects } from '../../../redux/slices/support/project/project';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

ReleaseListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  projectVal: PropTypes.object,
  setProjectVal: PropTypes.func,
  statusVal: PropTypes.string,
  setStatusVal: PropTypes.func,
  isListView: PropTypes.bool,
  setIsListView: PropTypes.func,
};

export default function ReleaseListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  projectVal,
  setProjectVal,
  statusVal,
  setStatusVal,
  isListView,
  setIsListView,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleAdd = () => navigate(PATH_SETTING.projectReleases.new);
  const { activeProjects } = useSelector((state) => state.project);

  useEffect(() => {
    dispatch(getActiveProjects());
    return () => {
      dispatch(resetActiveProjects());
    };
  }, [dispatch]);

  const nodes = [
    <>
      <Grid item xs={12} sm={6} md={1.5}>
        <Autocomplete
          fullWidth
          value={projectVal || null}
          options={activeProjects}
          isOptionEqualToValue={(option, val) => option?._id === val?._id}
          getOptionLabel={(option) => option?.name}
          onChange={(event, newValue) => {
            setProjectVal(newValue);
          }}
          renderOption={(props, option) => (<li {...props} key={option?._id}>{option?.name || ''}</li>)}
          renderInput={(params) => <TextField {...params} size='small' label="Project" />}
        />
      </Grid>,
      <Grid item xs={12} sm={6} md={1.5}>
        <Autocomplete
          fullWidth
          value={statusVal || null}
          options={releaseStatusOptions}
          isOptionEqualToValue={(option, val) => option?.value === val?.value}
          getOptionLabel={(option) => option?.label}
          onChange={(event, newValue) => {
            setStatusVal(newValue);
          }}
          renderOption={(props, option) => (<li {...props} key={option?.value}>{option?.label || ''}</li>)}
          renderInput={(params) => <TextField {...params} size='small' label="Status" />}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={2.5}>
        <ButtonGroup variant="outlined" sx={{ mt: 0.4, ml: 1, alignSelf: 'flex-end' }}>
          <Button onClick={() => setIsListView(false)} startIcon={<Iconify icon="mdi:view-grid" />}
            sx={{
              backgroundColor: !isListView ? 'primary.main' : 'grey.300',
              color: !isListView ? 'white' : 'black',
              '&:hover': { color: 'rgba(0, 0, 0, 0.7)' },
            }}
          >
            Detail View
          </Button>
          <Button onClick={() => setIsListView(true)} startIcon={<Iconify icon="mdi:view-list" />}
            sx={{
              backgroundColor: isListView ? 'primary.main' : 'grey.300',
              color: isListView ? 'white' : 'black',
              '&:hover': { color: 'rgba(0, 0, 0, 0.7)' },
            }}
          >
            List View
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  ];

  return (
    <Stack {...options}>
      <SearchBarCombo
        reduceFilterSize
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        SubOnClick={toggleAdd}
        addButton='New Release'
        nodes={nodes}
      />
    </Stack>
  );
}