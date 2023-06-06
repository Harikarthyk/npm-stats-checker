import React from 'react'

interface Props {
  analytics: any;
}

const TitleCard = ({ analytics }: Props) => {
  return (
    <section className="w-auto flex-col justify-center antialiased text-gray-600">
      <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
        <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200 gap-6 px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex flex-col">
                <div className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Package Name
                </div>
                <div className="md:text-2xl text-xl font-semibold text-gray-800 dark:text-white">
                  {analytics?.collected?.metadata?.name}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex flex-col">
                <div className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Publisher
                </div>
                <div className="md:text-2xl text-xl font-semibold text-gray-800 dark:text-white">
                  {analytics?.collected?.metadata?.publisher?.username}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex flex-col">
                <div className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Version
                </div>
                <div className="md:text-2xl text-xl font-semibold text-gray-800 dark:text-white">
                  {analytics?.collected?.metadata?.version}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TitleCard