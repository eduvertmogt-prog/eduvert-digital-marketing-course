export type PaymentKind = "deposit" | "instalment"

export interface Payment {
  id: string
  kind: PaymentKind
  amountPaise: number
  paidOn: string
  reference: string | null
  recordedBy: string
  voidReason: string | null
  voidedBy: string | null
  voidedAt: string | null
}

export interface FeeLedger {
  courseSlug: string
  agreedPaise: number
  payments: Payment[]
}

export interface StudentFees {
  courses: { slug: string; title: string; suggestedPaise: number | null }[]
  ledgers: FeeLedger[]
}

export type FeeChange = { courseSlug: string } & (
  | { action: "fee"; amountPaise: number; expectedFee: number | null }
  | { action: "record"; paymentId: string; amountPaise: number; kind: PaymentKind; paidOn: string; reference: string | null }
  | { action: "void"; paymentId: string; reason: string }
)

export const maxFeePaise = 100_000_000
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 })

export function feeMoney(paise: number) {
  return currency.format(paise / 100)
}

export function parsePaise(value: string) {
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(value)) return null
  const [rupees, cents = ""] = value.split(".")
  const paise = Number(rupees) * 100 + Number(cents.padEnd(2, "0"))
  return paise <= maxFeePaise ? paise : null
}

export function receivedPaise(ledger?: FeeLedger) {
  return ledger?.payments.reduce((total, payment) => total + (payment.voidedAt ? 0 : payment.amountPaise), 0) ?? 0
}
