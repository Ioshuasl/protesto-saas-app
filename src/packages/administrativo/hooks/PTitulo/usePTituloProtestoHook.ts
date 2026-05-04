import { useState } from 'react';

import { isTituloListItem, type TituloListItem } from '@/packages/administrativo/interfaces/PTitulo/PTituloListItem';
import { PTituloProtestoService } from '@/packages/administrativo/services/PTitulo/PTituloProtestoService';
import { useResponse } from '@/shared/components/response/ResponseContext';

export const usePTituloProtestoHook = () => {
  const { setResponse } = useResponse();
  const [pTitulo, setPTitulo] = useState<TituloListItem | null>(null);

  const protestarTitulo = async (id: number) => {
    const response = await PTituloProtestoService(id);

    if (isTituloListItem(response)) {
      setPTitulo(response);
      setResponse({ status: 200, message: 'Título protestado com sucesso' });
    } else {
      setResponse(response);
    }

    return response;
  };

  return { pTitulo, protestarTitulo };
};
