// src/pages/TenantComparison.jsx
import React, { useState, useEffect } from 'react';
import ApplicantForm from '../components/applicants/ApplicantForm';
import ApplicantCard from '../components/applicants/ApplicantCard';
import ComparisonModal from '../components/applicants/ComparisonModal';
import { tenantComparisonApi } from '../data/tenantComparison';

const TenantComparison = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [selectedApplicants, setSelectedApplicants] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    async function fetchApplicants() {
      try {
        const data = await tenantComparisonApi.getApplicants();
        setApplicants(data);
      } catch (err) {
        console.error('Error loading applicants data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchApplicants();
  }, []);

  const handleApplicantSubmit = async (formData) => {
    try {
      setLoading(true);
      const newApplicant = await tenantComparisonApi.addApplicant(formData);
      setApplicants([...applicants, newApplicant]);
      setShowForm(false);
    } catch (err) {
      console.error('Error adding applicant:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelection = (applicantId) => {
    setSelectedApplicants(prev => {
      if (prev.includes(applicantId)) {
        return prev.filter(id => id !== applicantId);
      } else {
        if (prev.length < 3) {
          return [...prev, applicantId];
        }
        return prev;
      }
    });
  };

  const handleCompare = () => {
    if (selectedApplicants.length > 1) {
      setShowComparisonModal(true);
    }
  };

  const filteredApplicants = filterStatus === 'all' 
    ? applicants 
    : applicants.filter(app => app.status === filterStatus);

  if (loading && !showForm) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Comparaison de Locataires Potentiels</h1>
        <div className="flex space-x-2">
          {selectedApplicants.length > 1 && (
            <button 
              onClick={handleCompare}
              className="px-4 py-2 bg-green-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700"
            >
              Comparer ({selectedApplicants.length})
            </button>
          )}
          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
          >
            {showForm ? 'Annuler' : '+ Ajouter un candidat'}
          </button>
        </div>
      </div>



      {showForm ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Nouveau Candidat Locataire</h2>
          <ApplicantForm onSubmit={handleApplicantSubmit} onCancel={() => setShowForm(false)} />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm p-2 flex space-x-2">
              <button 
                onClick={() => setFilterStatus('all')} 
                className={`px-3 py-1 text-sm font-medium rounded-md ${filterStatus === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
              >
                Tous
              </button>
              <button 
                onClick={() => setFilterStatus('pending')} 
                className={`px-3 py-1 text-sm font-medium rounded-md ${filterStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'hover:bg-gray-100'}`}
              >
                En attente
              </button>
              <button 
                onClick={() => setFilterStatus('approved')} 
                className={`px-3 py-1 text-sm font-medium rounded-md ${filterStatus === 'approved' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}
              >
                Approuvés
              </button>
              <button 
                onClick={() => setFilterStatus('rejected')} 
                className={`px-3 py-1 text-sm font-medium rounded-md ${filterStatus === 'rejected' ? 'bg-red-100 text-red-800' : 'hover:bg-gray-100'}`}
              >
                Rejetés
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {selectedApplicants.length} candidat{selectedApplicants.length !== 1 ? 's' : ''} sélectionné{selectedApplicants.length !== 1 ? 's' : ''}
              {selectedApplicants.length > 0 && <span> (max 3)</span>}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {filteredApplicants.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-500">Aucun candidat trouvé. Ajoutez votre premier candidat locataire !</p>
              </div>
            ) : (
              filteredApplicants.map(applicant => (
                <ApplicantCard 
                  key={applicant.id}
                  applicant={applicant}
                  isSelected={selectedApplicants.includes(applicant.id)}
                  onToggleSelect={() => handleToggleSelection(applicant.id)}
                />
              ))
            )}
          </div>
        </>
      )}

      {showComparisonModal && (
        <ComparisonModal 
          applicants={applicants.filter(app => selectedApplicants.includes(app.id))}
          onClose={() => setShowComparisonModal(false)}
        />
      )}
    </div>
  );
};

export default TenantComparison;