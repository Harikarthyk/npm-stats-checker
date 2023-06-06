import Chart from "chart.js/auto";
import * as React from 'react';
import 'chartjs-adapter-moment';

import AlternativesContent from '@/components/Alternatives';
import AnalyticsContent from '@/components/Analytics';
import InvalidPackageContent from '@/components/layout/InvalidPackage';
import Layout from '@/components/layout/Layout';
import ReadmeContent from '@/components/Readme';
import SearchingOverlay from '@/components/SearchingOverlay';
import SearchPackageContent from '@/components/SearchPackage';
import Seo from '@/components/Seo';
import TabsContent from '@/components/Tabs';
import TitleCardContent from '@/components/TitleCard';


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


const fetchDownloadData = async (labels, _search) => {
  const result = [];
  for (let i = labels.length - 1; i >= 1; i--) {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/${labels[i]}:${labels[i - 1]}/${_search}`
    ).then((res) => res.json());
    result.push(res.downloads || 0);
  }
  return result;
};

let alternativeMap = {};

const HomePage = () => {

  const [analytics, setAnalytics] = React.useState({
    totalDownloads: 0,
    maximumDownloads: 0,
    startEndStr: '',
    avgDownloadsMonthly: 0,
    avgDownloadsWeekly: 0,
    isNotFound: false
  });
  const [alternative, setAlternative] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("Analytics");

  const [search, setSearch] = React.useState('react-native');
  const [searching, setSearching] = React.useState(true);
  const [analyzing, setAnalyzing] = React.useState(true);
  const [fetchingGraphData, setFetchingGraphData] = React.useState(false);

  const searchPackageStats = async () => {
    setSearching(true);
    window.history.pushState({}, '', `/?package=${search}`);
    const success = await fetchPackageInfo(search);
    if (success) {
      fetchDownloadsForLastYear(search);
      setActiveTab("Analytics");
    }
  };

  const onTabChange = (tab) => {
    setActiveTab(tab);
  };

  const fetchDownloadsForLastYear = async (_search) => {
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

    const result = await fetchDownloadData(labels, _search);
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

  const fetchPackageInfo = async (_search) => {
    try {
      setSearching(true);
      let res = await fetch(`https://api.npms.io/v2/package/${_search}`);
      if (res.status == 404) {
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

  const initFunction = async (_search) => {
    const success = await fetchPackageInfo(_search);
    if (success) {
      fetchDownloadsForLastYear(_search);
    }
  };

  const renderContent = () => {
    if (activeTab === "Analytics") {
      return <AnalyticsContent fetchingGraphData={fetchingGraphData} analytics={analytics} />
    }
    if (activeTab === "Readme") {
      return <ReadmeContent analytics={analytics} />
    }
    if (activeTab === "Alternatives") {
      return <AlternativesContent analyzing={analyzing} alternative={alternative} analytics={analytics} />
    }

    return null;
  };
  const getAlternatives = async (search) => {
    setAnalyzing(true);
    if (alternativeMap[search]) {
      setAlternative(alternativeMap[search]);
      setAnalyzing(false);
      return;
    }
    const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_TOKEN}`
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [{
          "role": "user",
          "content": `Is this are any similar or other packages which is better compared to ${analytics?.collected?.metadata?.name || search} package. and also share the reason along with respective home page.
          
          Return the response in README. Like below format. Also all the links and href should be clickable. and should be in markdown format with neatly formatted.

          #### Package Name: ${analytics?.collected?.metadata?.name || search}

          ###### Description: ${analytics?.collected?.metadata?.description || 'No description found'}

          ###### Home Page: ${analytics?.collected?.metadata?.links?.homepage || 'No homepage found'}

          ###### Repository: ${analytics?.collected?.metadata?.links?.repository || 'No repository found'}

          ###### NPM Page: ${analytics?.collected?.metadata?.links?.npm || 'No npm page found'}

          ###### Downloads: ${analytics?.collected?.npm?.downloads?.count || 'No downloads found'}

          ###### Stars: ${analytics?.collected?.github?.starsCount || 'No stars found'}

          \n\n
          
          `
        }],
        "temperature": 0
      })
    }).then(res => res.json()).catch(e => console.warn(e));
    const choices = res?.choices || [];
    const message = choices[0]?.message?.content || '';
    if (message) {
      setAlternative(message);
      alternativeMap[search] = message;
    } else {
      alternativeMap[search] = message;
      setAlternative('No alternatives found');
    }
    setAnalyzing(false);
  };

  React.useEffect(() => {

    // load from query string
    const urlParams = new URLSearchParams(window.location.search);
    let packageName = urlParams.get('package');
    packageName = packageName || 'react-native';
    if (packageName) {
      setSearch(packageName);
    }
    initFunction(packageName);


    if (activeTab === "Alternatives") {
      getAlternatives(packageName);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <Layout>
      <Seo />
      <SearchingOverlay show={searching} />
      <main className="w-full min-h-screen bg-gray-100 flex flex-col ">
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