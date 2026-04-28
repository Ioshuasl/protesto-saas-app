/**
 * Interface gerada para a tabela P_BANCO
 */
export interface PBancoInterface {
  banco_id: number;
  codigo_banco?: string;
  pessoa_id?: number;
  layout_id?: number;
  demais_despesas?: number;
  descricao?: string;
  apontamento_pag_posterior?: string;
  custas_na_confirmacao?: string;
}
