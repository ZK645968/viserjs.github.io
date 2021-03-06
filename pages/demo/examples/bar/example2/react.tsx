import { Chart, Tooltip, Axis, Legend, Bar } from 'viser-react';
import * as React from 'react';
const DataSet = require('@antv/data-set');

const sourceData = [
  { name: 'London', 'Jan.': 18.9, 'Feb.': 28.8, 'Mar.': 39.3, 'Apr.': 81.4, 'May': 47, 'Jun.': 20.3, 'Jul.': 24, 'Aug.': 35.6 },
  { name: 'Berlin', 'Jan.': 12.4, 'Feb.': 23.2, 'Mar.': 34.5, 'Apr.': 99.7, 'May': 52.6, 'Jun.': 35.5, 'Jul.': 37.4, 'Aug.': 42.4 },
];

const dv = new DataSet.View().source(sourceData);
dv.transform({
  type: 'fold',
  fields: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.'],
  key: '月份',
  value: '月均降雨量',
});
const data = dv.rows;

export default class App extends React.Component {
  render() {
    return (
      <Chart forceFit height={400} data={data}>
        <Tooltip />
        <Axis />
        <Legend />
        <Bar position="月份*月均降雨量" color="name" adjust={[{ type: 'dodge', marginRatio: 1 / 32 }]} />
      </Chart>
    );
  }
}

