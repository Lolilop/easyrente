// src/pages/TaxSimulator.jsx
import React, { useState, useEffect } from 'react';

const TaxSimulator = () => {
  // Form state
  const [formData, setFormData] = useState({
    // Rental Income
    annualRentalIncome: 15000, // Annual rental income
    propertyTax: 1200, // Property tax
    insuranceCost: 500, // Insurance cost
    managementFees: 0, // Management fees
    maintenanceCost: 500, // Maintenance cost
    otherExpenses: 0, // Other expenses
    
    // Property Details
    acquisitionCost: 200000, // Property acquisition cost
    renovationCost: 0, // Renovation cost
    propertyAge: 10, // Property age in years
    
    // Tax Options
    taxRegime: 'real', // Tax regime: 'micro' or 'real'
    taxBracket: 30, // Tax bracket percentage
    socialChargesRate: 17.2, // Social charges rate percentage
  });
  
  // Results state
  const [results, setResults] = useState({
    grossIncome: 0,
    totalDeductions: 0,
    taxableIncome: 0,
    incomeTax: 0,
    socialCharges: 0,
    netIncome: 0,
    profitabilityRate: 0
  });

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };

  // Handle tax regime change
  const handleRegimeChange = (e) => {
    setFormData({
      ...formData,
      taxRegime: e.target.value
    });
  };

  // Calculate depreciation
  const calculateDepreciation = () => {
    if (formData.taxRegime !== 'real') return 0;
    
    const buildingValue = formData.acquisitionCost * 0.8; // Assume 80% of property value is building
    const annualDepreciation = buildingValue * 0.02; // 2% annual depreciation rate for buildings
    
    return annualDepreciation;
  };

  // Calculate tax results
  const calculateTaxes = () => {
    let grossIncome = formData.annualRentalIncome;
    let totalDeductions;
    let taxableIncome;
    
    if (formData.taxRegime === 'micro') {
      // Micro regime: 30% flat deduction
      totalDeductions = grossIncome * 0.3;
      taxableIncome = grossIncome - totalDeductions;
    } else {
      // Real regime: itemized deductions + depreciation
      const depreciation = calculateDepreciation();
      totalDeductions = formData.propertyTax + 
                        formData.insuranceCost + 
                        formData.managementFees + 
                        formData.maintenanceCost + 
                        formData.otherExpenses + 
                        depreciation;
      
      taxableIncome = grossIncome - totalDeductions;
    }
    
    // Calculate taxes
    const incomeTax = taxableIncome * (formData.taxBracket / 100);
    const socialCharges = taxableIncome * (formData.socialChargesRate / 100);
    const netIncome = grossIncome - totalDeductions - incomeTax - socialCharges;
    
    // Calculate profitability rate (against property value)
    const totalInvestment = formData.acquisitionCost + formData.renovationCost;
    const profitabilityRate = (netIncome / totalInvestment) * 100;
    
    setResults({
      grossIncome,
      totalDeductions,
      taxableIncome,
      incomeTax,
      socialCharges,
      netIncome,
      profitabilityRate
    });
  };

  // Calculate taxes when form data changes
  useEffect(() => {
    calculateTaxes();
  }, [formData]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercent = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-700">Rental Income Tax Simulator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-slate-700">Input Parameters</h2>
          
          {/* Tax Regime Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-slate-700">Tax Regime</h3>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  value="micro" 
                  checked={formData.taxRegime === 'micro'} 
                  onChange={handleRegimeChange}
                  className="form-radio h-5 w-5 text-blue-600" 
                />
                <span className="ml-2 text-slate-700">Micro Foncier (30% flat deduction)</span>
              </label>
              
              <label className="inline-flex items-center">
                <input 
                  type="radio" 
                  value="real" 
                  checked={formData.taxRegime === 'real'} 
                  onChange={handleRegimeChange}
                  className="form-radio h-5 w-5 text-blue-600" 
                />
                <span className="ml-2 text-slate-700">Régime Réel (Itemized deductions)</span>
              </label>
            </div>
          </div>
          
          {/* Tax Bracket Section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-slate-700">Tax Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Tax Bracket (%)</label>
                <input 
                  type="number" 
                  name="taxBracket" 
                  value={formData.taxBracket} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Social Charges Rate (%)</label>
                <input 
                  type="number" 
                  name="socialChargesRate" 
                  value={formData.socialChargesRate} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Income Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-slate-700">Rental Income</h3>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Annual Rental Income (€)</label>
              <input 
                type="number" 
                name="annualRentalIncome" 
                value={formData.annualRentalIncome} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Property Details */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3 text-slate-700">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Acquisition Cost (€)</label>
                <input 
                  type="number" 
                  name="acquisitionCost" 
                  value={formData.acquisitionCost} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Renovation Cost (€)</label>
                <input 
                  type="number" 
                  name="renovationCost" 
                  value={formData.renovationCost} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Property Age (years)</label>
                <input 
                  type="number" 
                  name="propertyAge" 
                  value={formData.propertyAge} 
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Expenses Section - Only shown for "Régime Réel" */}
          {formData.taxRegime === 'real' && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-slate-700">Deductible Expenses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Property Tax (€)</label>
                  <input 
                    type="number" 
                    name="propertyTax" 
                    value={formData.propertyTax} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Insurance (€)</label>
                  <input 
                    type="number" 
                    name="insuranceCost" 
                    value={formData.insuranceCost} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Management Fees (€)</label>
                  <input 
                    type="number" 
                    name="managementFees" 
                    value={formData.managementFees} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Maintenance (€)</label>
                  <input 
                    type="number" 
                    name="maintenanceCost" 
                    value={formData.maintenanceCost} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Other Expenses (€)</label>
                  <input 
                    type="number" 
                    name="otherExpenses" 
                    value={formData.otherExpenses} 
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      
        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 text-slate-700">Tax Calculation Results</h2>
          
          <div className="space-y-4">
            {/* Summary Section */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <h3 className="text-lg font-medium mb-3 text-blue-800">Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1 text-slate-600">Annual Rental Income:</div>
                <div className="col-span-1 font-semibold text-right">{formatCurrency(results.grossIncome)}</div>
                
                <div className="col-span-1 text-slate-600">Total Deductions:</div>
                <div className="col-span-1 font-semibold text-right">{formatCurrency(results.totalDeductions)}</div>
                
                <div className="col-span-1 text-slate-600">Taxable Income:</div>
                <div className="col-span-1 font-semibold text-right">{formatCurrency(results.taxableIncome)}</div>
                
                <div className="col-span-1 text-slate-600">Income Tax:</div>
                <div className="col-span-1 font-semibold text-right">{formatCurrency(results.incomeTax)}</div>
                
                <div className="col-span-1 text-slate-600">Social Charges:</div>
                <div className="col-span-1 font-semibold text-right">{formatCurrency(results.socialCharges)}</div>
                
                <div className="col-span-2 border-t border-blue-200 my-2"></div>
                
                <div className="col-span-1 text-slate-700 font-semibold">Net Income After Tax:</div>
                <div className="col-span-1 font-bold text-right text-blue-600">{formatCurrency(results.netIncome)}</div>
              </div>
            </div>
            
            {/* Profitability Section */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h3 className="text-lg font-medium mb-3 text-green-800">Investment Return</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1 text-slate-600">Total Investment:</div>
                <div className="col-span-1 font-semibold text-right">
                  {formatCurrency(formData.acquisitionCost + formData.renovationCost)}
                </div>
                
                <div className="col-span-1 text-slate-600">Annual Return Rate:</div>
                <div className="col-span-1 font-bold text-right text-green-600">
                  {formatPercent(results.profitabilityRate)}
                </div>
              </div>
            </div>
            
            {/* Tax Breakdown */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-3 text-slate-700">Tax Breakdown</h3>
              
              {/* Tax Visualization */}
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  {/* Calculate proportion for each segment */}
                  <div className="flex h-full rounded-full overflow-hidden">
                    <div 
                      className="bg-green-500" 
                      style={{ width: `${(results.netIncome / results.grossIncome) * 100}%` }}
                      title="Net Income"
                    ></div>
                    <div 
                      className="bg-red-500" 
                      style={{ width: `${(results.incomeTax / results.grossIncome) * 100}%` }}
                      title="Income Tax"
                    ></div>
                    <div 
                      className="bg-orange-500" 
                      style={{ width: `${(results.socialCharges / results.grossIncome) * 100}%` }}
                      title="Social Charges"
                    ></div>
                    <div 
                      className="bg-gray-400" 
                      style={{ width: `${(results.totalDeductions / results.grossIncome) * 100}%` }}
                      title="Deductions"
                    ></div>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 mr-1 rounded-sm"></div>
                    <span>Net Income</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 mr-1 rounded-sm"></div>
                    <span>Income Tax</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 mr-1 rounded-sm"></div>
                    <span>Social Charges</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 mr-1 rounded-sm"></div>
                    <span>Deductions</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div className="mt-8 text-sm text-slate-500">
              <h4 className="font-medium mb-2">Notes:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>This simulator provides an estimation and should not replace professional tax advice.</li>
                <li>The calculation assumes {formData.taxRegime === 'micro' ? 'a 30% flat deduction rate for the Micro-Foncier regime.' : 'itemized deductions with building depreciation at 2% annually.'}</li>
                <li>Social charges are calculated at {formData.socialChargesRate}% of the taxable income.</li>
                <li>The income tax calculation is simplified and based on your provided tax bracket of {formData.taxBracket}%.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSimulator;