import { memo } from 'react'
import PropTypes from 'prop-types';
import { Grid, TableContainer, Table, TableBody, Typography, Paper } from '@mui/material';
import StatusAndComment from './StatusAndComment';

const CollapsibleCheckedItemRow = ({value, index }) => (
    <Grid sx={{ border: '3px solid', borderColor: '#e1e1e1', borderRadius: '7px',mt:1.5 ,p:1}}>
            <Typography variant='h5'>
                <b>{`${index+1}- `}</b>{typeof value?.ListTitle === 'string' && value?.ListTitle || ''}{' ( Items: '}<b>{`${value?.checkItems?.length || 0}`}</b>{' ) '}
            </Typography>
            <Grid >
            <TableContainer component={Paper} >
              <Table size="small" aria-label="simple table" >
                <TableBody>
                  {value?.checkItems?.map((childRow,childIndex) => (
                    <>
                    {/* {!isHistorical && childRow?.checkItemValue &&   */}
                      <StatusAndComment index={index} childIndex={childIndex} childRow={childRow}/>
                    {/* } */}
                    </>
                  ))}
                </TableBody>
              </Table>
              </TableContainer>
            </Grid>   
    </Grid>
  )

CollapsibleCheckedItemRow.propTypes = {
    index: PropTypes.number,
    value: PropTypes.object,
  };

export default memo(CollapsibleCheckedItemRow)