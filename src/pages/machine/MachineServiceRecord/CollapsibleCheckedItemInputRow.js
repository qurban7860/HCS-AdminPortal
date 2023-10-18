import { useState, memo } from 'react'
import PropTypes, { number } from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Box, Table, TableBody, TableCell, TableRow,  IconButton, Collapse, Grid, TextField, Checkbox, Typography, Autocomplete } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import {  RHFTextField, RHFCheckbox, RHFDatePicker, RHFAutocomplete } from '../../../components/hook-form';
import CommentsInput from './CommentsInput';

const CollapsibleCheckedItemInputRow = ({ row, index, checkParamList, setValue, 
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
            <b>{`${index+1}). `}</b>{typeof row?.paramListTitle === 'string' && row?.paramListTitle || ''}{' ( Items: '}<b>{`${row?.paramList?.length}`}</b>{' ) '}
        </Typography>
        <Grid  sx={{ml:3}} >
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {row?.paramList.map((childRow,childIndex) => (
                      <>
                      <TableRow key={childRow._id} 
                          sx={{ ":hover": { backgroundColor: "#dbdbdb66" } }}
                      >
                      <Grid display='flex' flexDirection='column'>
                        <Grid  sx={{display: {sm: 'flex',xs:'block'}, justifyContent:'space-between', }}>
                          <Typography variant='body2' size='small' sx={{ my:'auto'}} >
                            <b>{`${childIndex+1}). `}</b>
                            {`${childRow.name}`}
                          </Typography>
                          <Grid align='right' sx={{ ml: 'auto'}} >
                                  <CommentsInput index={index} childIndex={childIndex} 
                                    childRow={childRow}
                                    checkParamList={checkParamList} 
                                    handleChangeCheckItemListDate={handleChangeCheckItemListDate}
                                    handleChangeCheckItemListValue={handleChangeCheckItemListValue}
                                    handleChangeCheckItemListStatus={handleChangeCheckItemListStatus}
                                    handleChangeCheckItemListComment={handleChangeCheckItemListComment}
                                    handleChangeCheckItemListChecked={handleChangeCheckItemListChecked}
                                    handleChangeCheckItemListCheckBoxValue={handleChangeCheckItemListCheckBoxValue}
                                  />
                          </Grid>
                        </Grid>
                        {editPage && <Grid sx={{mx: {sm: 0.6, } }} >
                          <Typography variant='body2'>History:</Typography>
                        </Grid>}
                        <Grid sx={{mx: {sm: 0.6, } }} >
                          <TextField 
                              // fullWidth
                              type="text"
                              label="Comment" 
                              name="comment"
                              onChange={(e) => handleChangeCheckItemListComment(index, childIndex, e.target.value)}
                              size="small" sx={{ m: 0.3, width: '100%', }} 
                              // pr:{md:4},width: {md: 470 } 
                              value={checkParamList[index]?.paramList[childIndex]?.comments}
                              minRows={1} multiline
                              InputProps={{ inputProps: { maxLength: 500 }, 
                              // style: { fontSize: '14px', height: 30 }
                              }}
                              // InputLabelProps={{ style: {  fontSize: '14px', top: '-4px' } }}
                          />
                        </Grid>
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
    checkParamList: PropTypes.array,
    handleChangeCheckItemListDate: PropTypes.func,
    handleChangeCheckItemListValue: PropTypes.func,
    handleChangeCheckItemListStatus: PropTypes.func,
    handleChangeCheckItemListComment: PropTypes.func,
    handleChangeCheckItemListChecked: PropTypes.func,
    handleChangeCheckItemListCheckBoxValue: PropTypes.func,
    setValue: PropTypes.func,
  };

export default memo(CollapsibleCheckedItemInputRow)