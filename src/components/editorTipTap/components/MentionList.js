import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'
import { Paper, MenuList, MenuItem, Typography } from '@mui/material'

const MentionList = forwardRef(({ items, command }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)

    const selectItem = (index) => {
        const item = items[index]
        if (item) {
            command({
                id: item._id,
                label: `@${item.firstName} ${item?.lastName || ""} (${item.email})`,
                email: item.email,
            })
        }
    }

    const upHandler = () => {
        setSelectedIndex((prev) => (prev + items.length - 1) % items.length)
    }

    const downHandler = () => {
        setSelectedIndex((prev) => (prev + 1) % items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => {
        setSelectedIndex(0)
    }, [items])

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler()
                return true
            }

            if (event.key === 'ArrowDown') {
                downHandler()
                return true
            }

            if (event.key === 'Enter') {
                enterHandler()
                return true
            }

            return false
        }
    }))

    return (
        <Paper sx={{ maxHeight: 300, overflowY: 'auto', width: 'auto' }}>
            <MenuList autoFocus>
                {items.length ? items.map((item, index) => {
                    const fullName = `${item.firstName} ${item.lastName || ''}`.trim()
                    return (
                        <MenuItem
                            key={index}
                            selected={index === selectedIndex}
                            onClick={() => selectItem(index)}
                        >
                            <Typography variant="body2">
                                {fullName} {item?.email?.trim() && `(${item?.email})`}
                            </Typography>
                        </MenuItem>
                    )
                }) : (
                    <MenuItem disabled>
                        <Typography variant="body2" color="text.secondary">
                            No results
                        </Typography>
                    </MenuItem>
                )}
            </MenuList>
        </Paper>
    )
})

MentionList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    command: PropTypes.func.isRequired,
}

export default MentionList
