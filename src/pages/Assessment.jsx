import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Assessment() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get('/api/v1/patients')
      setPatients(data.data)
    } catch (error) {
      toast.error('Failed to fetch patients')
    }
  }

  const handleAnalyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error('Please enter symptoms')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post('/api/v1/assessments/analyze-symptoms', {
        symptoms
      })
      setAnalysis(data.data)
    } catch (error) {
      toast.error('Failed to analyze symptoms')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAssessment = async () => {
    if (!selectedPatient) {
      toast.error('Please select a patient')
      return
    }

    try {
      await axios.post('/api/v1/assessments', {
        patientId: selectedPatient,
        symptoms: analysis.symptoms,
        possibleCauses: analysis.possibleCauses,
        suggestedTests: analysis.suggestedTests,
        treatmentSuggestions: analysis.treatmentSuggestions
      })
      toast.success('Assessment saved successfully')
      setSymptoms('')
      setAnalysis(null)
      setSelectedPatient('')
    } catch (error) {
      toast.error('Failed to save assessment')
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">New Assessment</h3>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700">
                Patient
              </label>
              <select
                id="patient"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700">
                Symptoms
              </label>
              <div className="mt-1">
                <textarea
                  id="symptoms"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Enter symptoms, separated by commas"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleAnalyzeSymptoms}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Analyzing...' : 'Analyze Symptoms'}
            </button>
          </div>

          {analysis && (
            <div className="mt-6">
              <div className="rounded-md bg-gray-50 p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Possible Causes:</h4>
                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                      {analysis.possibleCauses.map((cause, index) => (
                        <li key={index}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Suggested Tests:</h4>
                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                      {analysis.suggestedTests.map((test, index) => (
                        <li key={index}>{test}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Treatment Suggestions:</h4>
                    <ul className="mt-2 list-disc pl-5 text-sm text-gray-500">
                      {analysis.treatmentSuggestions.map((treatment, index) => (
                        <li key={index}>{treatment}</li>
                      ))}
                    </ul>
                  </div>
                
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleSaveAssessment}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Save Assessment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}