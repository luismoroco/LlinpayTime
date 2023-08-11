import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axios from 'axios';

const AreaChartC = ({ station, vari }) => {
  const [info, setInfo] = useState([]);
  const [arr, setArr] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await axios.get(
        `http://127.0.0.1:5000/nan_info/${station}`
      );

      setInfo(data.data.nan_counts);
    }

    if (station && vari) {
      fetch();
    }
  }, [station, vari]);


  useEffect(() => {
    if (info && vari) {
      const item = info.find(x => x.variable == vari);
      if (item) {
        setArr(item.nan_counts_by_year);
      }
    }
  }, [info, station, vari]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={300}
        data={arr}
        margin={{
          top: 15,
          right: 30,
          left: 0,
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
          {`${station}-${vari}`}
        </text>

        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 9, angle: -45, textAnchor: 'end' }}
          interval={0}
        />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="nan_count" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AreaChartC;
