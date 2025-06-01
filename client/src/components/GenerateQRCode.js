import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';

export default function QRCodeGenerator() {

  const { userData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    text: userData ? userData.name : 'Hello World!',
    size: 200,
    margin: 2,
    foreground: '#FFFFFF',
    background: '#000000',
    errorCorrection: 'H',
    format: 'png',
    logoUrl: ''
  });

  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const generateQRCode = () => {
    const baseUrl = 'https://quickchart.io/qr';
    const params = new URLSearchParams({
      text: formData.text,
      size: formData.size,
      margin: formData.margin,
      light: formData.background.replace('#', ''),
      dark: formData.foreground.replace('#', ''),
      ecLevel: formData.errorCorrection,
      format: formData.format
    });

    if (formData.logoUrl) {
      params.append('logo', formData.logoUrl);
    }

    setQrCodeUrl(`${baseUrl}?${params.toString()}`);
  };

  document.title = 'QR Code Generator | Linkwith | Create Custom Short URLs with Ease';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            QR Code Generator
          </h1>
          <p className="mt-4 text-gray-400 text-lg">
            Create customizable QR codes with ease.
          </p>
        </div>

        {/* Form and QR Code Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800">
            <div className="space-y-6">
              {[
                { label: 'QR Data (Text or URL)', name: 'text', type: 'text', placeholder: 'Enter text or URL' },
                { label: 'Size (px)', name: 'size', type: 'number', placeholder: '200' },
                { label: 'Logo URL', name: 'logoUrl', type: 'text', placeholder: 'Optional: Enter logo URL' }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none text-gray-100 placeholder-gray-500 transition-all duration-200"
                  />
                </div>
              ))}

              {[
                {
                  label: 'Margin (Blocks)',
                  name: 'margin',
                  options: [0, 1, 2, 3, 4]
                },
                {
                  label: 'Error Correction Level',
                  name: 'errorCorrection',
                  options: ['L', 'M', 'Q', 'H']
                },
                {
                  label: 'Format',
                  name: 'format',
                  options: ['png', 'svg', 'jpeg']
                }
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    {field.label}
                  </label>
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700 focus:outline-none text-gray-100 transition-all duration-200"
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option.toString()}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Foreground Color', name: 'foreground' },
                  { label: 'Background Color', name: 'background' }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {field.label}
                    </label>
                    <input
                      type="color"
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className="h-10 w-full rounded-lg border border-gray-700 bg-gray-800/50 text-gray-100 focus:outline-none"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={generateQRCode}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg transition-all duration-200 hover:from-blue-600 hover:to-cyan-600 focus:outline-none"
              >
                Generate QR Code
              </button>
            </div>
          </div>

          {/* QR Code Display Section */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-800 flex flex-col items-center justify-center">
            {qrCodeUrl ? (
              <>
                <img
                  src={qrCodeUrl}
                  alt="Generated QR Code"
                  className="mb-6 w-full max-w-xs"
                />
                <a
                  href={qrCodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4"
                >
                  Download QR Code
                </a>
              </>
            ) : (
              <p className="text-gray-500 text-center">
                Your QR code will appear here.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
