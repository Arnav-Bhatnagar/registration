import { useState } from 'react';
import PatientForm from './components/PatientForm';
import PatientIdDisplay from './components/PatientIdDisplay';

function App() {
  const [patientId, setPatientId] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const handleFormSubmit = (data) => {
    setPatientData(data);
    setPatientId(data.patientId);
  };

  const handleReset = () => {
    setPatientId(null);
    setPatientData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-2">
            Patient Registration
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Multilingual Voice-Enabled Form
          </p>
        </header>

        {!patientId ? (
          <PatientForm onSubmit={handleFormSubmit} />
        ) : (
          <PatientIdDisplay
            patientId={patientId}
            patientData={patientData}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default App;
