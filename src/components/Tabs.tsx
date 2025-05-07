/* eslint-disable @typescript-eslint/no-explicit-any */
// components/Tabs.tsx
import { useState, ReactNode } from 'react';

export const Tabs = ({ children }: { children: ReactNode }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = Array.isArray(children) ? children : [children];

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {tabs.map((tab: any, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            style={{ padding: '0.5rem 1rem', background: index === activeIndex ? 'yellow' : '#333', color: '#000' }}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div>{tabs[activeIndex]}</div>
    </div>
  );
};

export const Tab = ({ children }: { children: ReactNode }) => <div>{children}</div>;
