export const PTITULOPROTESTARBATCH_FAKE_ENDPOINTS = {
  index: "protesto-batch/p_titulo_protestar_batch/",
};

export function usePTituloProtestarBatchMockData() {
  return process.env.NEXT_PUBLIC_USE_MOCK_P_TITULO_PROTESTAR_BATCH !== "false";
}
