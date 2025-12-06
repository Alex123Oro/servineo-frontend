'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChartPieDonut } from '@/Components/Statistics-panel/Chart-pie-donut';
import { ChartBarLabel } from '@/Components/Statistics-panel/Chart-bar-Label';
import { useGetStatisticsQuery } from '@/app/redux/services/dashboardApi';
import { Button } from '@/Components/ui/button';

export default function Page() {
  const t = useTranslations('dashboard');

  const [selectedPeriod, setSelectedPeriod] = useState<'semanal' | 'mensual' | 'anual'>('mensual');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) || 'es';

  // Usar el hook de Redux para obtener los datos
  const { data, error, isLoading, refetch } = useGetStatisticsQuery(selectedPeriod);

  const handleBackToDashboard = () => {
    //router.push(`/${locale}/user-admin/dashboard`);
    router.push(`https://servineo-frontend-bytes-bandidos.vercel.app/user-admin/dashboard`);
  };

  // Refetch cuando cambie el período
  useEffect(() => {
    refetch();
  }, [selectedPeriod, refetch]);

  // Transformar los datos del backend al formato que esperan los componentes
  const transformFilterData = (filterData: Record<string, number> | undefined) => {
    if (!filterData) return [];
    return Object.entries(filterData).map(([name, value]) => ({
      name,
      value: value as number,
    }));
  };

  // Datos para los gráficos
  const monthlyData = data ? transformFilterData(data.filter_statistics?.fixer_name) : [];
  const tradesData = data ? transformFilterData(data.filter_statistics?.city) : [];
  const productsData = data ? transformFilterData(data.filter_statistics?.job_type) : [];
  const pieData = data ? transformFilterData(data.user_type_statistics) : [];

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center p-4'>
        <div className='text-lg'>{t('loading')}</div>
      </main>
    );
  }

  // Mostrar error si hay algún problema
  if (error) {
    return (
      <main className='flex min-h-screen flex-col items-center justify-center p-4'>
        <div className='text-lg text-red-500'>{t('error')}</div>
      </main>
    );
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-4 pt-8'>
      {/* Botón de regreso en la parte superior izquierda */}
      <div className='w-full max-w-7xl mb-6 flex justify-start items-center'>
        <Button
          onClick={handleBackToDashboard}
          variant='outline'
          className='flex items-center gap-2 hover:bg-gray-50 transition-colors duration-200 min-w-[160px]'
          aria-label='Volver al Dashboard'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
              clipRule='evenodd'
            />
          </svg>
          Volver al Dashboard
        </Button>
      </div>

      {/* Contenedor del dropdown del período */}
      <div className='w-full max-w-4xl mb-6 flex justify-center items-center'>
        <div className='relative'>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'semanal' | 'mensual' | 'anual')}
            className='appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
          >
            <option value='semanal'>{t('periods.weekly')}</option>
            <option value='mensual'>{t('periods.monthly')}</option>
            <option value='anual'>{t('periods.yearly')}</option>
          </select>
          <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
            <svg className='h-4 w-4' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'>
              <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
            </svg>
          </div>
        </div>
      </div>

      {/* Información del período */}
      {data && (
        <div className='w-full max-w-4xl mb-4 text-center'>
          <h2 className='text-xl font-semibold'>
            {t('periodLabel')}:{' '}
            {selectedPeriod === 'semanal'
              ? t('periods.weekly')
              : selectedPeriod === 'mensual'
                ? t('periods.monthly')
                : t('periods.yearly')}
          </h2>
          <p className='text-gray-600'>
            {t('totalSearches')}: {data.count}
          </p>
        </div>
      )}

      {/* Contenedor principal de gráficos */}
      <div className='w-full max-w-4xl space-y-6'>
        {/* Gráfico de donut para tipos de usuario */}
        {pieData.length > 0 && (
          <ChartPieDonut
            data={pieData}
            title={t('charts.userDistribution.title')}
            description={t('charts.userDistribution.description')}
          />
        )}

        {/* Gráfico de rangos de fixers */}
        {monthlyData.length > 0 && (
          <ChartBarLabel
            data={monthlyData}
            title={t('charts.fixerRanges.title')}
            description={t('charts.fixerRanges.description')}
            color='#2563eb'
            trendText={t('charts.filterStats')}
            footerText={t('charts.showingTotal')}
            barSize={90}
          />
        )}

        {/* Gráfico de ciudades */}
        {tradesData.length > 0 && (
          <ChartBarLabel
            data={tradesData}
            title={t('charts.cities.title')}
            description={t('charts.cities.description')}
            color='#10b981'
            trendText={t('charts.filterStats')}
            footerText={t('charts.showingTotal')}
            barSize={70}
          />
        )}

        {/* Gráfico de tipos de trabajo */}
        {productsData.length > 0 && (
          <ChartBarLabel
            data={productsData}
            title={t('charts.jobTypes.title')}
            description={t('charts.jobTypes.description')}
            color='#f59e0b'
            trendText={t('charts.filterStats')}
            footerText={t('charts.showingTotal')}
            barSize={70}
          />
        )}

        {/* Mensaje si no hay datos */}
        {!data && !isLoading && !error && (
          <div className='text-center text-gray-500'>{t('noData')}</div>
        )}
      </div>
    </main>
  );
}
