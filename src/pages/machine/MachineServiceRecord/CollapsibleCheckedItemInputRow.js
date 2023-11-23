import { memo } from 'react'
import PropTypes from 'prop-types';
import { Table, TableBody, TableRow, Grid, TextField, Checkbox, Typography, Stack, Divider } from '@mui/material';
import CommentsInput from './CommentsInput';
import ViewFormServiceRecordVersionAudit from '../../components/ViewForms/ViewFormServiceRecordVersionAudit';
import { StyledTableRow } from '../../../theme/styles/default-styles';

const CollapsibleCheckedItemInputRow = ({ row, index, checkItemLists, setValue, 
  editPage,
  handleChangeCheckItemListDate,
  handleChangeCheckItemListValue, 
  handleChangeCheckItemListStatus,
  handleChangeCheckItemListComment,
  handleChangeCheckItemListChecked,
  handleChangeCheckItemListCheckBoxValue}) =>
  (
    <>
        <Typography key={index} variant='h5'>

            <b>{`${index+1}). `}</b>{typeof row?.ListTitle === 'string' && row?.ListTitle || ''}{' ( Items: '}<b>{`${row?.checkItems?.length}`}</b>{' ) '}
        </Typography>
        <Grid  sx={{ml:3}} >
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {row?.checkItems?.map((childRow,childIndex) => (
                      <StyledTableRow key={childRow._id}  >
                        <Grid display='flex' flexDirection='column' sx={{ m:  1, }} key={childRow._id} >
                          <Grid >
                            <Typography variant='body2' size='small'  >
                              <b>{`${index+1}.${childIndex+1}. `}</b>{`${childRow.name}`}
                              <Checkbox 
                                name={`${childRow?.name}_${childIndex}_${index}_${childIndex}`} 
                                checked={checkItemLists[index]?.checkItems[childIndex]?.checked || false} 
                                onChange={()=>handleChangeCheckItemListChecked(index, childIndex )} 
                              />
                            </Typography>
                            <Grid  >
                              <CommentsInput index={index} childIndex={childIndex} 
                                key={`${index}${childIndex}`}
                                childRow={childRow}
                                checkParamList={checkItemLists} 
                                handleChangeCheckItemListDate={handleChangeCheckItemListDate}
                                handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                                handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                                handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                                handleChangeCheckItemListChecked={handleChangeCheckItemListChecked}
                                handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                              />
                            </Grid>
                          </Grid>

                          <Grid >
                            <TextField 
                                type="text"
                                label="Comment" 
                                name="comment"
                                disabled={!checkItemLists[index]?.checkItems[childIndex]?.checked}
                                onChange={(e) => handleChangeCheckItemListComment(index, childIndex, e.target.value)}
                                size="small" sx={{ width: '100%',mt:2 }} 
                                value={checkItemLists[index]?.checkItems[childIndex]?.comments}
                                minRows={2} multiline
                                InputProps={{ inputProps: { maxLength: 5000 } }}
                                InputLabelProps={{ shrink: checkItemLists[index]?.checkItems[childIndex]?.checked || checkItemLists[index]?.checkItems[childIndex]?.comments}}
                            />
                          </Grid>
                          {editPage && childRow?.recordValue?.checkItemValue && 
                            <Stack spacing={1}  >
                                <Divider sx={{mt:1.5 }}/>
                                <Typography variant="body2" sx={{mt:1}}><b>Value : </b>
                                {childRow?.inputType?.toLowerCase() !== 'boolean' ? childRow?.recordValue?.checkItemValue || ''  : 
                                <Checkbox  disabled checked={childRow?.recordValue?.checkItemValue === 'true' || childRow?.recordValue?.checkItemValue === true } sx={{my:'auto',mr:'auto'}} /> }
                                </Typography>
                                {childRow?.recordValue?.comments && <Typography variant="body2" sx={{ alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word'}} ><b>Comment: </b>{childRow?.recordValue?.comments || ''}</Typography>}
                                <ViewFormServiceRecordVersionAudit value={childRow?.recordValue}/>
                            </Stack>}
                        </Grid>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
        </Grid>
        </>
  )

CollapsibleCheckedItemInputRow.propTypes = {
    index: PropTypes.number,
    row: PropTypes.object,
    editPage: PropTypes.bool,
    checkItemLists: PropTypes.array,
    handleChangeCheckItemListDate: PropTypes.func,
    handleChangeCheckItemListValue: PropTypes.func,
    handleChangeCheckItemListStatus: PropTypes.func,
    handleChangeCheckItemListComment: PropTypes.func,
    handleChangeCheckItemListChecked: PropTypes.func,
    handleChangeCheckItemListCheckBoxValue: PropTypes.func,
    setValue: PropTypes.func,
  };

export default memo(CollapsibleCheckedItemInputRow)