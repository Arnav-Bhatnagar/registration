import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, User, Phone, CreditCard, MapPin, Calendar, Loader2 } from 'lucide-react';
import { generatePatientId } from '../utils/generateId';

const PatientForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    address: '',
    language: 'en-IN'
  });

  const [activeField, setActiveField] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [errors, setErrors] = useState({});
  const [browserSupport, setBrowserSupport] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setBrowserSupport(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log('Voice recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Voice transcript:', transcript);

      setFormData(prev => {
        const field = activeField;
        if (!field) return prev;

        const currentValue = prev[field];
        const newValue = currentValue ? `${currentValue} ${transcript}` : transcript;

        console.log(`Updating ${field} with:`, newValue);

        return {
          ...prev,
          [field]: newValue.trim()
        };
      });
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);

      if (event.error === 'not-allowed') {
        alert('Microphone access denied. Please allow microphone access in your browser settings.');
      } else if (event.error === 'no-speech') {
        alert('No speech detected. Please try again and speak clearly.');
      } else if (event.error === 'audio-capture') {
        alert('No microphone found. Please connect a microphone.');
      } else if (event.error !== 'aborted') {
        alert(`Voice recognition error: ${event.error}`);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.log('Cleanup:', e);
        }
      }
    };
  }, [activeField]);

  const handleVoiceInput = (fieldName) => {
    const recognition = recognitionRef.current;

    if (!browserSupport || !recognition) {
      alert('Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      console.log('Stopping voice recognition');
      try {
        recognition.stop();
      } catch (e) {
        console.log('Stop error:', e);
      }
      setIsListening(false);
      setActiveField(null);
      return;
    }

    console.log('Starting voice recognition for field:', fieldName);
    setActiveField(fieldName);
    recognition.lang = formData.language;

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);

      if (error.name === 'InvalidStateError') {
        recognition.abort();
        setTimeout(() => {
          try {
            setActiveField(fieldName);
            recognition.start();
          } catch (e) {
            console.error('Retry failed:', e);
            setIsListening(false);
            setActiveField(null);
          }
        }, 100);
      } else {
        setIsListening(false);
        setActiveField(null);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.age || formData.age < 1 || formData.age > 150) {
      newErrors.age = 'Valid age is required';
    }

    if (!formData.phone.trim() || formData.phone.length < 10) {
      newErrors.phone = 'Valid phone number is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const patientId = generatePatientId();
      onSubmit({
        ...formData,
        patientId,
        registrationDate: new Date().toISOString()
      });
    }
  };

  const languages = [
    { code: 'en-IN', name: 'English' },
    { code: 'hi-IN', name: 'हिंदी (Hindi)' },
    { code: 'pa-IN', name: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)' },
    { code: 'bn-IN', name: 'বাংলা (Bengali)' },
    { code: 'mr-IN', name: 'मराठी (Marathi)' },
    { code: 'gu-IN', name: 'ગુજરાતી (Gujarati)' },
    { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml-IN', name: 'മലയാളം (Malayalam)' }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
        

        {!browserSupport && (
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Warning:</strong> Voice recognition is not supported in your browser. Please use Chrome, Edge, or Safari for voice input.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Language / भाषा चुनें
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-base"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Patient Name / रोगी का नाम
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter patient name"
                  className={`w-full pl-12 pr-14 py-3 rounded-lg border-2 ${
                    errors.name ? 'border-red-400' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-base`}
                />
                <button
                  type="button"
                  onClick={() => handleVoiceInput('name')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                    isListening && activeField === 'name'
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title="Click to start/stop voice input"
                >
                  {isListening && activeField === 'name' ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age / उम्र
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Calendar className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
                  className={`w-full pl-12 pr-14 py-3 rounded-lg border-2 ${
                    errors.age ? 'border-red-400' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-base`}
                />
                <button
                  type="button"
                  onClick={() => handleVoiceInput('age')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                    isListening && activeField === 'age'
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title="Click to start/stop voice input"
                >
                  {isListening && activeField === 'age' ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number / फ़ोन नंबर
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Phone className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className={`w-full pl-12 pr-14 py-3 rounded-lg border-2 ${
                    errors.phone ? 'border-red-400' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-base`}
                />
                <button
                  type="button"
                  onClick={() => handleVoiceInput('phone')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                    isListening && activeField === 'phone'
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title="Click to start/stop voice input"
                >
                  {isListening && activeField === 'phone' ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>



            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aadhaar No. / आधार नंबर
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  maxlength='12'
                  onChange={handleInputChange}
                  placeholder="Enter Aadhaar No. "
                  className={`w-full pl-12 pr-14 py-3 rounded-lg border-2 ${
                    errors.phone ? 'border-red-400' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-base`}
                />
                <button
                  type="button"
                  onClick={() => handleVoiceInput('phone')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                    isListening && activeField === 'phone'
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title="Click to start/stop voice input"
                >
                  {isListening && activeField === 'phone' ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>





            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address / पता
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 pointer-events-none">
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete address"
                  rows="3"
                  className={`w-full pl-12 pr-14 py-3 rounded-lg border-2 ${
                    errors.address ? 'border-red-400' : 'border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none text-base`}
                />
                <button
                  type="button"
                  onClick={() => handleVoiceInput('address')}
                  className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
                    isListening && activeField === 'address'
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                  title="Click to start/stop voice input"
                >
                  {isListening && activeField === 'address' ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {isListening && (
            <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 py-3 rounded-lg animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="font-medium">
                Listening for {activeField}... Speak now
              </span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-lg"
          >
            Generate Patient ID
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
