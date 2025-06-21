import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// @mui
import { Box, Stack, Drawer, MenuItem, Select, FormControl } from '@mui/material'
// hooks
// import { useSettingsContext } from '../../../components/settings';
import useResponsive from '../../../hooks/useResponsive';
// config
import { NAV  } from '../../../config-global';
// components
import Logo from '../../../components/logo';
import Scrollbar from '../../../components/scrollbar';
import { NavSectionVertical } from '../../../components/nav-section';
//
import NavigationConfig from './NavigationConfig';
import NavDocs from './NavDocs';
import NavAccount from './NavAccount';
import NavToggleButton from './NavToggleButton';
import { useAuthContext } from '../../../auth/useAuthContext';
import { MAIN_CATEGORIES, getOtherMainCategories } from '../navigationConstants';
import VersionBadge from '../../../components/nav-section/VersionBadge';

// ----------------------------------------------------------------------

NavVertical.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,  
  selectedCategory: PropTypes.object,
  setSelectedCategory: PropTypes.func,
};

export default function NavVertical({ openNav, onCloseNav, selectedCategory, setSelectedCategory }) {
  const {
    isDocumentAccessAllowed,
    isDrawingAccessAllowed,
    isSettingAccessAllowed,
    isSecurityUserAccessAllowed,
    isEmailAccessAllowed,
    isDeveloper,
  } = useAuthContext();

  const { user: currentUser } = useAuthContext();
  const otherCategories = useMemo(() => getOtherMainCategories(currentUser?.roles), [currentUser?.roles]);

  const navConfig = useMemo(() => NavigationConfig({
    selectedCategory,
    isDocumentAccessAllowed,
    isDrawingAccessAllowed,
    isSettingAccessAllowed,
    isSecurityUserAccessAllowed,
  }), [
    selectedCategory,
    isDocumentAccessAllowed,
    isDrawingAccessAllowed,
    isSettingAccessAllowed,
    isSecurityUserAccessAllowed
  ]);

  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const renderContent = useMemo(() => (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
        }}
      >
        <Logo sx={{ width: '70%', margin: '0 auto' }} />
        <VersionBadge />
        <NavAccount />
      </Stack>
      {!isDesktop && (
        <CategoryDropdown 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          isSettingAccessAllowed={isSettingAccessAllowed}
          otherCategories={otherCategories}
        />
      )}
      <NavSectionVertical sx={{ mt: '-50px' }} data={navConfig} />
      <Box sx={{ flexGrow: 1 }} />
      <NavDocs />
    </Scrollbar>
  ), [isDesktop, selectedCategory, setSelectedCategory, isSettingAccessAllowed, otherCategories, navConfig]);

  return (
    <Box component="nav" sx={{ flexShrink: { lg: 0 }, width: { lg: NAV.W_DASHBOARD }}}>
      <NavToggleButton sx={{top: 22}}/>
      {isDesktop ? (
        <Drawer
          open
          variant="persistent"
          PaperProps={{
            sx: {
              zIndex: 0,
              width: NAV.W_DASHBOARD,
              bgcolor: 'transparent',
              borderRightStyle: 'solid',
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.W_DASHBOARD,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}


const CategoryDropdown = ({ selectedCategory, setSelectedCategory, isSettingAccessAllowed, otherCategories }) => {
  const navigate = useNavigate();

  const categoryMap = useMemo(() => 
    [...MAIN_CATEGORIES, ...otherCategories].reduce((acc, cat) => {
      acc[cat.id] = cat;
      return acc;
    }, {}), 
  [otherCategories]
  );

  const handleCategoryChange = useCallback((event) => {
    const category = categoryMap[event.target.value];
    setSelectedCategory(category);
    navigate(category.path);
  }, [categoryMap, setSelectedCategory, navigate]);

  const renderMenuItem = (category) => {
    if (category?.id === "settings" && !isSettingAccessAllowed) {
      return null;
    }
    return (
      <MenuItem key={category.id} value={category.id}>
        {category.title}
      </MenuItem>
    );
  };

  return (
    <FormControl fullWidth sx={{ px: 2, mb: 5 }}>
      <Select
        value={selectedCategory.id}
        onChange={handleCategoryChange}
        sx={{ 
          backgroundColor: 'background.paper',
          '& .MuiSelect-select': { py: 1 }
        }}
      >
        {MAIN_CATEGORIES.map(renderMenuItem)}
        {otherCategories.map(renderMenuItem)}
      </Select>
    </FormControl>
  );
};

CategoryDropdown.propTypes = {
  selectedCategory: PropTypes.object,
  setSelectedCategory: PropTypes.func,
  isSettingAccessAllowed: PropTypes.bool,
  otherCategories: PropTypes.array,
};
