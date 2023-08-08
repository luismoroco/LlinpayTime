import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';


const Barchart = ({station_name, data}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        stackOffset="sign"
        margin={{
          top: 15,
          right: 30,
          left: 10,
          bottom: 0,
        }} 
      >
 
        <text
          x={300}         
          y={7}          
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="bold"
          fontSize="16"
        >
          {station_name}
        </text>

        <CartesianGrid />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 10, angle: -90, textAnchor: 'end' }}
          interval={0}
        />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="percent_nan" fill="#2987ba" stackId="stack" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Barchart;