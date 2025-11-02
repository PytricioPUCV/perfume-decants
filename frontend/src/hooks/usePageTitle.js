import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} - Decants del Puerto` : 'Decants del Puerto';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default usePageTitle;
