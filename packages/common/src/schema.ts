import { z } from "zod";

const SignUpSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const CreateRoomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters long"),
});

const JoinRoomSchema = z.object({
  joiningId: z.string().min(3, "Room id must be at least 3 characters long"),
});

export { SignUpSchema, LoginSchema, CreateRoomSchema, JoinRoomSchema };
