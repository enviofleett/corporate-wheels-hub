// Mock data for Phase 7 — Escrow & Payments UI.
// Fund escrow, payment methods, transaction receipts, and payouts.
// All UI-only mock state — no Paystack wiring yet.

export type PaymentMethodType = "card" | "bank_transfer" | "ussd" | "wallet";

export type PaymentMethod = {
  id: string;
  type: PaymentMethodType;
  label: string; // e.g. "Visa •••• 4242"
  hint?: string; // e.g. "Expires 09/27"
  brand?: string; // visa, mastercard, verve
  isDefault: boolean;
  ownerRole: "corporate" | "host";
};

export type BankAccount = {
  id: string;
  bankName: string;
  accountNumber: string; // masked
  accountName: string;
  isDefault: boolean;
};

export type TxnKind =
  | "escrow_funding"
  | "escrow_release"
  | "refund"
  | "payout"
  | "fee"
  | "bonus";

export type TxnStatus =
  | "pending"
  | "processing"
  | "successful"
  | "failed"
  | "refunded";

export type Transaction = {
  id: string;
  ref: string; // human-readable reference
  kind: TxnKind;
  status: TxnStatus;
  amount: number; // positive in Naira; negative for outflows
  fee?: number;
  net?: number;
  date: string; // ISO
  counterparty: string; // e.g. "Host #A2C9" or "Logistics Co. #4821"
  dealId?: string;
  vehicleLabel?: string;
  method?: string; // e.g. "Visa •••• 4242"
  description?: string;
};

export type Payout = {
  id: string;
  ref: string;
  amount: number;
  fee: number;
  net: number;
  bank: string; // "GTBank •••• 4421"
  status: "scheduled" | "processing" | "completed" | "failed";
  requestedAt: string;
  completedAt?: string;
};

const NOW = new Date("2025-04-18T10:00:00Z").getTime();
const ago = (h: number) => new Date(NOW - h * 3_600_000).toISOString();

// ─── Payment methods (Corporate side) ───────────────────────────────────────
const CORP_METHODS: PaymentMethod[] = [
  {
    id: "pm_001",
    type: "card",
    label: "Visa •••• 4242",
    hint: "Expires 09/27",
    brand: "visa",
    isDefault: true,
    ownerRole: "corporate",
  },
  {
    id: "pm_002",
    type: "card",
    label: "Mastercard •••• 8821",
    hint: "Expires 02/26",
    brand: "mastercard",
    isDefault: false,
    ownerRole: "corporate",
  },
  {
    id: "pm_003",
    type: "bank_transfer",
    label: "Bank transfer",
    hint: "Pay via account number",
    isDefault: false,
    ownerRole: "corporate",
  },
  {
    id: "pm_004",
    type: "ussd",
    label: "USSD",
    hint: "Pay with bank code",
    isDefault: false,
    ownerRole: "corporate",
  },
];

// ─── Bank accounts (Host side, for payouts) ─────────────────────────────────
const HOST_BANKS: BankAccount[] = [
  {
    id: "ba_001",
    bankName: "GTBank",
    accountNumber: "•••• 4421",
    accountName: "Adewale Logistics",
    isDefault: true,
  },
  {
    id: "ba_002",
    bankName: "Access Bank",
    accountNumber: "•••• 9087",
    accountName: "Adewale Logistics",
    isDefault: false,
  },
];

// ─── Transactions (shown on receipts and history) ───────────────────────────
const TRANSACTIONS: Transaction[] = [
  {
    id: "txn_001",
    ref: "FLK-ESC-2025-0418-001",
    kind: "escrow_funding",
    status: "successful",
    amount: 6_960_000, // 12 weeks × 580k
    fee: 34_800,
    net: 6_960_000,
    date: ago(36),
    counterparty: "Host #E558",
    dealId: "deal_001",
    vehicleLabel: "Ford Ranger 2022 — Blue ×4",
    method: "Visa •••• 4242",
    description: "Escrow funding — 12-week site vehicles contract",
  },
  {
    id: "txn_002",
    ref: "FLK-ESC-2025-0416-002",
    kind: "escrow_funding",
    status: "pending",
    amount: 28_320_000, // 24 months × 1.18M
    fee: 141_600,
    net: 28_320_000,
    date: ago(72),
    counterparty: "Host #B7F1",
    dealId: "deal_002",
    vehicleLabel: "Honda Accord 2023 — Black",
    method: "Awaiting bank transfer",
    description: "Escrow funding — Executive transport",
  },
  {
    id: "txn_003",
    ref: "FLK-REL-2025-0411-014",
    kind: "escrow_release",
    status: "successful",
    amount: 600_000,
    date: ago(24 * 7),
    counterparty: "Host #E558",
    dealId: "deal_001",
    vehicleLabel: "Toyota Hilux ×2 — week 7",
    description: "Released to host on weekly milestone",
  },
  {
    id: "txn_004",
    ref: "FLK-FEE-2025-0411-015",
    kind: "fee",
    status: "successful",
    amount: -30_000,
    date: ago(24 * 7),
    counterparty: "FleetLink",
    description: "Platform fee (5%)",
  },
];

// ─── Payouts (Host side) ────────────────────────────────────────────────────
const PAYOUTS: Payout[] = [
  {
    id: "po_001",
    ref: "FLK-PO-2025-0411-001",
    amount: 1_055_000,
    fee: 0,
    net: 1_055_000,
    bank: "GTBank •••• 4421",
    status: "completed",
    requestedAt: ago(24 * 7 + 2),
    completedAt: ago(24 * 7),
  },
  {
    id: "po_002",
    ref: "FLK-PO-2025-0328-002",
    amount: 850_000,
    fee: 0,
    net: 850_000,
    bank: "GTBank •••• 4421",
    status: "completed",
    requestedAt: ago(24 * 21 + 4),
    completedAt: ago(24 * 21),
  },
];

// ─── Public API ─────────────────────────────────────────────────────────────
export function listPaymentMethods(role: "corporate" | "host" = "corporate"): PaymentMethod[] {
  return CORP_METHODS.filter((m) => m.ownerRole === role);
}

export function listBankAccounts(): BankAccount[] {
  return [...HOST_BANKS];
}

export function defaultPaymentMethod(): PaymentMethod {
  return CORP_METHODS.find((m) => m.isDefault) ?? CORP_METHODS[0];
}

export function defaultBankAccount(): BankAccount {
  return HOST_BANKS.find((b) => b.isDefault) ?? HOST_BANKS[0];
}

export function listTransactions(): Transaction[] {
  return [...TRANSACTIONS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getTransaction(id: string): Transaction | undefined {
  return TRANSACTIONS.find((t) => t.id === id);
}

export function listPayouts(): Payout[] {
  return [...PAYOUTS].sort(
    (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime(),
  );
}

// Fee calculator — flat 5% mock platform fee + 1.5% gateway.
export function calcFees(amount: number) {
  const platform = Math.round(amount * 0.05);
  const gateway = Math.round(amount * 0.015);
  const total = platform + gateway;
  return { platform, gateway, total, grandTotal: amount + total };
}

export const TXN_KIND_LABEL: Record<TxnKind, string> = {
  escrow_funding: "Escrow funding",
  escrow_release: "Escrow release",
  refund: "Refund",
  payout: "Payout",
  fee: "Platform fee",
  bonus: "Bonus",
};

export const TXN_STATUS_LABEL: Record<TxnStatus, string> = {
  pending: "Pending",
  processing: "Processing",
  successful: "Successful",
  failed: "Failed",
  refunded: "Refunded",
};

export const PAYOUT_STATUS_LABEL: Record<Payout["status"], string> = {
  scheduled: "Scheduled",
  processing: "Processing",
  completed: "Completed",
  failed: "Failed",
};

export const PM_TYPE_LABEL: Record<PaymentMethodType, string> = {
  card: "Card",
  bank_transfer: "Bank transfer",
  ussd: "USSD",
  wallet: "Wallet",
};
