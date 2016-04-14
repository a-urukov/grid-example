import React from 'react';
import ReactDOM from 'react-dom';
import GridExample from './main2.js';
import Immutable from 'immutable';
import apiManager from './app/service/apiManager'

// Grid data as an array of arrays
let list = Immutable.List((function() {
        const count = 100;
        let res = [];

        for (let i = 0; i < count; i++) {
            res.push({
                title: 'Кампан1ия №' + (i + 1),
                num: Math.round(Math.random() * 10e7),
                ctr: Math.random(),
                color: '#' + i + '22' + i
            });
        }

        return res;
    }()));

// Render your grid
ReactDOM.render(
    <GridExample
        list = {list}
    />,
    document.getElementById('example')
);
