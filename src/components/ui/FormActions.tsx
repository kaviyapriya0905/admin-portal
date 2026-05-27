import React from "react";
import { Save } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";

interface FormActionsProps {
  /**
   * Action to perform when cancel is clicked (e.g. navigate back)
   */
  onCancel: () => void;
  
  /**
   * Text for the cancel button
   * @default "Cancel"
   */
  cancelText?: string;
  
  /**
   * Text for the submit button
   * @default "Save"
   */
  submitText?: string;
  
  /**
   * Whether the submit button should be disabled
   */
  isSubmitDisabled?: boolean;
  
  /**
   * Custom icon for the submit button. Pass null to remove icon.
   * @default <Save className="w-5 h-5" />
   */
  submitIcon?: React.ReactNode;
  
  /**
   * Custom class names for the submit button (e.g. for warning states)
   */
  submitClassName?: string;
  
  /**
   * Custom class names for the container
   */
  className?: string;
}

const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  cancelText = "Cancel",
  submitText = "Save",
  isSubmitDisabled = false,
  submitIcon = <Save className="w-5 h-5" />,
  submitClassName,
  className
}) => {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row justify-end gap-4", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="w-full sm:w-auto rounded-xl py-3 text-slate-600"
      >
        {cancelText}
      </Button>
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitDisabled}
        className={cn(
          "w-full sm:w-auto rounded-xl py-3 shadow-lg flex items-center justify-center gap-2",
          submitClassName || "bg-brand-primary shadow-brand-primary/30 hover:bg-[#8e330b]"
        )}
      >
        {submitIcon}
        {submitText}
      </Button>
    </div>
  );
};

export default FormActions;
