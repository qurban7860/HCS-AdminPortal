import './MentionList.css'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const MentionList = forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    console.log({ props })
    const selectItem = index => {
        const item = props?.items[index]

        if (item) {
            props?.command({ id: item })
        }
    }

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
    }

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length)
    }

    const enterHandler = () => {
        selectItem(selectedIndex)
    }

    useEffect(() => setSelectedIndex(0), [props?.items])

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
        },
    }))

    return (
        <div className="dropdown-menu">
            {props?.items?.length
                ? props?.items.map((item, index) => (
                    <button
                        type="button"
                        className={index === selectedIndex ? 'is-selected' : ''}
                        key={index}
                        onClick={() => selectItem(index)}
                    >
                        {item}
                    </button>
                ))
                : <div className="item">No result</div>
            }
        </div>
    )
})

MentionList.propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    command: PropTypes.func.isRequired,
}

export default MentionList
