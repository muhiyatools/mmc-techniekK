"use client";

import { useState } from "react";
import type { LeadRow } from "@/lib/admin/leads";
import { LeadDetail, type Staff } from "./LeadDetail";

/** Stand-alone lead page (phone, and the link in the notification email). */
export function LeadDetailPage({ lead, staff }: { lead: LeadRow; staff: Staff[] }) {
  const [row, setRow] = useState(lead);
  return <LeadDetail lead={row} staff={staff} onChange={(p) => setRow((r) => ({ ...r, ...p }))} />;
}
