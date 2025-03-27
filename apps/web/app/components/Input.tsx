"use client";

import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputTypeProps {
  type: string;
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  icon?: React.ReactNode;
}

export default function Input({
  type,
  label,
  register,
  error,
  icon,
}: InputTypeProps) {
  return (
    <div>
      <label className="input validator w-full rounded-md">
        {icon}
        <input type={type} placeholder={label} {...register} />
      </label>
      {error && <p className="text-sm text-error mt-1">{error.message}</p>}
    </div>
  );
}
