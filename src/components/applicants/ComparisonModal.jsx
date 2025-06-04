// src/components/applicants/ComparisonModal.jsx
import React, { useState } from 'react';

const ComparisonModal = ({ applicants, onClose }) => {
  const [view, setView] = useState('overview'); // 'overview' or 'detailed'

  // Format currency values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date string to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Calculate affordability ratio (rent should be <= 33% of income)
  const calculateAffordability = (income, assumedRent = 1000) => {
    const ratio = (assumedRent / income) * 100;
    return {
      ratio: ratio.toFixed(1),
      status: ratio <= 33 ? 'good' : ratio <= 40 ? 'moderate' : 'bad'
    };
  };

  // Evaluate overall applicant score (simplified scoring algorithm)
  const evaluateApplicant = (applicant) => {
    let score = 0;
    
    // Employment status scoring
    if (applicant.employment_status === 'CDI') score += 30;
    else if (applicant.employment_status === 'CDD') score += 20;
    else if (applicant.employment_status === 'Freelance') score += 15;
    else if (applicant.employment_status === 'Retired') score += 25;
    else if (applicant.employment_status === 'Student') score += 10;
    else score += 5;
    
    // Income assessment (assuming 1000€ rent)
    const affordability = calculateAffordability(applicant.monthly_income);
    if (affordability.ratio <= 25) score += 30;
    else if (affordability.ratio <= 33) score += 25;
    else if (affordability.ratio <= 40) score += 15;
    else score += 5;
    
    // Credit score assessment
    if (applicant.credit_score >= 750) score += 20;
    else if (applicant.credit_score >= 700) score += 15;
    else if (applicant.credit_score >= 650) score += 10;
    else if (applicant.credit_score >= 600) score += 5;
    
    // Guarantor bonus
    if (applicant.has_guarantor) {
      score += 10;
      if (applicant.guarantor_income > 3000) score += 10;
      else if (applicant.guarantor_income > 2000) score += 5;
    }
    
    return {
      score,
      rating: score >= 80 ? 'Excellent' : 
              score >= 60 ? 'Bon' : 
              score >= 40 ? 'Moyen' : 'Risqué',
      colorClass: score >= 80 ? 'text-green-600' : 
                 score >= 60 ? 'text-blue-600' : 
                 score >= 40 ? 'text-yellow-600' : 'text-red-600'
    };
  };

  // Find the best applicant based on our evaluation
  const findBestApplicant = () => {
    if (!applicants || applicants.length === 0) return null;
    
    let best = applicants[0];
    let bestScore = evaluateApplicant(best).score;
    
    applicants.forEach(applicant => {
      const score = evaluateApplicant(applicant).score;
      if (score > bestScore) {
        best = applicant;
        bestScore = score;
      }
    });
    
    return best.id;
  };

  const bestApplicantId = findBestApplicant();

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Modal header */}
        <div className="bg-gray-100 px-6 py-4 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Comparaison de Candidats ({applicants.length})
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setView('overview')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${view === 'overview' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'}`}
            >
              Vue générale
            </button>
            <button
              onClick={() => setView('detailed')}
              className={`px-3 py-1 text-sm font-medium rounded-md ${view === 'detailed' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-200'}`}
            >
              Détaillé
            </button>
            <button 
              onClick={onClose}
              className="ml-2 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Modal body */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {view === 'overview' ? (
            <div className="space-y-8">
              {/* Evaluation scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applicants.map(applicant => {
                  const evaluation = evaluateApplicant(applicant);
                  return (
                    <div 
                      key={applicant.id} 
                      className={`bg-white border rounded-lg shadow-sm overflow-hidden ${applicant.id === bestApplicantId ? 'border-2 border-green-500' : 'border-gray-200'}`}
                    >
                      <div className="p-5">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-semibold">
                              {applicant.first_name.charAt(0)}{applicant.last_name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {applicant.first_name} {applicant.last_name}
                              </h3>
                            </div>
                          </div>
                          {applicant.id === bestApplicantId && (
                            <div className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                              Recommandé
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between">
                          <div className="text-center">
                            <div className={`text-3xl font-bold ${evaluation.colorClass}`}>
                              {evaluation.score}/100
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Score global</div>
                          </div>
                          <div className="text-center">
                            <div className={`text-xl font-semibold ${evaluation.colorClass}`}>
                              {evaluation.rating}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">Évaluation</div>
                          </div>
                        </div>
                        
                        <div className="mt-6 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Revenu mensuel:</span>
                            <span className="text-sm font-medium">{formatCurrency(applicant.monthly_income)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Type de contrat:</span>
                            <span className="text-sm font-medium">{applicant.employment_status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Score de crédit:</span>
                            <span className="text-sm font-medium">{applicant.credit_score || 'Non disponible'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Garant:</span>
                            <span className="text-sm font-medium">
                              {applicant.has_guarantor ? `Oui (${formatCurrency(applicant.guarantor_income)})` : 'Non'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Taux d'effort:</span>
                            <span className={`text-sm font-medium ${
                              calculateAffordability(applicant.monthly_income).status === 'good' ? 'text-green-600' :
                              calculateAffordability(applicant.monthly_income).status === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {calculateAffordability(applicant.monthly_income).ratio}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Comparison chart */}
              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparaison des critères clés</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Critère</th>
                        {applicants.map(applicant => (
                          <th key={applicant.id} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {applicant.first_name} {applicant.last_name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Revenu mensuel</td>
                        {applicants.map(applicant => (
                          <td key={applicant.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(applicant.monthly_income)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ratio loyer/revenu</td>
                        {applicants.map(applicant => {
                          const affordability = calculateAffordability(applicant.monthly_income);
                          return (
                            <td key={applicant.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className={
                                affordability.status === 'good' ? 'text-green-600' :
                                affordability.status === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                              }>
                                {affordability.ratio}%
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Statut d'emploi</td>
                        {applicants.map(applicant => (
                          <td key={applicant.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {applicant.employment_status}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Score de crédit</td>
                        {applicants.map(applicant => (
                          <td key={applicant.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {applicant.credit_score || 'Non disponible'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Garant</td>
                        {applicants.map(applicant => (
                          <td key={applicant.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {applicant.has_guarantor ? (
                              <span className="text-green-600">Oui ({formatCurrency(applicant.guarantor_income)})</span>
                            ) : (
                              <span className="text-red-600">Non</span>
                            )}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Date d'emménagement</td>
                        {applicants.map(applicant => (
                          <td key={applicant.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(applicant.desired_move_in)}
                          </td>
                        ))}
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Score final</td>
                        {applicants.map(applicant => {
                          const evaluation = evaluateApplicant(applicant);
                          return (
                            <td key={applicant.id} className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <span className={evaluation.colorClass}>
                                {evaluation.score}/100 ({evaluation.rating})
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Detailed View */
            <div className="space-y-8">
              {applicants.map(applicant => {
                const evaluation = evaluateApplicant(applicant);
                const affordability = calculateAffordability(applicant.monthly_income);
                
                return (
                  <div 
                    key={applicant.id} 
                    className={`bg-white border rounded-lg shadow-sm overflow-hidden ${applicant.id === bestApplicantId ? 'border-2 border-green-500' : 'border-gray-200'}`}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                            {applicant.first_name.charAt(0)}{applicant.last_name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-semibold text-gray-900">
                              {applicant.first_name} {applicant.last_name}
                            </h3>
                            <p className="text-gray-600">{applicant.email} • {applicant.phone}</p>
                          </div>
                        </div>
                        {applicant.id === bestApplicantId && (
                          <div className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full">
                            Meilleur candidat
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3">Informations financières</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Revenu mensuel:</span>
                              <span className="text-sm font-medium">{formatCurrency(applicant.monthly_income)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Ratio loyer/revenu:</span>
                              <span className={`text-sm font-medium ${
                                affordability.status === 'good' ? 'text-green-600' :
                                affordability.status === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {affordability.ratio}% ({affordability.status === 'good' ? 'Bon' : 
                                                         affordability.status === 'moderate' ? 'Acceptable' : 'Risqué'})
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Score de crédit:</span>
                              <span className="text-sm font-medium">{applicant.credit_score || 'Non disponible'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Garant:</span>
                              <span className="text-sm font-medium">
                                {applicant.has_guarantor ? `Oui (${formatCurrency(applicant.guarantor_income)})` : 'Non'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 mb-3">Informations professionnelles</h4>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Statut d'emploi:</span>
                              <span className="text-sm font-medium">{applicant.employment_status}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Propriété souhaitée:</span>
                              <span className="text-sm font-medium">{applicant.desired_property || 'Non spécifiée'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Date d'emménagement:</span>
                              <span className="text-sm font-medium">{formatDate(applicant.desired_move_in)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Date de candidature:</span>
                              <span className="text-sm font-medium">{formatDate(applicant.application_date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {applicant.notes && (
                        <div className="mt-6">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">Notes</h4>
                          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                            {applicant.notes}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-6 border-t border-gray-200 pt-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">Évaluation globale</h4>
                        <div className="flex items-center">
                          <div className={`text-3xl font-bold ${evaluation.colorClass} mr-3`}>
                            {evaluation.score}/100
                          </div>
                          <div className={`text-xl font-semibold ${evaluation.colorClass}`}>
                            {evaluation.rating}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Détail de la notation</h5>
                          <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                            <li>Statut d'emploi: {applicant.employment_status === 'CDI' ? '30/30' : 
                                                 applicant.employment_status === 'CDD' ? '20/30' : 
                                                 applicant.employment_status === 'Freelance' ? '15/30' : 
                                                 applicant.employment_status === 'Retired' ? '25/30' : 
                                                 applicant.employment_status === 'Student' ? '10/30' : '5/30'}</li>
                            <li>Capacité financière: {affordability.ratio <= 25 ? '30/30' :
                                                     affordability.ratio <= 33 ? '25/30' :
                                                     affordability.ratio <= 40 ? '15/30' : '5/30'}</li>
                            <li>Score de crédit: {!applicant.credit_score ? 'Non évalué' : 
                                                applicant.credit_score >= 750 ? '20/20' : 
                                                applicant.credit_score >= 700 ? '15/20' : 
                                                applicant.credit_score >= 650 ? '10/20' : 
                                                applicant.credit_score >= 600 ? '5/20' : '0/20'}</li>
                            <li>Garant: {!applicant.has_guarantor ? '0/20' :
                                        applicant.guarantor_income > 3000 ? '20/20' :
                                        applicant.guarantor_income > 2000 ? '15/20' : '10/20'}</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Modal footer */}
        <div className="bg-gray-100 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          {bestApplicantId && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">Notre recommandation: </span>
              {applicants.find(a => a.id === bestApplicantId)?.first_name} {applicants.find(a => a.id === bestApplicantId)?.last_name}
            </div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;