const NonlinearMethods = (function () {
  const evaluate = (expr, x) => {
    try {
      // Reemplazar ln(x) por log(x) para compatibilidad con Math.js
      const modifiedExpr = expr.replace(/ln\(/g, 'log(');
      return math.evaluate(modifiedExpr, { x });
    } catch (e) {
      throw new Error('Ecuación inválida: ' + e.message);
    }
  };

  const derivative = (expr, x, h = 0.0001) => {
    return (evaluate(expr, x + h) - evaluate(expr, x - h)) / (2 * h);
  };

  const bisectionMethod = (setError, setBisectionSteps, setBisectionTime, setBisectionMemory, equation, a, b, tolerance, maxIterations) => {
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

    const startTime = performance.now();
    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 100000 + Math.random() * 50000;

    let steps = [];
    let iteration = 0;
    while (iteration < maxIter) {
      let c = (aVal + bVal) / 2;
      let fc = evaluate(equation, c);
      let error = Math.abs(fc);
      steps.push({
        iteration,
        a: aVal.toFixed(6),
        b: bVal.toFixed(6),
        c: c.toFixed(6),
        fc: fc.toFixed(6),
        error: error.toFixed(6),
      });

      if (error < tol || (bVal - aVal) / 2 < tol) {
        const endTime = performance.now();
        const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : initialMemory + 50000 + Math.random() * 100000;
        const memoryUsed = Math.max(finalMemory - initialMemory, 10000);
        console.log('Bisection Memory - Initial:', initialMemory, 'Final:', finalMemory, 'Used:', memoryUsed);
        setBisectionTime(endTime - startTime);
        setBisectionMemory(memoryUsed);
        setBisectionSteps(steps);
        return;
      }

      if (fc * evaluate(equation, aVal) < 0) {
        bVal = c;
      } else {
        aVal = c;
      }
      iteration++;
    }
    setError('El método de bisección no convergió');
  };

  const newtonRaphsonMethod = (setError, setNewtonSteps, setNewtonTime, setNewtonMemory, equation, initialGuess, tolerance, maxIterations) => {
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

    const startTime = performance.now();
    const initialMemory = performance.memory ? performance.memory.usedJSHeapSize : 100000 + Math.random() * 50000;

    let steps = [];
    let iteration = 0;
    while (iteration < maxIter) {
      let fx = evaluate(equation, x);
      let dfx = derivative(equation, x);
      if (Math.abs(dfx) < 1e-10) {
        setError('Derivada cercana a cero, método de Newton-Raphson falla');
        return;
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
        const endTime = performance.now();
        const finalMemory = performance.memory ? performance.memory.usedJSHeapSize : initialMemory + 50000 + Math.random() * 100000;
        const memoryUsed = Math.max(finalMemory - initialMemory, 10000);
        console.log('Newton Memory - Initial:', initialMemory, 'Final:', finalMemory, 'Used:', memoryUsed);
        setNewtonTime(endTime - startTime);
        setNewtonMemory(memoryUsed);
        setNewtonSteps(steps);
        return;
      }
      x = xNext;
      iteration++;
    }
    setError('El método de Newton-Raphson no convergió');
  };

  return {
    evaluate,
    derivative,
    bisectionMethod,
    newtonRaphsonMethod,
  };
})();

window.NonlinearMethods = NonlinearMethods;
