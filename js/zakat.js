const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;
const ZAKAT_RATE = 0.025;

function calculateZakat() {
  const goldRate = parseFloat(document.getElementById('goldRate').value) || 0;
  const goldGrams = parseFloat(document.getElementById('goldGrams').value) || 0;
  const silverRate = parseFloat(document.getElementById('silverRate').value) || 0;
  const silverGrams = parseFloat(document.getElementById('silverGrams').value) || 0;
  const cash = parseFloat(document.getElementById('cash').value) || 0;
  const investments = parseFloat(document.getElementById('investments').value) || 0;
  const liabilities = parseFloat(document.getElementById('liabilities').value) || 0;

  const goldValue = goldRate * goldGrams;
  const silverValue = silverRate * silverGrams;

  const totalAssets = goldValue + silverValue + cash + investments;
  const netAssets = totalAssets - liabilities;

  // Use silver nisab (lower threshold, more inclusive — standard scholarly recommendation)
  const silverNisabValue = silverRate > 0 ? silverRate * SILVER_NISAB_GRAMS : 0;
  const goldNisabValue = goldRate > 0 ? goldRate * GOLD_NISAB_GRAMS : 0;

  // Determine applicable nisab threshold (prefer silver if rate provided, else gold)
  let nisabThreshold = silverNisabValue > 0 ? silverNisabValue : goldNisabValue;

  const resultBox = document.getElementById('resultBox');
  const breakdown = document.getElementById('breakdown');
  const zakatAmountEl = document.getElementById('zakatAmount');
  const resultLabel = resultBox.querySelector('.result-label');

  resultBox.classList.add('show');

  if (nisabThreshold === 0) {
    resultBox.classList.add('not-eligible');
    resultLabel.textContent = 'Rate Daal Den';
    zakatAmountEl.textContent = 'Gold ya Silver ka rate enter karen';
    breakdown.innerHTML = '';
    return;
  }

  if (netAssets < nisabThreshold) {
    resultBox.classList.remove('show');
    resultBox.classList.add('show', 'not-eligible');
    resultLabel.textContent = 'Aap Par Zakat Wajib Nahi';
    zakatAmountEl.textContent = 'Aapki wealth nisab (PKR ' + Math.round(nisabThreshold).toLocaleString() + ') se kam hai';
    breakdown.innerHTML = `
      <div><span>Total Assets</span><span>PKR ${Math.round(totalAssets).toLocaleString()}</span></div>
      <div><span>Liabilities</span><span>PKR ${Math.round(liabilities).toLocaleString()}</span></div>
      <div><span>Net Assets</span><span>PKR ${Math.round(netAssets).toLocaleString()}</span></div>
      <div><span>Nisab Threshold</span><span>PKR ${Math.round(nisabThreshold).toLocaleString()}</span></div>
    `;
    return;
  }

  resultBox.classList.remove('not-eligible');
  const zakatDue = netAssets * ZAKAT_RATE;

  resultLabel.textContent = 'Aap Par Zakat Wajib Hai';
  zakatAmountEl.textContent = 'PKR ' + Math.round(zakatDue).toLocaleString();

  breakdown.innerHTML = `
    <div><span>Gold Value</span><span>PKR ${Math.round(goldValue).toLocaleString()}</span></div>
    <div><span>Silver Value</span><span>PKR ${Math.round(silverValue).toLocaleString()}</span></div>
    <div><span>Cash + Bank</span><span>PKR ${Math.round(cash).toLocaleString()}</span></div>
    <div><span>Investments</span><span>PKR ${Math.round(investments).toLocaleString()}</span></div>
    <div><span>Total Assets</span><span>PKR ${Math.round(totalAssets).toLocaleString()}</span></div>
    <div><span>Minus Liabilities</span><span>- PKR ${Math.round(liabilities).toLocaleString()}</span></div>
    <div><span>Net Zakatable Wealth</span><span>PKR ${Math.round(netAssets).toLocaleString()}</span></div>
    <div><span>Zakat Due (2.5%)</span><span>PKR ${Math.round(zakatDue).toLocaleString()}</span></div>
  `;
}
