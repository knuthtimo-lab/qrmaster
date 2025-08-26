import { ChartConfiguration } from 'chart.js';

export const defaultChartOptions: Partial<ChartConfiguration['options']> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: '#f3f4f6',
      },
      beginAtZero: true,
    },
  },
};

export function createLineChartConfig(labels: string[], data: number[], label: string): ChartConfiguration {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: '#2563eb',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      ...defaultChartOptions,
      plugins: {
        ...(defaultChartOptions?.plugins || {}),
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
    },
  };
}

export function createBarChartConfig(labels: string[], data: number[], label: string): ChartConfiguration {
  return {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          backgroundColor: '#2563eb',
          borderRadius: 4,
        },
      ],
    },
    options: {
      ...defaultChartOptions,
      plugins: {
        ...(defaultChartOptions?.plugins || {}),
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
    },
  };
}