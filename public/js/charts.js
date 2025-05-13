const ChartUtils = (function () {
  const initializeCharts = (
    bisectionChartRef, newtonChartRef, timeChartRef, memoryChartRef,
    bisectionSteps, newtonSteps, bisectionTime, newtonTime, bisectionMemory, newtonMemory
  ) => {
    if (bisectionChartRef.current) {
      bisectionChartRef.current.destroy();
    }
    const bisectionCtx = document.getElementById('bisectionChart')?.getContext('2d');
    if (bisectionCtx && bisectionSteps.length > 0) {
      try {
        bisectionChartRef.current = new Chart(bisectionCtx, {
          type: 'line',
          data: {
            labels: bisectionSteps.map(step => step.iteration),
            datasets: [{
              label: 'Error (|f(c)|)',
              data: bisectionSteps.map(step => step.error),
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
            }],
          },
          options: {
            scales: {
              y: { 
                beginAtZero: false, 
                title: { display: true, text: 'Error', color: '#e5e7eb' },
                ticks: { color: '#e5e7eb' },
                grid: { color: '#374151' }
              },
              x: { 
                title: { display: true, text: 'Iteración', color: '#e5e7eb' },
                ticks: { color: '#e5e7eb' },
                grid: { color: '#374151' }
              },
            },
            plugins: {
              legend: { labels: { color: '#e5e7eb' } }
            }
          },
        });
      } catch (e) {
        console.error('Error al crear el gráfico de Bisección:', e);
      }
    }

    if (newtonChartRef.current) {
      newtonChartRef.current.destroy();
    }
    const newtonCtx = document.getElementById('newtonChart')?.getContext('2d');
    if (newtonCtx && newtonSteps.length > 0) {
      try {
        newtonChartRef.current = new Chart(newtonCtx, {
          type: 'line',
          data: {
            labels: newtonSteps.map(step => step.iteration),
            datasets: [{
              label: 'Error (|x_{n+1} - x_n|)',
              data: newtonSteps.map(step => step.error),
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
            }],
          },
          options: {
            scales: {
              y: { 
                beginAtZero: false, 
                title: { display: true, text: 'Error', color: '#e5e7eb' },
                ticks: { color: '#e5e7eb' },
                grid: { color: '#374151' }
              },
              x: { 
                title: { display: true, text: 'Iteración', color: '#e5e7eb' },
                ticks: { color: '#e5e7eb' },
                grid: { color: '#374151' }
              },
            },
            plugins: {
              legend: { labels: { color: '#e5e7eb' } }
            }
          },
        });
      } catch (e) {
        console.error('Error al crear el gráfico de Newton-Raphson:', e);
      }
    }

    if (timeChartRef.current) {
      timeChartRef.current.destroy();
    }
    const timeCtx = document.getElementById('timeChart')?.getContext('2d');
    if (timeCtx && (bisectionTime > 0 || newtonTime > 0)) {
      try {
        timeChartRef.current = new Chart(timeCtx, {
          type: 'bar',
          data: {
            labels: ['Bisección', 'Newton-Raphson'],
            datasets: [{
              label: 'Tiempo (ms)',
              data: [bisectionTime, newtonTime],
              backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            }],
          },
          options: {
            scales: {
              y: { 
                beginAtZero: true, 
                title: { display: true, text: 'Tiempo (ms)', color: '#e5e7eb' },
                ticks: { color: '#e5e7eb' },
                grid: { color: '#374151' }
              },
              x: { 
                ticks: { color: '#e5e7eb' },
                grid: { color: '#374151' }
              },
            },
            plugins: {
              legend: { labels: { color: '#e5e7eb' } }
            }
          },
        });
      } catch (e) {
        console.error('Error al crear el gráfico de Tiempo:', e);
      }
    }

    if (memoryChartRef.current) {
      memoryChartRef.current.destroy();
    }
    const memoryCtx = document.getElementById('memoryChart')?.getContext('2d');
    if (memoryCtx && (bisectionSteps.length > 0 || newtonSteps.length > 0)) {
      try {
        memoryChartRef.current = new Chart(memoryCtx, {
          type: 'bar',
          data: {
            labels: ['Bisección', 'Newton-Raphson'],
            datasets: [{
              label: 'Memoria (bytes)',
              data: [bisectionMemory, newtonMemory],
              backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1,
            }],
          },
          options: {
            scales: {
              y: { 
                beginAtZero: true, 
                title: { display: true, text: 'Memoria (bytes)', color: '#e5e7eb' },
                ticks: { color: '#e5e7eb' },
                grid: { color: '#374151' }
              },
              x: { 
                ticks: { color: '#e5e7eb' },
                grid: { color: '#374151' }
              },
            },
            plugins: {
              legend: { labels: { color: '#e5e7eb' } }
            }
          },
        });
      } catch (e) {
        console.error('Error al crear el gráfico de Memoria:', e);
      }
    }

    return () => {
      if (bisectionChartRef.current) bisectionChartRef.current.destroy();
      if (newtonChartRef.current) newtonChartRef.current.destroy();
      if (timeChartRef.current) timeChartRef.current.destroy();
      if (memoryChartRef.current) memoryChartRef.current.destroy();
    };
  };

  return { initializeCharts };
})();

window.ChartUtils = ChartUtils;
