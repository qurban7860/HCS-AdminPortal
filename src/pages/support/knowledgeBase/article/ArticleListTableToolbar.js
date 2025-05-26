import PropTypes from 'prop-types';
// @mui
import { Autocomplete, FormControl, Grid, MenuItem, Stack, TextField, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
// constants
import { BUTTONS } from '../../../../constants/default-constants';
// styles
import { options } from '../../../../theme/styles/default-styles';
import { articleStatusOptions } from '../../../../utils/constants';

// ----------------------------------------------------------------------

ArticleListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  isArchived: PropTypes.bool,
  categoryVal: PropTypes.object,
  setCategoryVal: PropTypes.func,
  statusVal: PropTypes.string,
  setStatusVal: PropTypes.func
};

export default function ArticleListTableToolbar({
  isFiltered,
  filterName,
  onResetFilter,
  onFilterName,
  isArchived,
  categoryVal,
  setCategoryVal,
  statusVal,
  setStatusVal
}) {

  const navigate = useNavigate();
  const toggleAdd = () => {
    navigate(PATH_SUPPORT.knowledgeBase.article.new);
  };

  const categoryList = useSelector((state) => state.articleCategory.activeArticleCategories);

  const nodes = [
    <Grid item xs={12} sm={6} md={2}>
      <Autocomplete
        fullWidth
        value={categoryVal || null}
        options={categoryList}
        isOptionEqualToValue={(option, val) => option?._id === val?._id}
        getOptionLabel={(option) => option?.name}
        onChange={(event, newValue) => {
          setCategoryVal(newValue);
        }}
        renderOption={(props, option) => (<li {...props} key={option?._id}>{option?.name || ''}</li>)}
        renderInput={(params) => <TextField {...params} size='small' label="Category" />}
      />
    </Grid>,
    <Grid item xs={12} sm={6} md={2}>
      <Autocomplete
        fullWidth
        value={statusVal || null}
        options={articleStatusOptions}
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
        {...(!isArchived && {addButton: ' Add Knowledge Base'})}
        {...(!isArchived && {SubOnClick: toggleAdd})}
        settingPage
        nodes={nodes}
        />
    </Stack>
  );
}
