'use client';

import { useEffect } from 'react';

export default function ClientLayout({ children }) {
  useEffect(() => {
    // Apply body classes on the client side to avoid hydration issues
    document.body.className = 'antialiased bg-gray-50 min-h-screen';
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  );
} 