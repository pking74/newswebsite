'use client';

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  ChartOptions,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import type { HourlyPoint } from '@/lib/weather';

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
);

type Props = {
  points: HourlyPoint[];
};

export function HourlyTempChart({ points }: Props) {
  const chartData = {
    labels: points.map((p) => p.time),
    datasets: [
      {
        label: 'Temperature (°F)',
        data: points.map((p) => p.temperatureF),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          title: (context) => {
            const date = new Date(context[0].label);
            return date.toLocaleString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            });
          },
          label: (context) => {
            return `Temperature: ${context.parsed.y}°F`;
          },
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'MMM d, ha',
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°F)',
        },
        ticks: {
          callback: (value) => `${value}°F`,
        },
      },
    },
  };

  return (
    <div className="w-full" style={{ height: '500px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
