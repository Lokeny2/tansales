"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import AdminGuard from "@/components/auth/AdminGuard";
import { useAuth } from "@/context/AuthContext";

function AdminOrdersContent() {
  const { token } = useAuth();

  const orders = useQuery(
    api.orders.getOrdersLog,
    token ? { token } : "skip",
  );

  if (orders === undefined) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center font-mono text-neutral-500">
        <span className="animate-pulse">CALIBRATING LOGISTICS MONITOR DECK...</span>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian flex items-center justify-center font-mono text-neutral-400">
        <div className="glass-panel p-8 rounded-xl text-center max-w-md mx-4">
          <p className="text-accent-lime font-semibold mb-1">LEDGER_EMPTY</p>
          <p className="text-sm text-neutral-500">No client transactions recorded in the cloud database yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian text-neutral-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">

        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-accent-lime font-mono">TANITE-POS LEDGER</h1>
            <p className="text-sm text-neutral-400 mt-0.5">Real-time inventory metrics & fulfillment flows.</p>
          </div>
          <div className="flex items-center gap-2 glass-panel px-3 py-1.5 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-accent-lime animate-ping" />
            <span className="text-xs font-mono font-medium text-accent-lime uppercase tracking-wider">
              live_sync_active
            </span>
          </div>
        </header>

        <div className="grid gap-4">
          {orders.map((order) => {
            const standardDate = order.createdAt ? order.createdAt.split("T")[0] : "PENDING";

            return (
              <div
                key={order._id}
                className="glass-panel p-5 sm:p-6 rounded-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-500">SYS_REF:</span>
                      <span className="text-xs font-mono text-neutral-400 font-semibold">{order._id}</span>
                    </div>
                    <h3 className="text-lg font-semibold mt-1.5 text-neutral-200">{order.customer.fullName}</h3>
                    <p className="text-xs font-mono text-neutral-400">{order.customer.email}</p>
                  </div>

                  <div className="sm:text-right flex sm:flex-col justify-between sm:justify-start w-full sm:w-auto items-center sm:items-end gap-1">
                    <span className="text-xs font-mono text-neutral-500 bg-white/[0.02] px-2 py-0.5 rounded border border-white/10">
                      {standardDate}
                    </span>
                    <p className="text-xl font-bold text-accent-lime mt-1 font-mono">
                      KSh {order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-black/20 border border-white/5 rounded-lg p-4">
                  <p className="text-xs font-mono font-bold tracking-widest text-neutral-500 uppercase mb-3">
                    ALLOCATED_SKU_ITEMS
                  </p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-item-${index}`}
                        className="flex justify-between items-start text-sm font-mono"
                      >
                        <div className="text-neutral-300">
                          <span className="text-neutral-100 font-medium">{item.name}</span>
                          <div className="text-xs text-neutral-500 mt-0.5">
                            VARIANT: {item.size} // {item.color} &times; {item.quantity}
                          </div>
                        </div>
                        <span className="text-neutral-400 font-semibold">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 text-xs font-mono">
                  <span className="bg-white/[0.02] text-neutral-400 border border-white/10 px-2.5 py-1 rounded-md">
                    PAYMENT: <span className="text-accent-lime uppercase font-bold">{order.paymentStatus}</span>
                  </span>
                  <span className="bg-white/[0.02] text-neutral-400 border border-white/10 px-2.5 py-1 rounded-md">
                    DISPATCH: <span className="text-accent-cyan uppercase font-bold">{order.fulfillmentStatus}</span>
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <AdminGuard>
      <AdminOrdersContent />
    </AdminGuard>
  );
}
