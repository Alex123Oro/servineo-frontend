import { useState, useEffect } from 'react';
import { Fixer } from '../interface/Fixer_Interface';

export const useCustomSearch = (fixers: Fixer[], search: string) => {
  const [results, setResults] = useState<Fixer[]>([]);

  useEffect(() => {
    if (!search) return setResults(fixers);

    const filtered = fixers.filter(f =>
      f.nombre.toLowerCase().includes(search.toLowerCase()) ||
      f.servicio.toLowerCase().includes(search.toLowerCase())
    );

    setResults(filtered);
  }, [search, fixers]);

  return results;
};
