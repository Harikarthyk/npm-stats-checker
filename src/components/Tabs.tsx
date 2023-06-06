import React from 'react'

const activeTabClass = "inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700 shadow-lg rounded-md ";
const inActiveTabClass = "inline-block w-full p-4 text-gray-900 bg-gray-100 rounded-l-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none dark:bg-gray-700 dark:text-white cursor-pointer hover:text-gray-700 hover:bg-gray-50 hover:shadow-lg hover:rounded-md ";

interface Props {
  activeTab: string,
  onTabChange: (tab: string) => void
}
const Tabs = ({
  activeTab,
  onTabChange
}: Props) => {
  return (
    <section className="w-auto flex-col justify-center antialiased text-gray-600">
      <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
        <ul className="text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow flex dark:divide-gray-700 dark:text-gray-400">
          <li className="w-full" onClick={() => onTabChange("Analytics")}>
            <div className={activeTab === "Analytics" ? activeTabClass : inActiveTabClass}>
              Analytics
            </div>
          </li>
          <li className="w-full" onClick={() => onTabChange("Readme")}>
            <div className={activeTab === "Readme" ? activeTabClass : inActiveTabClass}>
              Readme
            </div>
          </li>
          <li className="w-full" onClick={() => onTabChange("Alternatives")}>
            <div className={activeTab === "Alternatives" ? activeTabClass : inActiveTabClass}>
              Alternatives
            </div>
          </li>
        </ul>
      </div>
    </section>
  )
}

export default Tabs