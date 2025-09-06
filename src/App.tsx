import React, { useState, useEffect } from 'react';
import { Mic, Brain, BarChart3, FileText } from 'lucide-react';
import VoiceRecorder from './components/VoiceRecorder';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import NLPAnalysis from './components/NLPAnalysis';
import DataVisualization from './components/DataVisualization';
import { analyzeText, NLPAnalysis as NLPAnalysisType } from './utils/nlpUtils';

function App() {
  const [transcription, setTranscription] = useState('');
  const [analysis, setAnalysis] = useState<NLPAnalysisType>({
    wordFrequency: {},
    sentiment: { score: 0, label: 'neutral', confidence: 0 },
    statistics: { totalWords: 0, uniqueWords: 0, sentences: 0, averageWordsPerSentence: 0, averageWordLength: 0 },
    topWords: []
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNewTranscription = (newText: string) => {
    setTranscription(prev => prev ? `${prev} ${newText}` : newText);
  };

  const handleTranscriptionChange = (newText: string) => {
    setTranscription(newText);
  };

  useEffect(() => {
    if (transcription.trim()) {
      setIsProcessing(true);
      // Simulate processing delay for better UX
      const timer = setTimeout(() => {
        const newAnalysis = analyzeText(transcription);
        setAnalysis(newAnalysis);
        setIsProcessing(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setAnalysis({
        wordFrequency: {},
        sentiment: { score: 0, label: 'neutral', confidence: 0 },
        statistics: { totalWords: 0, uniqueWords: 0, sentences: 0, averageWordsPerSentence: 0, averageWordLength: 0 },
        topWords: []
      });
    }
  }, [transcription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-3xl font-bold text-gray-900">Voice to Text NLP</h1>
                <p className="text-gray-600">Advanced speech recognition with natural language processing</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Mic className="w-4 h-4 mr-1" />
                Record
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Transcribe
              </div>
              <div className="flex items-center">
                <Brain className="w-4 h-4 mr-1" />
                Analyze
              </div>
              <div className="flex items-center">
                <BarChart3 className="w-4 h-4 mr-1" />
                Visualize
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Voice Input Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <VoiceRecorder
                onTranscription={handleNewTranscription}
                isProcessing={isProcessing}
              />
            </div>
            <div className="lg:col-span-2">
              <TranscriptionDisplay
                transcription={transcription}
                onTranscriptionChange={handleTranscriptionChange}
              />
            </div>
          </div>

          {/* Analysis Section */}
          {transcription.trim() && (
            <>
              <NLPAnalysis analysis={analysis} />
              <DataVisualization analysis={analysis} transcription={transcription} />
            </>
          )}

          {/* Getting Started Guide */}
          {!transcription.trim() && (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mic className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                      <Brain className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Voice to Text NLP</h2>
                  <p className="text-gray-600 mb-8">Transform your voice into insights with advanced natural language processing</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <Mic className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">1. Record or Type</h3>
                    <p className="text-gray-600 text-sm">Start by clicking the record button to capture live audio, or type/paste text directly into the transcription area.</p>
                  </div>
                  <div className="p-6 bg-purple-50 rounded-lg">
                    <Brain className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">2. Analyze Text</h3>
                    <p className="text-gray-600 text-sm">Our NLP engine automatically analyzes sentiment, calculates word frequencies, and extracts key insights from your text.</p>
                  </div>
                  <div className="p-6 bg-green-50 rounded-lg">
                    <BarChart3 className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">3. View Results</h3>
                    <p className="text-gray-600 text-sm">Explore interactive charts, word clouds, and detailed analytics. Export your results as PDF or text files.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">
              Built with React, Tailwind CSS, and advanced NLP processing
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Supports modern browsers with Web Speech API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;