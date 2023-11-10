import { useState, memo } from 'react'
import PropTypes, { number } from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Box, Table, TableBody, TableCell, TableRow,  IconButton, Collapse, Grid, TextField, Checkbox, Typography, Autocomplete, Card } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import {  RHFTextField, RHFCheckbox, RHFDatePicker, RHFAutocomplete } from '../../../components/hook-form';
import CommentsInput from './CommentsInput';
import { fDate } from '../../../utils/formatTime';

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
                      <>
                      <TableRow key={childRow._id} 
                          sx={{ ":hover": { backgroundColor: "#dbdbdb66" } }}
                      >
                      <Grid display='flex' flexDirection='column'>
                        <Grid  sx={{display: {sm: 'flex',xs:'block'}, justifyContent:'space-between', }}>
                          <Typography variant='body2' size='small' sx={{ my:'auto'}} >
                            <b>{`${childIndex+1}). `}</b>{`${childRow.name}`}
                          </Typography>
                          <Grid align='right' sx={{ ml: 'auto'}} >
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

                        <Grid sx={{mx: {sm: 0.6, } }} >
                          <TextField 
                              type="text"
                              label="Comment" 
                              name="comment"
                              disabled={!checkItemLists[index]?.checkItems[childIndex]?.checked}
                              onChange={(e) => handleChangeCheckItemListComment(index, childIndex, e.target.value)}
                              size="small" sx={{ m: 0.3, width: '100%', }} 
                              value={checkItemLists[index]?.checkItems[childIndex]?.comments}
                              minRows={1} multiline
                              InputProps={{ inputProps: { maxLength: 500 }, 
                              }}
                          />
                        </Grid>
                          {editPage && <Card sx={{p:1,m:1}}>
                            <Grid sx={{ display:'flex', justifyContent:'space-between' }} >
                              <Typography variant="body2" sx={{ml:1,my:'auto'}} > {fDate(childRow?.createdAt)} {childRow?.createdBy?.name || ''} </Typography>
                              <Grid sx={{width: 235}} >
                              {childRow?.inputType?.toLowerCase() !== 'boolean' ? 
                                <Typography variant="body2"  > {childRow?.checkItemValue || ''} </Typography> :
                                <Checkbox  disabled checked={childRow?.checkItemValue || false} sx={{my:'auto',mr:'auto'}} /> }
                                </Grid>
                            </Grid>
                            <Typography variant="body2" sx={{ml:4}} >{childRow?.comments || ''}</Typography>
                          </Card>}
                      </Grid>
                      </TableRow>
                        </>
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