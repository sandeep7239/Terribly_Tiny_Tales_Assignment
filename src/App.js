import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://www.terriblytinytales.com/test.txt');
      const text = response.data;
      const words = text.split(/\s+/);
      const wordCount = words.reduce((acc, word) => {
        if (word in acc) {
          acc[word]++;
        } else {
          acc[word] = 1;
        }
        return acc;
      }, {});
      const sortedWords = Object.keys(wordCount).sort((a, b) => wordCount[b] - wordCount[a]);
      const top20Words = sortedWords.slice(0, 20);
      const chartData = top20Words.map((word) => ({ word, count: wordCount[word] }));
      setData(chartData);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const exportData = () => {
    const csvData = data.map(({ word, count }) => `${word},${count}`).join('\n');
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'histogram.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
  <div className='buttons'>
  {data.length == 0 &&<button className="submit-button" onClick={fetchData}>Submit</button>}
  {data.length > 0 && <button className="export" onClick={exportData}>Export</button>}
  </div>
  {loading && <div className="loading">Loading...</div>}
  {error && <div className="error">{error}</div>}
  {data.length > 0 && (
    <div className="chart">
      <BarChart width={800} height={300} data={data} barCategoryGap={0}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="word" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#4CAF50"/>
      </BarChart>
    </div>
  )}
</div>
  );
}

export default App;
