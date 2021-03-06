import React from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import Button from '../buttons/button'

import './search_item.css'

const SearchItem = ({
    item,
    selected = true,
    onClick,
    onShowPreviewClick,
    withPreview,
    className = ''
}) => {
    const itemClasses = classnames('search-list-item', {
        'search-list-item--selected': selected
    })

    return (
        <div className={itemClasses + ' ' + className} onClick={onClick}>
            {item.name}
            <Button
                onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.nativeEvent &&
                        e.nativeEvent.stopImmediatePropagation &&
                        e.nativeEvent.stopImmediatePropagation()
                    onShowPreviewClick()
                }}
                label={withPreview ? 'Hide preview' : 'Show preview'}
            />
        </div>
    )
}

SearchItem.propTypes = {
    item: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
    selected: PropTypes.bool,
    withPreview: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired
}

export default SearchItem
