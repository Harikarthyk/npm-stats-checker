import React from 'react';

interface Props {
  analytics: any;
}

const Analytics = ({
  analytics
}: Props) => {
  return (
    <>
      {/* Performance */}
      <section className="w-auto flex-col justify-center antialiased text-gray-600">
        <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
          <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200 gap-6 px-6 py-6">
            <div>
              <div className="mb-1 text-base font-medium text-green-700 dark:text-green-500">
                Maintenance ({(analytics?.score?.detail?.maintenance * 100).toFixed()}%)
              </div>
              <div className="w-full bg-gray-200 rounded-md h-2.5 dark:bg-gray-700">
                <div
                  className="bg-green-600 h-3 rounded-md"
                  style={{ width: `${(analytics?.score?.detail?.maintenance * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 text-base font-medium text-sky-700 dark:text-sky-500">
                Quality ({(analytics?.score?.detail?.quality * 100).toFixed()}%)
              </div>
              <div className="w-full bg-gray-200 rounded-md h-2.5 dark:bg-gray-700">
                <div
                  className="bg-sky-600 h-3 rounded-md"
                  style={{ width: `${(analytics?.score?.detail?.quality * 100)}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 text-base font-medium text-orange-700 dark:text-orange-500">
                Popularity ({(analytics?.score?.detail?.popularity * 100).toFixed()}%)
              </div>
              <div className="w-full bg-gray-200 rounded-md h-2.5 dark:bg-gray-700">
                <div
                  className="bg-orange-600 h-3 rounded-md"
                  style={{ width: `${(analytics?.score?.detail?.popularity * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 text-base font-medium text-indigo-700 dark:text-indigo-500">Overall ({(analytics?.score?.final * 100).toFixed()}%)</div>
              <div className="w-full bg-gray-200 rounded-md h-2.5 dark:bg-gray-700">
                <div className="bg-indigo-600 h-3 rounded-md" style={{ width: `${(analytics?.score?.final * 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Analytics */}
      <section className="w-auto flex-col justify-center antialiased text-gray-600">
        <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
          <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200">
            <header className="px-5 py-4 border-b border-gray-100 flex items-center">
              <h2 className="font-semibold text-gray-800">Analytics</h2>
              <div className="ml-auto flex items-center">
                <div className="text-sm font-medium text-gray-500 mr-2">{analytics.startEndStr}</div>
                <div className="flex items-center justify-center bg-gray-100 rounded-md w-8 h-8">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 0a8 8 0 100 16A8 8 0 008 0zM4.5 8a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>

              </div>
            </header>
            <div className="px-5 py-1">
              <div className="flex flex-wrap">
                <div className="flex items-center py-2">
                  <div className="mr-5">
                    <div className="flex items-center">
                      <div className="text-3xl font-bold text-gray-800 mr-2">{analytics.totalDownloads}</div>
                    </div>
                    <div className="text-sm text-gray-500">Total Downloads</div>
                  </div>
                  <div className="hidden md:block w-px h-8 bg-gray-200 mr-5" aria-hidden="true"></div>
                </div>
                <div className="flex items-center py-2">
                  <div className="mr-5">
                    <div className="flex items-center">
                      <div className="text-3xl font-bold text-gray-800 mr-2">{analytics.avgDownloadsMonthly}</div>
                    </div>
                    <div className="text-sm text-gray-500">Average Monthly Downloads</div>
                  </div>
                  <div className="hidden md:block w-px h-8 bg-gray-200 mr-5" aria-hidden="true"></div>
                </div><div className="flex items-center py-2">
                  <div className="mr-5">
                    <div className="flex items-center">
                      <div className="text-3xl font-bold text-gray-800 mr-2">
                        {analytics.avgDownloadsWeekly}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Average Weekly Downloads</div>
                  </div>
                  <div className="hidden md:block w-px h-8 bg-gray-200 mr-5" aria-hidden="true"></div>
                </div>
              </div>
            </div>
            <div className="flex-grow">
              <canvas id="chart" width="800" height="300"></canvas>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Analytics