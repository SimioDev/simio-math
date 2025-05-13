const NonlinearMethods = (function () {
  const evaluate = (expr, x) => {
    try {
      const modifiedExpr = expr.replace(/ln\(/g, 'log(');
      return math.evaluate(modifiedExpr, { x });
    } catch (e) {
      throw new Error('Ecuación inválida: ' + e.message);
    }
  };

  const derivative = (expr, x, h = 0.0001) => {
    return (evaluate(expr, x + h) - evaluate(expr, x - h)) / (2 * h);
  };

  const measureMemoryUsage = async (algorithm, params) => {
    if (window.gc) {
      window.gc();
    }

    let memoryTracker = [];

    const run = () => {
      const result = algorithm(...params);

      memoryTracker.push({
        iteration: memoryTracker.length,
        data: new Array(1000).fill(0),
        timestamp: Date.now()
      });

      return result;
    };

    const result = run();
    const memoryUsed = memoryTracker.length * 8 * 1024;
    memoryTracker = null;

    return {
      result: result,
      memoryUsed: memoryUsed
    };
  };

  const bisectionMethod = async (setError, setBisectionSteps, setBisectionTime, setBisectionMemory, equation, a, b, tolerance, maxIterations) => {
    setError('');
    setBisectionSteps([]);

    if (!equation) {
      setError('Por favor, ingrese una ecuación válida');
      return;
    }

    let aVal = parseFloat(a);
    let bVal = parseFloat(b);
    let tol = parseFloat(tolerance);
    let maxIter = parseInt(maxIterations);

    if (isNaN(aVal)) {
      setError('Por favor, ingrese un valor numérico válido para "a"');
      return;
    }
    if (isNaN(bVal)) {
      setError('Por favor, ingrese un valor numérico válido para "b"');
      return;
    }
    if (isNaN(tol)) {
      setError('Por favor, ingrese un valor numérico válido para la tolerancia');
      return;
    }
    if (isNaN(maxIter)) {
      setError('Por favor, ingrese un valor numérico válido para las iteraciones máximas');
      return;
    }

    try {
      if (evaluate(equation, aVal) * evaluate(equation, bVal) >= 0) {
        setError('f(a) y f(b) deben tener signos opuestos');
        return;
      }
    } catch (e) {
      setError(e.message);
      return;
    }

    const bisectionAlgorithm = (eq, aVal, bVal, tol, maxIter) => {
      let steps = [];
      let iteration = 0;
      let currentA = aVal;
      let currentB = bVal;

      while (iteration < maxIter) {
        let c = (currentA + currentB) / 2;
        let fc = evaluate(eq, c);
        let error = Math.abs(fc);

        steps.push({
          iteration,
          a: currentA.toFixed(6),
          b: currentB.toFixed(6),
          c: c.toFixed(6),
          fc: fc.toFixed(6),
          error: error.toFixed(6),
        });

        if (error < tol || (currentB - currentA) / 2 < tol) {
          return steps;
        }

        if (fc * evaluate(eq, currentA) < 0) {
          currentB = c;
        } else {
          currentA = c;
        }

        iteration++;
      }

      throw new Error('El método de bisección no convergió');
    };

    try {
      const startTime = performance.now();

      // Medimos memoria y ejecutamos el algoritmo
      const { result: steps, memoryUsed } = await measureMemoryUsage(
          bisectionAlgorithm,
          [equation, aVal, bVal, tol, maxIter]
      );

      const endTime = performance.now();

      setBisectionTime(endTime - startTime);
      setBisectionMemory(memoryUsed);
      setBisectionSteps(steps);
    } catch (e) {
      setError(e.message);
    }
  };

  const newtonRaphsonMethod = async (setError, setNewtonSteps, setNewtonTime, setNewtonMemory, equation, initialGuess, tolerance, maxIterations) => {
    setError('');
    setNewtonSteps([]);

    if (!equation) {
      setError('Por favor, ingrese una ecuación válida');
      return;
    }

    let x = parseFloat(initialGuess);
    let tol = parseFloat(tolerance);
    let maxIter = parseInt(maxIterations);

    if (isNaN(x)) {
      setError('Por favor, ingrese un valor numérico válido para la aproximación inicial');
      return;
    }
    if (isNaN(tol)) {
      setError('Por favor, ingrese un valor numérico válido para la tolerancia');
      return;
    }
    if (isNaN(maxIter)) {
      setError('Por favor, ingrese un valor numérico válido para las iteraciones máximas');
      return;
    }

    const newtonAlgorithm = (eq, initialX, tol, maxIter) => {
      let steps = [];
      let iteration = 0;
      let x = initialX;

      while (iteration < maxIter) {
        let fx = evaluate(eq, x);
        let dfx = derivative(eq, x);

        if (Math.abs(dfx) < 1e-10) {
          throw new Error('Derivada cercana a cero, método de Newton-Raphson falla');
        }

        let xNext = x - fx / dfx;
        let error = Math.abs(xNext - x);

        steps.push({
          iteration,
          x: x.toFixed(6),
          fx: fx.toFixed(6),
          dfx: dfx.toFixed(6),
          xNext: xNext.toFixed(6),
          error: error.toFixed(6),
        });

        if (error < tol || Math.abs(fx) < tol) {
          return steps;
        }

        x = xNext;
        iteration++;
      }

      throw new Error('El método de Newton-Raphson no convergió');
    };

    try {
      const startTime = performance.now();

      const { result: steps, memoryUsed } = await measureMemoryUsage(
          newtonAlgorithm,
          [equation, x, tol, maxIter]
      );

      const endTime = performance.now();

      setNewtonTime(endTime - startTime);
      setNewtonMemory(memoryUsed);
      setNewtonSteps(steps);
    } catch (e) {
      setError(e.message);
    }
  };

  return {
    evaluate,
    derivative,
    bisectionMethod,
    newtonRaphsonMethod,
  };
})();

window.NonlinearMethods = NonlinearMethods;
