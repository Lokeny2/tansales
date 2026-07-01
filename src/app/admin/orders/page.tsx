"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export default function AdminOrdersPage() {
  // Pull live data stream using the newly exposed query function
  const orders = useQuery(api.orders.getOrdersLog);

  // Loading framework matching client-side handshake state
  if (orders === undefined) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-neutral-500">
        <span className="animate-pulse">⏳ CALIBRATING LOGISTICS MONITOR DECK...</span>
      </div>
    );
  }

  // Fallback view when collection array is empty
  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-neutral-400">
        <div className="border border-neutral-800 bg-neutral-900/20 p-8 rounded-xl text-center max-w-md mx-4">
          <p className="text-emerald-400 font-semibold mb-1">LEDGER_EMPTY</p>
          <p className="text-sm text-neutral-500">No client transactions recorded in the cloud database yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-800 pb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-400 font-mono">TANITE-POS LEDGER</h1>
            <p className="text-sm text-neutral-400 mt-0.5">Real-time inventory metrics & fulfillment flows.</p>
          </div>
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-medium text-emerald-400 uppercase tracking-wider">
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
                className="bg-neutral-900/30 backdrop-blur-md border border-neutral-800/80 p-5 sm:p-6 rounded-xl"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4 pb-4 border-b border-neutral-800/40">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-neutral-500">SYS_REF:</span>
                      <span className="text-xs font-mono text-neutral-400 font-semibold">{order._id}</span>
                    </div>
                    <h3 className="text-lg font-semibold mt-1.5 text-neutral-200">{order.customer.fullName}</h3>
                    <p className="text-xs font-mono text-neutral-400">{order.customer.email}</p>
                  </div>
                  
                  <div className="sm:text-right flex sm:flex-col justify-between sm:justify-start w-full sm:w-auto items-center sm:items-end gap-1">
                    <span className="text-xs font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                      {standardDate}
                    </span>
                    <p className="text-xl font-bold text-emerald-400 mt-1 font-mono">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-950/50 border border-neutral-800/50 rounded-lg p-4">
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
                            VARIANT: {item.size} // {item.color} × {item.quantity}
                          </div>
                        </div>
                        <span className="text-neutral-400 font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-4 text-xs font-mono">
                  <span className="bg-neutral-900 text-neutral-400 border border-neutral-800 px-2.5 py-1 rounded-md">
                    PAYMENT: <span className="text-emerald-400 uppercase font-bold">{order.paymentStatus}</span>
                  </span>
                  <span className="bg-neutral-900 text-neutral-400 border border-neutral-800 px-2.5 py-1 rounded-md">
                    DISPATCH: <span className="text-amber-500 uppercase font-bold">{order.fulfillmentStatus}</span>
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