import React from 'react';
import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

export default function Layout({ children, currentPageName }) {
  const hideNav = currentPageName === 'Admin';

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600&family=Josefin+Sans:wght@300;400;600;700&display=swap');
        
        :root {
          --font-serif: 'Josefin Sans', sans-serif;
          --font-sans: 'Inter', system-ui, sans-serif;
        }
        
        body {
          font-family: var(--font-sans);
          -webkit-font-smoothing: antialiased;
        }
        
        .font-serif {
          font-family: var(--font-serif);
        }

        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #d6d3d1;
          border-radius: 3px;
        }
      `}</style>
      {!hideNav && <Navigation currentPage={currentPageName} />}
      <main className="flex-1">{children}</main>
      {!hideNav && <Footer />}
    </div>
  );
}