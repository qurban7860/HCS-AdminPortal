import { useState, memo } from 'react'
import PropTypes, { number } from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { Box, Table, TableBody, TableCell, TableRow,  IconButton, Collapse } from '@mui/material';
import Iconify from '../../../components/iconify';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons'
import {  RHFTextField, RHFCheckbox, RHFDatePicker } from '../../../components/hook-form';

const CollapsibleCheckedItemInputRow = ({value, index, toggleEdit, deleteIndex, checkParams, setValue, handleListDragStart, handleListDrop }) => {
  console.log("checkParams : ",checkParams)

  const handleChangeCheckItemListValue = (childIndex, event) => {
    console.log(" val : ",index,childIndex, event)
    const updateCheckParams = [...checkParams]
    const updateCheckParamObject = updateCheckParams[index].paramList[childIndex]
          updateCheckParamObject.value = event.target.value
    updateCheckParams[index]?.paramList.splice(childIndex, 1, updateCheckParamObject);
    setValue('checkParams',updateCheckParams)

  }
  return (
    <>
        <TableRow
                key={index}
                draggable
                onDragStart={handleListDragStart && ((e) => handleListDragStart(e, index))}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleListDrop && ((e) => handleListDrop(e, index))}
              >
              <TableCell size='small' align='left' >
                <b>{`${index+1}). `}</b>{typeof value?.paramListTitle === 'string' && value?.paramListTitle || ''}{' ( Items: '}<b>{`${value?.paramList?.length}`}</b>{' ) '}
                </TableCell>
              <TableCell size='small' align='right' >
                  {toggleEdit && <ViewFormEditDeleteButtons handleEdit={()=>toggleEdit(index)} onDelete={()=>deleteIndex(index)} /> }
              </TableCell>
        </TableRow>
        <TableRow key={uuidv4()}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Table size="small" aria-label="purchases">
                  <TableBody>
                    {value?.paramList.map((childRow,childIndex) => (
                      <TableRow key={childRow._id} >
                        <TableCell component="th" scope="row" >
                        <b>{`${childIndex+1}). `}</b>
                        {`${childRow.name}`}
                        </TableCell>
                        {( childRow?.inputType === 'String' || childRow?.inputType === 'Number' ) && <RHFTextField 
                        label={childRow?.inputType} 
                        name={childRow.name} 
                        value={checkParams[index].paramList[childIndex]?.value || ''}
                        type={childRow?.inputType === 'Number' && childRow?.inputType.toLowerCase()} 
                        onChange={(val)=>handleChangeCheckItemListValue(childIndex, val)} 
                        size="small" sx={{m:0.3}} />}
                        {childRow?.inputType === 'Boolean' && <RHFCheckbox name={childRow.name} onChange={(val)=>handleChangeCheckItemListValue(childIndex, val)}/>}
                        {childRow?.inputType === 'Date' && <RHFDatePicker name={childRow.name} label={childRow?.inputType} onChange={(val)=>handleChangeCheckItemListValue(childIndex, val)} />}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
          </TableCell>
        </TableRow>
        </>
  )
}
CollapsibleCheckedItemInputRow.propTypes = {
    index: PropTypes.number,
    value: PropTypes.object,
    checkParams: PropTypes.array,
    setValue: PropTypes.func,
    toggleEdit: PropTypes.func,
    deleteIndex: PropTypes.func,
    handleListDragStart: PropTypes.func,
    handleListDrop: PropTypes.func,
  };

export default memo(CollapsibleCheckedItemInputRow)