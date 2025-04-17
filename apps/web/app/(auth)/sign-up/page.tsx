"use client";

import React from "react";
import Input from "../../components/Input";
import UserIcon from "../../components/UserIcon";
import EmailIcon from "../../components/EmailIcon";
import PasswordIcon from "../../components/PasswordIcon";
import { useForm } from "react-hook-form";
import { SignUpSchema } from "@repo/common/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
  });

  const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
    // console.log("Submitted data:", data);
    // API call
    try {
      const response = await axios.post("/api/auth/sign-up", data);
      if (response.status === 201) {
        toast.success("Account created successfully");
      }
      router.push("/login");
      reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(
          error.response.status === 409
            ? "User already exist with this email"
            : error.response.status === 400
              ? "Invalid Inputs"
              : "Internal server error"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center ">
      <div className="card bg-neutral text-neutral-content max-w-screen-md w-full mx-2 flex justify-center items-center py-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card-body md:w-2/3 w-full"
        >
          <h2 className="card-title text-center text-3xl justify-center mb-10">
            Register to your account
          </h2>
          <div className="grid grid-cols-1 gap-5">
            <Input
              icon={<UserIcon />}
              label="Full Name"
              register={register("fullName")}
              type="text"
              error={errors.fullName}
            />

            <Input
              icon={<EmailIcon />}
              label="Email"
              register={register("email")}
              type="email"
              error={errors.email}
            />

            <Input
              icon={<PasswordIcon />}
              label="Password"
              register={register("password")}
              type="password"
              error={errors.password}
            />
          </div>

          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Sign Up"}
            </button>
            <p className="text-center text-sm mt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
