import { memo } from 'react'
import PropTypes from 'prop-types';
import { Grid, Table, TableBody, Typography } from '@mui/material';
import StatusAndComment from './StatusAndComment';

const CollapsibleCheckedItemRow = ({value, index }) => (
    <>
            <Typography variant='h5'>
                <b>{`${index+1}). `}</b>{typeof value?.ListTitle === 'string' && value?.ListTitle || ''}{' ( Items: '}<b>{`${value?.checkItems?.length || 0}`}</b>{' ) '}
            </Typography>
            <Grid >
              <Table size="small" aria-label="purchases">
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
            </Grid>   
    </>
  )

CollapsibleCheckedItemRow.propTypes = {
    index: PropTypes.number,
    value: PropTypes.object,
  };

export default memo(CollapsibleCheckedItemRow)