import PropTypes from 'prop-types';
import { Typography, Grid} from '@mui/material';
import React from 'react';

CommaJoinField.propTypes = {
    objectParam: PropTypes.object,
    arrayParam: PropTypes.array,
    basicArrayParam: PropTypes.array,
    heading: PropTypes.string,
    sm: PropTypes.number,
  };
export default function CommaJoinField({ basicArrayParam, arrayParam, objectParam,heading, sm}) {
    return (
     <Grid item xs={12} sm={sm} sx={{ px: 2, py: 1, overflowWrap: 'break-word' }}> 
      {heading && <Typography variant="overline" sx={{ color: 'text.disabled' }}>
        {heading || ''}
      </Typography>}
      {basicArrayParam && 
      <Typography> {basicArrayParam.map((item, index) => (
        <React.Fragment key={index}>
          {item}
          {index !== basicArrayParam.length - 1}
        </React.Fragment>

        ))} </Typography>
      }
      {arrayParam && <Typography> {arrayParam.map(item => typeof item.name === "string" ? item.connectedMachine.name.trim() : "").filter(value => value !== "").join(", ")}</Typography>}
      {objectParam && <Typography  >{Object.values(objectParam ?? {}).map(value => typeof value === "string" ? value.trim() : "").filter(value => value !== "").join(", ")} </Typography>}
     </Grid>
    )
}