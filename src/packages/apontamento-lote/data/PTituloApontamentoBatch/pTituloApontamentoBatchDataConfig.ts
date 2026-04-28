export const PTITULOAPONTAMENTOBATCH_FAKE_ENDPOINTS = {
  index: "apontamento-batch/p_titulo_apontamento_batch/",
};

export function usePTituloApontamentoBatchMockData() {
  return process.env.NEXT_PUBLIC_USE_MOCK_P_TITULO_APONTAMENTO_BATCH !== "false";
}
