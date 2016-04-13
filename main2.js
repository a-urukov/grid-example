/** @flow */
import Immutable from 'immutable'
import ReactDOM from 'react-dom'
import React, {Component, PropTypes} from 'react'
//import {ContentBox, ContentBoxHeader, ContentBoxParagraph} from './demo/ContentBox'
//import {LabeledInput, InputRow} from './demo/LabeledInput'
//import AutoSizer from './AutoSizer'
import { Grid } from 'react-virtualized'
import shallowCompare from 'react-addons-shallow-compare'
import cn from 'classnames'

function createMarkup() {
    return { __html: 'First &middot; Second' };
};

class BEMTHLCell extends Component {


    render() {
        return <span
            dangerouslySetInnerHTML={this.html}
        />
    }

    componentWillMount() {

        this.html = { __html: BEMHTML.apply({ block: 'button', content: this.props.title }) };
    }

    componentDidMount() {
        let elem = ReactDOM.findDOMNode(this);

        this.bem = $(elem.children[0]).bem('button');
    }

    componentWillUnmount() {
        BEM.DOM.destruct(this.bem.domElem);
    }
}


export default class GridExample extends Component {

    static propTypes = {
        list: PropTypes.instanceOf(Immutable.List).isRequired
    }

    constructor(props, context) {
        super(props, context)

        this.state = {
            columnsCount: 5,
            height: 300,
            overscanColumnsCount: 0,
            overscanRowsCount: 5,
            rowHeight: 40,
            rowsCount: 100,
            scrollToColumn: undefined,
            scrollToRow: undefined,
            useDynamicRowHeight: false,
            width: 600
        }

        this._getColumnWidth = this._getColumnWidth.bind(this);
        this._getRowClassName = this._getRowClassName.bind(this);
        this._getRowHeight = this._getRowHeight.bind(this);
        this._noContentRenderer = this._noContentRenderer.bind(this);
        this._onColumnsCountChange = this._onColumnsCountChange.bind(this);
        this._onRowsCountChange = this._onRowsCountChange.bind(this);
        this._onScrollToColumnChange = this._onScrollToColumnChange.bind(this);
        this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
        this._renderBodyCell = this._renderBodyCell.bind(this);
        this._renderCell = this._renderCell.bind(this);
        this._renderLeftSideCell = this._renderLeftSideCell.bind(this);
    }

    render() {
        const { list } = this.props

        const {
            columnsCount,
            height,
            overscanColumnsCount,
            overscanRowsCount,
            rowHeight,
            rowsCount,
            scrollToColumn,
            scrollToRow,
            width,
            useDynamicRowHeight
        } = this.state

        return (
            <Grid
                className={'BodyGrid'}
                columnWidth={this._getColumnWidth}
                columnsCount={columnsCount}
                height={height}
                noContentRenderer={this._noContentRenderer}
                overscanColumnsCount={overscanColumnsCount}
                overscanRowsCount={overscanRowsCount}
                renderCell={this._renderCell}
                rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
                rowsCount={rowsCount}
                scrollToColumn={scrollToColumn}
                scrollToRow={scrollToRow}
                width={width}
            />
        )
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState)
    }

    _getColumnWidth(index) {
        switch (index) {
            case 0:
                return 50
            case 1:
                return 200
            case 2:
                return 200
            case 3:
                return 150
            default:
                return 100
        }
    }

    _getDatum(index) {
        const { list } = this.props

        return list.get(index % list.size)
    }

    _getRowClassName(row) {
        return row % 2 === 0 ? 'evenRow' : 'oddRow'
    }

    _getRowHeight(index) {
        return this._getDatum(index).size
    }

    _noContentRenderer() {
        return (
            <div className={'noCells'}>
                No cells
            </div>
        )
    }

    _renderBodyCell({ columnIndex, rowIndex }) {
        const rowClass = this._getRowClassName(rowIndex)
        const datum = this._getDatum(rowIndex)

        let content

        switch (columnIndex) {
            case 1:
                content = datum.title;
                break
            case 2:
                content = 'Номер: ' + datum.num;
                break
            case 3:
                content = <BEMTHLCell
                    title = {datum.title}
                />
                break
            default:
                content = `${rowIndex}, ${columnIndex}`
                break
        }

        const classNames = cn(rowClass, 'cell', {
            ['enteredCell']: columnIndex > 2
        })

        return (
            <div className={classNames}>
                {content}
            </div>
        )
    }

    _renderCell({ columnIndex, rowIndex }) {
        if (columnIndex === 0) {
            return this._renderLeftSideCell({ columnIndex, rowIndex })
        } else {
            return this._renderBodyCell({ columnIndex, rowIndex })
        }
    }

    _renderLeftSideCell({ rowIndex }) {
        const datum = this._getDatum(rowIndex)

        const classNames = cn('cell', 'letterCell')
        const style = { backgroundColor: datum.color }

        return (
            <div
                className={classNames}
                style={style}
            >
                {rowIndex}
            </div>
        )
    }

    _updateUseDynamicRowHeights(value) {
        this.setState({
            useDynamicRowHeight: value
        })
    }

    _onColumnsCountChange(event) {
        const columnsCount = parseInt(event.target.value, 10) || 0

        this.setState({ columnsCount })
    }

    _onRowsCountChange(event) {
        const rowsCount = parseInt(event.target.value, 10) || 0

        this.setState({ rowsCount })
    }

    _onScrollToColumnChange(event) {
        const { columnsCount } = this.state
        let scrollToColumn = Math.min(columnsCount - 1, parseInt(event.target.value, 10))

        if (isNaN(scrollToColumn)) {
            scrollToColumn = undefined
        }

        this.setState({ scrollToColumn })
    }

    _onScrollToRowChange(event) {
        const { rowsCount } = this.state
        let scrollToRow = Math.min(rowsCount - 1, parseInt(event.target.value, 10))

        if (isNaN(scrollToRow)) {
            scrollToRow = undefined
        }

        this.setState({ scrollToRow })
    }
}
