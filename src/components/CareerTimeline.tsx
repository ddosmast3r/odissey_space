'use client';

interface TimelineItem {
  period: string;
  title: string;
  company?: string;
  type: 'education' | 'work';
  description: string;
  color: string;
}

const timelineData: TimelineItem[] = [
  {
    period: '2018-2022',
    title: 'Bachelor\'s Degree',
    company: 'SUAI',
    type: 'education',
    description: 'Business Informatics',
    color: 'blue'
  },
  {
    period: 'Feb-Sep 2022',
    title: 'Level & Technical Designer',
    company: 'Bears Com Games',
    type: 'work',
    description: 'Stint: Rift Apart',
    color: 'green'
  },
  {
    period: 'Sep 2022-Aug 2024',
    title: 'Level & Technical Designer',
    company: 'G5 Games',
    type: 'work',
    description: 'Sherlock: Hidden Match-3 Cases',
    color: 'purple'
  },
  {
    period: 'Mar-Jun 2025',
    title: 'Technical Designer',
    company: 'Vameon',
    type: 'work',
    description: 'Empire of Vampire',
    color: 'red'
  }
];

export default function CareerTimeline() {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-6">Career Timeline</h3>
      
      {/* Desktop Timeline */}
      <div className="hidden md:block relative">
        {/* Main timeline line */}
        <div className="absolute left-0 right-0 top-8 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>
        
        <div className="grid grid-cols-4 gap-2">
          {timelineData.map((item, index) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <div className={`absolute left-1/2 transform -translate-x-1/2 -top-2 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                item.color === 'blue' ? 'bg-blue-500' :
                item.color === 'green' ? 'bg-green-500' :
                item.color === 'purple' ? 'bg-purple-500' :
                'bg-red-500'
              }`}></div>
              
              {/* Content card */}
              <div className="pt-6">
                <div className={`p-3 rounded-lg border-2 ${
                  item.color === 'blue' ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' :
                  item.color === 'green' ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20' :
                  item.color === 'purple' ? 'border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20' :
                  'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                }`}>
                  <div className={`text-xs font-medium mb-1 ${
                    item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    item.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    item.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {item.period}
                  </div>
                  
                  <div className="font-semibold text-xs mb-1 break-words">
                    {item.title}
                  </div>
                  
                  {item.company && (
                    <div className={`text-xs font-medium mb-1 break-words ${
                      item.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                      item.color === 'green' ? 'text-green-700 dark:text-green-300' :
                      item.color === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                      'text-red-700 dark:text-red-300'
                    }`}>
                      {item.company}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-80 break-words">
                    {item.description}
                  </div>
                  
                  {/* Type indicator */}
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      item.type === 'education' 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {item.type === 'education' ? '🎓 Study' : '💼 Work'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile Timeline */}
      <div className="md:hidden space-y-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-purple-500"></div>
          
          {timelineData.map((item, index) => (
            <div key={index} className="relative flex items-start mb-6">
              {/* Timeline dot */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 ${
                item.color === 'blue' ? 'bg-blue-500' :
                item.color === 'green' ? 'bg-green-500' :
                item.color === 'purple' ? 'bg-purple-500' :
                'bg-red-500'
              } flex items-center justify-center`}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              
              {/* Content */}
              <div className="ml-4 flex-1">
                <div className={`p-3 rounded-lg border ${
                  item.color === 'blue' ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20' :
                  item.color === 'green' ? 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20' :
                  item.color === 'purple' ? 'border-purple-200 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20' :
                  'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20'
                }`}>
                  <div className={`text-xs font-medium mb-1 ${
                    item.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    item.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    item.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {item.period}
                  </div>
                  
                  <div className="font-semibold text-xs mb-1 break-words">
                    {item.title}
                  </div>
                  
                  {item.company && (
                    <div className={`text-xs font-medium mb-1 break-words ${
                      item.color === 'blue' ? 'text-blue-700 dark:text-blue-300' :
                      item.color === 'green' ? 'text-green-700 dark:text-green-300' :
                      item.color === 'purple' ? 'text-purple-700 dark:text-purple-300' :
                      'text-red-700 dark:text-red-300'
                    }`}>
                      {item.company}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-80 mb-2 break-words">
                    {item.description}
                  </div>
                  
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    item.type === 'education' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {item.type === 'education' ? '🎓 Study' : '💼 Work'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}