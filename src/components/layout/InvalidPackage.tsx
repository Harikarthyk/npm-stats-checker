import React from 'react';

interface Props {
  analytics: any;
  children: any;
}

const InvalidPackage = ({ analytics, children }: Props) => {

  if (analytics.isNotFound === true) {
    return (<section className="w-auto max-w-3xl mx-auto p-4 sm:px-6 h-full bg-white rounded-md shadow-lg border border-gray-200">
      <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full ">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gray-100">
            <svg
              className="w-8 h-8 text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12 0a12 12 0 100 24 12 12 0 000-24zM6.5 8a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0zm9 8a4 4 0 11-8 0 4 4 0 018 0zm-9 0a5 5 0 1110 0 5 5 0 01-10 0z"
                clipRule="evenodd"
              >
              </path>
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">
            No analytics available
          </h2>
          <p className="text-gray-500 dark:text-gray-300">
            Analytics will be available after the package has been downloaded at least once.
          </p>
        </div>
      </div>
    </section>)
  }
  return (
    <>
      {children}
    </>
  )
}

export default InvalidPackage