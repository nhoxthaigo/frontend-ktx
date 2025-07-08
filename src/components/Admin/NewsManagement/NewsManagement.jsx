import React, { useState } from 'react';
import NewsManager from './NewsManager';
import TopicManager from './TopicManager';
const NewsManagement = () => {
      const [activeTab, setActiveTab] = useState('topics');
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">QUẢN LÝ BẢN TIN</h2>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('topics')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'topics'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Chủ đề
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`py-2 px-1 border-b-2 font-medium text-lg ${
              activeTab === 'news'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent transition transform duration-200 text-gray-500 hover:text-orange-700 hover:border-orange-200'
            }`}
          >
            Bản tin
          </button>
        </nav>
      </div>
      <div>
        {activeTab === 'topics' && <TopicManager />}
        {activeTab === 'news' && <NewsManager />}
      </div>
    </div>
  );
}

export default NewsManagement