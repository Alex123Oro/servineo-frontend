import React from 'react';
import { useTranslations } from 'next-intl';

interface Metrics {
  total: number;
  active: number;
  cancelled: number;
}

interface MetricsCardsProps {
  metrics: Metrics;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  const t = useTranslations('tracking.metrics');
  const { total, active, cancelled } = metrics;

  return (
    <div className='flex flex-col gap-4'>
      <div className='bg-white shadow-sm rounded p-4 border-l-4 border-blue-500'>
        <h3 className='text-lg font-semibold text-gray-800'>{t('total')}</h3>
        <p className='text-2xl font-bold text-blue-600'>{total}</p>
      </div>
      <div className='bg-white shadow-sm rounded p-4 border-l-4 border-green-500'>
        <h3 className='text-lg font-semibold text-gray-800'>{t('scheduled')}</h3>
        <p className='text-2xl font-bold text-green-600'>{active}</p>
      </div>
      <div className='bg-white shadow-sm rounded p-4 border-l-4 border-red-500'>
        <h3 className='text-lg font-semibold text-gray-800'>{t('cancelled')}</h3>
        <p className='text-2xl font-bold text-red-600'>{cancelled}</p>
      </div>
    </div>
  );
};

export default MetricsCards;
