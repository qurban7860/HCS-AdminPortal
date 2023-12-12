import PropTypes from 'prop-types';
import FormLabel from './FormLabel';

FormHeading.propTypes = {
  heading: PropTypes.string,
};
export default function FormHeading({heading}) {
    return (<FormLabel content={heading} />)
}