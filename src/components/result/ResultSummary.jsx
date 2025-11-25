import React from 'react'
import ResultTable from './ResultTable'

function ResultSummary({ result }) {
  if (!result) return null

  return (
    <div id="result" className="mt-6">
      <h3 className="text-lg font-medium text-gray-900">File Summary</h3>
      <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{result.filename}</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">File details and preview</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Total Rows</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{result.total_rows}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Columns</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{result.columns.join(', ')}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Preview</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ResultTable columns={result.columns} preview={result.preview} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default ResultSummary
