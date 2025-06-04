// src/pages/LoanComparison.jsx
import React, { useState, useEffect } from 'react';
import { loanComparisonApi } from '../services/api';

const LoanComparison = () => {
  const [saveStatus, setSaveStatus] = useState({ success: false, message: '', error: false });
  
  // Function to save comparison to database
  const handleSaveComparison = async () => {
    try {
      const comparisonData = {
        name: `${loans.bank1.name} vs ${loans.bank2.name}`,
        loan_amount: results.bank1.loanAmount,
        interest_rate_1: loans.bank1.rate,
        term_years_1: loans.bank1.term,
        interest_rate_2: loans.bank2.rate,
        term_years_2: loans.bank2.term,
        monthly_payment_1: results.bank1.monthlyPayment,
        monthly_payment_2: results.bank2.monthlyPayment,
        total_interest_1: results.bank1.totalInterestPaid,
        total_interest_2: results.bank2.totalInterestPaid
      };
      
      await loanComparisonApi.compare(comparisonData);
      setSaveStatus({
        success: true,
        message: 'Comparison saved successfully!',
        error: false
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveStatus({ success: false, message: '', error: false });
      }, 3000);
    } catch (error) {
      console.error('Error saving comparison:', error);
      setSaveStatus({
        success: false,
        message: 'Failed to save comparison. Please try again.',
        error: true
      });
    }
  };
  // State for storing loan inputs
  const [loans, setLoans] = useState({
    bank1: {
      name: 'Bank 1',
      propertyValue: 300000,        // Prix du bien
      agencyFees: 10000,           // Frais d'agence
      renovationCost: 20000,       // Montant des travaux
      notaryFees: 21000,           // Frais de notaire
      monthlyIncome: 4000,         // Revenu mensuel
      downPayment: 60000,          // Apport
      administrationFee: 1000,     // Frais de dossier
      guaranteeFees: 2500,         // Frais de garantie
      rate: 2.5,                   // Taux nominal
      insuranceFee: 0.36,          // Taux d'assurance
      term: 20,                    // Durée du prêt
      fullGracePeriod: 0,          // Différé total
      partialGracePeriod: 0,       // Différé partiel
      brokerFees: 2000             // Frais de courtage
    },
    bank2: {
      name: 'Bank 2',
      propertyValue: 300000,
      agencyFees: 10000,
      renovationCost: 20000,
      notaryFees: 21000,
      monthlyIncome: 4000,
      downPayment: 60000,
      administrationFee: 800,
      guaranteeFees: 2200,
      rate: 2.8,
      insuranceFee: 0.40,
      term: 20,
      fullGracePeriod: 0,
      partialGracePeriod: 0,
      brokerFees: 0
    }
  });

  // State to store calculated results
  const [results, setResults] = useState({
    bank1: {
      loanAmount: 0,
      monthlyPayment: 0,
      totalInterestPaid: 0,
      totalPayment: 0,
      annualCost: 0,
      debtRatio: 0,
      amortizationTable: []
    },
    bank2: {
      loanAmount: 0,
      monthlyPayment: 0,
      totalInterestPaid: 0,
      totalPayment: 0,
      annualCost: 0,
      debtRatio: 0,
      amortizationTable: []
    }
  });

  // State to track which bank is more profitable
  const [betterOption, setBetterOption] = useState(null);

  // Function to update loan data
  const handleInputChange = (bank, field, value) => {
    setLoans(prevLoans => ({
      ...prevLoans,
      [bank]: {
        ...prevLoans[bank],
        [field]: value
      }
    }));
  };
  
  // Function to generate amortization table
  const generateAmortizationTable = (loanAmount, rate, term, monthlyPayment, fullGracePeriod, partialGracePeriod, insuranceFee) => {
    const monthlyRate = rate / 100 / 12;
    const termMonths = term * 12;
    const table = [];
    
    let remainingPrincipal = loanAmount;
    let totalPaid = 0;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;
    let monthlyInsurance = (loanAmount * (insuranceFee / 100)) / 12;
    
    // Handle grace periods
    const fullGraceMonths = fullGracePeriod * 12;
    const partialGraceMonths = partialGracePeriod * 12;
    
    for (let month = 1; month <= termMonths; month++) {
      let interestPayment = remainingPrincipal * monthlyRate;
      let principalPayment = 0;
      let payment = 0;
      
      // During full grace period: no payment at all (interest is capitalized)
      if (month <= fullGraceMonths) {
        remainingPrincipal += interestPayment;
        payment = monthlyInsurance;
      }
      // During partial grace period: only pay interest, no principal
      else if (month <= fullGraceMonths + partialGraceMonths) {
        payment = interestPayment + monthlyInsurance;
        principalPayment = 0;
      }
      // Normal amortization
      else {
        // Recalculate monthly payment for remaining term
        if (month === fullGraceMonths + partialGraceMonths + 1) {
          const remainingMonths = termMonths - fullGraceMonths - partialGraceMonths;
          monthlyPayment = remainingPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, remainingMonths)) / (Math.pow(1 + monthlyRate, remainingMonths) - 1);
        }
        
        payment = monthlyPayment + monthlyInsurance;
        principalPayment = monthlyPayment - interestPayment;
        remainingPrincipal -= principalPayment;
        
        // Adjust for the final payment to ensure we reach exactly 0
        if (month === termMonths) {
          principalPayment += remainingPrincipal;
          payment = principalPayment + interestPayment + monthlyInsurance;
          remainingPrincipal = 0;
        }
      }
      
      totalPaid += payment;
      totalInterestPaid += interestPayment;
      totalPrincipalPaid += principalPayment;
      
      table.push({
        month,
        payment,
        principalPayment,
        interestPayment,
        insurancePayment: monthlyInsurance,
        remainingPrincipal: Math.max(0, remainingPrincipal),
        totalPaid
      });
      
      // Update monthly insurance as principal decreases
      monthlyInsurance = (remainingPrincipal * (insuranceFee / 100)) / 12;
    }
    
    return table;
  };

  // Function to calculate loan repayments with all parameters
  const calculateLoan = (bank) => {
    const {
      propertyValue,
      agencyFees,
      renovationCost,
      notaryFees,
      monthlyIncome,
      downPayment,
      administrationFee,
      guaranteeFees,
      rate,
      insuranceFee,
      term,
      fullGracePeriod,
      partialGracePeriod,
      brokerFees
    } = bank;
    
    // Calculate total project cost
    const totalCost = propertyValue + agencyFees + renovationCost + notaryFees;
    
    // Calculate loan amount (total cost minus down payment)
    const loanAmount = totalCost - downPayment;
    
    // Convert to monthly rates
    const monthlyRate = rate / 100 / 12;
    const termMonths = term * 12;
    
    // Calculate effective term after grace periods
    const effectiveTermMonths = termMonths - (fullGracePeriod * 12);
    
    // Calculate monthly payment using the loan formula (excluding insurance)
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, effectiveTermMonths)) / 
                          (Math.pow(1 + monthlyRate, effectiveTermMonths) - 1);
    
    // Generate amortization table
    const amortizationTable = generateAmortizationTable(
      loanAmount, 
      rate, 
      term, 
      monthlyPayment, 
      fullGracePeriod, 
      partialGracePeriod, 
      insuranceFee
    );
    
    // Get final values from the amortization table
    const totalPayment = amortizationTable[amortizationTable.length - 1].totalPaid;
    const totalInterestPaid = amortizationTable.reduce((sum, row) => sum + row.interestPayment, 0);
    
    // Monthly insurance payment
    const monthlyInsurance = (loanAmount * (insuranceFee / 100)) / 12;
    
    // Calculate total monthly payment including insurance
    const totalMonthlyPayment = monthlyPayment + monthlyInsurance;
    
    // Calculate debt ratio
    const debtRatio = (totalMonthlyPayment / monthlyIncome) * 100;
    
    // Calculate annual cost including all fees
    const upfrontCosts = administrationFee + guaranteeFees + brokerFees;
    const annualCost = (upfrontCosts / term) + 
                       (totalInterestPaid / term) + 
                       (loanAmount * (insuranceFee / 100));
    
    return {
      loanAmount,
      monthlyPayment: totalMonthlyPayment,
      totalInterestPaid,
      totalPayment,
      annualCost,
      debtRatio,
      amortizationTable
    };
  };

  // Calculate and update results when inputs change
  useEffect(() => {
    const bank1Results = calculateLoan(loans.bank1);
    const bank2Results = calculateLoan(loans.bank2);
    
    setResults({
      bank1: bank1Results,
      bank2: bank2Results
    });
    
    // Determine better option
    if (bank1Results.annualCost < bank2Results.annualCost) {
      setBetterOption('bank1');
    } else if (bank2Results.annualCost < bank1Results.annualCost) {
      setBetterOption('bank2');
    } else {
      setBetterOption(null); // same cost
    }
  }, [loans]);
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Format percentage
  const formatPercent = (value) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'percent', 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };
  
  // Download amortization table as CSV
  const downloadAmortizationTable = (bank) => {
    const bankData = loans[bank];
    const table = results[bank].amortizationTable;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Numéro de mois,Mensualité,Capital remboursé,Intérêts,Assurance,Capital restant dû,Total payé\n";
    
    table.forEach(row => {
      csvContent += `${row.month},${row.payment.toFixed(2)},${row.principalPayment.toFixed(2)},${row.interestPayment.toFixed(2)},${row.insurancePayment.toFixed(2)},${row.remainingPrincipal.toFixed(2)},${row.totalPaid.toFixed(2)}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tableau_Amortissement_${bankData.name.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    
    // Trigger download and remove link
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Comparateur de Prêts Immobiliers</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Bank 1 Input Panel */}
        <div className={`bg-white p-6 rounded-lg shadow-md ${betterOption === 'bank1' ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              <input 
                type="text" 
                className="border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 max-w-[120px]" 
                value={loans.bank1.name} 
                onChange={(e) => handleInputChange('bank1', 'name', e.target.value)}
              />
            </h2>
            {betterOption === 'bank1' && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                Meilleure option
              </span>
            )}
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {/* Property information */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-md font-semibold mb-3 text-slate-700">Information sur le bien</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prix du bien (€)</label>
                  <input
                    type="number"
                    value={loans.bank1.propertyValue}
                    onChange={(e) => handleInputChange('bank1', 'propertyValue', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais d'agence (€)</label>
                  <input
                    type="number"
                    value={loans.bank1.agencyFees}
                    onChange={(e) => handleInputChange('bank1', 'agencyFees', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant travaux (€)</label>
                  <input
                    type="number"
                    value={loans.bank1.renovationCost}
                    onChange={(e) => handleInputChange('bank1', 'renovationCost', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais de notaire (€)</label>
                  <input
                    type="number"
                    value={loans.bank1.notaryFees}
                    onChange={(e) => handleInputChange('bank1', 'notaryFees', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Financial information */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-md font-semibold mb-3 text-slate-700">Information financière</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Revenu mensuel (€)</label>
                  <input
                    type="number"
                    value={loans.bank1.monthlyIncome}
                    onChange={(e) => handleInputChange('bank1', 'monthlyIncome', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apport (€)</label>
                  <input
                    type="number"
                    value={loans.bank1.downPayment}
                    onChange={(e) => handleInputChange('bank1', 'downPayment', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Loan information */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-md font-semibold mb-3 text-slate-700">Conditions du prêt</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Taux nominal (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={loans.bank1.rate}
                    onChange={(e) => handleInputChange('bank1', 'rate', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durée (années)</label>
                  <input
                    type="number"
                    value={loans.bank1.term}
                    onChange={(e) => handleInputChange('bank1', 'term', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Différé total (années)</label>
                  <input
                    type="number"
                    value={loans.bank1.fullGracePeriod}
                    onChange={(e) => handleInputChange('bank1', 'fullGracePeriod', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Différé partiel (années)</label>
                  <input
                    type="number"
                    value={loans.bank1.partialGracePeriod}
                    onChange={(e) => handleInputChange('bank1', 'partialGracePeriod', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Fees */}
            <div>
              <h3 className="text-md font-semibold mb-3 text-slate-700">Frais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais de dossier (€)</label>
                  <input
                    type="number"
                    value={loans.bank1.administrationFee}
                    onChange={(e) => handleInputChange('bank1', 'administrationFee', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais de garantie (€)</label>
                  <input
                    type="number"
                    value={loans.bank1.guaranteeFees}
                    onChange={(e) => handleInputChange('bank1', 'guaranteeFees', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Taux assurance (%/an)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={loans.bank1.insuranceFee}
                    onChange={(e) => handleInputChange('bank1', 'insuranceFee', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais de courtage (€)</label>
                  <input
                    type="number"
                    value={loans.bank1.brokerFees}
                    onChange={(e) => handleInputChange('bank1', 'brokerFees', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">Résultats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant du prêt:</span>
                <span className="font-medium">{formatCurrency(results.bank1.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mensualité:</span>
                <span className="font-medium">{formatCurrency(results.bank1.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total des intérêts:</span>
                <span className="font-medium">{formatCurrency(results.bank1.totalInterestPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux d'endettement:</span>
                <span className="font-medium">{formatPercent(results.bank1.debtRatio)}</span>
              </div>
              <div className="flex justify-between font-semibold text-blue-800">
                <span>Coût annuel:</span>
                <span>{formatCurrency(results.bank1.annualCost)}</span>
              </div>
              <button 
                onClick={() => downloadAmortizationTable('bank1')}
                className="mt-2 w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Télécharger tableau d'amortissement
              </button>
            </div>
          </div>
        </div>
        
        {/* Bank 2 Input Panel */}
        <div className={`bg-white p-6 rounded-lg shadow-md ${betterOption === 'bank2' ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              <input 
                type="text" 
                className="border-b border-gray-300 focus:border-blue-500 focus:outline-none px-1 max-w-[120px]" 
                value={loans.bank2.name} 
                onChange={(e) => handleInputChange('bank2', 'name', e.target.value)}
              />
            </h2>
            {betterOption === 'bank2' && (
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                Meilleure option
              </span>
            )}
          </div>
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {/* Property information */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-md font-semibold mb-3 text-slate-700">Information sur le bien</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prix du bien (€)</label>
                  <input
                    type="number"
                    value={loans.bank2.propertyValue}
                    onChange={(e) => handleInputChange('bank2', 'propertyValue', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais d'agence (€)</label>
                  <input
                    type="number"
                    value={loans.bank2.agencyFees}
                    onChange={(e) => handleInputChange('bank2', 'agencyFees', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Montant travaux (€)</label>
                  <input
                    type="number"
                    value={loans.bank2.renovationCost}
                    onChange={(e) => handleInputChange('bank2', 'renovationCost', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais de notaire (€)</label>
                  <input
                    type="number"
                    value={loans.bank2.notaryFees}
                    onChange={(e) => handleInputChange('bank2', 'notaryFees', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Financial information */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-md font-semibold mb-3 text-slate-700">Information financière</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Revenu mensuel (€)</label>
                  <input
                    type="number"
                    value={loans.bank2.monthlyIncome}
                    onChange={(e) => handleInputChange('bank2', 'monthlyIncome', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Apport (€)</label>
                  <input
                    type="number"
                    value={loans.bank2.downPayment}
                    onChange={(e) => handleInputChange('bank2', 'downPayment', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Loan information */}
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-md font-semibold mb-3 text-slate-700">Conditions du prêt</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Taux nominal (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={loans.bank2.rate}
                    onChange={(e) => handleInputChange('bank2', 'rate', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Durée (années)</label>
                  <input
                    type="number"
                    value={loans.bank2.term}
                    onChange={(e) => handleInputChange('bank2', 'term', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Différé total (années)</label>
                  <input
                    type="number"
                    value={loans.bank2.fullGracePeriod}
                    onChange={(e) => handleInputChange('bank2', 'fullGracePeriod', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Différé partiel (années)</label>
                  <input
                    type="number"
                    value={loans.bank2.partialGracePeriod}
                    onChange={(e) => handleInputChange('bank2', 'partialGracePeriod', parseInt(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Fees */}
            <div>
              <h3 className="text-md font-semibold mb-3 text-slate-700">Frais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais de dossier (€)</label>
                  <input
                    type="number"
                    value={loans.bank2.administrationFee}
                    onChange={(e) => handleInputChange('bank2', 'administrationFee', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais de garantie (€)</label>
                  <input
                    type="number"
                    value={loans.bank2.guaranteeFees}
                    onChange={(e) => handleInputChange('bank2', 'guaranteeFees', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Taux assurance (%/an)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={loans.bank2.insuranceFee}
                    onChange={(e) => handleInputChange('bank2', 'insuranceFee', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Frais de courtage (€)</label>
                  <input
                    type="number"
                    value={loans.bank2.brokerFees}
                    onChange={(e) => handleInputChange('bank2', 'brokerFees', parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2 text-slate-800">Résultats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Montant du prêt:</span>
                <span className="font-medium">{formatCurrency(results.bank2.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mensualité:</span>
                <span className="font-medium">{formatCurrency(results.bank2.monthlyPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total des intérêts:</span>
                <span className="font-medium">{formatCurrency(results.bank2.totalInterestPaid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taux d'endettement:</span>
                <span className="font-medium">{formatPercent(results.bank2.debtRatio)}</span>
              </div>
              <div className="flex justify-between font-semibold text-blue-800">
                <span>Coût annuel:</span>
                <span>{formatCurrency(results.bank2.annualCost)}</span>
              </div>
              <button 
                onClick={() => downloadAmortizationTable('bank2')}
                className="mt-2 w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Télécharger tableau d'amortissement
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comparison Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-slate-800">Comparaison détaillée</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Critère
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {loans.bank1.name}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {loans.bank2.name}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Différence
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Montant du prêt</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(results.bank1.loanAmount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(results.bank2.loanAmount)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {formatCurrency(results.bank1.loanAmount - results.bank2.loanAmount)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Taux nominal</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loans.bank1.rate}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loans.bank2.rate}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${loans.bank1.rate < loans.bank2.rate ? 'text-green-600' : loans.bank1.rate > loans.bank2.rate ? 'text-red-600' : 'text-gray-500'}`}>
                  {(loans.bank1.rate - loans.bank2.rate).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Taux d'assurance</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loans.bank1.insuranceFee}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loans.bank2.insuranceFee}%</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${loans.bank1.insuranceFee < loans.bank2.insuranceFee ? 'text-green-600' : loans.bank1.insuranceFee > loans.bank2.insuranceFee ? 'text-red-600' : 'text-gray-500'}`}>
                  {(loans.bank1.insuranceFee - loans.bank2.insuranceFee).toFixed(2)}%
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mensualité</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(results.bank1.monthlyPayment)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(results.bank2.monthlyPayment)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${results.bank1.monthlyPayment < results.bank2.monthlyPayment ? 'text-green-600' : results.bank1.monthlyPayment > results.bank2.monthlyPayment ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatCurrency(results.bank1.monthlyPayment - results.bank2.monthlyPayment)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Total des intérêts</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(results.bank1.totalInterestPaid)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(results.bank2.totalInterestPaid)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${results.bank1.totalInterestPaid < results.bank2.totalInterestPaid ? 'text-green-600' : results.bank1.totalInterestPaid > results.bank2.totalInterestPaid ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatCurrency(results.bank1.totalInterestPaid - results.bank2.totalInterestPaid)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Frais de dossier</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(loans.bank1.administrationFee)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(loans.bank2.administrationFee)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${loans.bank1.administrationFee < loans.bank2.administrationFee ? 'text-green-600' : loans.bank1.administrationFee > loans.bank2.administrationFee ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatCurrency(loans.bank1.administrationFee - loans.bank2.administrationFee)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Frais de garantie</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(loans.bank1.guaranteeFees)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(loans.bank2.guaranteeFees)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${loans.bank1.guaranteeFees < loans.bank2.guaranteeFees ? 'text-green-600' : loans.bank1.guaranteeFees > loans.bank2.guaranteeFees ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatCurrency(loans.bank1.guaranteeFees - loans.bank2.guaranteeFees)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Frais de courtage</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(loans.bank1.brokerFees)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(loans.bank2.brokerFees)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${loans.bank1.brokerFees < loans.bank2.brokerFees ? 'text-green-600' : loans.bank1.brokerFees > loans.bank2.brokerFees ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatCurrency(loans.bank1.brokerFees - loans.bank2.brokerFees)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Assurance (coût annuel)</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(results.bank1.loanAmount * (loans.bank1.insuranceFee / 100))}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(results.bank2.loanAmount * (loans.bank2.insuranceFee / 100))}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${results.bank1.loanAmount * (loans.bank1.insuranceFee / 100) < results.bank2.loanAmount * (loans.bank2.insuranceFee / 100) ? 'text-green-600' : results.bank1.loanAmount * (loans.bank1.insuranceFee / 100) > results.bank2.loanAmount * (loans.bank2.insuranceFee / 100) ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatCurrency(results.bank1.loanAmount * (loans.bank1.insuranceFee / 100) - results.bank2.loanAmount * (loans.bank2.insuranceFee / 100))}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Taux d'endettement</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPercent(results.bank1.debtRatio)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPercent(results.bank2.debtRatio)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${results.bank1.debtRatio < results.bank2.debtRatio ? 'text-green-600' : results.bank1.debtRatio > results.bank2.debtRatio ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatPercent(results.bank1.debtRatio - results.bank2.debtRatio)}
                </td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">Coût annuel total</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{formatCurrency(results.bank1.annualCost)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{formatCurrency(results.bank2.annualCost)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${results.bank1.annualCost < results.bank2.annualCost ? 'text-green-600' : results.bank1.annualCost > results.bank2.annualCost ? 'text-red-600' : 'text-gray-500'}`}>
                  {formatCurrency(results.bank1.annualCost - results.bank2.annualCost)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Amortization Table Preview - First 12 Months */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4 text-slate-800">Tableau d'amortissement ({betterOption ? loans[betterOption].name : 'meilleure offre'})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mois</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensualité</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capital</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intérêts</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assurance</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capital restant</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {betterOption && results[betterOption].amortizationTable.slice(0, 12).map((row) => (
                  <tr key={row.month}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{row.month}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.payment)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.principalPayment)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.interestPayment)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.insurancePayment)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatCurrency(row.remainingPrincipal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4 space-x-4">
            <button 
              onClick={() => downloadAmortizationTable('bank1')}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Télécharger tableau {loans.bank1.name}
            </button>
            <button 
              onClick={() => downloadAmortizationTable('bank2')}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Télécharger tableau {loans.bank2.name}
            </button>
          </div>
        </div>
        
        {/* Comparison Summary */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">Conclusion</h3>
          {betterOption ? (
            <p className="text-gray-700">
              L'offre de <span className="font-semibold">{betterOption === 'bank1' ? loans.bank1.name : loans.bank2.name}</span> est plus avantageuse avec un coût annuel inférieur de {formatCurrency(Math.abs(results.bank1.annualCost - results.bank2.annualCost))}. 
              Sur la durée totale du prêt, cela représente une économie de {formatCurrency(Math.abs(results.bank1.annualCost - results.bank2.annualCost) * loans[betterOption].term)}.
            </p>
          ) : (
            <p className="text-gray-700">Les deux offres sont équivalentes en termes de coût annuel.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanComparison;