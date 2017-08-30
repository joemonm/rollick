import React from 'react'
import Modal from 'node_modules/react-modal/dist/react-modal.js'
import SearchResults from './search_results'
import classnames from 'classnames'
import deboune from 'debounce'
import 'src/components/search_modal.css'

function stopAllPropagations(e) {
    e.nativeEvent.stopImmediatePropagation()
    e.preventDefault()
    e.stopPropagation()
}

export default class SearchModal extends React.Component {
    handleInputChange = e => {
        this.setState({ searchText: e.target.value })
    }

    handleItemClick = item => {
        this.props.onSelection(item)
    }

    handleKeypress = e => {
        const keyCode = e.keyCode || e.which
        switch (keyCode) {
            case 13: // enter key
                if (this.state.selectedItemIndex >= 0) {
                    stopAllPropagations(e)
                    this.props.onSelection(
                        this.getFilteredComponents()[
                            this.state.selectedItemIndex
                        ]
                    )
                }
                break
            case 27: // esc key
                stopAllPropagations(e)
                this.props.onRequestClose()
                break
            case 40: // down arrow
                stopAllPropagations(e)
                this.setState(
                    {
                        selectedItemIndex:
                            (this.state.selectedItemIndex + 1) %
                            this.getFilteredComponents().length
                    },
                    () =>
                        console.log(
                            'next selected index',
                            this.state.selectedItemIndex
                        )
                )
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

    constructor(props) {
        super(props)

        this.state = {
            searchText: '',
            selectedItemIndex: -1
        }
        this.searchInputRef = null
    }

    render() {
        const { onRequestClose } = this.props
        const { searchText, selectedItemIndex } = this.state

        const modalStyle = {
            content: {
                top: '20%',
                left: 'calc((100vw - 500px)/2)',
                width: 500,
                border: 'none',
                background: 'none'
            }
        }

        const inputClassnames = classnames('search-modal-input', {
            'with-results': this.getFilteredComponents().length > 0
        })

        return (
            <div>
                <Modal
                    isOpen={true}
                    onAfterOpen={() => {
                        this.searchInputRef && this.searchInputRef.focus()
                    }}
                    onRequestClose={onRequestClose}
                    style={modalStyle}
                    contentLabel="Search Components"
                >
                    <input
                        ref={input => (this.searchInputRef = input)}
                        onKeyDown={this.handleKeypress}
                        className={inputClassnames}
                        value={searchText}
                        onChange={this.handleInputChange}
                        placeholder="Search Component"
                    />
                    <SearchResults
                        items={this.getFilteredComponents()}
                        selectedItemIndex={selectedItemIndex}
                        onItemClick={this.handleItemClick}
                    />
                </Modal>
            </div>
        )
    }
}
