"use client";
import { TourProvider } from '@reactour/tour';

export function Providers({ children }: { children: React.ReactNode }) {
  
  const styles = {
    popover: (base: any) => ({
      ...base,
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(43, 106, 224, 0.1)',
      zIndex: 999999,
      maxWidth: '460px',
      backgroundColor: '#ffffff',
      pointerEvents: 'auto',
      animation: 'slideIn 0.3s ease-out',
    }),
    maskWrapper: (base: any) => ({
      ...base,
      zIndex: 999998,
      transition: 'opacity 0.3s ease-in-out',
    }),
    maskArea: (base: any) => ({
      ...base,
      rx: 12,
      fill: 'rgba(0, 0, 0, 0.75)',
      transition: 'all 0.3s ease-in-out',
    }),
    badge: (base: any) => ({
      ...base,
      backgroundColor: '#2B6AE0',
      color: 'white',
      padding: '6px 14px',
      borderRadius: '24px',
      fontSize: '13px',
      fontWeight: '700',
      boxShadow: '0 2px 8px rgba(43, 106, 224, 0.3)',
    }),
    controls: (base: any) => ({
      ...base,
      marginTop: '24px',
      display: 'flex',
      justifyContent: 'flex-end',
      pointerEvents: 'auto',
      gap: '12px',
    }),
    close: (base: any) => ({
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
  };

  const NextBtn = ({ ...props }) => {
    const isLastStep = props.currentStep === props.stepsLength - 1;
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (props.setCurrentStep && props.steps) {
        if (isLastStep) {
          props.setIsOpen(false);
          localStorage.setItem('servineoTourVisto', 'true');
        } else {
          props.setCurrentStep((s: number) => s + 1);
        }
      }
    };
    
    return (
      <button 
        onClick={handleClick}
        type="button"
        style={{
          backgroundColor: '#2B6AE0',
          color: 'white',
          fontWeight: '700',
          padding: '12px 28px',
          borderRadius: '10px',
          fontSize: '15px',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 1000001,
          boxShadow: '0 4px 12px rgba(43, 106, 224, 0.3)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1e4bbd';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(43, 106, 224, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#2B6AE0';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(43, 106, 224, 0.3)';
        }}
      >
        {isLastStep ? 'Finalizar' : 'Siguiente'}
      </button>
    );
  };

  const PrevBtn = ({ ...props }) => {
    if (props.currentStep === 0) return null;
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (props.setCurrentStep) {
        props.setCurrentStep((s: number) => s - 1);
      }
    };
    
    return (
      <button 
        onClick={handleClick}
        type="button"
        style={{
          color: '#666',
          fontWeight: '600',
          fontSize: '15px',
          padding: '12px 20px',
          border: '2px solid transparent',
          background: 'transparent',
          cursor: 'pointer',
          borderRadius: '10px',
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
          position: 'relative',
          zIndex: 1000001,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
          e.currentTarget.style.color = '#2B6AE0';
          e.currentTarget.style.borderColor = '#e0e0e0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#666';
          e.currentTarget.style.borderColor = 'transparent';
        }}
      >
        Anterior
      </button>
    );
  };

  return (
    <TourProvider 
      steps={[]} 
      styles={styles}
      showBadge={false}
      showDots={true}
      showCloseButton={true}
      disableInteraction={false}
      prevButton={PrevBtn}
      nextButton={NextBtn}
      scrollSmooth={true}
      padding={12}
      onClickMask={({ setIsOpen }) => {}}
    >
      <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      {children}
    </TourProvider>
  );
}