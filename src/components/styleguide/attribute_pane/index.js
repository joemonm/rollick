import React from 'react'
import {
    isFunctionProp,
    isObjectProp,
    isBoolProp
} from '../../../component_maker_helpers/prop_value_from_string.js'
import './attribute_pane.css'
import Textarea from 'node_modules/react-textarea-autosize/dist/react-textarea-autosize.min.js'

// This function exists to convert between some javascript values to values which can be put inside some input component
// E.g. if some prop is a function, We need to convert it to a string before putting it inside a textarea
// Similarly, if the prop is an object, it would should up like [Object Object] if we don't do a JSON.stringify of the object
function serialize(propsMeta, fakeProps) {
    return Object.keys(fakeProps).reduce((acc, propName) => {
        if (isFunctionProp(propsMeta[propName])) {
            return {
                ...acc,
                [propName]: fakeProps[propName].toString()
            }
        } else if (isObjectProp(propsMeta[propName])) {
            return {
                ...acc,
                [propName]: JSON.stringify(fakeProps[propName], null, 4)
            }
        } else {
            return {
                ...acc,
                [propName]: fakeProps[propName]
            }
        }
    }, {})
}
function getTextArea(value, onChangeHandler) {
    return (
        <Textarea
            onChange={e => onChangeHandler(e.target.value)}
            value={value}
            maxRows={10}
            style={{
                fontSize: 'inherit',
                border: '1px solid gray',
                borderRadius: 5,
                padding: '0.1em',
                width: '100%'
            }}
        />
    )
}

function getInputField(propsMeta, value, onChangeHandler) {
    if (isBoolProp(propsMeta)) {
        return (
            <input
                type="checkbox"
                checked={value && value.toString() === 'true'}
                onChange={e => onChangeHandler(e.target.checked)}
            />
        )
    } else {
        return getTextArea(value, onChangeHandler)
    }
}

export default class AttributePane extends React.Component {
    handlePropChange = (propName, newValue) => {
        this.setState({
            props: {
                ...this.state.props,
                [propName]: newValue
            }
        })
        this.props.onChange(propName, newValue)
    }

    getAttributes = () => {
        const { component } = this.props

        if (!component) {
            return null
        } else {
            return Object.keys(component.props).map(propName => {
                return (
                    <div className="form-row" key={`attribute_${propName}`}>
                        <span style={{ flex: 1 }}>
                            {propName}
                        </span>
                        <div style={{ flex: 3, width: '100%' }}>
                            {getInputField(
                                component.props[propName],
                                this.state.props[propName],
                                this.handlePropChange.bind(this, propName)
                            )}
                        </div>
                    </div>
                )
            })
        }
    }

    constructor(props) {
        super(props)

        this.state = {
            props: this.props.component
                ? serialize(
                      this.props.component.props,
                      this.props.component.fakeProps
                  )
                : {}
        }
    }

    componentWillReceiveProps(nextProps) {
        // if this rerender is due to a new component being selected, let's rehydrate the state using the serialize function
        if (
            nextProps.component &&
            this.props.component &&
            nextProps.component.path !== this.props.component.path
        ) {
            this.setState({
                props: nextProps.component
                    ? serialize(
                          nextProps.component.props,
                          nextProps.component.fakeProps
                      )
                    : {}
            })
        }
    }

    render() {
        const detailsPaneStyle = {
            flex: 2,
            padding: '1em',
            borderLeft: '1px solid rgba(200,200,200, 0.9)',
            maxHeight: '100%',
            overflow: 'hidden',
            overflowY: 'auto'
        }

        return (
            <div className="styleguide-details-pane" style={detailsPaneStyle}>
                <div style={{ marginBottom: '1em' }}>
                    <h3
                        style={{
                            paddingBottom: '0.5em',
                            borderBottom: '1px solid rgba(200,200,200,0.9)'
                        }}
                    >
                        Attributes
                    </h3>
                </div>
                <div>
                    {this.getAttributes()}
                </div>
            </div>
        )
    }
}