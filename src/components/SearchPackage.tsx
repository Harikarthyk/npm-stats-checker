import React from 'react'
interface Props {
  search: string;
  setSearch: (search: string) => void;
  searchPackageStats: () => void;
}
const SearchPackage = ({
  search,
  setSearch,
  searchPackageStats
}: Props) => {
  return (
    <section className="w-auto text-gray-600 ">
      <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
        <div className="flex flex-col col-span-full xl:col-span-8 bg-white rounded-md shadow-lg border border-gray-200">
          <header className="px-5 py-4 border-b border-gray-100 flex items-center">

            <h2 className="font-semibold text-gray-800">Check Statistics for NPM Package</h2>
            <div className="ml-auto flex items-center">
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
                    onSubmit={searchPackageStats}
                  />
                </div>
                <div className="flex flex-col  sm:flex-row sm:space-x-4 sm:w-64 w-full">
                  <button
                    className="border border-gray-300  px-5 py-3 w-full focus:outline-none focus:border-blue-500 bg-indigo-500 font-semibold	 hover:bg-indigo-800 hover:bottom-5 hover:border-indigo-800 text-white rounded-md"
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
  )
}

export default SearchPackage;