import { CheckCircle, User, Phone, MapPin, Calendar, RefreshCw } from 'lucide-react';

const PatientIdDisplay = ({ patientId, patientData, onReset }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Registration Successful!
          </h2>
          <p className="text-gray-600">Patient has been registered successfully</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 md:p-8 mb-6 text-center">
          <p className="text-blue-100 text-sm md:text-base mb-2 font-medium">
            PATIENT ID
          </p>
          <p className="text-3xl md:text-5xl font-bold text-white tracking-wider mb-2">
            {patientId}
          </p>
          <p className="text-blue-100 text-xs md:text-sm">
            Please save this ID for future reference
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Patient Details</h3>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-base md:text-lg font-semibold text-gray-800">
                {patientData.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Age</p>
              <p className="text-base md:text-lg font-semibold text-gray-800">
                {patientData.age} years
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Phone Number</p>
              <p className="text-base md:text-lg font-semibold text-gray-800">
                {patientData.phone}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="text-base md:text-lg font-semibold text-gray-800">
                {patientData.address}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Register Another Patient
        </button>
      </div>
    </div>
  );
};

export default PatientIdDisplay;
