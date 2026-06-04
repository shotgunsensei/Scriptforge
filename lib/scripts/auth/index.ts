import { OperatorOsSsoAuthAdapter } from "./operatorOsAuth";
import { PasswordAuthAdapter } from "./passwordAuth";

export function getAuthAdapter() {
  return process.env.OPERATOROS_AUTH_MODE === "sso" ? new OperatorOsSsoAuthAdapter() : new PasswordAuthAdapter();
}
