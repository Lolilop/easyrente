// src/data/tenantComparison.js
const applicants = [
  {
    id: 1,
    first_name: "Marie",
    last_name: "Dupont",
    email: "marie.dupont@email.com",
    phone: "06 12 34 56 78",
    monthly_income: 2800,
    employment_status: "CDI",
    credit_score: 750,
    has_guarantor: true,
    guarantor_income: 3500,
    desired_move_in: "2023-12-01",
    desired_property: "Sunset Apartments",
    notes: "A stable employee at Tech Company for 5 years.",
    application_date: "2023-10-15",
    status: "pending"
  },
  {
    id: 2,
    first_name: "Thomas",
    last_name: "Martin",
    email: "thomas.martin@email.com",
    phone: "07 98 76 54 32",
    monthly_income: 2200,
    employment_status: "CDD",
    credit_score: 680,
    has_guarantor: false,
    guarantor_income: 0,
    desired_move_in: "2023-11-15",
    desired_property: "Oakwood Heights",
    notes: "Contract ends in 8 months, but renewable.",
    application_date: "2023-10-10",
    status: "pending"
  },
  {
    id: 3,
    first_name: "Sophie",
    last_name: "Bernard",
    email: "sophie.bernard@email.com",
    phone: "06 45 67 89 12",
    monthly_income: 3100,
    employment_status: "CDI",
    credit_score: 800,
    has_guarantor: false,
    guarantor_income: 0,
    desired_move_in: "2023-12-15",
    desired_property: "Pine Street Houses",
    notes: "Looking for a quiet neighborhood. Has 2 cats.",
    application_date: "2023-10-18",
    status: "approved"
  },
  {
    id: 4,
    first_name: "Lucas",
    last_name: "Petit",
    email: "lucas.petit@email.com",
    phone: "07 23 45 67 89",
    monthly_income: 1900,
    employment_status: "Freelance",
    credit_score: 630,
    has_guarantor: true,
    guarantor_income: 4000,
    desired_move_in: "2023-11-01",
    desired_property: "Riverside Complex",
    notes: "Income varies monthly, guarantor is parent.",
    application_date: "2023-09-28",
    status: "rejected"
  },
  {
    id: 5,
    first_name: "Emma",
    last_name: "Roux",
    email: "emma.roux@email.com",
    phone: "06 78 90 12 34",
    monthly_income: 2600,
    employment_status: "CDI",
    credit_score: 720,
    has_guarantor: false,
    guarantor_income: 0,
    desired_move_in: "2024-01-10",
    desired_property: "City Center Lofts",
    notes: "Currently living in another city, planning to move for new job.",
    application_date: "2023-10-05",
    status: "pending"
  },
  {
    id: 6,
    first_name: "Antoine",
    last_name: "Girard",
    email: "antoine.girard@email.com",
    phone: "06 55 66 77 88",
    monthly_income: 2900,
    employment_status: "CDI",
    credit_score: 760,
    has_guarantor: false,
    guarantor_income: 0,
    desired_move_in: "2023-12-20",
    desired_property: "Oakwood Heights",
    notes: "Has a small dog. Works remotely most of the time.",
    application_date: "2023-10-22",
    status: "pending"
  },
  {
    id: 7,
    first_name: "Julie",
    last_name: "Moreau",
    email: "julie.moreau@email.com",
    phone: "07 11 22 33 44",
    monthly_income: 2400,
    employment_status: "CDD",
    credit_score: 710,
    has_guarantor: true,
    guarantor_income: 3800,
    desired_move_in: "2023-11-20",
    desired_property: "Sunset Apartments",
    notes: "First-time renter, good references from university.",
    application_date: "2023-10-08",
    status: "approved"
  },
  {
    id: 8,
    first_name: "Nicolas",
    last_name: "Robert",
    email: "nicolas.robert@email.com",
    phone: "06 99 88 77 66",
    monthly_income: 2100,
    employment_status: "Entrepreneur",
    credit_score: 650,
    has_guarantor: true,
    guarantor_income: 4200,
    desired_move_in: "2023-12-05",
    desired_property: "City Center Lofts",
    notes: "New business started 8 months ago, parents as guarantors.",
    application_date: "2023-10-12",
    status: "rejected"
  }
];

const tenantComparisonApi = {
  getApplicants: () => Promise.resolve(applicants),
  
  getApplicantById: (id) => {
    const applicant = applicants.find(app => app.id === id);
    return applicant ? Promise.resolve(applicant) : Promise.reject(new Error(`Applicant with id ${id} not found`));
  },
  
  addApplicant: (applicantData) => {
    const newId = Math.max(...applicants.map(a => a.id)) + 1;
    const newApplicant = {
      ...applicantData,
      id: newId,
      application_date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    applicants.push(newApplicant);
    return Promise.resolve(newApplicant);
  },
  
  updateApplicantStatus: (id, status) => {
    const index = applicants.findIndex(app => app.id === id);
    if (index >= 0) {
      applicants[index] = { ...applicants[index], status };
      return Promise.resolve(applicants[index]);
    }
    return Promise.reject(new Error(`Applicant with id ${id} not found`));
  },
  
  deleteApplicant: (id) => {
    const index = applicants.findIndex(app => app.id === id);
    if (index >= 0) {
      const deleted = applicants.splice(index, 1)[0];
      return Promise.resolve(deleted);
    }
    return Promise.reject(new Error(`Applicant with id ${id} not found`));
  }
};

export { applicants, tenantComparisonApi };