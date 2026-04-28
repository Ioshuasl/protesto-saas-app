import * as z from "zod";

export const bancoFormSchema = z.object({
  codigo_banco: z.string().min(1, "Código do banco é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

export type BancoFormValues = z.infer<typeof bancoFormSchema>;
