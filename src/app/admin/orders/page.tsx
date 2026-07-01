"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

interface Order {
  _id: string;
  customer: {
    fullName: string;
    email: string;
    street: string;
    city: string;
  };
  items: OrderItem[];
  totalAmount: number;
  fulfillmentStatus: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to stream administrative order ledger:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  // Compute live analytical ledger metrics from incoming data streams
  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.totalAmount || 0),
    0,
  );
  const averageOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono text-neutral-500">
        <span className="animate-pulse">
          ⏳ CALIBRATING LOGISTICS MONITOR DECK...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-accent-lime/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation Dashboard Header */}
        <header className="border-b border-white/5 pb-6 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
              HQ // INTEL_CENTER
            </span>
            <h1 className="text-3xl font-black uppercase tracking-tight text-white font-mono">
              TRANSACTION_LEDGERS
            </h1>
          </div>
          <div className="flex gap-3 font-mono text-xs">
            <Link
              href="/admin/products"
              className="border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] px-4 py-2 rounded-xl transition-colors text-zinc-400 hover:text-white"
            >
              MANAGE_STOCK
            </Link>
            <Link
              href="/"
              className="bg-white text-black font-bold px-4 py-2 rounded-xl hover:bg-accent-lime transition-all"
            >
              STUDIO_VIEW
            </Link>
          </div>
        </header>

        {/* Live Aggregation Analytics Deck */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 block mb-2">
              GROSS_REVENUE_STREAM
            </span>
            <p className="text-2xl font-black text-accent-cyan font-mono">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 block mb-2">
              COMMITTED_TICKET_VOLUME
            </span>
            <p className="text-2xl font-black text-white font-mono">
              {orders.length} LOGS
            </p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-white/[0.01] backdrop-blur-xl">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 block mb-2">
              AVERAGE_TICKET_VALUE
            </span>
            <p className="text-2xl font-black text-accent-lime font-mono">
              ${averageOrderValue.toFixed(2)}
            </p>
          </div>
        </section>

        {/* Chronological Orders Log Feed */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase px-1">
            [ CHRONOLOGICAL ARCHIVE FEED ]
          </h2>

          {orders.length === 0 ? (
            <div className="border border-dashed border-white/5 rounded-2xl p-12 text-center text-zinc-600 font-mono text-xs">
              NO TRANSACTION METRICS INGESTED INSIDE DATABASE CLUSTER
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="glass-panel border border-white/5 bg-white/[0.01] backdrop-blur-md p-6 rounded-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                >
                  {/* Customer Meta Frame */}
                  <div className="lg:col-span-4 space-y-1.5 border-b lg:border-b-0 lg:border-r border-white/5 pb-4 lg:pb-0 lg:pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono bg-zinc-900 border border-white/5 px-2 py-0.5 rounded text-zinc-400">
                        {order._id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                          order.fulfillmentStatus === "unfulfilled"
                            ? "bg-amber-950/20 text-amber-400 border border-amber-500/10"
                            : "bg-emerald-950/20 text-emerald-400 border border-emerald-500/10"
                        }`}
                      >
                        {order.fulfillmentStatus}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-neutral-200">
                      {order.customer.fullName}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono truncate">
                      {order.customer.email}
                    </p>
                    <p className="text-[11px] text-zinc-400 truncate font-mono">
                      {order.customer.street}, {order.customer.city}
                    </p>
                  </div>

                  {/* Purchased Items Sub-Manifest Frame */}
                  <div className="lg:col-span-5 space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center text-xs font-mono text-zinc-400 bg-black/20 p-2 rounded-xl border border-white/[0.02]"
                      >
                        <span className="truncate max-w-[200px] text-neutral-300 font-sans font-medium">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-zinc-500 shrink-0">
                          [{item.size}/{item.color}] x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Financial Total Matrix */}
                  <div className="lg:col-span-3 text-left lg:text-right flex lg:flex-col justify-between lg:justify-center items-center lg:items-end gap-1.5 border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
                    <span className="text-[9px] font-mono text-zinc-500 tracking-wider">
                      NET_PAYMENT_VALUE
                    </span>
                    <p className="text-lg font-mono font-black text-white">
                      ${order.totalAmount.toFixed(2)}
                    </p>
                    <span className="text-[9px] font-mono text-zinc-600 block">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        dateStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
