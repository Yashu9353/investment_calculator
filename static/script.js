document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const initialAmountInput = document.getElementById('initialAmount');
    const monthlyContributionSlider = document.getElementById('monthlyContributionSlider');
    const monthlyContributionInput = document.getElementById('monthlyContribution');
    const interestRateSlider = document.getElementById('interestRateSlider');
    const interestRateDisplay = document.getElementById('interestRateDisplay');
    const yearsSlider = document.getElementById('yearsSlider');
    const yearsDisplay = document.getElementById('yearsDisplay');
    const calculateBtn = document.getElementById('calculateBtn');

    const summaryInvested = document.getElementById('totalInvested');
    const summaryInterest = document.getElementById('totalInterest');
    const summaryBalance = document.getElementById('finalBalance');

    const ctx = document.getElementById('growthChart').getContext('2d');

    // --- Chart Setup (Chart.js) ---
    // Using a gradient for the line fill
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(88, 166, 255, 0.5)');   // Start color
    gradient.addColorStop(1, 'rgba(88, 166, 255, 0.0)');   // End color

    let investmentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [], // Years to be populated
            datasets: [{
                label: 'Projected Balance',
                data: [],
                borderColor: '#58a6ff',
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: '#fff',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4 // Smooth curves
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(13, 17, 23, 0.9)',
                    titleColor: '#8b949e',
                    bodyColor: '#c9d1d9',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    displayColors: false,
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#8b949e'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#8b949e',
                        callback: function (value) {
                            return '₹' + value / 1000 + 'k';
                        }
                    }
                }
            }
        }
    });

    // --- Logic ---
    function updateCalculation() {
        // 1. Get Values
        let initial = parseFloat(initialAmountInput.value) || 0;
        let monthly = parseFloat(monthlyContributionInput.value) || 0;
        let rate = parseFloat(interestRateSlider.value) || 0;
        let years = parseInt(yearsSlider.value) || 10;

        // Sync Sliders/Inputs UI
        monthlyContributionSlider.value = monthly;
        interestRateDisplay.textContent = rate.toFixed(1) + '%';
        yearsDisplay.textContent = years + (years === 1 ? ' Year' : ' Years');

        // 2. Compute Growth
        let labels = [];
        let dataPoints = [];
        let currentBalance = initial;
        let totalInvested = initial;

        // Push Year 0
        labels.push('Year 0');
        dataPoints.push(initial);

        for (let y = 1; y <= years; y++) {
            // Compound monthly for the year
            for (let m = 0; m < 12; m++) {
                currentBalance += monthly;
                currentBalance *= (1 + (rate / 100) / 12);
                totalInvested += monthly;
            }
            labels.push('Year ' + y);
            dataPoints.push(currentBalance);
        }

        // 3. Update DOM Summaries
        let totalInterest = currentBalance - totalInvested;

        summaryInvested.textContent = formatMoney(totalInvested);
        summaryInterest.textContent = formatMoney(totalInterest);
        summaryBalance.textContent = formatMoney(currentBalance);

        // 4. Update Chart
        investmentChart.data.labels = labels;
        investmentChart.data.datasets[0].data = dataPoints;
        investmentChart.update();
    }

    function formatMoney(amount) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    }

    // --- Event Listeners ---

    // Sync slider <-> input for monthly contribution
    monthlyContributionSlider.addEventListener('input', (e) => {
        monthlyContributionInput.value = e.target.value;
        updateCalculation();
    });
    monthlyContributionInput.addEventListener('input', (e) => {
        monthlyContributionSlider.value = e.target.value;
        updateCalculation();
    });

    // Other inputs
    initialAmountInput.addEventListener('input', updateCalculation);
    interestRateSlider.addEventListener('input', updateCalculation);
    yearsSlider.addEventListener('input', updateCalculation);

    calculateBtn.addEventListener('click', updateCalculation);

    // Initial Run
    updateCalculation();
});
