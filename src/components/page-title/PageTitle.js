import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { CONFIG } from '../../config-global';

export default function PageTitle({ title }) {
  const pageTitle = title ? `${title} - ${CONFIG.APP_TITLE}` : CONFIG.APP_TITLE;

  return (
    <Helmet>
      <title>{pageTitle}</title>
    </Helmet>
  );
}

PageTitle.propTypes = {
  title: PropTypes.string,
}; 