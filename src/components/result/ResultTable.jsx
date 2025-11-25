import React from 'react'

function ResultTable({ columns, preview }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {preview.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => (
                <td
                  key={`${i}-${c}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {row[c] !== null ? String(row[c]) : 'null'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResultTable
