import React, { useMemo, useReducer, useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Wallet,
  Gift,
  User,
  Sparkles,
  Crown,
  LogOut,
  Ticket,
  Filter,
  ChevronRight,
  Utensils,
  QrCode,
  Store,
  CalendarDays,
  MapPin,
  ScanLine,
  Bell,
  Star,
  Download,
} from "lucide-react";

const initialState = {
  user: {
    name: "Gerry Sy",
    memberSince: "2022-07-15",
    tier: "Platinum",
    lifetimePoints: 98540,
    email: "gerry.sy@supersam.club",
    region: "Metro Manila",
    city: "Makati",
    birthday: "1991-09-18",
    gender: "Male"
  },
  points: 12450,
  transactions: [
    {
      id: "tx-1",
      date: "2026-04-10",
      description: "Dining - Supersam Bonifacio",
      points: 1250
    },
    {
      id: "tx-2",
      date: "2026-04-05",
      description: "Points Discount - Supersam Bonifacio",
      points: -1400
    },
    {
      id: "tx-3",
      date: "2026-04-02",
      description: "Dining - Supersam Rockwell",
      points: 980
    },
    {
      id: "tx-4",
      date: "2026-03-28",
      description: "Points Discount - Supersam Bonifacio",
      points: -4200
    },
    {
      id: "tx-5",
      date: "2026-03-18",
      description: "Points Discount - Supersam Makati",
      points: -900
    },
    {
      id: "tx-6",
      date: "2026-03-12",
      description: "Dining - Supersam Bonifacio",
      points: 1120
    },
    {
      id: "tx-7",
      date: "2026-03-02",
      description: "Points Discount - Supersam Rockwell",
      points: -2500
    },
    {
      id: "tx-8",
      date: "2026-02-24",
      description: "Dining - Supersam Makati",
      points: 860
    },
    {
      id: "tx-9",
      date: "2026-02-14",
      description: "Points Discount - Supersam Rockwell",
      points: -750
    },
    {
      id: "tx-10",
      date: "2026-02-01",
      description: "Dining - Supersam Makati",
      points: 920
    },
    {
      id: "tx-11",
      date: "2026-01-20",
      description: "Points Discount - Supersam Makati",
      points: -1500
    },
    {
      id: "tx-12",
      date: "2026-01-08",
      description: "Dining - Supersam Bonifacio",
      points: 780
    },
    {
      id: "tx-13",
      date: "2025-12-22",
      description: "Dining - Supersam Rockwell",
      points: 1040
    },
  ],
  wallet: []
};

const discountOptions = [
  {
    id: "dc-1",
    title: "P500 bill discount",
    points: 500,
    category: "Discount"
  },
  {
    id: "dc-2",
    title: "P1,000 bill discount",
    points: 1000,
    category: "Discount"
  },
  {
    id: "dc-3",
    title: "P2,500 bill discount",
    points: 2500,
    category: "Discount"
  },
  {
    id: "dc-4",
    title: "P5,000 bill discount",
    points: 5000,
    category: "Discount"
  }
];

const memberTiers = [
  {
    name: "Member",
    minimumPoints: 0,
    pesoPerPoint: 100,
    accent: "#f8f5ec"
  },
  {
    name: "Gold",
    minimumPoints: 10000,
    pesoPerPoint: 85,
    accent: "#f3c437"
  },
  {
    name: "Platinum",
    minimumPoints: 50000,
    pesoPerPoint: 70,
    accent: "#d9e2ef"
  },
  {
    name: "Diamond",
    minimumPoints: 100000,
    pesoPerPoint: 50,
    accent: "#7de3ff"
  }
];

const demotionPolicy = {
  graceDays: 60,
  stepDays: 30
};

function reducer(state, action) {
  switch (action.type) {
    case "SPEND_POINTS":
      return {
        ...state,
        points: state.points - action.payload.points,
        transactions: [action.payload.transaction, ...state.transactions]
      };
    case "EARN_POINTS":
      return {
        ...state,
        points: state.points + action.payload.points,
        user: {
          ...state.user,
          lifetimePoints: state.user.lifetimePoints + action.payload.points
        },
        transactions: [action.payload.transaction, ...state.transactions]
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function formatPoints(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact"
  }).format(value);
}

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function formatShortDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function parseDateKey(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function toLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(startDate, endDate) {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.max(0, Math.floor((endDate - startDate) / millisecondsPerDay));
}

function getEarnedTier(points) {
  return memberTiers.reduce((earnedTier, tier) => (
    points >= tier.minimumPoints ? tier : earnedTier
  ), memberTiers[0]);
}

function getTierStatus(state) {
  const today = new Date();
  const lastEarnedTransaction = state.transactions.find((transaction) => transaction.points > 0);
  const lastEarnedDate = lastEarnedTransaction
    ? parseDateKey(lastEarnedTransaction.date)
    : parseDateKey(state.user.memberSince);
  const inactiveDays = daysBetween(lastEarnedDate, today);
  const earnedTier = getEarnedTier(state.user.lifetimePoints);
  const earnedIndex = memberTiers.findIndex((tier) => tier.name === earnedTier.name);
  const demotionSteps = inactiveDays <= demotionPolicy.graceDays
    ? 0
    : Math.floor((inactiveDays - demotionPolicy.graceDays) / demotionPolicy.stepDays) + 1;
  const activeTierIndex = Math.max(0, earnedIndex - demotionSteps);
  const activeTier = memberTiers[activeTierIndex];
  const nextTier = memberTiers[activeTierIndex + 1] || null;
  const nextMinimum = nextTier?.minimumPoints ?? activeTier.minimumPoints;
  const pointsIntoTier = state.user.lifetimePoints - activeTier.minimumPoints;
  const tierRange = Math.max(1, nextMinimum - activeTier.minimumPoints);
  const progress = nextTier ? Math.min(1, Math.max(0, pointsIntoTier / tierRange)) : 1;
  const demotionDueIn = inactiveDays <= demotionPolicy.graceDays
    ? demotionPolicy.graceDays - inactiveDays
    : demotionPolicy.stepDays - ((inactiveDays - demotionPolicy.graceDays) % demotionPolicy.stepDays);

  return {
    activeTier,
    activeTierIndex,
    demotionDueIn,
    demotionSteps,
    earnedTier,
    inactiveDays,
    lastEarnedDate,
    nextTier,
    progress,
    pointsToNextTier: nextTier ? Math.max(0, nextTier.minimumPoints - state.user.lifetimePoints) : 0
  };
}

function App() {
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toasts, setToasts] = useState([]);
  const [earnQrOpen, setEarnQrOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(null);
  const isNewDesign = location.pathname.startsWith("/new-design");

  const addToast = (message) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2400);
  };

  return (
    <div className="app-shell text-white">
      <div
        className={`mx-auto min-h-screen w-full px-5 pt-8 ${
          isNewDesign
            ? "new-design-content max-w-md"
            : "app-content-with-nav max-w-md"
        }`}
      >
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route
            path="/login"
            element={<LoginScreen onLogin={() => addToast("Welcome back, Gerry.")} />}
          />
          <Route
            path="/home"
            element={
              <HomeScreen
                state={state}
                onEarnQr={() => setEarnQrOpen(true)}
              />
            }
          />
          <Route
            path="/transactions"
            element={<TransactionsScreen transactions={state.transactions} />}
          />
          <Route
            path="/brands"
            element={<BrandsScreen />}
          />
          <Route
            path="/redeem"
            element={
              <RedeemScreen
                points={state.points}
                onSelectDiscount={(discount) => setRedeemOpen(discount)}
              />
            }
          />
          <Route
            path="/wallet"
            element={
              <WalletScreen />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfileScreen state={state} />
            }
          />
          <Route
            path="/new-design"
            element={
              <NewDesignSite
                state={state}
              />
            }
          />
        </Routes>
      </div>

      <BottomNav />

      {earnQrOpen && (
        <EarnQrModal
          onClose={() => setEarnQrOpen(false)}
          onCopy={() => addToast("Qr code copied to clipboard.")}
        />
      )}

      {redeemOpen && (
        <RedeemModal
          reward={redeemOpen}
          onClose={() => setRedeemOpen(null)}
          onRedeem={(reward) => {
            if (state.points < reward.points) {
              addToast("Not enough points for this discount.");
              return;
            }
            dispatch({
              type: "SPEND_POINTS",
              payload: {
                points: reward.points,
                transaction: {
                  id: crypto.randomUUID(),
                  date: toLocalDateKey(),
                  description: `Points Discount - ${reward.title}`,
                  points: -reward.points
                }
              }
            });
            addToast("Discount applied to transaction.");
            setRedeemOpen(null);
          }}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
}

function SupersamV2Mark({ compact = false }) {
  return (
    <div className="flex items-center">
      {!compact && (
        <p
          className="text-2xl font-black uppercase leading-none tracking-[0.02em] text-[#f3c437]"
          style={{ WebkitTextStroke: "1.5px #11100b", textShadow: "0 2px 0 #11100b" }}
        >
          SUPERSAM
        </p>
      )}
      {compact && (
        <p
          className="text-xl font-black uppercase leading-none tracking-[0.02em] text-[#f3c437]"
          style={{ WebkitTextStroke: "1px #11100b", textShadow: "0 1px 0 #11100b" }}
        >
          SUPERSAM
        </p>
      )}
    </div>
  );
}

function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate("/login"), 1400);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center animate-fadeUp">
      <div className="space-y-4">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-gold/20 text-brand-gold shadow-glow">
          <Utensils size={34} />
        </div>
        <p className="text-xs tracking-[0.4em] text-brand-gold/70">
          Supersam
        </p>
        <h1 className="font-display text-3xl">Loyalty Atelier</h1>
        <p className="text-sm text-white/60">Points, tiers, and dining discounts.</p>
      </div>
      <button
        className="mt-12 rounded-full border border-white/20 px-5 py-2 text-xs text-white/70 transition hover:border-brand-gold/60"
        onClick={() => navigate("/login")}
      >
        Skip
      </button>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-[80vh] flex-col justify-between animate-fadeUp">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm tracking-[0.35em] text-brand-dark">
            Supersam
          </p>
          <h1 className="font-display text-3xl leading-tight">
            Elevated dining, rewarded.
          </h1>
          <p className="text-sm text-white/70">
            Sign in to access points, member tiers, and bill discounts.
          </p>
        </div>

        <div className="glass-card rounded-3xl p-6 shadow-soft">
          <div className="space-y-4">
            <label className="block text-xs tracking-[0.25em] text-white/60">
              Email
            </label>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40"
              placeholder="gerry.sy@supersam.club"
            />
            <label className="block text-xs tracking-[0.25em] text-white/60">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/40"
              placeholder="••••••••"
            />
          </div>

          <button
            className="mt-6 w-full rounded-2xl bg-brand-gold py-3 text-sm font-semibold text-brand-dark transition active:scale-95"
            onClick={() => {
              onLogin();
              navigate("/home");
            }}
          >
            Enter Supersam
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button
          className="w-full rounded-2xl border border-white/15 bg-white/5 py-3 text-sm font-semibold text-brand-dark transition active:scale-95"
          onClick={() => navigate("/new-design")}
        >
          Enter SuperApp V2
        </button>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-xs text-white/60">
          By continuing, you agree to the Supersam Loyalty membership terms.
        </div>
      </div>
    </div>
  );
}

function HomeScreen({ state, onEarnQr }) {
  const navigate = useNavigate();
  const previewTransactions = useMemo(
    () => state.transactions.slice(0, 4),
    [state.transactions]
  );

  return (
    <div className="space-y-6 animate-fadeUp">
      <div className="-mx-5 relative pb-2">
        <div
          className="absolute inset-x-0 top-0 bg-brand-gold shadow-soft"
          style={{ height: "clamp(200px, 30vh, 280px)" }}
        />
        <div className="relative px-5 pt-4">
          <header className="space-y-2">
            <p className="text-sm text-white/60">Welcome,</p>
            <h2 className="font-display text-3xl font-bold text-brand-dark">
              {state.user.name.split(" ")[0]}!
            </h2>
            <div className="flex items-center gap-2 text-sm text-brand-dark">
              <Crown size={14} />
              {state.user.tier} Member
            </div>
          </header>

          <section className="glass-card mt-8 rounded-3xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/60">My Points</p>
            </div>
            <h3 className="mt-4 text-3xl font-semibold">
              {formatPoints(state.points)} pts
            </h3>
            <button
              className="mt-6 flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white transition"
              onClick={() => navigate("/wallet")}
            >
              Discount History
              <ChevronRight size={16} />
            </button>
          </section>
        </div>
      </div>


      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-white/60">Quick actions</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <QuickAction
            icon={<QrCode size={18} />}
            label="Qr"
            onClick={onEarnQr}
          />
          <QuickAction
            icon={<Gift size={18} />}
            label="Discount"
            onClick={() => navigate("/redeem")}
          />
          <QuickAction
            icon={<Wallet size={18} />}
            label="Ledger"
            onClick={() => navigate("/wallet")}
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm text-white/60">Recent activity</h3>
          <button
            className="text-sm text-brand-gold"
            onClick={() => navigate("/transactions")}
          >
            View all
          </button>
        </div>
        <div className="space-y-3">
          {previewTransactions.map((tx) => (
            <TransactionCard key={tx.id} transaction={tx} />
          ))}
        </div>
      </section>
    </div>
  );
}

function TransactionsScreen({ transactions }) {
  const sections = useMemo(() => groupTransactions(transactions), [transactions]);
  return (
    <div className="space-y-6 animate-fadeUp">
      <header className="space-y-1">
        <h2 className="font-display text-2xl">Transactions</h2>
        <p className="text-sm text-white/60">
          A complete view of your loyalty history.
        </p>
      </header>
      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.label} className="space-y-3">
            <p className="text-xs tracking-[0.35em] text-white/60">
              {section.label}
            </p>
            <div className="space-y-3">
              {section.items.map((tx) => (
                <TransactionCard key={tx.id} transaction={tx} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandsScreen() {
  const brands = [
    {
      id: "br-1",
      name: "Supersam Bonifacio",
      type: "Flagship",
      branch: "Bonifacio High Street",
      gallery: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80"
      ],
      activePromotion: {
        title: "Weekday Lunch Plates",
        date: "2026-05-01",
        detail: "Featured mains with complimentary iced tea from Monday to Thursday."
      },
      incomingPromotion: {
        title: "Father's Day Grill Board",
        date: "2026-06-14",
        detail: "A limited sharing board and reserved dessert pairing."
      }
    },
    {
      id: "br-2",
      name: "Supersam Rockwell",
      type: "Fine Dining",
      branch: "Power Plant Mall",
      gallery: [
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=400&q=80"
      ],
      activePromotion: {
        title: "Dessert Cart Encore",
        date: "2026-05-10",
        detail: "Members can apply points as a bill discount after dinner service."
      },
      incomingPromotion: {
        title: "Chef's Seasonal Pasta",
        date: "2026-06-01",
        detail: "Three new pasta plates with launch-week loyalty pricing."
      }
    },
    {
      id: "br-3",
      name: "Supersam Makati",
      type: "Signature Lounge",
      branch: "Legazpi Village",
      gallery: [
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80"
      ],
      activePromotion: {
        title: "After-Office Spritz Hour",
        date: "2026-05-15",
        detail: "Selected mocktails and bar bites available from 5 PM to 7 PM."
      },
      incomingPromotion: {
        title: "Jazz Supper Fridays",
        date: "2026-06-05",
        detail: "Dinner specials paired with live lounge sets every Friday."
      }
    },
    {
      id: "br-4",
      name: "Supersam Seaside",
      type: "Resort Dining",
      branch: "Mall of Asia Complex",
      gallery: [
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80"
      ],
      activePromotion: {
        title: "Seaside Brunch Set",
        date: "2026-05-18",
        detail: "Weekend brunch trays featuring prawns, roast chicken, and fresh fruit."
      },
      incomingPromotion: {
        title: "Sunset Seafood Festival",
        date: "2026-06-20",
        detail: "A two-week seafood menu built for groups and late sunsets."
      }
    }
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <header className="space-y-1">
        <h2 className="font-display text-2xl">Brands & Branches</h2>
        <p className="text-sm text-white/60">
          Explore each branch and its current dining promotions.
        </p>
      </header>

      <div className="space-y-5">
        {brands.map((brand) => (
          <article key={brand.id} className="glass-card overflow-hidden rounded-3xl shadow-soft">
            <div className="grid grid-cols-[1.5fr_0.8fr] gap-1">
              <img
                src={brand.gallery[0]}
                alt={`${brand.name} dining room`}
                className="h-36 w-full object-cover"
              />
              <div className="grid gap-1">
                {brand.gallery.slice(1).map((image, index) => (
                  <img
                    key={image}
                    src={image}
                    alt={`${brand.name} gallery ${index + 2}`}
                    className="h-[70px] w-full object-cover"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">{brand.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-white/60">
                    <MapPin size={12} /> {brand.branch}
                  </p>
                </div>
                <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-[10px] tracking-[0.18em] text-brand-gold">
                  {brand.type}
                </span>
              </div>

              <div className="grid gap-3">
                <PromotionPanel
                  label="Active"
                  icon={<Sparkles size={14} />}
                  promotion={brand.activePromotion}
                />
                <PromotionPanel
                  label="Incoming"
                  icon={<CalendarDays size={14} />}
                  promotion={brand.incomingPromotion}
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PromotionPanel({ label, icon, promotion }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-brand-gold">
          {icon}
          {label}
        </span>
        <span className="text-[11px] text-white/60">{formatDate(promotion.date)}</span>
      </div>
      <h4 className="mt-2 text-sm font-semibold">{promotion.title}</h4>
      <p className="mt-1 text-xs leading-5 text-white/60">{promotion.detail}</p>
    </div>
  );
}

function RedeemScreen({ points, onSelectDiscount }) {
  return (
    <div className="space-y-6 animate-fadeUp">
      <header className="space-y-1">
        <h2 className="font-display text-2xl">Transaction Discounts</h2>
        <p className="text-sm text-white/60">
          Use points as bill discounts at checkout. Product redemption is not available yet.
        </p>
      </header>

      <div className="glass-card rounded-3xl p-4 shadow-soft">
        <p className="text-xs tracking-[0.25em] text-brand-gold/70">AVAILABLE POINTS</p>
        <p className="mt-2 text-3xl font-black">{formatPoints(points)}</p>
        <p className="mt-1 text-sm text-white/60">
          Present your member QR before payment and choose how many points to apply.
        </p>
      </div>

      <div className="grid gap-4">
        {discountOptions.map((discount) => (
          <button
            key={discount.id}
            className="glass-card rounded-3xl p-5 text-left shadow-soft transition hover:-translate-y-1"
            onClick={() => onSelectDiscount(discount)}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold">{discount.title}</h3>
                <p className="mt-1 text-xs text-white/60">
                  Apply {formatPoints(discount.points)} points as a transaction discount.
                </p>
              </div>
              <span className="rounded-full bg-brand-gold px-3 py-1 text-[11px] tracking-[0.16em] text-brand-dark">
                {formatPoints(discount.points)}
              </span>
            </div>
            {points < discount.points && (
              <p className="mt-3 text-[11px] text-rose-200">
                You need {formatPoints(discount.points - points)} more points.
              </p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function RedeemModal({ reward, onClose, onRedeem }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-white/50 px-6 pb-8">
      <div className="glass-card w-full max-w-sm rounded-3xl p-6 shadow-soft animate-fadeUp">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-brand-gold/70">
              Transaction Discount
            </p>
            <h3 className="mt-2 font-display text-xl">{reward.title}</h3>
          </div>
          <button
            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm text-white/70">
          <span>{formatPoints(reward.points)} pts</span>
          <span className="text-brand-gold">Bill discount</span>
        </div>
        <button
          className="mt-6 w-full rounded-2xl bg-brand-gold py-2 text-sm font-semibold text-brand-dark transition active:scale-95"
          onClick={() => onRedeem(reward)}
        >
          Apply Discount
        </button>
      </div>
    </div>
  );
}

function WalletScreen() {
  return (
    <div className="space-y-6 animate-fadeUp">
      <header className="space-y-1">
        <h2 className="font-display text-2xl">Discount History</h2>
        <p className="text-sm text-white/60">
          Stored discount passes are disabled for now. Point use appears as transaction discounts.
        </p>
      </header>
      <div className="glass-card rounded-3xl p-5 shadow-soft">
        <p className="text-sm font-semibold">No stored discount passes.</p>
        <p className="mt-2 text-xs leading-5 text-white/60">
          Ask the cashier to apply points to the bill before payment. The discount will be recorded in your ledger.
        </p>
      </div>
    </div>
  );
}

function NewDesignSite({ state }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [isLightMode, setIsLightMode] = useState(false);
  const [message, setMessage] = useState("");

  const tabs = [
    { label: "Home", icon: Home },
    { label: "Transactions", icon: Ticket },
    { label: "QR", icon: QrCode },
    { label: "Ledger", icon: Wallet },
    { label: "My Account", icon: User }
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    setIsAuthenticated(true);
  };

  if (isAuthenticated) {
    return (
      <main className={`new-design -mx-5 min-h-screen bg-[#11100b] pb-28 text-[#f8f5ec] ${isLightMode ? "v2-light" : ""}`}>
        <header className="sticky top-0 z-30 border-b border-[#f3c437]/20 bg-[#11100b]/95 px-5 pb-4 pt-5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <SupersamV2Mark compact />
            <button
              className="rounded-full border border-[#f3c437]/35 bg-[#f3c437] px-4 py-2 text-xs font-black text-[#11100b] shadow-sm"
              onClick={() => setIsAuthenticated(false)}
            >
              Logout
            </button>
          </div>
        </header>

        <section className="px-5 pt-5">
          {activeTab === "Home" && (
            <V2HomeTab
              state={state}
              onOpenLedger={() => setActiveTab("Ledger")}
              onOpenQr={() => setActiveTab("QR")}
            />
          )}
          {activeTab === "Transactions" && <V2TransactionsTab transactions={state.transactions} />}
          {activeTab === "QR" && <V2QrTab user={state.user} />}
          {activeTab === "Ledger" && <V2LedgerTab state={state} />}
          {activeTab === "My Account" && (
            <V2AccountTab
              state={state}
              isLightMode={isLightMode}
              onLightModeChange={setIsLightMode}
            />
          )}
        </section>

        <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-[#f3c437]/20 bg-[#18150d] px-3 pb-5 pt-3 shadow-[0_-12px_28px_rgba(0,0,0,0.35)]">
          <div className="grid grid-cols-5 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  className={`flex min-h-[4rem] flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-black ${
                    isActive ? "bg-[#f3c437] text-[#11100b]" : "text-[#f8f5ec]/55"
                  }`}
                  onClick={() => setActiveTab(tab.label)}
                >
                  <Icon size={19} strokeWidth={isActive ? 2.6 : 2.1} />
                  <span className="leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </main>
    );
  }

  return (
    <main className="new-design -mx-5 min-h-screen bg-[#11100b] px-5 py-6 text-[#f8f5ec]">
      <header className="flex items-center justify-between">
        <SupersamV2Mark />
        <button
          className="rounded-full border border-[#f3c437]/35 px-4 py-2 text-xs font-black text-[#f3c437]"
          onClick={() => navigate("/login")}
        >
          Classic
        </button>
      </header>

      <section className="mt-10">
        <div className="overflow-hidden rounded-[1.75rem] border border-[#f3c437]/25 bg-[#1a1710] shadow-soft">
          <div className="border-b border-[#f3c437]/20 bg-[#f3c437] p-5 text-[#11100b]">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-black/55">
              Supersam member pass
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">Enter the V2 mock app.</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-black/65">
              Auth is mocked for preview. Tap login to go straight into the app.
            </p>
          </div>

          {message && (
            <div className="mx-5 mt-5 rounded-2xl border border-[#f3c437]/35 bg-[#242015] px-4 py-3 text-sm font-semibold text-[#f3c437]">
              {message}
            </div>
          )}

          <form className="space-y-4 p-5" onSubmit={handleSubmit} noValidate>
            <div className="rounded-[1.25rem] border border-[#f3c437]/20 bg-[#11100b] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3c437]">
                    Mock profile
                  </p>
                  <p className="mt-2 text-lg font-black text-white">{state.user.name}</p>
                  <p className="mt-1 text-sm font-semibold text-[#f8f5ec]/55">{state.user.email}</p>
                </div>
                <div className="grid h-14 w-14 place-items-center rounded-full bg-[#f3c437] text-[#11100b]">
                  <Crown size={24} strokeWidth={2.25} />
                </div>
              </div>
            </div>
            <button
              className="w-full rounded-2xl bg-[#f3c437] py-4 text-sm font-black text-[#11100b] transition active:scale-95"
              type="submit"
            >
              Login
            </button>
          </form>

          <div className="flex border-t border-[#f3c437]/20 text-center text-sm font-black">
            <button
              className="flex-1 px-3 py-4 text-[#f8f5ec]/65"
              onClick={() => setMessage("Sign up is mocked in this V2 preview.")}
            >
              Sign up
            </button>
            <button
              className="flex-1 border-l border-[#f3c437]/20 px-3 py-4 text-[#f8f5ec]/65"
              onClick={() => setMessage("Password reset is mocked in this V2 preview.")}
            >
              Forgot password
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function V2HomeTab({ state, onOpenLedger, onOpenQr }) {
  const tierStatus = useMemo(() => getTierStatus(state), [state]);
  const latestEarned = state.transactions.find((transaction) => transaction.points > 0);
  const banners = [
    {
      title: "Double points lunch",
      detail: "Earn 2x points at Supersam Bonifacio from 11 AM to 2 PM.",
      image:
        "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80"
    },
    {
      title: "Chef's weekend table",
      detail: "Use points as bill discounts at participating branches.",
      image:
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80"
    }
  ];

  return (
    <div className="space-y-4 animate-fadeUp">
      <section className="overflow-hidden rounded-[1.5rem] border border-[#f3c437]/20 bg-[#f3c437] text-[#11100b] shadow-soft">
        <div className="p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-black/55">
            Available points
          </p>
          <div className="mt-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-5xl font-black leading-none">{formatPoints(state.points)}</p>
              <p className="mt-2 text-sm font-bold text-black/60">
                {tierStatus.activeTier.name} member - P{tierStatus.activeTier.pesoPerPoint} = 1 pt
              </p>
            </div>
            <Wallet size={30} strokeWidth={2.3} />
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#11100b] px-3 py-3 text-sm font-black text-[#f3c437] transition active:scale-95"
              onClick={onOpenQr}
            >
              <QrCode size={17} strokeWidth={2.4} />
              Show QR
            </button>
            <button
              className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-black/20 bg-white/45 px-3 py-3 text-sm font-black text-[#11100b] transition active:scale-95"
              onClick={onOpenLedger}
            >
              <Ticket size={17} strokeWidth={2.4} />
              Ledger
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-black/15 bg-[#11100b] text-[#f8f5ec]">
          <V2HomeMetric label="Lifetime" value={formatPoints(state.user.lifetimePoints)} />
          <V2HomeMetric
            label="Last Earned"
            value={latestEarned ? `+${formatPoints(latestEarned.points)}` : "None"}
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[1.25rem] border border-[#f3c437]/15 bg-[#1a1710] p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#f3c437]">Next Tier</p>
          <p className="mt-2 text-lg font-black text-white">
            {tierStatus.nextTier ? tierStatus.nextTier.name : "Unlocked"}
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[#f8f5ec]/45">
            {tierStatus.nextTier
              ? `${formatPoints(tierStatus.pointsToNextTier)} pts left`
              : "Highest member tier"}
          </p>
        </div>
        <div className="rounded-[1.25rem] border border-[#f3c437]/15 bg-[#1a1710] p-4 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.15em] text-[#f3c437]">Spend To Go</p>
          <p className="mt-2 text-lg font-black text-white">
            {tierStatus.nextTier
              ? `P${formatCompactNumber(tierStatus.pointsToNextTier * tierStatus.activeTier.pesoPerPoint)}`
              : "Top tier"}
          </p>
          <p className="mt-1 text-xs font-semibold leading-5 text-[#f8f5ec]/45">
            At P{tierStatus.activeTier.pesoPerPoint} = 1 pt
          </p>
        </div>
      </section>

      <TierStatusGauge status={tierStatus} />

      <section className="rounded-[1.5rem] border border-[#f3c437]/20 bg-[#1a1710] p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <V2SectionTitle title="Tier path" />
          <span className="rounded-full border border-[#f3c437]/25 px-3 py-1 text-xs font-black text-[#f3c437]">
            {tierStatus.activeTier.name}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {memberTiers.map((tier, index) => {
            const isActive = tier.name === tierStatus.activeTier.name;
            const isUnlocked = index <= tierStatus.activeTierIndex;
            return (
              <div
                key={tier.name}
                className={`rounded-2xl border px-2 py-3 text-center ${
                  isActive
                    ? "border-[#f3c437] bg-[#f3c437] text-[#11100b]"
                    : "border-[#f3c437]/15 bg-[#11100b] text-[#f8f5ec]"
                }`}
              >
                <span
                  className="mx-auto block h-2 w-2 rounded-full"
                  style={{ backgroundColor: isUnlocked ? tier.accent : "#5b5039" }}
                />
                <p className="mt-2 text-[11px] font-black">{tier.name}</p>
                <p className={`mt-1 text-[10px] font-bold ${isActive ? "text-black/55" : "text-[#f8f5ec]/40"}`}>
                  {formatPoints(tier.minimumPoints)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-5 divide-y divide-[#f3c437]/15">
          {memberTiers.map((tier) => {
            const isActive = tier.name === tierStatus.activeTier.name;
            return (
              <div key={tier.name} className="grid grid-cols-[1fr_auto] items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-black text-white">{tier.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#f8f5ec]/45">
                    {formatPoints(tier.minimumPoints)} lifetime points
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-[#f3c437]">P{tier.pesoPerPoint}:1</p>
                  <p className="mt-0.5 text-[11px] font-bold text-[#f8f5ec]/40">
                    {isActive ? "Current rate" : "earn rate"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <V2SectionTitle title="Promotions" />
          <ChevronRight className="text-[#f3c437]" size={19} strokeWidth={2.4} />
        </div>
        <div className="space-y-3">
          {banners.map((banner) => (
            <article key={banner.title} className="grid grid-cols-[6.5rem_1fr] overflow-hidden rounded-[1.25rem] border border-[#f3c437]/20 bg-[#1a1710] shadow-sm">
              <img src={banner.image} alt={banner.title} className="h-full min-h-[7rem] w-full object-cover" />
              <div className="p-4">
                <h2 className="text-sm font-black text-white">{banner.title}</h2>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#f8f5ec]/55">{banner.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function V2HomeMetric({ label, value }) {
  return (
    <div className="border-r border-[#f3c437]/15 px-3 py-4 last:border-r-0">
      <p className="text-[10px] font-black uppercase tracking-[0.13em] text-[#f3c437]">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-white">{value}</p>
    </div>
  );
}

function TierStatusGauge({ status }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const strokeOffset = 100 - status.progress * 100;
  const activeRate = `P${status.activeTier.pesoPerPoint} spend = 1 point`;
  const reviewMessage = status.demotionSteps > 0
    ? `Demoted ${status.demotionSteps} tier${status.demotionSteps === 1 ? "" : "s"} after ${status.inactiveDays} inactive days.`
    : `${status.demotionDueIn} day${status.demotionDueIn === 1 ? "" : "s"} until demotion review.`;
  const nextGoal = status.nextTier
    ? `${formatPoints(status.pointsToNextTier)} pts to ${status.nextTier.name}`
    : "Top tier unlocked";

  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-[#f3c437]/20 bg-[#1a1710] shadow-sm">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f3c437]">
              Membership tier
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">{status.activeTier.name}</h2>
            <p className="mt-1 text-sm font-semibold text-[#f8f5ec]/50">{activeRate}</p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f3c437] text-[#11100b]">
            <Crown size={22} strokeWidth={2.4} />
          </div>
        </div>

        <div className="relative mx-auto mt-5 h-36 max-w-[17rem]">
          <svg viewBox="0 0 256 144" className="h-full w-full">
            <path
              d="M24 124A104 104 0 0 1 232 124"
              fill="none"
              pathLength="100"
              stroke="rgba(248,245,236,0.12)"
              strokeLinecap="round"
              strokeWidth="18"
            />
            <path
              d="M24 124A104 104 0 0 1 232 124"
              fill="none"
              pathLength="100"
              stroke={status.activeTier.accent}
              strokeDasharray="100"
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              strokeWidth="18"
            />
            {memberTiers.map((tier, index) => {
              const angle = Math.PI - (Math.PI * index) / (memberTiers.length - 1);
              const x = 128 + Math.cos(angle) * 104;
              const y = 124 - Math.sin(angle) * 104;
              const isUnlocked = index <= status.activeTierIndex;
              return (
                <circle
                  key={tier.name}
                  cx={x}
                  cy={y}
                  fill={isUnlocked ? tier.accent : "#302a1a"}
                  r={isUnlocked ? 6 : 4.5}
                  stroke="#11100b"
                  strokeWidth="3"
                />
              );
            })}
          </svg>

          <div className="absolute inset-x-0 bottom-0 text-center">
            <p className="text-4xl font-black leading-none text-white">
              {Math.round(status.progress * 100)}%
            </p>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#f3c437]">
              {nextGoal}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#f3c437]/15 bg-[#11100b]">
        <button
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
          type="button"
          aria-expanded={detailsOpen}
          onClick={() => setDetailsOpen((isOpen) => !isOpen)}
        >
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#f3c437]">
            Activity & demotion
          </span>
          <ChevronRight
            className={`shrink-0 text-[#f3c437] transition ${detailsOpen ? "rotate-90" : ""}`}
            size={17}
            strokeWidth={2.4}
          />
        </button>

        {detailsOpen && (
          <div className="grid grid-cols-2 border-t border-[#f3c437]/15">
            <div className="p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#f3c437]">
                <CalendarDays size={13} />
                Activity
              </p>
              <p className="mt-2 text-sm font-black text-white">
                {formatShortDate(toLocalDateKey(status.lastEarnedDate))}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#f8f5ec]/45">
                Last points earned
              </p>
            </div>
            <div className="border-l border-[#f3c437]/15 p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.14em] text-[#f3c437]">
                <Star size={13} />
                Demotion
              </p>
              <p className="mt-2 text-sm font-black text-white">{reviewMessage}</p>
              <p className="mt-1 text-xs font-semibold text-[#f8f5ec]/45">
                Earn any points to reset timer
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function V2TransactionsTab({ transactions }) {
  return (
    <div className="space-y-3 animate-fadeUp">
      {transactions.slice(0, 10).map((transaction) => (
        <V2ListRow
          key={transaction.id}
          title={transaction.description}
          meta={formatDate(transaction.date)}
          value={`${transaction.points > 0 ? "+" : "-"}${formatPoints(Math.abs(transaction.points))}`}
          tone={transaction.points > 0 ? "positive" : "muted"}
        />
      ))}
    </div>
  );
}

function V2QrTab({ user }) {
  const memberCode = `SS-V2-${user.name.replace(/\s/g, "").toUpperCase()}-2045`;
  const downloadQr = () => {
    const svg = createQrDownloadSvg(memberCode, user);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${memberCode.toLowerCase()}-qr.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 animate-fadeUp">
      <section className="rounded-[1.75rem] border border-[#f3c437]/20 bg-[#1a1710] p-5 text-center shadow-soft">
        <div className="mx-auto w-fit">
          <QrPlaceholder value={memberCode} size={184} />
        </div>
        <h2 className="mt-5 text-xl font-black text-white">{user.name}</h2>
        <p className="mt-1 text-sm font-semibold text-[#f8f5ec]/55">{user.tier} member</p>
        <div className="mt-4 rounded-2xl border border-[#f3c437]/20 bg-[#11100b] px-4 py-3 text-sm font-black text-[#f3c437]">
          {memberCode}
        </div>
        <button
          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#f3c437] px-4 py-3 text-sm font-black text-[#11100b] transition active:scale-95"
          type="button"
          onClick={downloadQr}
        >
          <Download size={17} strokeWidth={2.4} />
          Download QR
        </button>
      </section>
    </div>
  );
}

function createQrDownloadSvg(memberCode, user) {
  const size = 184;
  const padding = 32;
  const width = size + padding * 2;
  const height = size + padding * 2 + 96;
  const cells = 21;
  const cell = size / cells;
  let seed = 0;
  for (let i = 0; i < memberCode.length; i += 1) {
    seed = (seed * 31 + memberCode.charCodeAt(i)) % 2147483647;
  }

  const isFinder = (x, y) => (
    (x < 7 && y < 7) ||
    (x > cells - 8 && y < 7) ||
    (x < 7 && y > cells - 8)
  );
  const finderSvg = (x, y) => {
    const finderSize = cell * 7;
    return `
      <rect x="${x}" y="${y}" width="${finderSize}" height="${finderSize}" fill="#010812"/>
      <rect x="${x + cell}" y="${y + cell}" width="${finderSize - cell * 2}" height="${finderSize - cell * 2}" fill="#ffffff"/>
      <rect x="${x + cell * 2}" y="${y + cell * 2}" width="${finderSize - cell * 4}" height="${finderSize - cell * 4}" fill="#010812"/>
    `;
  };

  const modules = [];
  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      if (isFinder(x, y)) continue;
      seed = (seed * 1103515245 + 12345) % 2147483647;
      if (seed % 2 === 0) {
        modules.push(`<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="#010812"/>`);
      }
    }
  }

  const escapeSvgText = (value) => String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" rx="28" fill="#11100b"/>
      <text x="${padding}" y="34" fill="#f3c437" font-family="Arial, sans-serif" font-size="18" font-weight="800">SUPERSAM</text>
      <g transform="translate(${padding} 56)">
        <rect width="${size}" height="${size}" fill="#ffffff"/>
        ${finderSvg(0, 0)}
        ${finderSvg((cells - 7) * cell, 0)}
        ${finderSvg(0, (cells - 7) * cell)}
        ${modules.join("")}
      </g>
      <text x="${width / 2}" y="${height - 54}" fill="#ffffff" font-family="Arial, sans-serif" font-size="18" font-weight="800" text-anchor="middle">${escapeSvgText(user.name)}</text>
      <text x="${width / 2}" y="${height - 28}" fill="#f3c437" font-family="Arial, sans-serif" font-size="13" font-weight="700" text-anchor="middle">${escapeSvgText(memberCode)}</text>
    </svg>
  `;
}

function V2LedgerTab({ state }) {
  const runningRows = state.transactions.map((transaction, index) => {
    const laterActivity = state.transactions
      .slice(0, index)
      .reduce((total, item) => total + item.points, 0);
    return {
      ...transaction,
      balance: state.points - laterActivity
    };
  });

  return (
    <div className="space-y-5 animate-fadeUp">
      <section className="rounded-[1.5rem] border border-[#f3c437]/20 bg-[#1a1710] p-5 shadow-sm">
        <V2SectionTitle title="Account points ledger" />
        <div className="mt-4 grid grid-cols-2 gap-3">
          <V2Stat label="Available" value={formatPoints(state.points)} />
          <V2Stat label="Lifetime" value={formatPoints(state.user.lifetimePoints)} />
        </div>
      </section>

      <section className="space-y-3">
        {runningRows.map((row) => (
          <V2ListRow
            key={row.id}
            title={row.description}
            meta={`${formatDate(row.date)} - Balance ${formatPoints(row.balance)}`}
            value={`${row.points > 0 ? "+" : "-"}${formatPoints(Math.abs(row.points))}`}
            tone={row.points > 0 ? "positive" : "muted"}
          />
        ))}
      </section>
    </div>
  );
}

function V2AccountTab({ state, isLightMode, onLightModeChange }) {
  const settings = ["Push notifications", "Email receipts", "Location-based offers"];

  return (
    <div className="space-y-5 animate-fadeUp">
      <section className="rounded-[1.75rem] border border-[#f3c437]/20 bg-[#1a1710] p-5 text-center shadow-sm">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#f3c437] text-[#11100b]">
          <User size={30} strokeWidth={2.2} />
        </div>
        <h2 className="mt-4 text-xl font-black text-white">{state.user.name}</h2>
        <p className="mt-1 text-sm font-semibold text-[#f8f5ec]/55">{state.user.email}</p>
      </section>

      <section className="rounded-[1.5rem] border border-[#f3c437]/20 bg-[#1a1710] p-5 shadow-sm">
        <V2SectionTitle title="Profile information" />
        <div className="mt-3 divide-y divide-[#f3c437]/15">
          <V2ProfileLine label="Tier" value={state.user.tier} />
          <V2ProfileLine label="Member since" value={formatDate(state.user.memberSince)} />
          <V2ProfileLine label="Region" value={state.user.region} />
          <V2ProfileLine label="City" value={state.user.city} />
          <V2ProfileLine label="Birthdate" value={formatDate(state.user.birthday)} />
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-[#f3c437]/20 bg-[#1a1710] p-5 shadow-sm">
        <V2SectionTitle title="Settings" />
        <div className="mt-3 space-y-3">
          <label className="flex items-center justify-between gap-3 text-sm font-black text-[#f8f5ec]">
            <span>Light mode</span>
            <input
              checked={isLightMode}
              className="h-5 w-5 accent-[#f3c437]"
              type="checkbox"
              onChange={(event) => onLightModeChange(event.target.checked)}
            />
          </label>
          {settings.map((setting) => (
            <label key={setting} className="flex items-center justify-between gap-3 text-sm font-black text-[#f8f5ec]">
              <span>{setting}</span>
              <input className="h-5 w-5 accent-[#f3c437]" type="checkbox" defaultChecked />
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

function V2SectionTitle({ title }) {
  return <h2 className="text-lg font-black text-white">{title}</h2>;
}

function V2Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-[#f3c437]/20 bg-[#11100b] p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f3c437]">{label}</p>
      <p className="mt-2 text-xl font-black text-white">{value}</p>
    </div>
  );
}

function V2ListRow({ title, meta, value, tone }) {
  return (
    <article className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-[#f3c437]/15 bg-[#1a1710] px-4 py-4 shadow-sm">
      <div>
        <p className="text-sm font-black text-white">{title}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-[#f8f5ec]/45">{meta}</p>
      </div>
      <span className={`text-sm font-black ${tone === "positive" ? "text-[#60d394]" : "text-[#f8f5ec]/50"}`}>
        {value}
      </span>
    </article>
  );
}

function V2ProfileLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 text-sm">
      <span className="font-bold text-[#f8f5ec]/50">{label}</span>
      <span className="font-black text-white">{value}</span>
    </div>
  );
}

function SupersamRewardsMark() {
  return (
    <div className="relative grid h-12 w-12 place-items-center rounded-full bg-[#221b05] text-[#f3c437] shadow-soft">
      <div className="absolute inset-1 rounded-full border border-[#f3c437]/55" />
      <div className="flex flex-col items-center leading-none">
        <Utensils size={15} strokeWidth={2.4} />
        <span className="mt-0.5 text-[10px] font-black tracking-[0.08em]">SS</span>
      </div>
    </div>
  );
}

function RewardsAction({ icon, label, onClick }) {
  return (
    <button
      className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-[1.15rem] border border-[#ead47a] bg-white px-2 py-3 text-xs font-black shadow-sm"
      onClick={onClick}
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#fff0a7] text-[#8a6500]">
        {icon}
      </span>
      {label}
    </button>
  );
}

function RewardsSectionHeader({ title, action, onClick }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-black">{title}</h2>
      <button className="text-sm font-black text-[#8a6500]" onClick={onClick}>
        {action}
      </button>
    </div>
  );
}

function RewardsTransaction({ transaction }) {
  const isPositive = transaction.points > 0;
  return (
    <article className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-[#ead47a] bg-white px-4 py-4 shadow-sm">
      <div>
        <p className="text-sm font-bold">{transaction.description}</p>
        <p className="mt-1 text-xs font-semibold text-[#7b6b32]">{formatDate(transaction.date)}</p>
      </div>
      <span className={`text-sm font-black ${isPositive ? "text-[#8a6500]" : "text-[#9b6b1f]"}`}>
        {isPositive ? "+" : "-"}
        {formatPoints(Math.abs(transaction.points))}
      </span>
    </article>
  );
}

function RewardsPromo({ icon, label, value }) {
  return (
    <div className="rounded-[1rem] border border-[#d8d0bf] p-3">
      <p className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.16em] text-[#667064]">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

function RewardsProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-[#f0df91] pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs font-bold text-[#7b6b32]">{label}</span>
      <span className="text-sm font-black">{value}</span>
    </div>
  );
}

function LegacyNewDesignSite({ state }) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("Home");
  const previewTransactions = state.transactions.slice(0, 4);
  const brandCards = [
    {
      name: "Supersam Bonifacio",
      branch: "Bonifacio High Street",
      active: "Weekday Lunch Plates",
      incoming: "Father's Day Grill Board",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Supersam Rockwell",
      branch: "Power Plant Mall",
      active: "Dessert Cart Encore",
      incoming: "Chef's Seasonal Pasta",
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=80"
    },
    {
      name: "Supersam Makati",
      branch: "Legazpi Village",
      active: "After-Office Spritz Hour",
      incoming: "Jazz Supper Fridays",
      image:
        "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=900&q=80"
    }
  ];
  const tabs = [
    { label: "Home", icon: Home },
    { label: "Transactions", icon: Ticket },
    { label: "Brands", icon: Store },
    { label: "Discount", icon: Gift },
    { label: "Profile", icon: User }
  ];
  const showHome = activeView === "Home";
  const showTransactions = activeView === "Transactions";
  const showBrands = activeView === "Brands";
  const showRedeem = activeView === "Discount";
  const showProfile = activeView === "Profile";

  return (
    <main className="new-design -mx-5 min-h-screen bg-white pb-28 text-brand-dark">
      <header className="sticky top-0 z-30 border-b border-black/10 bg-white px-5 pb-4 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-black/55">
              Supersam V2
            </p>
            <h1 className="mt-1 text-2xl font-black">
              {showHome && "Hi, Gerry"}
              {showTransactions && "Transactions"}
              {showBrands && "Brands"}
              {showRedeem && "Discount"}
              {showProfile && "Profile"}
            </h1>
          </div>
          <button
            className="rounded-full border border-black/10 bg-brand-gold px-4 py-2 text-xs font-black"
            onClick={() => navigate("/login")}
          >
            Classic
          </button>
        </div>
      </header>

      <section className="space-y-5 px-5 pt-5">
        {showHome && (
          <>
            <V2PointsCard state={state} />
            <div className="grid grid-cols-3 gap-3">
              <V2ActionButton
                icon={<QrCode size={20} strokeWidth={2.25} />}
                label="QR"
                onClick={() => setActiveView("Profile")}
              />
              <V2ActionButton
                icon={<Gift size={20} strokeWidth={2.25} />}
                label="Discount"
                onClick={() => setActiveView("Discount")}
              />
              <V2ActionButton
                icon={<Wallet size={20} strokeWidth={2.25} />}
                label="Ledger"
                onClick={() => setActiveView("Profile")}
              />
            </div>
            <V2SectionHeader title="Recent activity" action="View all" onClick={() => setActiveView("Transactions")} />
            <div className="space-y-3">
              {previewTransactions.map((transaction) => (
                <V2TransactionCard key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </>
        )}

        {showTransactions && (
          <div className="space-y-3">
            {state.transactions.map((transaction) => (
              <V2TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}

        {showBrands && (
          <div className="space-y-4">
            {brandCards.map((brand) => (
              <article key={brand.name} className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white">
                <img src={brand.image} alt={brand.name} className="h-36 w-full object-cover" />
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-black">{brand.name}</h2>
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-black/55">
                        <MapPin size={12} strokeWidth={2.4} /> {brand.branch}
                      </p>
                    </div>
                    <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-black">
                      Active
                    </span>
                  </div>
                  <div className="grid gap-2">
                    <V2Promo label="Now" value={brand.active} />
                    <V2Promo label="Next" value={brand.incoming} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {showRedeem && (
          <>
            <div className="rounded-[1.5rem] border border-black/10 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-black/50">
                Transaction discounts
              </p>
              <p className="mt-2 text-sm font-semibold text-black/60">
                Apply points directly to the bill. Product redemption is not active.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {discountOptions.map((discount) => (
                <button
                  key={discount.id}
                  className="rounded-[1.35rem] border border-black/10 bg-white p-4 text-left"
                  onClick={() => setActiveView("Profile")}
                >
                  <p className="min-h-10 text-sm font-black leading-5">{discount.title}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-black/50">Bill discount</span>
                    <span className="rounded-full bg-black px-2 py-1 text-[11px] font-black text-[#fbe106]">
                      {formatPoints(discount.points)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {showProfile && (
          <div className="space-y-4">
            <section className="rounded-[1.75rem] bg-brand-gold p-5">
              <div className="flex flex-col items-center text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white">
                  <User size={28} strokeWidth={2.2} />
                </div>
                <h2 className="mt-4 text-xl font-black">{state.user.name}</h2>
                <p className="mt-1 text-sm font-semibold text-black/60">{state.user.email}</p>
              </div>
            </section>
            <section className="rounded-[1.5rem] border border-black/10 bg-white p-5">
              <div className="space-y-3 text-sm">
                <V2ProfileRow label="Tier" value={state.user.tier} />
                <V2ProfileRow label="Member since" value={formatDate(state.user.memberSince)} />
                <V2ProfileRow label="Lifetime points" value={formatPoints(state.user.lifetimePoints)} />
                <V2ProfileRow label="Region" value={state.user.region} />
                <V2ProfileRow label="Birthday" value={formatDate(state.user.birthday)} />
              </div>
            </section>
            <section className="rounded-[1.5rem] border border-black/10 bg-white p-5">
              <V2SectionHeader title="Discounts" action="Open" onClick={() => setActiveView("Discount")} />
              <p className="mt-2 text-sm font-semibold text-black/50">
                Discount redemptions are recorded as points-discount transactions.
              </p>
            </section>
            <button
              className="w-full rounded-full bg-black py-3 text-sm font-black text-[#fbe106]"
              onClick={() => navigate("/login")}
            >
              Logout
            </button>
          </div>
        )}
      </section>

      <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-black/10 bg-white px-4 pb-5 pt-3">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.label;
            return (
              <button
                key={tab.label}
                className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-bold ${
                  isActive ? "bg-brand-gold text-brand-dark" : "text-black/45"
                }`}
                onClick={() => setActiveView(tab.label)}
              >
                <Icon size={19} strokeWidth={isActive ? 2.6 : 2.1} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </nav>
    </main>
  );
}

function V2PointsCard({ state }) {
  return (
    <section className="rounded-[1.75rem] bg-brand-gold p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/55">
            My Points
          </p>
          <p className="mt-2 text-4xl font-black">{formatPoints(state.points)}</p>
        </div>
        <span className="rounded-full bg-white px-3 py-2 text-xs font-black">
          {state.user.tier}
        </span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70">
        <div className="h-full w-[68%] rounded-full bg-black" />
      </div>
      <div className="mt-3 flex items-center justify-between text-sm font-semibold">
        <span>{formatPoints(7200)} pts to next treat</span>
        <span>{formatPoints(state.user.lifetimePoints)} lifetime</span>
      </div>
    </section>
  );
}

function V2ActionButton({ icon, label, onClick }) {
  return (
    <button
      className="flex flex-col items-center gap-2 rounded-[1.25rem] border border-black/10 bg-white py-4 text-sm font-black"
      onClick={onClick}
    >
      <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-gold">
        {icon}
      </span>
      {label}
    </button>
  );
}

function V2SectionHeader({ title, action, onClick }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="text-lg font-black">{title}</h2>
      <button className="text-sm font-black text-black/60" onClick={onClick}>
        {action}
      </button>
    </div>
  );
}

function V2TransactionCard({ transaction }) {
  const isPositive = transaction.points > 0;
  return (
    <article className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-black/10 bg-white px-4 py-4">
      <div>
        <p className="text-sm font-bold">{transaction.description}</p>
        <p className="mt-1 text-xs text-black/45">{formatDate(transaction.date)}</p>
      </div>
      <span className={`text-sm font-black ${isPositive ? "text-black" : "text-black/50"}`}>
        {isPositive ? "+" : "-"}
        {formatPoints(Math.abs(transaction.points))}
      </span>
    </article>
  );
}

function V2Promo({ label, value }) {
  return (
    <div className="rounded-[1rem] border border-black/10 p-3">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-black/45">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

function V2ProfileRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-xs font-bold text-black/50">{label}</span>
      <span className="text-sm font-black">{value}</span>
    </div>
  );
}

function ProfileScreen({ state }) {
  const navigate = useNavigate();
  const [tierOpen, setTierOpen] = useState(false);
  return (
    <div className="space-y-6 animate-fadeUp">
      <header className="flex items-center justify-between">
        <h2 className="font-display text-2xl">Profile</h2>
        <button className="rounded-full border border-white/20 bg-black/10 p-2 text-brand-gold">
          <ChevronRight size={16} />
        </button>
      </header>

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-black/10">
          <User size={28} />
        </div>
        <h3 className="text-xl font-semibold text-brand-gold">{state.user.name}</h3>
        <p className="text-sm text-white/70">{state.user.email}</p>
        <button className="flex items-center gap-2 text-sm text-brand-gold">
          <QrCode size={16} /> Show Qr code
        </button>
      </div>

      <div className="glass-card rounded-3xl p-6 shadow-soft">
        <div className="space-y-4 text-sm">
          <ProfileRow label="Tier">
            <span className="flex items-center gap-2 text-brand-gold">
              <Crown size={14} /> {state.user.tier}
              <button
                className="rounded-full border border-white/10 p-1 text-brand-gold"
                onClick={() => setTierOpen(true)}
                aria-label="View tier benefits"
              >
                <ChevronRight size={12} />
              </button>
            </span>
          </ProfileRow>
          <ProfileRow label="Member since">{formatDate(state.user.memberSince)}</ProfileRow>
          <ProfileRow label="Lifetime points">
            {formatPoints(state.user.lifetimePoints)}
          </ProfileRow>
          <ProfileRow label="Region">{state.user.region}</ProfileRow>
          <ProfileRow label="City">{state.user.city}</ProfileRow>
          <ProfileRow label="Birthday">{formatDate(state.user.birthday)}</ProfileRow>
          <ProfileRow label="Gender">{state.user.gender}</ProfileRow>
        </div>
      </div>

      <div className="grid gap-3">
        <button className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-black/5 px-4 py-3 text-sm text-white transition active:scale-95">
          Change PIN
          <ChevronRight size={16} />
        </button>
        <button className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-black/5 px-4 py-3 text-sm text-white transition active:scale-95">
          Help
          <ChevronRight size={16} />
        </button>
        <button className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-black/5 px-4 py-3 text-sm text-white transition active:scale-95">
          Contact Us
          <ChevronRight size={16} />
        </button>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-black/5 py-3 text-sm text-white transition active:scale-95"
        onClick={() => navigate("/wallet")}
      >
        <Wallet size={16} /> Discount History
      </button>

      <button
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-black/5 py-3 text-sm text-white transition active:scale-95"
        onClick={() => navigate("/login")}
      >
        <LogOut size={16} /> Logout
      </button>

      {tierOpen && <TierModal onClose={() => setTierOpen(false)} />}
    </div>
  );
}

function BottomNav() {
  const location = useLocation();
  if (
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname.startsWith("/new-design")
  ) {
    return null;
  }

  const links = [
    { to: "/home", label: "Home", icon: Home },
    { to: "/transactions", label: "Transactions", icon: Ticket },
    { to: "/brands", label: "Brands", icon: Store },
    { to: "/redeem", label: "Discount", icon: Gift },
    { to: "/profile", label: "Profile", icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto w-full max-w-md border-t border-white/10 bg-brand-dark/90 px-5 pb-6 pt-3 backdrop-blur safe-bottom-nav">
      <div className="flex items-center justify-between">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[11px] transition ${
                  isActive ? "text-brand-gold" : "text-white/50"
                }`
              }
            >
              <Icon size={20} />
              {link.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

function QuickAction({ icon, label, onClick }) {
  return (
    <button
      className="glass-card flex flex-col items-center gap-2 rounded-2xl py-4 text-sm text-white transition active:scale-95"
      onClick={onClick}
    >
      <span className="text-brand-gold">{icon}</span>
      {label}
    </button>
  );
}

function TransactionCard({ transaction, tone = "light" }) {
  const isPositive = transaction.points > 0;
  const dateTone = tone === "dark" ? "text-brand-gold/70" : "text-white/60";
  return (
    <div className="glass-card flex items-center justify-between rounded-2xl px-4 py-4 shadow-soft">
      <div className="space-y-1">
        <p className={`text-xs ${dateTone}`}>{formatDate(transaction.date)}</p>
        <p className="text-sm">{transaction.description}</p>
      </div>
      <div
        className={`flex items-center gap-1 text-sm font-semibold ${
          isPositive ? "text-emerald-300" : "text-rose-200"
        }`}
      >
        {isPositive ? "+" : "-"}
        {formatPoints(Math.abs(transaction.points))}
      </div>
    </div>
  );
}

function ProfileRow({ label, children }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm last:border-b-0 last:pb-0">
      <span className="text-xs text-white/70">{label}</span>
      <span className="text-sm text-brand-gold">{children}</span>
    </div>
  );
}

function groupTransactions(transactions) {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dayOfWeek = (startOfToday.getDay() + 6) % 7;
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
  const startOfLastWeek = new Date(startOfWeek);
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const buckets = {
    Today: [],
    "This Week": [],
    "Last Week": [],
    "This Month": [],
    Earlier: []
  };

  transactions.forEach((tx) => {
    const date = new Date(tx.date + "T00:00:00");
    if (date >= startOfToday) {
      buckets["Today"].push(tx);
    } else if (date >= startOfWeek) {
      buckets["This Week"].push(tx);
    } else if (date >= startOfLastWeek) {
      buckets["Last Week"].push(tx);
    } else if (date >= startOfMonth) {
      buckets["This Month"].push(tx);
    } else {
      buckets["Earlier"].push(tx);
    }
  });

  const order = ["Earlier", "This Week", "Last Week", "This Month", "Today"];
  return order
    .filter((label) => buckets[label].length > 0)
    .map((label) => ({ label, items: buckets[label] }));
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed right-0 top-6 z-50 flex w-full max-w-md flex-col items-end gap-3 px-5">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast glass-card rounded-2xl px-4 py-3 text-xs text-white shadow-soft"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function EarnQrModal({ onClose, onCopy }) {
  const [code] = useState(() => {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    return `SS-EARN-${suffix}`;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-6 pb-8">
      <div className="glass-card w-full max-w-sm rounded-3xl p-6 shadow-soft animate-fadeUp">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Earn Points Qr</h3>
          <button
            className="rounded-full bg-black/10 px-3 py-1 text-xs text-white/70"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <p className="mt-3 text-sm text-white/60">
          Present this Qr at checkout to earn points instantly.
        </p>
        <div className="mt-5 flex flex-col items-center gap-3">
          <QrPlaceholder value={code} />
          <span className="rounded-full border border-white/10 px-4 py-2 text-xs">
            {code}
          </span>
        </div>
        <button
          className="mt-5 w-full rounded-2xl bg-brand-gold py-2 text-sm font-semibold text-brand-gold transition active:scale-95"
          onClick={onCopy}
        >
          Copy Code
        </button>
      </div>
    </div>
  );
}

function QrPlaceholder({ value, size = 160 }) {
  const cells = 21;
  const cell = size / cells;
  let seed = 0;
  for (let i = 0; i < value.length; i += 1) {
    seed = (seed * 31 + value.charCodeAt(i)) % 2147483647;
  }

  const isFinder = (x, y) => {
    const inTopLeft = x < 7 && y < 7;
    const inTopRight = x > cells - 8 && y < 7;
    const inBottomLeft = x < 7 && y > cells - 8;
    return inTopLeft || inTopRight || inBottomLeft;
  };

  const cellsRender = [];
  for (let y = 0; y < cells; y += 1) {
    for (let x = 0; x < cells; x += 1) {
      if (isFinder(x, y)) continue;
      seed = (seed * 1103515245 + 12345) % 2147483647;
      const on = seed % 2 === 0;
      if (on) {
        cellsRender.push(
          <rect
            key={`${x}-${y}`}
            x={x * cell}
            y={y * cell}
            width={cell}
            height={cell}
            fill="#010812"
          />
        );
      }
    }
  }

  return (
    <div className="rounded-3xl bg-black p-4 shadow-soft">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect width={size} height={size} fill="#ffffff" />
        <Finder x={0} y={0} cell={cell} />
        <Finder x={(cells - 7) * cell} y={0} cell={cell} />
        <Finder x={0} y={(cells - 7) * cell} cell={cell} />
        {cellsRender}
      </svg>
    </div>
  );
}

function Finder({ x, y, cell }) {
  const size = cell * 7;
  return (
    <>
      <rect x={x} y={y} width={size} height={size} fill="#010812" />
      <rect
        x={x + cell}
        y={y + cell}
        width={size - cell * 2}
        height={size - cell * 2}
        fill="#ffffff"
      />
      <rect
        x={x + cell * 2}
        y={y + cell * 2}
        width={size - cell * 4}
        height={size - cell * 4}
        fill="#010812"
      />
    </>
  );
}

function TierModal({ onClose }) {
  const tiers = [
    {
      name: "Gold",
      requirement: "0 - 24,999 pts",
      benefits: ["Priority booking", "Birthday surprise", "Member pricing"]
    },
    {
      name: "Platinum",
      requirement: "25,000 - 74,999 pts",
      benefits: ["Chef table access", "Exclusive tastings", "Bonus points days"]
    },
    {
      name: "Signature",
      requirement: "75,000+ pts",
      benefits: ["Private lounge", "Concierge dining", "Invite-only events"]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-6 pb-8">
      <div className="glass-card w-full max-w-sm rounded-3xl p-6 shadow-soft animate-fadeUp">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl">Membership Tiers</h3>
          <button
            className="rounded-full bg-black/10 px-3 py-1 text-xs text-white/70"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="mt-5 space-y-4">
          {tiers.map((tier) => (
            <div key={tier.name} className="rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-gold">{tier.name}</p>
                <span className="text-[11px] text-white/60">{tier.requirement}</span>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-white/70">
                {tier.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
