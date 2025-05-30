import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function Diagnostics() {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState('')
  const [diagnosticType, setDiagnosticType] = useState('ecg')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [diagnostics, setDiagnostics] = useState([])

  useEffect(() => {
    fetchPatients()
    fetchDiagnostics()
  }, [])

  const fetchPatients = async () => {
    try {
      const { data } = await axios.get('/api/v1/patients')
      setPatients(data.data)
    } catch (error) {
      toast.error('Failed to fetch patients')
    }
  }

  const fetchDiagnostics = async () => {
    try {
      const { data } = await axios.get('/api/v1/diagnostics')
      setDiagnostics(data.data)
    } catch (error) {
      toast.error('Failed to fetch diagnostics')
    }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedPatient) {
      toast.error('Please select a patient')
      return
    }
    if (!file) {
      toast.error('Please select a file')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('patientId', selectedPatient)
    formData.append('type', diagnosticType)

    setLoading(true)
    try {
      await axios.post('/api/v1/diagnostics', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      toast.success('Diagnostic uploaded successfully')
      setSelectedPatient('')
      setFile(null)
      fetchDiagnostics()
    } catch (error) {
      toast.error('Failed to upload diagnostic')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Upload New Diagnostic</h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
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

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Diagnostic Type
              </label>
              <select
                id="type"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={diagnosticType}
                onChange={(e) => setDiagnosticType(e.target.value)}
              >
                <option value="ecg">ECG</option>
                <option value="x-ray">X-Ray</option>
                <option value="ct-scan">CT Scan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload File</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, PNG, JPG, CSV up to 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Diagnostics</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {diagnostics.map((diagnostic) => (
              <li key={diagnostic._id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Patient: {diagnostic.patient.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Type: {diagnostic.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {new Date(diagnostic.date).toLocaleDateString()}
                    </p>
                  </div>
                  {diagnostic.fileUrl && (
                    <a
                      href={diagnostic.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View File
                    </a>
                  )}
                </div>
                {diagnostic.conclusion && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Conclusion: {diagnostic.conclusion}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}