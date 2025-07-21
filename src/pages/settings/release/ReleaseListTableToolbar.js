import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import { Stack, Grid, Autocomplete, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SearchBarCombo from '../../../components/ListTableTools/SearchBarCombo';
// routes
import { PATH_SETTING } from '../../../routes/paths';
// constants
import { options } from '../../../theme/styles/default-styles';
import { releaseStatusOptions } from '../../../utils/constants';
import { getActiveProjects, resetActiveProjects } from '../../../redux/slices/support/project/project';
// ----------------------------------------------------------------------

ReleaseListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  projectVal: PropTypes.object,
  setProjectVal: PropTypes.func,
  statusVal: PropTypes.string,
  setStatusVal: PropTypes.func
};

export default function ReleaseListTableToolbar({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  projectVal,
  setProjectVal,
  statusVal,
  setStatusVal
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
      <Grid item xs={12} sm={6} md={2}>
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
      <Grid item xs={12} sm={6} md={2}>
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
    ];

  return (
    <Stack {...options}>
      <SearchBarCombo
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
