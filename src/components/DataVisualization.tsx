import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Download } from 'lucide-react';
import { NLPAnalysis } from '../utils/nlpUtils';
import jsPDF from 'jspdf';

interface DataVisualizationProps {
  analysis: NLPAnalysis;
  transcription: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({ analysis, transcription }) => {
  const barChartData = analysis.topWords.slice(0, 8).map(item => ({
    word: item.word,
    count: item.count
  }));

  const sentimentData = [
    { name: 'Positive', value: analysis.sentiment.label === 'positive' ? 1 : 0, color: '#10B981' },
    { name: 'Neutral', value: analysis.sentiment.label === 'neutral' ? 1 : 0, color: '#6B7280' },
    { name: 'Negative', value: analysis.sentiment.label === 'negative' ? 1 : 0, color: '#EF4444' }
  ].filter(item => item.value > 0);

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316'];

  const generatePDFReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;

    // Title
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('Voice to Text NLP Analysis Report', margin, 30);

    // Date
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 45);

    // Statistics Section
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    doc.text('Text Statistics:', margin, 65);

    doc.setFontSize(10);
    let yPos = 75;
    const stats = [
      `Total Words: ${analysis.statistics.totalWords}`,
      `Unique Words: ${analysis.statistics.uniqueWords}`,
      `Sentences: ${analysis.statistics.sentences}`,
      `Average Words per Sentence: ${analysis.statistics.averageWordsPerSentence}`,
      `Average Word Length: ${analysis.statistics.averageWordLength}`
    ];

    stats.forEach(stat => {
      doc.text(stat, margin, yPos);
      yPos += 10;
    });

    // Sentiment Analysis
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Sentiment Analysis:', margin, yPos);
    yPos += 15;

    doc.setFontSize(10);
    doc.text(`Overall Sentiment: ${analysis.sentiment.label.toUpperCase()}`, margin, yPos);
    yPos += 10;
    doc.text(`Confidence Score: ${Math.round(analysis.sentiment.confidence * 100)}%`, margin, yPos);

    // Top Words
    yPos += 20;
    doc.setFontSize(14);
    doc.text('Top Words:', margin, yPos);
    yPos += 15;

    doc.setFontSize(10);
    analysis.topWords.slice(0, 10).forEach((item, index) => {
      doc.text(`${index + 1}. ${item.word}: ${item.count}`, margin, yPos);
      yPos += 8;
    });

    // Transcription (if space allows)
    if (yPos < 200 && transcription) {
      doc.setFontSize(14);
      doc.text('Transcription:', margin, yPos + 10);
      
      const splitText = doc.splitTextToSize(transcription, pageWidth - 2 * margin);
      doc.setFontSize(9);
      doc.text(splitText, margin, yPos + 25);
    }

    doc.save(`nlp-analysis-report-${new Date().getTime()}.pdf`);
  };

  if (!analysis.topWords.length) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
          Data Visualization
        </h2>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <BarChart3 className="w-16 h-16 mx-auto" />
          </div>
          <p className="text-gray-600">No data to visualize. Start by recording or typing some text.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
          Data Visualization
        </h2>
        <button
          onClick={generatePDFReport}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Word Frequency Bar Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
            Word Frequency
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                <XAxis 
                  dataKey="word" 
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Distribution */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <PieChartIcon className="w-5 h-5 mr-2 text-purple-600" />
            Sentiment Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center mt-4">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              analysis.sentiment.label === 'positive' ? 'bg-green-100 text-green-700' :
              analysis.sentiment.label === 'negative' ? 'bg-red-100 text-red-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              Overall: {analysis.sentiment.label.charAt(0).toUpperCase() + analysis.sentiment.label.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Word Cloud Simulation */}
      <div className="mt-8 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Word Cloud</h3>
        <div className="flex flex-wrap gap-2 justify-center">
          {analysis.topWords.slice(0, 20).map((item, index) => (
            <span
              key={item.word}
              className="inline-block px-3 py-1 rounded-full text-white font-medium transition-transform hover:scale-110"
              style={{
                backgroundColor: COLORS[index % COLORS.length],
                fontSize: `${Math.max(0.8, Math.min(1.5, item.count / 2))}rem`
              }}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;