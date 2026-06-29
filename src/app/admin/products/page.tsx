"use client";

import { useState } from "react";

export default function AdminProductsDashboard() {
  // Simulated verification settings
  const [isAdmin, setIsAdmin] = useState(true);
  const [formInputs, setFormInputs] = useState({
    title: "",
    description: "",
    price: "",
    category: "Tees",
    sizes: [] as string[],
    imageUrl: "",
  });

  const handleSizeToggle = (size: string) => {
    setFormInputs((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `Scaffold Payload Validated: Ready to dispatch JSON data structure to /api/products POST route!\n\n${JSON.stringify(formInputs, null, 2)}`,
    );
  };

  // Render simulated unauthorized screen if admin access token falls low
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto py-32 px-6 text-center space-y-4">
        <h1 className="text-2xl font-black uppercase text-red-400 tracking-tight">
          Security Access Exception
        </h1>
        <p className="text-xs text-zinc-400 uppercase tracking-widest">
          Your authorization signature role claims customer rank. Route requires
          secure store manager scope overrides.
        </p>
        <button
          onClick={() => setIsAdmin(true)}
          className="bg-white/10 px-4 py-2 rounded-full text-[10px] tracking-widest uppercase font-bold text-white hover:bg-white/20"
        >
          Simulate Root Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Admin Action Header Row */}
      <header className="border-b border-white/10 pb-6 mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-widest text-accent-cyan uppercase block mb-1">
            Management Portal
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Inventory Architect
          </h1>
        </div>
        <button
          onClick={() => setIsAdmin(false)}
          className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] tracking-widest font-bold uppercase px-4 py-2 rounded-full hover:bg-red-500/20 transition-all"
        >
          Simulate Log Out
        </button>
      </header>

      {/* Grid Layout Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Hand Element Block: Core Product CRUD Management Input Form */}
        <section className="lg:col-span-2 glass-panel p-6 rounded-sm">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-300 border-b border-white/5 pb-3 mb-6">
            Create New SKU Record
          </h2>

          <form
            onSubmit={handleFormSubmit}
            className="space-y-5 text-xs uppercase tracking-wider text-zinc-400"
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-zinc-500 tracking-widest font-bold">
                Product Title
              </label>
              <input
                type="text"
                required
                value={formInputs.title}
                onChange={(e) =>
                  setFormInputs({ ...formInputs, title: e.target.value })
                }
                placeholder="e.g., Heavyweight Boxy Tee"
                className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 tracking-widest font-bold">
                  Base Valuation Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formInputs.price}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, price: e.target.value })
                  }
                  placeholder="30.00"
                  className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-zinc-500 tracking-widest font-bold">
                  Classification Category
                </label>
                <select
                  value={formInputs.category}
                  onChange={(e) =>
                    setFormInputs({ ...formInputs, category: e.target.value })
                  }
                  className="bg-zinc-900 border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white uppercase tracking-wider"
                >
                  <option value="Tees">Tees</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Outerwear">Outerwear</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-zinc-500 tracking-widest font-bold">
                Overview Detailed Description
              </label>
              <textarea
                rows={3}
                required
                value={formInputs.description}
                onChange={(e) =>
                  setFormInputs({ ...formInputs, description: e.target.value })
                }
                placeholder="Enter fabric density breakdown details, silhouette profiles, structural specs..."
                className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white normal-case tracking-wide"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-zinc-500 tracking-widest font-bold">
                Image CDN Asset Token URL
              </label>
              <input
                type="url"
                required
                value={formInputs.imageUrl}
                onChange={(e) =>
                  setFormInputs({ ...formInputs, imageUrl: e.target.value })
                }
                placeholder="https://images.unsplash.com/..."
                className="bg-white/[0.02] border border-white/10 rounded-sm px-4 py-3 text-xs text-white focus:outline-none focus:border-white normal-case tracking-wide"
              />
            </div>

            {/* Sizing Array Checkers Checklist Selection Grid */}
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 tracking-widest block font-bold">
                Active Dimensions Target Matrix
              </label>
              <div className="flex gap-2">
                {["S", "M", "L", "XL"].map((size) => {
                  const isActive = formInputs.sizes.includes(size);
                  return (
                    <button
                      type="button"
                      key={size}
                      onClick={() => handleSizeToggle(size)}
                      className={`w-12 h-12 border text-xs font-bold rounded-sm transition-all ${
                        isActive
                          ? "bg-accent-cyan text-white border-accent-cyan"
                          : "border-white/10 text-zinc-400 hover:border-white"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-obsidian font-bold text-xs uppercase tracking-widest py-4 rounded-sm hover:bg-accent-lime hover:text-white transition-all cursor-pointer"
            >
              Execute Production SKU Dispatch
            </button>
          </form>
        </section>

        {/* Right Hand Element Block: Current Stock Capacity Metadata Review Panel */}
        <section className="space-y-6">
          <div className="glass-panel p-6 rounded-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 border-b border-white/5 pb-2 mb-4">
              Inventory Telemetry
            </h3>
            <div className="space-y-4 text-xs tracking-wider uppercase text-zinc-400">
              <div className="flex justify-between">
                <span>Active SKUs mapped</span>
                <span className="text-white font-bold">3 Records</span>
              </div>
              <div className="flex justify-between">
                <span>Global Stock Pool Capacity</span>
                <span className="text-white font-bold">142 Items</span>
              </div>
              <div className="flex justify-between">
                <span>System Warehouse Operations</span>
                <span className="text-accent-lime font-bold">
                  ONLINE STATUS
                </span>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-sm text-[10px] text-zinc-500 uppercase tracking-wide leading-relaxed">
            💡 <strong>Architecture Note:</strong> When we transition to the
            backend phase, this dashboard form will direct payloads straight
            into your live MongoDB Atlas server via specialized Mongoose ODM
            schema pipelines.
          </div>
        </section>
      </div>
    </div>
  );
}
