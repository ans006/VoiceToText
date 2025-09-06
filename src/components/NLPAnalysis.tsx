import React from 'react';
import { Brain, TrendingUp, BarChart3, FileText } from 'lucide-react';
import { NLPAnalysis as NLPAnalysisType } from '../utils/nlpUtils';

interface NLPAnalysisProps {
  analysis: NLPAnalysisType;
}

const NLPAnalysis: React.FC<NLPAnalysisProps> = ({ analysis }) => {
  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive': return '😊';
      case 'negative': return '😞';
      default: return '😐';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Brain className="w-6 h-6 mr-2 text-purple-600" />
        NLP Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sentiment Analysis */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
            Sentiment Analysis
          </h3>
          <div className="text-center">
            <div className="text-4xl mb-2">
              {getSentimentIcon(analysis.sentiment.label)}
            </div>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSentimentColor(analysis.sentiment.label)}`}>
              {analysis.sentiment.label.charAt(0).toUpperCase() + analysis.sentiment.label.slice(1)}
            </div>
            <div className="mt-3">
              <div className="text-sm text-gray-600 mb-1">Confidence Score</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.sentiment.confidence * 100}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(analysis.sentiment.confidence * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Text Statistics */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Text Statistics
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Words</span>
              <span className="font-semibold text-gray-800">{analysis.statistics.totalWords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unique Words</span>
              <span className="font-semibold text-gray-800">{analysis.statistics.uniqueWords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sentences</span>
              <span className="font-semibold text-gray-800">{analysis.statistics.sentences}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Words/Sentence</span>
              <span className="font-semibold text-gray-800">{analysis.statistics.averageWordsPerSentence}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Word Length</span>
              <span className="font-semibold text-gray-800">{analysis.statistics.averageWordLength}</span>
            </div>
          </div>
        </div>

        {/* Top Words */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-green-600" />
            Top Words
          </h3>
          <div className="space-y-2">
            {analysis.topWords.slice(0, 5).map((item, index) => (
              <div key={item.word} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mr-3 ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-600 text-white' :
                    'bg-green-200 text-green-800'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-gray-800 font-medium">{item.word}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(item.count / analysis.topWords[0]?.count || 1) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-600">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NLPAnalysis;