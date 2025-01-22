import React from "react";
// import "./MetricsTable.css";

const MatricsTable = ({ metrics }) => {
  if (!metrics) return <div>Loading...</div>; // Added loading state

  return (
    <div className="metrics-table">
      <h3>Pronunciation Metrics</h3>
      <table>
        <thead>
          <tr>
            <th>Accuracy</th>
            <th>Fluency</th>
            <th>Completeness</th>
            <th>Pronunciation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{metrics.accuracy}</td>
            <td>{metrics.fluency}</td>
            <td>{metrics.completeness}</td>
            <td>{metrics.pronunciation}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MatricsTable;
