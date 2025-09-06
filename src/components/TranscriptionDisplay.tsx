import React, { useState } from 'react';
import { FileText, Download, Copy, CheckCircle } from 'lucide-react';

interface TranscriptionDisplayProps {
  transcription: string;
  onTranscriptionChange: (text: string) => void;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({ 
  transcription, 
  onTranscriptionChange 
}) => {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([transcription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcription-${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const wordCount = transcription.trim() ? transcription.trim().split(/\s+/).length : 0;
  const charCount = transcription.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FileText className="w-6 h-6 mr-2 text-purple-600" />
          Transcription
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            disabled={!transcription}
            className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {copied ? <CheckCircle className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!transcription}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
        </div>
      </div>

      <div className="mb-4">
        <textarea
          value={transcription}
          onChange={(e) => onTranscriptionChange(e.target.value)}
          placeholder="Your transcribed text will appear here... You can also type or paste text directly."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex space-x-4">
          <span>Words: <strong>{wordCount}</strong></span>
          <span>Characters: <strong>{charCount}</strong></span>
        </div>
        <div className="text-xs text-gray-500">
          {transcription ? 'Text ready for analysis' : 'Start recording or type to begin'}
        </div>
      </div>
    </div>
  );
};

export default TranscriptionDisplay;