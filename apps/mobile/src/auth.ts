import type { User } from "@goldlink/core";

// Mask an email like `pierre.mvita@privatewealth.com` -> `p***a@privatewealth.com`.
// Falls back gracefully when the input is malformed.
export function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return email;
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) {
    const first = local[0] ?? "*";
    return `${first}***@${domain}`;
  }
  const first = local[0];
  const last = local[local.length - 1];
  return `${first}***${last}@${domain}`;
}

// Mask a phone like `+1 (212) 555-0001` -> `••• ••• 0001`, preserving only the last 4 digits.
export function maskPhone(phone: string): string {
  if (!phone) return phone;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  const lastFour = digits.slice(-4);
  return `••• ••• ${lastFour}`;
}

// Pick a sensible masked contact string for the 2FA copy. Prefers phone, then email.
export function getMaskedContact(
  user: Pick<User, "phone" | "email">,
): string {
  if (user.phone) return maskPhone(user.phone);
  if (user.email) return maskEmail(user.email);
  return "your registered device";
}
