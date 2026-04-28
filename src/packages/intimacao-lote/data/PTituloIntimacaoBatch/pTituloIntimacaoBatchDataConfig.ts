export const PTITULOINTIMACAOBATCH_FAKE_ENDPOINTS = {
  index: "intimacao-batch/p_titulo_intimacao_batch/",
};

export function usePTituloIntimacaoBatchMockData() {
  return process.env.NEXT_PUBLIC_USE_MOCK_P_TITULO_INTIMACAO_BATCH !== "false";
}
