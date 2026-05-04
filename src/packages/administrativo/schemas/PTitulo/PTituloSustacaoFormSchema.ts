"use client";

import { z } from "zod";
import type { PTituloSustacaoFormInterface } from "@/packages/administrativo/interfaces/PTitulo/PTituloSustacaoFormInterface";
import { zPTituloWorkflowLocalIsoDate } from "@/packages/administrativo/schemas/PTitulo/PTituloWorkflowFormDateSchema";

type PTituloSustacaoFieldMap = Record<keyof PTituloSustacaoFormInterface, z.ZodTypeAny>;

const sustacaoShape: PTituloSustacaoFieldMap = {
  ocorrencia_id: z.coerce.number().int().positive("Selecione a ocorrência"),
  motivo_cancelamento_id: z.coerce.number().int().positive("Selecione o motivo de cancelamento"),
  data_sustacao: zPTituloWorkflowLocalIsoDate("Selecione a data de sustação"),
};

export const pTituloSustacaoFormSchema = z.object(sustacaoShape);

export type PTituloSustacaoFormValues = z.infer<typeof pTituloSustacaoFormSchema>;
