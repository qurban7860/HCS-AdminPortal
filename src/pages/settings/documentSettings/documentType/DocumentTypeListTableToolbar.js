import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { PATH_MACHINE, PATH_SETTING } from '../../../../routes/paths';
import { resetActiveDocumentCategories } from '../../../../redux/slices/document/documentCategory';
// components
import SearchBarCombo from '../../../../components/ListTableTools/SearchBarCombo';
// constants
import { BUTTONS } from '../../../../constants/default-constants';
// styles
import { options } from '../../../../theme/styles/default-styles';

// ----------------------------------------------------------------------

DocumentTypeListTableToolbar.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  filterCategory: PropTypes.string,
  onFilterCategory: PropTypes.func,
  isArchived: PropTypes.bool
};

export default function DocumentTypeListTableToolbar({
  isFiltered,
  filterName,
  onResetFilter,
  onFilterName,
  filterCategory,
  onFilterCategory,
  isArchived
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleAdd = () => {
    dispatch(resetActiveDocumentCategories())
    navigate(PATH_MACHINE.documents.documentType.new);
  };
  return (
    <Stack {...options}>
      <SearchBarCombo
        isFiltered={isFiltered}
        value={filterName}
        onChange={onFilterName}
        onClick={onResetFilter}
        {...(!isArchived && {SubOnClick: toggleAdd})}
        {...(!isArchived && {addButton: BUTTONS.ADDDOCUMENT_TYPE})}
        settingPage
        categoryVal={filterCategory}
        setCategoryVal={onFilterCategory}
      />
    </Stack>
  );
}
