# 🏦 GoldLink Bank

![GoldLink Bank](https://images.unsplash.com/photo-1634733988138-bf2c3a2a13fa?q=80&w=2070&auto=format&fit=crop)

**GoldLink Bank** is a premium, full-stack banking application tailored specifically for Ultra High Net Worth Individuals (UHNWI). Built with a deep focus on design, security, and performance, GoldLink offers an exclusive, private banking aesthetic characterized by a sophisticated deep carbon and metallic gold color palette.

---

## ✨ Features

- **Presentation Splash Screen:** A striking entry experience featuring the bespoke "GL" monogram logo and a seamless loading animation to immerse the user immediately into the premium aesthetic.
- **Exclusive Authentication Flow:** A seamlessly overhauled entry point featuring secure login, multi-factor authentication (2FA), and a bespoke "Request an Invitation" flow for prospective elite clients.
- **Premium Dashboard:** A high-level, elegant overview of total net worth, liquid assets, and recent top-tier transactions.
- **Fluid & Premium Animations:** Integration of `motion/react` throughout the application to provide high-quality staggered entrances, interactive hovers, and polished state transitions that elevate the perceived value.
- **Comprehensive Wealth Management:**
  - **Accounts:** Granular insights into checking, savings, and investment accounts with advanced filtering.
  - **Transfers:** Frictionless domestic and international wire transfers designed for high-value transactions.
  - **Bill Pay:** Streamlined payee management and scheduled payments.
  - **Cards:** Credit and debit card management, complete with lock/unlock features and precise spending limits.
  - **Budgeting & Analytics:** Beautiful, interactive charts visualizing cash flow and expenditure, powered by Recharts.
- **Fully Responsive & Dynamic UI:** Meticulously engineered layouts that flawlessly adapt to desktop, tablet, and mobile devices. The application properly handles complex text truncation and flex-wrapping without ever breaking the luxurious design.
- **Local JSON Mock Backend:** A structured `/db` simulating a robust backend architecture for rapid prototyping and localized state management.

## 🛠 Tech Stack

- **Frontend Framework:** React 18 & TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Accessible, customizable Radix primitives)
- **Animation:** Motion (`motion/react`)
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **Mock Database:** Local JSON persistence (`/db/` architecture)

## 🎨 Design System

Following a recent comprehensive UI overhaul, GoldLink Bank's design language is rooted in exclusivity. The aesthetic relies heavily on:
- **Bespoke Branding:** The "GL" monogram acts as a central visual anchor conveying legacy and modern trust.
- **Deep Carbon (`#111111` to `#1A1A1A`):** For profound depth, reduced eye strain, and a modern, executive feel.
- **Metallic Gold (`#D4AF37`, `#cca858`):** As the primary accent, conveying wealth, prestige, and trust.
- **Dynamic Layouts:** Liquid responsiveness guaranteeing that high-density financial data remains legible, beautifully aligned, and fully functional on any screen size.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- `pnpm` (or `npm`/`yarn`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/goldlink-bank.git
   ```
2. Navigate into the directory:
   ```bash
   cd goldlink-bank
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```

## 📁 Project Structure

```text
├── db/                       # Local JSON database simulation
│   ├── accounts.json
│   ├── users.json
│   └── ...
├── src/
│   ├── app/
│   │   ├── components/       # Main feature components & UI elements
│   │   │   ├── ui/           # Reusable shadcn/ui components
│   │   │   └── ...
│   │   ├── App.tsx           # Application entrypoint & Routing
│   │   └── LoginPage.tsx     # Specialized Auth & Invitation flow
│   ├── styles/               # Global CSS, theme configurations, fonts
│   └── imports/              # SVGs and asset references
```

## 🤝 Contributing

While GoldLink Bank is a private banking prototype, contributions to improve the UI/UX, responsive behavior, or backend simulation are welcome. Please ensure any pull requests adhere to the premium design system guidelines and maintain full responsiveness across all breakpoints.

## 📄 License

This project is licensed under the MIT License.
