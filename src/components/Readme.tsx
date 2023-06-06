import React from 'react';
import Markdown from 'react-markdown';

interface Props {
  analytics: any;
}

const Readme = ({
  analytics
}: Props) => {
  return (
    <>
      <section className="w-auto flex-col justify-center antialiased text-gray-600">
        <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
          <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200 gap-6 px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div className="flex flex-col">
                  <div className="text-base font-medium text-gray-700 dark:text-gray-200">
                    Description
                  </div>
                  <div className="md:text-2xl text-xl font-semibold text-gray-800 dark:text-white">
                    {analytics?.collected?.metadata?.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-auto flex-col justify-center antialiased text-gray-600">
        <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
          <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200 gap-6 px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              {/* NPM LINK, GITHUB and HOME PAGE */}
              <div className="flex flex-col">
                <div className="text-base font-medium text-gray-700 mb-4 dark:text-gray-200">
                  Links
                </div>
                <div className="md:text-2xl text-xl font-semibold text-gray-800 dark:text-white">
                  <a href={analytics?.collected?.metadata?.links?.npm} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">NPM</a>
                </div>
                <div className="md:text-2xl text-xl font-semibold text-gray-800 dark:text-white">
                  <a href={analytics?.collected?.metadata?.links?.repository} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">Github</a>
                </div>
                <div className="md:text-2xl text-xl font-semibold text-gray-800 dark:text-white">
                  <a href={analytics?.collected?.metadata?.links?.homepage} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700">Home Page</a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-auto flex-col justify-center antialiased text-gray-600">
        <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
          <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200 gap-6 px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4 overflow-x-scroll overflow-y-hidden">
              <div className="flex flex-col">
                <Markdown>
                  {analytics?.collected?.metadata?.readme?.trim()}
                </Markdown>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
};

export default Readme