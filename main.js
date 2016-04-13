import React from 'react';
import ReactDOM from 'react-dom';
import GridExample from './main2.js';

// Grid data as an array of arrays
const list = [
    ['Brian Vaughn', 'Software Engineer', 'Sunnyvale', 'CA', 94086 /* ... */]
    // And so on...
];

// Render your grid
ReactDOM.render(
    <GridExample
        width={300}
        height={300}
        columnWidth={100}
        rowHeight={30}
        columnsCount={list.length}
        rowsCount={list.length}
        renderCell={({ columnIndex, rowIndex }) => list[rowIndex][columnIndex]}
    />,
    document.getElementById('example')
);
