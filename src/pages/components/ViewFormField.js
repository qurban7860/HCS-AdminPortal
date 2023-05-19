import PropTypes from 'prop-types';
import { Typography, Grid} from '@mui/material';
import Iconify from '../../components/iconify';

ViewFormField.propTypes = {
    heading: PropTypes.string,
    param: PropTypes.string,
    numberParam: PropTypes.number,
    secondParam: PropTypes.string,
    objectParam: PropTypes.object,
    secondObjectParam: PropTypes.object,
    sm: PropTypes.number,
    isActive: PropTypes.bool
  };
export default function ViewFormField({heading,param, secondParam ,objectParam,secondObjectParam, numberParam , sm, isActive}) {
    return (
    <Grid item xs={12} sm={sm} sx={{ px:2,py:1, overflowWrap: "break-word", }}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                {heading || ""}
            </Typography>
            {/* <Typography variant="body2">{param || ''} {secondParam || ''} {objectParam || ''} {secondObjectParam || ''} {numberParam || ''}</Typography> */}


            <Typography variant="body1" style={{ display: 'flex', alignItems: 'center' }}>
              {isActive !== undefined && (
                <Iconify
                  icon={isActive ? "mdi:user-check-outline" : "mdi:user-block-outline"}
                  style={{ color: isActive ? "green" : "red", fontSize: '24px', marginRight: '8px' }}
                />
              )}
              {param && param.trim().length > 0 ? param : ''}
              {param && param.trim().length > 0 && secondParam && secondParam.trim().length > 0 ? '  ' : ''}
              {secondParam && secondParam.trim().length > 0 ? secondParam : ''}
              {objectParam || ''}
              {secondObjectParam || ''}
              {numberParam || ''}
            </Typography>

        </Grid>

    )
}