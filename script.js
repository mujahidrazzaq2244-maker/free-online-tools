(() => {
  const dobEl = document.getElementById('dob');
  const calcBtn = document.getElementById('calcBtn');
  const resetBtn = document.getElementById('resetBtn');

  const errorBox = document.getElementById('errorBox');
  const errorText = document.getElementById('errorText');

  const yearsEl = document.getElementById('years');
  const monthsEl = document.getElementById('months');
  const daysEl = document.getElementById('days');
  const resultHint = document.getElementById('resultHint');

  const yearNow = document.getElementById('yearNow');
  const todayText = document.getElementById('todayText');

  yearNow.textContent = new Date().getFullYear();
  todayText.textContent = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

  const pad2 = (n) => String(n).padStart(2, '0');

  function showError(msg) {
    errorText.textContent = msg;
    errorBox.classList.remove('d-none');
  }

  function clearError() {
    errorBox.classList.add('d-none');
    errorText.textContent = '';
  }

  function resetUI() {
    dobEl.value = '';
    clearError();
    yearsEl.textContent = '—';
    monthsEl.textContent = '—';
    daysEl.textContent = '—';
    resultHint.textContent = 'Your result will appear here.';
    dobEl.focus();
  }

  // Calculate exact age: years, months, days (calendar-accurate)
  function calculateExactAge(dob) {
    // Normalize to dates (no time issues)
    const start = new Date(dob.getFullYear(), dob.getMonth(), dob.getDate());
    const end = new Date();
    const today = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    if (start.getTime() > today.getTime()) {
      return null;
    }

    let years = today.getFullYear() - start.getFullYear();
    let months = today.getMonth() - start.getMonth();
    let days = today.getDate() - start.getDate();

    if (days < 0) {
      // Borrow days from previous month of 'today'
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); // last day of prev month
      days += prevMonth.getDate();
      months -= 1;
    }

    if (months < 0) {
      months += 12;
      years -= 1;
    }

    return { years, months, days };
  }

  function formatDOB(d) {
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function onCalculate() {
    clearError();

    const value = dobEl.value;
    if (!value) {
      showError('Please enter your date of birth.');
      return;
    }

    const dob = new Date(value + 'T00:00:00');
    if (Number.isNaN(dob.getTime())) {
      showError('Invalid date format.');
      return;
    }

    // Basic sanity: limit date range
    const min = new Date(1900, 0, 1);
    const max = new Date();
    if (dob < min) {
      showError('Date of birth is too far in the past.');
      return;
    }
    if (dob > max) {
      showError('Date of birth cannot be in the future.');
      return;
    }

    const age = calculateExactAge(dob);
    if (!age) {
      showError('Date of birth cannot be in the future.');
      return;
    }

    yearsEl.textContent = age.years;
    monthsEl.textContent = age.months;
    daysEl.textContent = age.days;

    const today = new Date();
    resultHint.textContent = `Born on ${formatDOB(dob)} → Your exact age as of ${today.toLocaleDateString()} is ${age.years} years, ${age.months} months and ${age.days} days.`;
  }

  calcBtn.addEventListener('click', onCalculate);
  resetBtn.addEventListener('click', resetUI);

  dobEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onCalculate();
  });

  // Optional: auto-calc if user picks date
  dobEl.addEventListener('change', () => {
    if (!dobEl.value) return;
    // Keep it user-controlled: only calculate if fields are filled.
  });

  // Set maximum allowed date to today to prevent future dates via UI
  (function setMaxToToday() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = pad2(now.getMonth() + 1);
    const dd = pad2(now.getDate());
    dobEl.max = `${yyyy}-${mm}-${dd}`;
  })();
})();

