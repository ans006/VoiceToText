import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square, Play, Upload } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  isProcessing: boolean;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscription, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
      if (finalTranscript) {
        onTranscription(finalTranscript.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscription]);

  const startRecording = () => {
    if (recognitionRef.current && isSupported) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Note: This would require a backend service to process audio files
      alert('Audio file upload would require backend processing. This is a demo of the UI.');
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="text-red-500 mb-4">
          <MicOff className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Speech Recognition Not Supported</h3>
        <p className="text-gray-600">Your browser doesn't support the Web Speech API. Please try Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Mic className="w-6 h-6 mr-2 text-blue-600" />
        Voice Input
      </h2>
      
      <div className="space-y-6">
        {/* Live Recording */}
        <div className="text-center">
          <div className="mb-4">
            {isRecording ? (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full animate-pulse">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <Square className="w-6 h-6 text-white" />
                </div>
              </div>
            ) : (
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors">
                <Mic className="w-8 h-8 text-blue-600" />
              </div>
            )}
          </div>
          
          <div className="space-x-3">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center mx-auto"
              >
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
              </button>
            )}
          </div>
          
          {isRecording && (
            <p className="text-sm text-gray-600 mt-3 animate-pulse">
              Listening... Speak clearly into your microphone
            </p>
          )}
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Or Upload Audio File</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".mp3,.wav,.m4a"
              className="hidden"
            />
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 mb-2">Drop your audio file here or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">Supports MP3, WAV, M4A (Max 10MB)</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Choose File
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: Audio file processing requires backend integration (not implemented in this demo)
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;