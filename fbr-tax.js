// FBR Salary Tax Slabs 2025-26
const TAX_SLABS = [
  { min: 0, max: 600000, rate: 0, fixed: 0 },
  { min: 600000, max: 1200000, rate: 0.025, fixed: 0 },
  { min: 1200000, max: 2200000, rate: 0.11, fixed: 6000 },
  { min: 2200000, max: 3200000, rate: 0.23, fixed: 116000 },
  { min: 3200000, max: 4100000, rate: 0.30, fixed: 346000 },
  { min: 4100000, max: Infinity, rate: 0.35, fixed: 616000 }
];

document.getElementById('salaryType').addEventListener('change', function() {
  const label = document.getElementById('salaryLabel');
  label.textContent = this.value === 'monthly' ? 'Monthly Gross Salary (PKR)' : 'Yearly Gross Salary (PKR)';
});

function calculateTax() {
  const type = document.getElementById('salaryType').value;
  const amount = parseFloat(document.getElementById('salaryAmount').value) || 0;

  if (amount <= 0) {
    alert('Salary amount enter karen');
    return;
  }

  const annualSalary = type === 'monthly' ? amount * 12 : amount;

  let annualTax = 0;
  let appliedSlab = null;

  for (const slab of TAX_SLABS) {
    if (annualSalary > slab.min) {
      if (annualSalary <= slab.max || slab.max === Infinity) {
        const taxableInSlab = annualSalary - slab.min;
        annualTax = slab.fixed + (taxableInSlab * slab.rate);
        appliedSlab = slab;
        break;
      }
    }
  }

  const monthlyTax = annualTax / 12;
  const netAnnual = annualSalary - annualTax;
  const netMonthly = netAnnual / 12;
  const effectiveRate = (annualTax / annualSalary) * 100;

  const resultBox = document.getElementById('resultBox');
  const breakdown = document.getElementById('breakdown');
  const taxAmountEl = document.getElementById('taxAmount');

  resultBox.classList.add('show');
  resultBox.classList.remove('not-eligible');

  if (annualTax === 0) {
    taxAmountEl.textContent = 'PKR 0 — Tax Free';
  } else {
    taxAmountEl.textContent = 'PKR ' + Math.round(annualTax).toLocaleString() + ' / year';
  }

  breakdown.innerHTML = `
    <div><span>Annual Gross Salary</span><span>PKR ${Math.round(annualSalary).toLocaleString()}</span></div>
    <div><span>Annual Tax</span><span>PKR ${Math.round(annualTax).toLocaleString()}</span></div>
    <div><span>Monthly Tax</span><span>PKR ${Math.round(monthlyTax).toLocaleString()}</span></div>
    <div><span>Net Annual Income</span><span>PKR ${Math.round(netAnnual).toLocaleString()}</span></div>
    <div><span>Net Monthly Income</span><span>PKR ${Math.round(netMonthly).toLocaleString()}</span></div>
    <div><span>Effective Tax Rate</span><span>${effectiveRate.toFixed(2)}%</span></div>
  `;
}
