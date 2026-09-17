import { PASSWORD_REGEX } from "@/lib/validations/auth";

export const validarPassword = (password) => PASSWORD_REGEX.test(password);