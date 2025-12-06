'use client';

import { Provider } from 'react-redux';
import { store } from './redux/store';
import { TourProviderWrapper } from '@/Components/Tour/TourProviderWrapper';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <TourProviderWrapper>{children}</TourProviderWrapper>
    </Provider>
  );
}
