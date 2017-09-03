import React from 'react'
import PropTypes from 'prop-types'
import SearchResults from './search_results'
import SearchInput from './search_input'
import classnames from 'classnames'
import deboune from 'debounce'
import key from 'keymaster'
import './search_box.css'

function stopAllPropagations(e) {
    e && e.nativeEvent && e.nativeEvent.stopImmediatePropagation()
    e.preventDefault()
    e.stopPropagation()
}

class SearchBox extends React.Component {
    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    handleItemClick = item => {
        this.props.onSelection(item)
    }

    handleContainerKeyDown = e => {
        const keyCode = e.keyCode || e.which
        switch (keyCode) {
            case 27: // esc key
                stopAllPropagations(e)
                this.setState({ searchText: '', selectedItemIndex: -1 })
                this.props.onRequestClose()
                break
        }
    }

    handleKeyDown = e => {
        const keyCode = e.keyCode || e.which
        switch (keyCode) {
            case 13: // enter key
                if (this.state.selectedItemIndex >= 0) {
                    stopAllPropagations(e)
                    this.setState({ searchText: '', selectedItemIndex: 0 })
                    this.props.onSelection(
                        this.getFilteredComponents()[
                            this.state.selectedItemIndex
                        ]
                    )
                }
                break
            case 40: // down arrow
                stopAllPropagations(e)
                this.setState({
                    selectedItemIndex:
                        (this.state.selectedItemIndex + 1) %
                        this.getFilteredComponents().length
                })
                break
            case 38: // up arrow
                stopAllPropagations(e)
                this.setState(
                    {
                        selectedItemIndex:
                            (this.getFilteredComponents().length +
                                this.state.selectedItemIndex -
                                1) %
                            this.getFilteredComponents().length
                    },
                    () =>
                        console.log(
                            'next selected index',
                            this.state.selectedItemIndex
                        )
                )
                break
        }
    }

    getFilteredComponents = () => {
        const { searchText } = this.state

        if (searchText.trim() === '') {
            return []
        } else {
            return this.props.items.filter(
                item =>
                    item.name
                        .toLowerCase()
                        .indexOf(searchText.toLowerCase().trim()) >= 0
            )
        }
    }

    handleShowPreviewClick = item => {
        console.log('show preview for', item)
    }

    getInput = () => {
        const { searchText } = this.state

        const inputClassnames = classnames('search-modal-input', {
            'with-results': this.getFilteredComponents().length > 0
        })

        return (
            <SearchInput
                ref={node => (this.searchInputRef = node)}
                onKeyDown={this.handleKeyDown}
                className={inputClassnames}
                value={searchText}
                onChange={this.handleInputChange}
                placeholder="Search Component (Command + i)"
            />
        )
    }

    constructor(props) {
        super(props)

        this.state = {
            searchText: '',
            selectedItemIndex: -1
        }
        this.searchInputRef = null
    }

    componentDidMount() {
        key('esc', this.handleContainerKeyDown)
        setTimeout(() => {
            this.searchInputRef && this.searchInputRef.getInputRef().focus()
        }, 250)
    }

    render() {
        const { onRequestClose, isOpen } = this.props
        const { selectedItemIndex } = this.state

        return (
            <div>
                {this.getInput()}
                <SearchResults
                    items={this.getFilteredComponents()}
                    selectedItemIndex={selectedItemIndex}
                    onItemClick={this.handleItemClick}
                    onShowPreviewClick={this.handleShowPreviewClick}
                />
            </div>
        )
    }
}

SearchBox.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            path: PropTypes.string
        })
    ).isRequired,
    onSelection: PropTypes.func.isRequired,
    onRequestClose: PropTypes.func.isRequired
}

export default SearchBox
