import React from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
interface Props {
  alternative: any;
  analytics: any;
  analyzing: boolean
}
const Alternatives = ({ alternative, analytics, analyzing }: Props) => {
  if (analyzing) {
    return (
      <section className="w-auto flex-col justify-center antialiased text-gray-600">
        {/* Loader */}
        <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
          <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200 gap-6 px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex flex-col sm:flex-row sm:space-x-4 text-center" >
                <div className="flex flex-col text-center">
                  Loading...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-auto flex-col justify-center antialiased text-gray-600">
      <div className="max-w-3xl mx-auto p-4 sm:px-6 h-full">
        <div className="flex flex-col col-span-full xl:col-span-8 bg-white shadow-lg rounded-md border border-gray-200 gap-6 px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="flex flex-col gap-3">
                {/* {
                  alternative && alternative?.split("\n")?.map((item: any, i: any) => {
                    return (
                      <div key={i} className="text-base font-medium text-gray-700 dark:text-gray-200">
                        {item}
                      </div>
                    )
                  })
                } */}
                <ReactMarkdown>
                  {alternative}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Alternatives