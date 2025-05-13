const { useState, useEffect, useRef } = React;
const { bisectionMethod, newtonRaphsonMethod } = window.NonlinearMethods;
const { initializeCharts } = window.ChartUtils;

function App() {
  const [equation, setEquation] = useState('');
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [initialGuess, setInitialGuess] = useState('');
  const [tolerance, setTolerance] = useState('0.0001');
  const [maxIterations, setMaxIterations] = useState('100');
  const [bisectionSteps, setBisectionSteps] = useState([]);
  const [newtonSteps, setNewtonSteps] = useState([]);
  const [error, setError] = useState('');
  const [bisectionTime, setBisectionTime] = useState(0);
  const [newtonTime, setNewtonTime] = useState(0);
  const [bisectionMemory, setBisectionMemory] = useState(0);
  const [newtonMemory, setNewtonMemory] = useState(0);
  const [memoryApiAvailable, setMemoryApiAvailable] = useState(!!performance.memory);

  const bisectionChartRef = useRef(null);
  const newtonChartRef = useRef(null);
  const timeChartRef = useRef(null);
  const memoryChartRef = useRef(null);

  const handleCalculate = async () => {
    setError('');
    try {
      await bisectionMethod(setError, setBisectionSteps, setBisectionTime, setBisectionMemory, equation, a, b, tolerance, maxIterations);
      if (!error) {
        await newtonRaphsonMethod(setError, setNewtonSteps, setNewtonTime, setNewtonMemory, equation, initialGuess, tolerance, maxIterations);
      }
    } catch (e) {
      setError('Error al calcular: ' + e.message);
    }
  };

  const generateRandomEquation = () => {
    const equations = [
      { expr: 'x^3 - x - 2', a: 1, b: 2, initialGuess: 1.5 },
      { expr: 'sin(x) - x/2', a: 1, b: 2, initialGuess: 1.8 },
      { expr: 'e^x - 3x', a: 0, b: 1, initialGuess: 0.5 },
      { expr: 'x^2 - 4', a: 1, b: 3, initialGuess: 2 },
      { expr: 'cos(x) - x', a: 0, b: 1, initialGuess: 0.7 },
      { expr: 'x^3 - 2x^2 + x - 1', a: 1, b: 2, initialGuess: 1.4 },
      { expr: 'log(x) + x - 2', a: 1, b: 2, initialGuess: 1.5 },
      { expr: 'x^4 - 5x^2 + 4', a: 1, b: 2, initialGuess: 1.5 },
    ];
    const tolerances = ['0.0001', '0.001', '0.00001'];
    const maxIters = ['50', '100', '200'];

    const randomEq = equations[Math.floor(Math.random() * equations.length)];
    const randomTol = tolerances[Math.floor(Math.random() * tolerances.length)];
    const randomIter = maxIters[Math.floor(Math.random() * maxIters.length)];

    setEquation(randomEq.expr);
    setA(randomEq.a.toString());
    setB(randomEq.b.toString());
    setInitialGuess(randomEq.initialGuess.toString());
    setTolerance(randomTol);
    setMaxIterations(randomIter);
    setError('');
  };

  const clearForm = () => {
    setEquation('');
    setA('');
    setB('');
    setInitialGuess('');
    setTolerance('0.0001');
    setMaxIterations('100');
    setBisectionSteps([]);
    setNewtonSteps([]);
    setError('');
    setBisectionTime(0);
    setNewtonTime(0);
    setBisectionMemory(0);
    setNewtonMemory(0);
  };

  useEffect(() => {
    return initializeCharts(
      bisectionChartRef, newtonChartRef, timeChartRef, memoryChartRef,
      bisectionSteps, newtonSteps, bisectionTime, newtonTime, bisectionMemory, newtonMemory
    );
  }, [bisectionSteps, newtonSteps, bisectionTime, newtonTime, bisectionMemory, newtonMemory]);

  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="max-w-6xl mx-auto p-8 bg-gray-800 rounded-2xl shadow-2xl text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              Ecuación f(x)
              <span className="ml-2 relative group">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute left-0 top-6 w-64 p-3 bg-gray-700 text-gray-200 text-xs rounded-lg shadow-lg hidden group-hover:block transition-opacity duration-300">
                  Ingresa la ecuación no lineal que deseas resolver, como x^3 - x - 2. Usa ^ para exponentes, * para multiplicación, y funciones como sin(x), cos(x), log(x).
                </span>
              </span>
            </label>
            <input
              type="text"
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              placeholder="Ej: x^3 - x - 2"
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              Tolerancia
              <span className="ml-2 relative group">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute left-0 top-6 w-64 p-3 bg-gray-700 text-gray-200 text-xs rounded-lg shadow-lg hidden group-hover:block transition-opacity duration-300">
                  Define la precisión deseada para la solución. Un valor pequeño como 0.0001 significa mayor precisión.
                </span>
              </span>
            </label>
            <input
              type="number"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              Iteraciones Máximas
              <span className="ml-2 relative group">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute left-0 top-6 w-64 p-3 bg-gray-700 text-gray-200 text-xs rounded-lg shadow-lg hidden group-hover:block transition-opacity duration-300">
                  Número máximo de iteraciones antes de detener el cálculo. Un valor como 100 evita bucles infinitos.
                </span>
              </span>
            </label>
            <input
              type="number"
              value={maxIterations}
              onChange={(e) => setMaxIterations(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              Intervalo [a, b] (Bisección)
              <span className="ml-2 relative group">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute left-0 top-6 w-64 p-3 bg-gray-700 text-gray-200 text-xs rounded-lg shadow-lg hidden group-hover:block transition-opacity duration-300">
                  Extremos del intervalo para el método de Bisección. Deben cumplir que f(a) por f(b) sea menor que 0.
                </span>
              </span>
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="a"
                className="w-1/2 p-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="b"
                className="w-1/2 p-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
              Aproximación Inicial (Newton-Raphson)
              <span className="ml-2 relative group">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="absolute left-0 top-6 w-64 p-3 bg-gray-700 text-gray-200 text-xs rounded-lg shadow-lg hidden group-hover:block transition-opacity duration-300">
                  Valor inicial para el método de Newton-Raphson. Elige un valor cercano a la raíz para una convergencia rápida.
                </span>
              </span>
            </label>
            <input
              type="number"
              value={initialGuess}
              onChange={(e) => setInitialGuess(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700/50 text-white focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
        </div>
        <div className="flex space-x-4 mb-8">
          <button
            onClick={handleCalculate}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition duration-300 shadow-md hover:shadow-xl"
          >
            Calcular
          </button>
          <button
            onClick={generateRandomEquation}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition duration-300 shadow-md hover:shadow-xl"
          >
            Ecuación Aleatoria
          </button>
          <button
            onClick={clearForm}
            className="px-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition duration-300 shadow-md hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        {error && <p className="text-red-400 text-center text-lg font-medium mb-8">{error}</p>}
        {(bisectionSteps.length > 0 || newtonSteps.length > 0) && (
          <div className="mt-10 fade-in">
            <h2 className="text-2xl font-semibold text-sky-300 mb-8">Resultados</h2>
            <div className="space-y-12">
              {bisectionSteps.length > 0 && (
                <div className="bg-gray-700/50 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-medium text-gray-200 mb-6">Método de Bisección</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-600/50 rounded-lg">
                      <thead>
                        <tr className="bg-gray-800/50">
                          <th className="py-3 px-4 text-gray-200">Iteración</th>
                          <th className="py-3 px-4 text-gray-200">a</th>
                          <th className="py-3 px-4 text-gray-200">b</th>
                          <th className="py-3 px-4 text-gray-200">c</th>
                          <th className="py-3 px-4 text-gray-200">f(c)</th>
                          <th className="py-3 px-4 text-gray-200">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bisectionSteps.map((step) => (
                          <tr key={step.iteration} className="hover:bg-gray-500/50 transition duration-200">
                            <td className="py-3 px-4 text-gray-300">{step.iteration}</td>
                            <td className="py-3 px-4 text-gray-300">{step.a}</td>
                            <td className="py-3 px-4 text-gray-300">{step.b}</td>
                            <td className="py-3 px-4 text-gray-300">{step.c}</td>
                            <td className="py-3 px-4 text-gray-300">{step.fc}</td>
                            <td className="py-3 px-4 text-gray-300">{step.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <canvas id="bisectionChart" className="mt-6"></canvas>
                </div>
              )}
              {newtonSteps.length > 0 && (
                <div className="bg-gray-700/50 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-medium text-gray-200 mb-6">Método de Newton-Raphson</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-600/50 rounded-lg">
                      <thead>
                        <tr className="bg-gray-800/50">
                          <th className="py-3 px-4 text-gray-200">Iteración</th>
                          <th className="py-3 px-4 text-gray-200">x</th>
                          <th className="py-3 px-4 text-gray-200">f(x)</th>
                          <th className="py-3 px-4 text-gray-200">f'(x)</th>
                          <th className="py-3 px-4 text-gray-200">x siguiente</th>
                          <th className="py-3 px-4 text-gray-200">Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newtonSteps.map((step) => (
                          <tr key={step.iteration} className="hover:bg-gray-500/50 transition duration-200">
                            <td className="py-3 px-4 text-gray-300">{step.iteration}</td>
                            <td className="py-3 px-4 text-gray-300">{step.x}</td>
                            <td className="py-3 px-4 text-gray-300">{step.fx}</td>
                            <td className="py-3 px-4 text-gray-300">{step.dfx}</td>
                            <td className="py-3 px-4 text-gray-300">{step.xNext}</td>
                            <td className="py-3 px-4 text-gray-300">{step.error}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <canvas id="newtonChart" className="mt-6"></canvas>
                </div>
              )}
              {(bisectionTime > 0 || newtonTime > 0 || bisectionSteps.length > 0 || newtonSteps.length > 0) && (
                <div className="bg-gray-700/50 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-medium text-gray-200 mb-6">Métricas de Rendimiento</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-300 mb-4">Tiempo de Ejecución</h4>
                      <canvas id="timeChart"></canvas>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-300 mb-4">Memoria Usada</h4>
                      {!memoryApiAvailable && (
                        <p className="text-yellow-400 text-sm mb-4">
                          Nota: La API de memoria no está disponible en este navegador. Los valores son simulados.
                        </p>
                      )}
                      <canvas id="memoryChart"></canvas>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        <footer className="text-center text-sky-300 mt-5">
          Realizado por: Nestor Fabian Cabrera - Alvaro Andrés Mejía
        </footer>
      </div>
    </div>
  );
}

window.App = App;
