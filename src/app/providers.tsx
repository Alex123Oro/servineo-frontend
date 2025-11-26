"use client";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { TourProvider } from '@reactour/tour';
import { NextBtn, PrevBtn } from '@/Components/Tour/CustomTourComponents';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <TourProvider
        steps={[]}
        styles={{
          popover: (base) => ({
            ...base,
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(43, 106, 224, 0.1)',
            zIndex: 999999,
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            pointerEvents: 'auto',
          }),
          maskWrapper: (base) => ({ ...base, zIndex: 999998 }),
          maskArea: (base) => ({ ...base, rx: 12, fill: 'rgba(0, 0, 0, 0.75)' }),
          badge: (base) => ({ ...base, display: 'none' }),
          controls: (base) => ({
            ...base,
            marginTop: '24px',
            display: 'flex',
            justifyContent: 'flex-end',
            pointerEvents: 'auto',
            gap: '12px',
          }),
          close: (base) => ({
            ...base,
            right: 20,
            top: 20,
            width: 20,
            height: 20,
            color: '#999',
            cursor: 'pointer',
            pointerEvents: 'auto',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#2B6AE0',
              transform: 'scale(1.1)',
            },
          }),
        }}
        showBadge={false}
        showDots={true}
        showCloseButton={true}
        disableInteraction={false}
        prevButton={PrevBtn}
        nextButton={NextBtn}
        scrollSmooth={true}
        padding={12}
      >
        {children}
      </TourProvider>
    </Provider>
  );
}