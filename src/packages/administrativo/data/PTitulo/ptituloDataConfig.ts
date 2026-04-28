export const PTITULO_FAKE_ENDPOINTS = {
  index: 'administrativo/p_titulo/',
  show: (id: number) => `administrativo/p_titulo/${id}/`,
  selos: (id: number) => `administrativo/p_titulo/${id}/selos`,
  updateStatus: (id: number) => `administrativo/p_titulo/${id}/status/`,
};

export function isPTituloMockDataEnabled() {
  return process.env.NEXT_PUBLIC_USE_MOCK_PTITULO !== 'false';
}
