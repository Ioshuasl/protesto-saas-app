"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PBancoInterface } from "@/packages/administrativo/interfaces";
import { bancoFormSchema, type BancoFormValues } from "@/packages/administrativo/schemas/PBanco/PPBancoFormSchema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

export type { BancoFormValues };

interface PBancoFormProps {
  defaultValues?: Partial<PBancoInterface>;
  onSubmit: (data: BancoFormValues) => void;
  isLoading?: boolean;
}

export function PBancoForm({ defaultValues, onSubmit, isLoading }: PBancoFormProps) {
  const form = useForm<BancoFormValues>({
    resolver: zodResolver(bancoFormSchema),
    defaultValues: {
      codigo_banco: defaultValues?.codigo_banco || "",
      descricao: defaultValues?.descricao || "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        codigo_banco: defaultValues.codigo_banco || "",
        descricao: defaultValues.descricao || "",
      });
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="codigo_banco"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código do Banco</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Banco do Brasil" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#FF6B00] hover:bg-[#E56000] text-white"
          >
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
