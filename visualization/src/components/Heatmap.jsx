import React from 'react';
import { Chart, Axis, Tooltip, Coord, Guide, Polygon } from 'viser-react';

const values = ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'];

const generateRandomData = () => {
  const data = [];
  for (let week = 0; week < values.length; week++) {
    for (let time = 0; time < 24; time++) {
      data.push({
        week: values[week],
        time: `${time}:00`,
        value: Math.floor(Math.random() * 100),
      });
    } 
  }
  return data;
};

const HeatmapC = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const generatedData = generateRandomData();
    setData(generatedData);
  }, []);

  return (
    <div>
      <Chart forceFit height={400} padding={40} data={data}>
        <Tooltip showTitle={null} />
        <Coord type="polar" innerRadius={0.2} />
        <Axis dataKey="week" grid={null} line={null} tickLine={null} label={null} />
        <Axis dataKey="time" grid={null} line={null} tickLine={null} label={{ offset: 3 }} />
        <Polygon
          position="time*week"
          color={['value', '#BAE7FF-#1890FF-#0050B3']}
          tooltip="week*time*value"
          style={{
            stroke: '#fff',
            lineWidth: 1,
          }}
        />
        {values.map((val, idx) => {
          const position = [0, idx];
          const content = val;

          return (
            <Guide
              key={val}
              type="text"
              top={true}
              position={position}
              content={val}
              style={{
                fill: '#fff',
                textAlign: 'center',
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, .45)',
              }}
            />
          );
        })}
      </Chart>
    </div>
  );
};

export default HeatmapC;
