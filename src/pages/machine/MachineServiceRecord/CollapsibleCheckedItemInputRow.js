import { useState, memo } from 'react'
import PropTypes, { number } from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Box, Table, TableBody, TableCell, TableRow,  IconButton, Collapse, Grid, TextField, Checkbox, Typography, Autocomplete, Card, Stack, Divider } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import {  RHFTextField, RHFCheckbox, RHFDatePicker, RHFAutocomplete } from '../../../components/hook-form';
import CommentsInput from './CommentsInput';
import { fDateTime } from '../../../utils/formatTime';
import ViewFormServiceRecordVersionAudit from '../../components/ViewForms/ViewFormServiceRecordVersionAudit';

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
                      <TableRow key={childRow._id}  >
                        <Grid display='flex' flexDirection='column' sx={{ m:  1, }} >
                          <Grid >
                            <Typography variant='body2' size='small'  >
                              <b>{`${Number(childIndex)+1}) `}</b>{`${childRow.name}`}
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

                          <Grid  >
                            <TextField 
                                type="text"
                                label="Comment" 
                                name="comment"
                                disabled={!checkItemLists[index]?.checkItems[childIndex]?.checked}
                                onChange={(e) => handleChangeCheckItemListComment(index, childIndex, e.target.value)}
                                size="small" sx={{ width: '100%', }} 
                                value={checkItemLists[index]?.checkItems[childIndex]?.comments}
                                minRows={2} multiline
                                InputProps={{ inputProps: { maxLength: 5000 }, 
                                }}
                            />
                          </Grid>
                          {editPage && childRow?.checkItemValue && 
                            <Stack spacing={1}  >
                                <Divider sx={{mt:1.5 }}/>
                                <Typography variant="body2" sx={{mt:1}}><b>Value : </b>
                                {childRow?.inputType?.toLowerCase() !== 'boolean' ? childRow?.checkItemValue || ''  : 
                                <Checkbox  disabled checked={childRow?.checkItemValue === 'true' || childRow?.checkItemValue === true } sx={{my:'auto',mr:'auto'}} /> }
                                </Typography>
                                {childRow?.comments && <Typography variant="body2" ><b>Comment: </b>{childRow?.comments || ''}</Typography>}
                                <ViewFormServiceRecordVersionAudit value={childRow}/>
                            </Stack>}
                        </Grid>
                      </TableRow>
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