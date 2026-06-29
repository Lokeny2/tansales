```markdown
# Next.js App Router Component Architecture

This document blueprints the expected directory structure for the Next.js frontend application within the `src/` directory.

## 1. App Routing Map (`src/app/`)
* `layout.tsx` -> Global provider wrappers (Theme, Cart Context) & Navigation Layout
* `page.tsx` -> Homepage / Featured Collections
* `products/page.tsx` -> Main searchable catalog with filtering sidebars
* `products/[id]/page.tsx` -> Dynamic Product Detail Page (PDP) for variant selections
* `cart/page.tsx` -> Shopping cart review line-items
* `checkout/page.tsx` -> Shipping information capture and final payment intent
* `admin/page.tsx` -> Inventory controls (Protected Route)

## 2. Component Design Architecture (`src/components/`)
* **ui/** -> Reusable atomic UI pieces (Button.tsx, Card.tsx, Badge.tsx)
* **layout/** -> Core global structural components (Navbar.tsx, Footer.tsx)
* **products/** -> Product-specific functional components (ProductCard.tsx, FilterSidebar.tsx, VariantSelector.tsx)
* **cart/** -> Cart management displays (CartItemRow.tsx, OrderSummary.tsx)

## 3. State Management (`src/context/`)
* `CartContext.tsx` -> Global React context syncing cart state items to `localStorage`.