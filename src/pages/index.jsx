import Chart from "chart.js/auto";
import * as React from 'react';
import 'chartjs-adapter-moment';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
const formatThousands = (value) => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);
const HomePage = () => {

  const [analytics, setAnalytics] = React.useState({
    totalDownloads: 0,
    maximumDownloads: 0,
    startEndStr: '',
    avgDownloadsMonthly: 0,
    avgDownloadsWeekly: 0,
    isNotFound: false
  });
  const fetchFromStartAndEnd = async (startDate, endDate) => {
    if (searching) return;
    setSearching(true);
    const labels = [];
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    // from start to end loop through each month.
    for (let i = 0; i <= 12; i++) {
      const date = new Date(start.getFullYear(), start.getMonth() + i, start.getDate());
      if (date > end) {
        break;
      }
      dates.push(date);
      const label = formatDate(date);
      labels.push(label);
    }

    const result = await fetchDownloadData(labels);
    const totalDownloads = result.reduce((a, b) => a + b, 0);
    setAnalytics(pre => {
      return {
        ...pre,
        totalDownloads: formatThousands(result.reduce((a, b) => a + b, 0)),
        maximumDownloads: formatThousands(result.reduce((a, b) => Math.max(a, b), 0)),
        startEndStr: `${labels[0]} to ${labels[labels.length - 1]}`,
        avgDownloadsMonthly: formatThousands(totalDownloads / result.length),
        avgDownloadsWeekly: formatThousands(totalDownloads / (result.length / 4)),
        isNotFound: false
      }
    });


    setDateValue({
      startDate: dates[0],
      endDate: dates[dates.length - 1]
    });

    const ctx = document.getElementById('chart').getContext('2d');

    labels.shift();

    createLineChart(ctx, labels, result, `${labels[0]} to ${labels[labels.length - 1]}`);
  };
  const fetchDownloadsForLastYear = async (startDate, endDate) => {
    // if (startDate && endDate) {
    //   return fetchFromStartAndEnd(startDate, endDate);
    // }
    const dates = [];
    const labels = [];

    const today = new Date();
    for (let i = 0; i <= 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, today.getDate());
      dates.push(date);
      const label = formatDate(date);
      labels.push(label);
    }

    const result = await fetchDownloadData(labels);
    const totalDownloads = result.reduce((a, b) => a + b, 0);
    setAnalytics(pre => {
      return {
        ...pre,
        totalDownloads: formatThousands(result.reduce((a, b) => a + b, 0)),
        maximumDownloads: formatThousands(result.reduce((a, b) => Math.max(a, b), 0)),
        startEndStr: `${labels[labels.length - 1]} to ${labels[0]}`,
        avgDownloadsMonthly: formatThousands(totalDownloads / result.length),
        avgDownloadsWeekly: formatThousands(totalDownloads / (result.length / 4)),
        isNotFound: false
      }
    });

    setDateValue({
      startDate: dates[dates.length - 1],
      endDate: dates[0]
    });


    const ctx = document.getElementById('chart').getContext('2d');

    labels.pop();
    createLineChart(ctx, labels, result, `${labels[labels.length - 1]} to ${labels[0]}`);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = (date.getDate() + 1).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchDownloadData = async (labels) => {
    const result = [];
    for (let i = labels.length - 1; i >= 1; i--) {
      const res = await fetch(
        `https://api.npmjs.org/downloads/point/${labels[i]}:${labels[i - 1]}/${search}`
      ).then((res) => res.json());
      result.push(res.downloads || 0);
    }
    return result;
  };

  const createLineChart = (ctx, labels, data, label) => {
    if (window.myLine) {
      window.myLine.destroy();
      window.myLine = null;
    }
    window.myLine = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label,
            data: data,
            fill: true,
            backgroundColor: 'rgba(59, 130, 246, 0.08)',
            borderColor: 'rgb(99, 102, 241)',
            borderWidth: 2,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 3,
            pointBackgroundColor: 'rgb(99, 102, 241)',
          },
        ],
      },
      options: {
        layout: {
          padding: 20,
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
            },
            ticks: {
              callback: (value) => formatThousands(value),
            },
          },
          x: {
            type: 'time',
            time: {
              parser: 'YYYY-MM-DD',
              unit: 'month',
              displayFormats: {
                month: 'MMM YY',
              },
            },
            grid: {
              display: false,
              drawBorder: false,
            },
            ticks: {
              autoSkipPadding: 12,
              maxRotation: 0,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: () => false, // Disable tooltip title
              label: (context) => formatThousands(context.parsed.y),
            },
          },
        },
        interaction: {
          intersect: false,
          mode: 'nearest',
        },
        maintainAspectRatio: true
      },
    });
    setSearching(false);
  };

  const fetchPackageInfo = async () => {
    try {

      setSearching(true);
      let res = await fetch(`https://api.npms.io/v2/package/${search}`);
      console.log(res, '11')
      if (res.status == 404) {
        console.log('not found')
        setSearching(false);
        setAnalytics(pre => {
          return {
            ...pre,
            isNotFound: true
          }
        });
        return false;
      }
      res = await res.json();

      setSearchResults(res);
      setAnalytics(pre => {
        return {
          ...pre,
          ...res,
          isNotFound: false
        }
      });
      console.log(res)
      setSearching(false);
      return true;
    } catch (e) {
      setSearching(false);
      setAnalytics(pre => {
        return {
          ...pre,
          isNotFound: true,
        }
      });

      return false;
    }
  };

  const initFunction = async () => {
    const success = await fetchPackageInfo();
    if (success) {
      fetchDownloadsForLastYear();
    }
  };
  console.log(analytics)
  React.useEffect(() => {
    // load from query string
    const urlParams = new URLSearchParams(window.location.search);
    const packageName = urlParams.get('package');
    if (packageName) {
      setSearch(packageName);
    }
    initFunction();
    return () => {
      window.myLine?.destroy();
      window.myLine = null;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [search, setSearch] = React.useState('react-native');
  const [searchResults, setSearchResults] = React.useState([]);
  const [searching, setSearching] = React.useState(true);
  const [dateValue, setDateValue] = React.useState([new Date(), new Date()]);
  const searchPackageStats = async () => {
    // update the url.
    setSearching(true);
    window.history.pushState({}, '', `/?package=${search}`);
    const success = await fetchPackageInfo();
    if (success) {
      fetchDownloadsForLastYear();
    }

  };

  const handleDateValue = (value) => {
    console.log(value);
    const start = value[0]
    const end = value[1]
    const label = `${start} to ${end}`;
    setAnalytics(pre => {
      return {
        ...pre,
        startEndStr: label
      }
    });
    fetchDownloadsForLastYear(start, end);


  };
  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />
      <main className="w-full min-h-screen bg-gray-100 flex flex-col justify-center align-middle">
        {/* Search */}
        <section className="w-auto text-gray-600 ">
          {
            searching &&
            <div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>
          }
          <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
            <div className="flex flex-col col-span-full xl:col-span-8 bg-white rounded-md shadow-lg border border-gray-200">
              <header className="px-5 py-4 border-b border-gray-100 flex items-center">

                <h2 className="font-semibold text-gray-800">Check Statistics for NPM Package</h2>
                {/* Label */}
                <div className="ml-auto flex items-center">
                  {/* TODO */}
                </div>
              </header>
              <div className="p-3">
                <div className="flex flex-col">
                  <div className="flex flex-col sm:flex-row gap-2" >

                    <div className="flex flex-col sm:flex-row sm:space-x-2 w-full">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md px-5 py-3 w-full focus:outline-none focus:border-blue-500 w-128"
                        placeholder="Eg. react-native"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}

                      />
                    </div>
                    <div className="flex flex-col  sm:flex-row sm:space-x-4 sm:w-64 w-full">
                      <button
                        className="border border-gray-300 rounded-md px-5 py-3 w-full focus:outline-none focus:border-blue-500 bg-indigo-500 font-semibold	 hover:bg-indigo-800 hover:bottom-5 hover:border-indigo-800 text-white rounded-md"
                        onClick={searchPackageStats}
                      >
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {
          !analytics.isNotFound ? <>
            {/* Performance */}
            <section className="w-auto flex-col justify-center antialiased text-gray-600">
              <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
                <div className="flex flex-col col-span-full rounded-md xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200 gap-6 px-6 py-6">
                  <div>
                    <div className="mb-1 text-base font-medium text-green-700 dark:text-green-500">Maintenance ({(analytics?.score?.detail?.maintenance * 100).toFixed()}%)</div>
                    <div className="w-full bg-gray-200 rounded-md h-2.5 dark:bg-gray-700">
                      <div className="bg-green-600 h-3 rounded-md" style={{ width: `${(analytics?.score?.detail?.maintenance * 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-base font-medium text-sky-700 dark:text-sky-500">Quality ({(analytics?.score?.detail?.quality * 100).toFixed()}%)</div>
                    <div className="w-full bg-gray-200 rounded-md h-2.5 dark:bg-gray-700">
                      <div className="bg-sky-600 h-3 rounded-md" style={{ width: `${(analytics?.score?.detail?.quality * 100)}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 text-base font-medium text-orange-700 dark:text-orange-500">Popularity ({(analytics?.score?.detail?.popularity * 100).toFixed()}%)</div>
                    <div className="w-full bg-gray-200 rounded-md h-2.5 dark:bg-gray-700">
                      <div className="bg-orange-600 h-3 rounded-md" style={{ width: `${(analytics?.score?.detail?.popularity * 100)}%` }}></div>
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
                <div className="flex flex-col col-span-full rounded-md xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200">
                  <header className="px-5 py-4 border-b border-gray-100 flex items-center">
                    <h2 className="font-semibold text-gray-800">Analytics</h2>
                    {/* Label */}
                    <div className="ml-auto flex items-center">
                      <div className="text-sm font-medium text-gray-500 mr-2">{analytics.startEndStr}</div>
                      {/* <Datepicker
                    value={dateValue}
                    onChange={handleDateValue}
                  /> */}
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
                            <div className="text-3xl font-bold text-gray-800 mr-2">{analytics.avgDownloadsWeekly}</div>
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
            : (
              <section className="w-auto max-w-3xl mx-auto p-4 sm:px-6 h-full bg-white rounded-md shadow-lg border border-gray-200">
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
                        ></path>
                      </svg>
                    </div>
                    <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">No analytics available</h2>
                    <p className="text-gray-500 dark:text-gray-300">Analytics will be available after the package has been downloaded at least once.</p>
                  </div>
                </div>
              </section>
            )
        }
      </main>
    </Layout >
  );
}

export default HomePage;