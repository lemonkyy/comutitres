"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, LogIn } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/actions/button/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input/input";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "@/i18n/navigation";
import { ApiClientError } from "@/lib/api/ApiClientError";
import type { LoginInput } from "@/utils/types";

export type LoginFormCopy = {
  email: {
    invalid: string;
    label: string;
    placeholder: string;
    required: string;
  };
  password: {
    label: string;
    placeholder: string;
    required: string;
  };
  submitLabel: string;
  submittingLabel: string;
};

type LoginFormProps = {
  copy: LoginFormCopy;
  returnTo: "/" | "/account" | "/account/settings";
};

export function LoginForm({ copy, returnTo }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuth();
  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().min(1, copy.email.required).email(copy.email.invalid),
        password: z.string().min(1, copy.password.required),
      }),
    [copy],
  );
  const form = useForm<LoginInput>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = form;

  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={handleSubmit(async (values) => {
        const result = await login(values);

        if (result instanceof ApiClientError) {
          setError("root", {
            message: result.message,
            type: "server",
          });
          return;
        }

        router.replace(returnTo);
      })}
    >
      <FieldGroup className="gap-4">
        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="login-email">{copy.email.label}</FieldLabel>
          <Input
            autoComplete="email"
            id="login-email"
            type="email"
            aria-invalid={Boolean(errors.email)}
            placeholder={copy.email.placeholder}
            {...register("email")}
          />
          <FieldError errors={[errors.email]} />
        </Field>

        <Field data-invalid={Boolean(errors.password)}>
          <FieldLabel htmlFor="login-password">
            {copy.password.label}
          </FieldLabel>
          <Input
            autoComplete="current-password"
            id="login-password"
            type="password"
            aria-invalid={Boolean(errors.password)}
            placeholder={copy.password.placeholder}
            {...register("password")}
          />
          <FieldError errors={[errors.password]} />
        </Field>
      </FieldGroup>

      <FieldError errors={[errors.root]} />

      <Button className="min-h-12 w-full" disabled={isSubmitting} type="submit">
        {isSubmitting ? (
          <LoaderCircle className="animate-spin" data-icon="inline-start" />
        ) : (
          <LogIn data-icon="inline-start" />
        )}
        {isSubmitting ? copy.submittingLabel : copy.submitLabel}
      </Button>
    </form>
  );
}
