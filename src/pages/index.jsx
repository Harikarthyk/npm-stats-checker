import * as React from 'react';

import Chart from "chart.js/auto";
import 'chartjs-adapter-moment';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

import AnalyticsContent from '@/components/Analytics';
import TitleCardContent from '@/components/TitleCard';
import TabsContent from '@/components/Tabs';
import SearchPackageContent from '@/components/SearchPackage';
import InvalidPackageContent from '@/components/layout/InvalidPackage';
import ReadmeContent from '@/components/Readme';

import SearchingOverlay from '@/components/SearchingOverlay';


const formatThousands = (value) => Intl.NumberFormat('en-US', {
  maximumSignificantDigits: 3,
  notation: 'compact',
}).format(value);


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = (date.getDate() + 1).toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
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
  return;
};


const fetchDownloadData = async (labels, search) => {
  const result = [];
  for (let i = labels.length - 1; i >= 1; i--) {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/${labels[i]}:${labels[i - 1]}/${search}`
    ).then((res) => res.json());
    result.push(res.downloads || 0);
  }
  return result;
};



const HomePage = () => {

  const [analytics, setAnalytics] = React.useState({
    totalDownloads: 0,
    maximumDownloads: 0,
    startEndStr: '',
    avgDownloadsMonthly: 0,
    avgDownloadsWeekly: 0,
    isNotFound: false
  });
  const [activeTab, setActiveTab] = React.useState("Analytics");

  const [search, setSearch] = React.useState('react-native');
  const [searching, setSearching] = React.useState(true);
  const [fetchingGraphData, setFetchingGraphData] = React.useState(false);

  const searchPackageStats = async () => {
    setSearching(true);
    window.history.pushState({}, '', `/?package=${search}`);
    const success = await fetchPackageInfo();
    if (success) {
      fetchDownloadsForLastYear(search);
    }
  };

  const onTabChange = (tab) => {
    setActiveTab(tab);
  };

  const fetchDownloadsForLastYear = async (search) => {
    setFetchingGraphData(true);
    const dates = [];
    const labels = [];

    const today = new Date();
    for (let i = 0; i <= 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, today.getDate());
      dates.push(date);
      const label = formatDate(date);
      labels.push(label);
    }

    const result = await fetchDownloadData(labels, search);
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


    const ctx = document.getElementById('chart')?.getContext('2d');
    if (!ctx) {
      return;
    }
    labels.pop();
    createLineChart(ctx, labels, result, `${labels[labels.length - 1]} to ${labels[0]}`);
    setFetchingGraphData(false);
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

  const initFunction = async (search) => {
    const success = await fetchPackageInfo();
    if (success) {
      fetchDownloadsForLastYear(search);
    }
  };

  const renderContent = () => {
    if (activeTab === "Analytics") {
      return <AnalyticsContent fetchingGraphData={fetchingGraphData} analytics={analytics} />
    }
    if (activeTab === "Readme") {
      return <ReadmeContent analytics={analytics} />
    }
    return null;
  };

  React.useEffect(() => {
    // load from query string
    const urlParams = new URLSearchParams(window.location.search);
    let packageName = urlParams.get('package');
    if (packageName) {
      setSearch(packageName);
    }
    packageName = packageName || 'react-native';
    initFunction(packageName);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <Layout>
      <Seo />
      <SearchingOverlay show={searching} />
      <main className="w-full min-h-screen bg-gray-100 flex flex-col justify-center align-middle">
        <SearchPackageContent
          search={search}
          setSearch={setSearch}
          searchPackageStats={searchPackageStats}
        />
        <InvalidPackageContent analytics={analytics}>
          <TabsContent activeTab={activeTab} onTabChange={onTabChange} />
          <TitleCardContent analytics={analytics} />
          {renderContent()}

        </InvalidPackageContent>
      </main>
    </Layout >
  );
}

export default HomePage;