'use server';

import { PTituloProtestoData } from '@/packages/administrativo/data/PTitulo/PTituloProtestoData';
import { withClientErrorHandler } from '@/shared/actions/withClientErrorHandler/withClientErrorHandler';

async function executePTituloProtestoService(id: number) {
  const response = await PTituloProtestoData(id);

  return response;
}

export const PTituloProtestoService = withClientErrorHandler(executePTituloProtestoService);
