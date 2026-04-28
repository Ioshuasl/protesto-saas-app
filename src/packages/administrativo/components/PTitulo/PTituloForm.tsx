"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePBancoReadHook } from "@/packages/administrativo/hooks/PBanco/usePBancoReadHook";
import { usePEspecieReadHook } from "@/packages/administrativo/hooks/PEspecie/usePEspecieReadHook";
import { usePMotivosReadHook } from "@/packages/administrativo/hooks/PMotivos/usePMotivosReadHook";
import { usePMotivosCancelamentoReadHook } from "@/packages/administrativo/hooks/PMotivosCancelamento/usePMotivosCancelamentoReadHook";
import { usePOcorrenciasReadHook } from "@/packages/administrativo/hooks/POcorrencias/usePOcorrenciasReadHook";
import { usePTituloShowHook } from "@/packages/administrativo/hooks/PTitulo/usePTituloShowHook";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PTituloDetailsForm } from "./PTituloDetailsForm";
import type {
  PTituloDetailsFormValues,
  PTituloSelectOptionsByField,
} from "@/packages/administrativo/schemas/PTitulo/PTituloDetailsFormSchema";

export function PTituloForm({ id }: { id?: string }) {
  const router = useRouter();
  const isNew = id == null || id === "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { titulo, setTitulo, isLoading, fetchTituloById } = usePTituloShowHook();
  const fetchTituloByIdRef = useRef(fetchTituloById);
  fetchTituloByIdRef.current = fetchTituloById;

  const { bancos, fetchBancos } = usePBancoReadHook();
  const { especies, fetchEspecies } = usePEspecieReadHook();
  const { ocorrencias, fetchOcorrencias } = usePOcorrenciasReadHook();
  const { motivos, fetchMotivos } = usePMotivosReadHook();
  const { motivosCancelamento, fetchMotivosCancelamento } = usePMotivosCancelamentoReadHook();

  useEffect(() => {
    void fetchBancos();
    void fetchEspecies();
    void fetchOcorrencias();
    void fetchMotivos();
    void fetchMotivosCancelamento();
  }, [fetchBancos, fetchEspecies, fetchMotivos, fetchMotivosCancelamento, fetchOcorrencias]);

  useEffect(() => {
    if (isNew) {
      setTitulo(null);
      return;
    }

    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      setTitulo(null);
      return;
    }

    void fetchTituloByIdRef.current(numericId);
  }, [id, isNew, setTitulo]);

  const selectOptionsByField = useMemo<PTituloSelectOptionsByField>(
    () => ({
      especie_id: especies.map((especie) => ({
        value: String(especie.especie_id),
        label: especie.descricao || especie.especie || "-",
      })),
      banco_id: bancos.map((banco) => ({
        value: String(banco.banco_id),
        label: banco.descricao || banco.codigo_banco || "-",
      })),
      ocorrencia_id: ocorrencias.map((ocorrencia) => ({
        value: String(ocorrencia.ocorrencias_id),
        label: ocorrencia.descricao || ocorrencia.tipo || ocorrencia.codigo || "-",
      })),
      motivo_apontamento_id: motivos.map((motivo) => ({
        value: String(motivo.motivos_id),
        label: motivo.descricao || motivo.codigo || "-",
      })),
      motivo_cancelamento: motivosCancelamento.map((motivoCancelamento) => ({
        value: String(motivoCancelamento.motivos_cancelamento_id),
        label: motivoCancelamento.descricao || motivoCancelamento.ord_jud_ou_rem_ind || "-",
      })),
    }),
    [bancos, especies, motivos, motivosCancelamento, ocorrencias],
  );

  const ocorrenciaBadgeLabel = useMemo(() => {
    if (!titulo?.ocorrencia_id) return "Sem ocorrência";

    const ocorrencia = ocorrencias.find((item) => item.ocorrencias_id === titulo.ocorrencia_id);
    if (!ocorrencia) return "Sem ocorrência";

    return ocorrencia.descricao || ocorrencia.tipo || ocorrencia.codigo || "Sem ocorrência";
  }, [ocorrencias, titulo?.ocorrencia_id]);

  const workflowActionButtons = useMemo(() => {
    const hasValue = (value: unknown) => value !== null && value !== undefined && value !== "";
    const hasApontamentoBase = hasValue(titulo?.numero_apontamento) && hasValue(titulo?.data_apontamento);
    const hasIntimacao = hasApontamentoBase && hasValue(titulo?.data_intimacao);
    const hasProtestoCompleto =
      hasIntimacao &&
      hasValue(titulo?.data_protesto) &&
      hasValue(titulo?.livro_id_protesto) &&
      hasValue(titulo?.folha_protesto);

    if (hasProtestoCompleto) {
      return [
        { label: "Voltar para Intimação", variant: "outline" as const },
        { label: "Cancelar Título", variant: "destructive" as const },
      ];
    }

    if (hasIntimacao) {
      return [
        { label: "Voltar para Apontamento", variant: "outline" as const },
        { label: "Aceite/Edital", variant: "outline" as const },
        { label: "Desistir/Liquidar Título", variant: "outline" as const },
        { label: "Protestar Título", variant: "default" as const },
      ];
    }

    if (hasApontamentoBase) {
      return [{ label: "Intimar Título", variant: "default" as const }];
    }

    return [];
  }, [titulo]);

  const workflowProgress = useMemo(() => {
    const hasValue = (value: unknown) => value !== null && value !== undefined && value !== "";

    const hasApontamentoBase = hasValue(titulo?.numero_apontamento) && hasValue(titulo?.data_apontamento);
    const hasIntimacao = hasApontamentoBase && hasValue(titulo?.data_intimacao);
    const hasProtestoCompleto =
      hasIntimacao &&
      hasValue(titulo?.data_protesto) &&
      hasValue(titulo?.livro_id_protesto) &&
      hasValue(titulo?.folha_protesto);

    const stage = hasProtestoCompleto ? 3 : hasIntimacao ? 2 : hasApontamentoBase ? 1 : 0;
    const percent = stage === 0 ? 0 : stage === 1 ? 35 : stage === 2 ? 70 : 100;
    const stageLabel =
      stage === 3 ? "Protesto concluído" : stage === 2 ? "Intimação em andamento" : stage === 1 ? "Apontado" : "Sem andamento";

    const steps = [
      { label: "Apontamento", completed: stage >= 1 },
      { label: "Intimação", completed: stage >= 2 },
      { label: "Protesto", completed: stage >= 3 },
    ];

    return {
      hasApontamentoBase,
      hasIntimacao,
      hasProtestoCompleto,
      stage,
      percent,
      stageLabel,
      steps,
    };
  }, [titulo]);

  const handleSubmit = async (data: PTituloDetailsFormValues) => {
    void data;
    setIsSubmitting(true);
    try {
      router.push("/titulos");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <header className="rounded-xl border bg-card p-4 shadow-xs md:p-5">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 items-start gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                aria-label="Voltar para página anterior"
                className="text-muted-foreground hover:text-[#FF6B00] inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
              >
                <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
              </button>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    {isNew ? "Cadastrar Título" : "Detalhes do Título"}
                  </h1>
                  <Badge variant="outline" className="shrink-0 text-xs">
                    Ocorrência: {ocorrenciaBadgeLabel}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Gerencie os dados e o fluxo operacional do título nesta tela.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col gap-2 lg:w-auto lg:shrink-0 lg:items-end">
              {workflowActionButtons.length > 0 ? (
                <div className="rounded-lg bg-muted/30 p-2">
                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    {workflowActionButtons.map((buttonConfig) => (
                      <Button
                        key={buttonConfig.label}
                        variant={buttonConfig.variant}
                        type="button"
                        className={
                          [
                            "h-9 rounded-md border px-3 text-sm font-medium shadow-none md:h-10 md:px-4",
                            "transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.01]",
                            buttonConfig.variant === "default" && "bg-[#FF6B00] text-white hover:bg-[#E56000]",
                            buttonConfig.variant !== "default" && "bg-muted hover:bg-muted/80",
                          ]
                            .filter(Boolean)
                            .join(" ")
                        }
                        onClick={() => {
                          console.info(`Ação "${buttonConfig.label}" ainda não implementada`);
                        }}
                      >
                        {buttonConfig.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-lg bg-muted/20 p-3">
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-[#FF6B00] transition-all duration-700 ease-out hover:brightness-110"
                style={{ width: `${workflowProgress.percent}%` }}
              />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {workflowProgress.steps.map((step) => (
                <div
                  key={step.label}
                  className={`flex items-center gap-1 text-[11px] ${step.completed ? "text-emerald-600" : "text-muted-foreground"}`}
                >
                  {step.completed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />}
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="text-muted-foreground w-full rounded-md border p-8 text-center">Carregando título...</div>
      ) : (
        <PTituloDetailsForm
          titulo={titulo}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
          selectOptionsByField={selectOptionsByField}
        />
      )}
    </div>
  );
}
