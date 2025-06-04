// src/components/applicants/ApplicantForm.jsx
import React, { useState } from 'react';

const ApplicantForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || '',
    last_name: initialData.last_name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    monthly_income: initialData.monthly_income || '',
    employment_status: initialData.employment_status || 'CDI',
    credit_score: initialData.credit_score || '',
    has_guarantor: initialData.has_guarantor || false,
    guarantor_income: initialData.guarantor_income || '',
    desired_move_in: initialData.desired_move_in || '',
    desired_property: initialData.desired_property || '',
    notes: initialData.notes || '',
    status: initialData.status || 'pending'
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.monthly_income) {
      newErrors.monthly_income = 'Le revenu mensuel est requis';
    } else if (isNaN(formData.monthly_income) || formData.monthly_income <= 0) {
      newErrors.monthly_income = 'Le revenu doit être un nombre positif';
    }
    if (!formData.employment_status) newErrors.employment_status = 'Le statut d\'emploi est requis';
    if (formData.credit_score && (isNaN(formData.credit_score) || formData.credit_score < 300 || formData.credit_score > 850)) {
      newErrors.credit_score = 'Le score de crédit doit être entre 300 et 850';
    }
    if (formData.has_guarantor && (!formData.guarantor_income || isNaN(formData.guarantor_income) || formData.guarantor_income <= 0)) {
      newErrors.guarantor_income = 'Le revenu du garant est requis et doit être un nombre positif';
    }
    if (!formData.desired_move_in) newErrors.desired_move_in = 'La date d\'emménagement souhaitée est requise';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Convert string numbers to actual numbers
      const processedData = {
        ...formData,
        monthly_income: Number(formData.monthly_income),
        credit_score: formData.credit_score ? Number(formData.credit_score) : null,
        guarantor_income: formData.has_guarantor ? Number(formData.guarantor_income) : 0,
      };
      onSubmit(processedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
            Prénom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.first_name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
        </div>

        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
            Nom <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.last_name ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="monthly_income" className="block text-sm font-medium text-gray-700">
            Revenu mensuel (€) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="monthly_income"
            id="monthly_income"
            value={formData.monthly_income}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.monthly_income ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.monthly_income && <p className="mt-1 text-sm text-red-600">{errors.monthly_income}</p>}
        </div>

        <div>
          <label htmlFor="employment_status" className="block text-sm font-medium text-gray-700">
            Statut d'emploi <span className="text-red-500">*</span>
          </label>
          <select
            name="employment_status"
            id="employment_status"
            value={formData.employment_status}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.employment_status ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Freelance">Freelance / Auto-entrepreneur</option>
            <option value="Student">Étudiant</option>
            <option value="Retired">Retraité</option>
            <option value="Unemployed">Sans emploi</option>
          </select>
          {errors.employment_status && <p className="mt-1 text-sm text-red-600">{errors.employment_status}</p>}
        </div>

        <div>
          <label htmlFor="credit_score" className="block text-sm font-medium text-gray-700">
            Score de crédit (300-850)
          </label>
          <input
            type="number"
            name="credit_score"
            id="credit_score"
            min="300"
            max="850"
            value={formData.credit_score}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.credit_score ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.credit_score && <p className="mt-1 text-sm text-red-600">{errors.credit_score}</p>}
        </div>

        <div>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              name="has_guarantor"
              id="has_guarantor"
              checked={formData.has_guarantor}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="has_guarantor" className="ml-2 block text-sm font-medium text-gray-700">
              A un garant
            </label>
          </div>
        </div>

        {formData.has_guarantor && (
          <div>
            <label htmlFor="guarantor_income" className="block text-sm font-medium text-gray-700">
              Revenu du garant (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="guarantor_income"
              id="guarantor_income"
              value={formData.guarantor_income}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${errors.guarantor_income ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
            />
            {errors.guarantor_income && <p className="mt-1 text-sm text-red-600">{errors.guarantor_income}</p>}
          </div>
        )}

        <div>
          <label htmlFor="desired_move_in" className="block text-sm font-medium text-gray-700">
            Date d'emménagement souhaitée <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="desired_move_in"
            id="desired_move_in"
            value={formData.desired_move_in}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${errors.desired_move_in ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
          />
          {errors.desired_move_in && <p className="mt-1 text-sm text-red-600">{errors.desired_move_in}</p>}
        </div>

        <div>
          <label htmlFor="desired_property" className="block text-sm font-medium text-gray-700">
            Propriété souhaitée
          </label>
          <input
            type="text"
            name="desired_property"
            id="desired_property"
            value={formData.desired_property}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div className="col-span-full">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Statut
          </label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>

        <div className="col-span-full">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Informations supplémentaires sur le candidat locataire..."
          ></textarea>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-5 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
        >
          Sauvegarder
        </button>
      </div>
    </form>
  );
};

export default ApplicantForm;