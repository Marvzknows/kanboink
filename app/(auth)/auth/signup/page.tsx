"use client";

import React from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupInput, signupSchema } from "@/app/schemas/authSchema";
import { signupAction } from "@/app/actions/auth/authActions";
import { toast } from "sonner";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value as string)
      );

      const response = await signupAction(formData);

      if (!response.success) {
        // Handle field-specific or general errors
        if (response.error) {
          Object.entries(response.error).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) =>
                toast.error(msg, { description: `Error in ${field}` })
              );
            } else {
              toast.error(String(messages));
            }
          });
        } else {
          toast.error("Something went wrong. Please try again.");
        }
        return;
      }

      toast.success("Account created successfully!", {
        description: "You can now sign in with your new account.",
      });
    } catch (error) {
      toast.error("Unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-lg">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <h1 className="text-xl font-bold">Create an Account</h1>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-2 md:px-4 py-6 rounded"
        >
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              type="first_name"
              id="first_name"
              placeholder="First name"
              {...register("first_name")}
            />
            {errors.first_name?.message && (
              <small className="text-red-500">
                {errors.first_name?.message}
              </small>
            )}
          </div>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="middle_name">Middle Name</Label>
            <Input
              type="middle_name"
              id="middle_name"
              placeholder="Middle name"
              {...register("middle_name")}
            />
            {errors.middle_name?.message && (
              <small className="text-red-500">
                {errors.middle_name?.message}
              </small>
            )}
          </div>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              type="last_name"
              id="last_name"
              placeholder="Last name"
              {...register("last_name")}
            />
            {errors.last_name?.message && (
              <small className="text-red-500">
                {errors.last_name?.message}
              </small>
            )}
          </div>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Email" {...register("email")} />
            {errors.email?.message && (
              <small className="text-red-500">{errors.email?.message}</small>
            )}
          </div>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" {...register("password")} />
            {errors.password?.message && (
              <small className="text-red-500">{errors.password?.message}</small>
            )}
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Creating accoung..." : "Create account"}
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Button
              disabled={isSubmitting}
              variant="outline"
              type="button"
              className="w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Continue with Apple
            </Button>
            <Button
              disabled={isSubmitting}
              variant="outline"
              type="button"
              className="w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
