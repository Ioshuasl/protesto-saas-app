"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PBancoForm, BancoFormValues } from "./PBancoForm";
import { PBancoInterface } from "@/packages/administrativo/interfaces";

interface PBancoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banco?: PBancoInterface | null;
  onSubmit: (data: BancoFormValues) => void;
  isLoading?: boolean;
}

export function PBancoDialog({
  open,
  onOpenChange,
  banco,
  onSubmit,
  isLoading,
}: PBancoDialogProps) {
  const isEditing = !!banco;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Banco" : "Novo Banco"}
          </DialogTitle>
        </DialogHeader>
        <PBancoForm
          defaultValues={banco || undefined}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
