import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
// @mui
import { Collapse } from '@mui/material';
// hooks
import useActiveLink from '../../../hooks/useActiveLink';
//
import NavItem from './NavItem';

// ----------------------------------------------------------------------

NavList.propTypes = {
  data: PropTypes.object,
  depth: PropTypes.number,
  hasChild: PropTypes.bool,
};

export default function NavList({ data, depth, hasChild }) {
  const { pathname } = useLocation();
  const { active, isExternalLink } = useActiveLink(data.path);

  const hasActiveChild = useMemo(
    () => checkChildActive(pathname, data?.children),
    [pathname, data?.children]
  );

  const [open, setOpen] = useState(active || hasActiveChild);

  useEffect(() => {
    const shouldOpen = active || hasActiveChild;
    setOpen(shouldOpen);
  }, [active, hasActiveChild]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={active}
        key={data}
        isExternalLink={isExternalLink}
        onClick={handleToggle}
      />

      {hasChild && data.children && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} />
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

NavSubList.propTypes = {
  data: PropTypes.array,
  depth: PropTypes.number,
};

function NavSubList({ data, depth }) {
  return (
    <>
      {data.map((list) => (
        <NavList
          key={list.title + list.path}
          data={list}
          depth={depth + 1}
          hasChild={!!list.children}
        />
      ))}
    </>
  );
}

// ----------------------------------------------------------------------

function checkChildActive(pathname, children = []) {
  return children?.some((child) => {
    if (pathname === child.path || pathname.startsWith(child.path)) {
      return true;
    }
    if (child.children) {
      return checkChildActive(pathname, child.children);
    }
    return false;
  });
}
