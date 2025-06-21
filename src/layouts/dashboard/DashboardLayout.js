import { useEffect, useMemo, useState, memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// @mui
import { Box } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// components
import { useSettingsContext } from '../../components/settings';
//
import Main from './Main';
import Header from './header';
import NavMini from './nav/NavMini';
import NavVertical from './nav/NavVertical';
// import NavHorizontal from './nav/NavHorizontal';
import { CONFIG } from '../../config-global';
import { MAIN_CATEGORIES, getOtherMainCategories } from './navigationConstants';
import { useAuthContext } from '../../auth/useAuthContext';


// ----------------------------------------------------------------------

const MemoizedHeader = memo(Header);

export default function DashboardLayout() {
  const { themeLayout } = useSettingsContext();
  const isDesktop = useResponsive('up', 'lg');
  const [open, setOpen] = useState(false);
  const { user: currentUser } = useAuthContext();
  const allCategories = useMemo(
    () => [...MAIN_CATEGORIES, ...getOtherMainCategories(currentUser?.roles)],
    [currentUser?.roles]
  );
  const [selectedCategory, setSelectedCategory] = useState(allCategories[0] || MAIN_CATEGORIES[0]);
  const location = useLocation();

  const isNavMini = themeLayout === 'mini';

  useEffect(() => {
    const pathMap = {
      '/crm': 0,
      '/products': 1,
      // '/jobs': 2,
      '/support': 2,
      '/reports': 3,
      '/calendar': 4,
      '/settings': 5
    };

    const path = location.pathname;
    const categoryIndex = Object.entries(pathMap).find(([key]) => path.includes(key))?.[1];
    
    if (categoryIndex !== undefined) {
      setSelectedCategory(allCategories[categoryIndex]);
    }
  }, [location.pathname, allCategories]);
  
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const bgcolor = CONFIG.Background_Color;

  if (isNavMini) {
    return (
      <>
        <MemoizedHeader
          onOpenNav={handleOpen}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sx={{ backgroundColor: bgcolor }}
        />
        <Box
          sx={{
            display: { lg: 'flex' },
            minHeight: { lg: 1 },
          }}
        >
          {isDesktop ? (
            <NavMini selectedCategory={selectedCategory} />
          ) : (
            <NavVertical
              openNav={open}
              onCloseNav={handleClose}
              setSelectedCategory={setSelectedCategory}
              selectedCategory={selectedCategory}
            />
          )}

          <Main>
            <Outlet />
          </Main>
        </Box>
      </>
    );
  }

  return (
    <>
      <MemoizedHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenNav={handleOpen}
      />
      <Box
        sx={{
          display: { lg: 'flex' },
          minHeight: { lg: 1 },
        }}
      >
        <NavVertical openNav={open} onCloseNav={handleClose} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <Main>
          <Outlet />
        </Main>
      </Box>
    </>
  );
}