import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './bookingsChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Your bookings',
    },
  },
};

const BOOKINGS_BUCKET = {
  Cheap: {
    min: 0,
    max: 100,
  },
  Normal: {
    min: 100,
    max: 200,
  },
  Expensive: {
    min: 200,
    max: 1000000,
  },
};

const BookingsChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKINGS_BUCKET) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKINGS_BUCKET[bucket].min &&
        current.event.price < BOOKINGS_BUCKET[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      label: bucket,
      fillColor: 'rgba(220, 220, 220, 0.5)',
      strokeColor: 'rgba(220, 220, 220, 0.8)',
      highlightFeel: 'rgba(220, 220, 220, 0.75)',
      highlightStroke: 'rgba(220, 220, 220, 1)',
      data: values,
    });
      values = [...values];
      values[values.length - 1] = 0;
  }

    return (
      <div className='chart-container'>
        <Bar data={chartData} options={options} />
      </div>
    );
};

export default BookingsChart;
