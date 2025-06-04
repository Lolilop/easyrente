// src/components/applicants/ApplicantCard.jsx
import React from 'react';

const ApplicantCard = ({ applicant, isSelected, onToggleSelect }) => {
  // Format date string to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Format currency values
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Determine status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Determine employment status color
  const getEmploymentStatusColor = (status) => {
    switch(status) {
      case 'CDI':
        return 'bg-green-100 text-green-800';
      case 'CDD':
        return 'bg-blue-100 text-blue-800';
      case 'Freelance':
        return 'bg-purple-100 text-purple-800';
      case 'Student':
        return 'bg-blue-100 text-blue-800';
      case 'Retired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${
        isSelected ? 'border-blue-500' : 'border-transparent'
      } transition-all duration-200 hover:shadow-lg`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-lg font-semibold">
              {applicant.first_name.charAt(0)}{applicant.last_name.charAt(0)}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                {applicant.first_name} {applicant.last_name}
              </h3>
              <p className="text-sm text-gray-600">
                {applicant.desired_property ? applicant.desired_property : 'Aucune propriété spécifiée'}
              </p>
            </div>
          </div>
          <button
            onClick={onToggleSelect}
            className={`h-6 w-6 rounded-full ${
              isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
            } flex items-center justify-center transition-colors`}
            aria-label={isSelected ? 'Désélectionner' : 'Sélectionner'}
          >
            {isSelected && (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Revenu mensuel</p>
            <p className="text-sm font-medium">{formatCurrency(applicant.monthly_income)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Statut d'emploi</p>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEmploymentStatusColor(applicant.employment_status)}`}>
              {applicant.employment_status}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Score de crédit</p>
            <p className="text-sm font-medium">{applicant.credit_score || 'Non évalué'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Garant</p>
            <p className="text-sm font-medium">{applicant.has_guarantor ? 'Oui' : 'Non'}</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-gray-500">Emménagement souhaité</p>
          <p className="text-sm font-medium">{formatDate(applicant.desired_move_in)}</p>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(applicant.status)}`}>
            {applicant.status === 'approved' ? 'Approuvé' : 
             applicant.status === 'rejected' ? 'Rejeté' : 'En attente'}
          </span>
          <span className="text-xs text-gray-500">
            Demande le {formatDate(applicant.application_date)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;