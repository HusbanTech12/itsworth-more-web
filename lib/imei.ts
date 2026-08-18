export type ImeiValidationResult =
  | { ok: true; imei: string }
  | { ok: false; error: string };

/** Strip spaces, dashes, and dots people often paste from Settings. */
export function normalizeImei(raw: string): string {
  return raw.replace(/[\s\-.]/g, "").trim();
}

/**
 * Luhn checksum used by GSM IMEI (15 digits).
 * Double every second digit from the right; digits > 9 are summed as n-9.
 */
export function isLuhnValid(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;

  let sum = 0;
  let doubleIt = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (doubleIt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    doubleIt = !doubleIt;
  }

  return sum % 10 === 0;
}

/**
 * IMEI / IMEISV format:
 * - 15 digits: IMEI, last digit is Luhn check
 * - 16–17 digits: IMEI (15) + software version; Luhn on the first 15
 * Empty is allowed unless `required` is set.
 */
export function validateImei(
  raw: string | null | undefined,
  options?: { required?: boolean },
): ImeiValidationResult {
  const value = typeof raw === "string" ? raw : "";
  const imei = normalizeImei(value);

  if (!imei) {
    if (options?.required) {
      return { ok: false, error: "IMEI is required" };
    }
    return { ok: true, imei: "" };
  }

  if (!/^\d+$/.test(imei)) {
    return { ok: false, error: "IMEI must contain only digits" };
  }

  if (imei.length < 15 || imei.length > 17) {
    return { ok: false, error: "IMEI must be 15–17 digits" };
  }

  if (/^0+$/.test(imei)) {
    return { ok: false, error: "Enter a valid IMEI from the device" };
  }

  const body = imei.slice(0, 15);
  if (!isLuhnValid(body)) {
    return {
      ok: false,
      error: "IMEI check digit is invalid. Please double-check the number.",
    };
  }

  return { ok: true, imei };
}
