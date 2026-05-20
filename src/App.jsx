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
      description: "Redeemed - Signature Tasting Menu",
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
      description: "Redeemed - Chef's Table Voucher",
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
      description: "Redeemed - Valentine's Dessert Set",
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
  wallet: [
    {
      id: "wd-1",
      title: "Signature Tasting Menu",
      status: "Ready",
      expires: "2026-06-30",
      code: "SS-TASTE-2045"
    },
    {
      id: "wd-2",
      title: "Chef's Table Voucher",
      status: "Scheduled",
      expires: "2026-05-20",
      code: "SS-CHEF-1188"
    }
  ]
};

const rewards = [
  {
    id: "rw-1",
    title: "US Angus Beef Salpicao",
    points: 4200,
    image:
      "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80",
    tag: "Main",
    category: "Mains"
  },
  {
    id: "rw-2",
    title: "Truffle Mushroom Pizza",
    points: 7200,
    image:
      "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=800&q=80",
    tag: "House Favorite",
    category: "Mains"
  },
  {
    id: "rw-3",
    title: "Mango Pavlova",
    points: 1800,
    image:
      "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    tag: "Dessert",
    category: "Dessert"
  },
  {
    id: "rw-4",
    title: "Crispy Pork Sisig",
    points: 2600,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
    tag: "Savory",
    category: "Mains"
  },
  {
    id: "rw-5",
    title: "Smoked Salmon Caesar",
    points: 2200,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    tag: "Fresh",
    category: "Starters"
  },
  {
    id: "rw-6",
    title: "Garlic Butter Prawns",
    points: 1600,
    image:
      "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80",
    tag: "Seafood",
    category: "Starters"
  },
  {
    id: "rw-7",
    title: "Calamansi Basil Spritz",
    points: 2400,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
    tag: "Mocktail",
    category: "Beverage"
  },
  {
    id: "rw-8",
    title: "Classic Sans Rival Slice",
    points: 5200,
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",
    tag: "Sweet",
    category: "Dessert"
  },
  {
    id: "rw-9",
    title: "Ube Cheesecake",
    points: 2800,
    image:
      "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    tag: "Limited",
    category: "Dessert"
  },
  {
    id: "rw-10",
    title: "Iced Spanish Latte",
    points: 1200,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80",
    tag: "Coffee",
    category: "Beverage"
  },
  {
    id: "rw-11",
    title: "Roasted Chicken Inasal",
    points: 8800,
    image:
      "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=800&q=80",
    tag: "Grill",
    category: "Mains"
  }
];

const categories = ["All", "Starters", "Mains", "Dessert", "Beverage"];

function reducer(state, action) {
  switch (action.type) {
    case "SPEND_POINTS":
      return {
        ...state,
        points: state.points - action.payload.points,
        transactions: [action.payload.transaction, ...state.transactions],
        wallet: [action.payload.walletItem, ...state.wallet]
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

function formatDate(value) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function toLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function App() {
  const location = useLocation();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toasts, setToasts] = useState([]);
  const [earnQrOpen, setEarnQrOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(null);
  const [rewardCodeOpen, setRewardCodeOpen] = useState(null);
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
                onSelectReward={(reward) => setRedeemOpen(reward)}
              />
            }
          />
          <Route
            path="/wallet"
            element={
              <WalletScreen
                wallet={state.wallet}
                onOpen={(item) => setRewardCodeOpen(item)}
              />
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
                onSelectReward={(reward) => setRedeemOpen(reward)}
                onOpenPocketItem={(item) => setRewardCodeOpen(item)}
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
              addToast("Not enough points for this reward.");
              return;
            }
            const code = `SS-${reward.id.slice(-2).toUpperCase()}-${
              Math.floor(1000 + Math.random() * 9000)
            }`;
            dispatch({
              type: "SPEND_POINTS",
              payload: {
                points: reward.points,
                transaction: {
                  id: crypto.randomUUID(),
                  date: toLocalDateKey(),
                  description: `Redeemed - ${reward.title}`,
                  points: -reward.points
                },
                walletItem: {
                  id: crypto.randomUUID(),
                  title: reward.title,
                  status: "Ready",
                  expires: "2026-07-15",
                  code
                }
              }
            });
            addToast("Points redeemed successfully.");
            setRewardCodeOpen({
              title: reward.title,
              code
            });
            setRedeemOpen(null);
          }}
        />
      )}

      {rewardCodeOpen && (
        <RewardCodeModal
          reward={rewardCodeOpen}
          onClose={() => setRewardCodeOpen(null)}
        />
      )}

      <ToastStack toasts={toasts} />
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
        <p className="text-sm text-white/60">Crafted rewards for modern dining.</p>
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
            Sign in to access your premium rewards and curated experiences.
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
          Explore new design
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
              Rewards Pocket
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
            label="Redeem"
            onClick={() => navigate("/redeem")}
          />
          <QuickAction
            icon={<Wallet size={18} />}
            label="Pocket"
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
        detail: "Members can redeem a rotating dessert cart item after dinner service."
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

function RedeemScreen({ points, onSelectReward }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredRewards = rewards.filter((reward) => {
    const matchesCategory =
      activeCategory === "All" || reward.category === activeCategory;
    const matchesQuery = reward.title
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-fadeUp">
      <header className="space-y-1">
        <h2 className="font-display text-2xl">Redeem Menu Items</h2>
        <p className="text-sm text-white/60">
          Choose specific dishes and drinks, paid with your points.
        </p>
      </header>

      <div className="glass-card rounded-3xl p-4 shadow-soft">
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-brand-gold" />
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-xs text-white placeholder:text-white/40"
            placeholder="Search menu items"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-3 py-1 text-[11px] tracking-[0.2em] transition ${
                activeCategory === category
                  ? "bg-brand-gold text-brand-dark"
                  : "border border-white/10 text-white/60"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredRewards.map((reward) => (
          <button
            key={reward.id}
            className="group glass-card overflow-hidden rounded-3xl text-left shadow-soft transition hover:-translate-y-1"
            onClick={() => onSelectReward(reward)}
          >
            <div className="relative">
              <img
                src={reward.image}
                alt={reward.title}
                className="h-32 w-full object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-brand-gold px-3 py-1 text-[10px] tracking-[0.25em] text-brand-dark">
                {reward.tag}
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">{reward.title}</h3>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] tracking-[0.2em] text-white/70">
                  {reward.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>{formatPoints(reward.points)} pts</span>
                <span className="flex items-center gap-1 text-brand-gold">
                  View
                  <ChevronRight size={14} />
                </span>
              </div>
              {points < reward.points && (
                <p className="text-[11px] text-rose-200">
                  You need {formatPoints(reward.points - points)} more points.
                </p>
              )}
            </div>
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
              Menu Item
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
          <span className="text-brand-gold">{reward.category}</span>
        </div>
        <button
          className="mt-6 w-full rounded-2xl bg-brand-gold py-2 text-sm font-semibold text-brand-dark transition active:scale-95"
          onClick={() => onRedeem(reward)}
        >
          Redeem Now
        </button>
      </div>
    </div>
  );
}

function RewardCodeModal({ reward, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-white/50 px-6 pb-8">
      <div className="glass-card w-full max-w-sm rounded-3xl p-6 shadow-soft animate-fadeUp">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-brand-gold/70">
              Reward Access
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
        <div className="mt-5 flex flex-col items-center gap-3">
          <QrPlaceholder value={reward.code} />
          <p className="text-xs text-white/60">Show this Qr to redeem.</p>
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-sm">
          {reward.code}
        </div>
        <button
          className="mt-5 w-full rounded-2xl bg-brand-gold py-2 text-sm font-semibold text-brand-dark transition active:scale-95"
          onClick={onClose}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function WalletScreen({ wallet, onOpen }) {
  return (
    <div className="space-y-6 animate-fadeUp">
      <header className="space-y-1">
        <h2 className="font-display text-2xl">Rewards Pocket</h2>
        <p className="text-sm text-white/60">
          Your redeemed rewards and vouchers.
        </p>
      </header>
      <div className="space-y-3">
        {wallet.map((item) => (
          <button
            key={item.id}
            className="glass-card w-full rounded-3xl p-5 text-left shadow-soft transition hover:-translate-y-1"
            onClick={() => onOpen(item)}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <span className="rounded-full bg-brand-gold/20 px-3 py-1 text-[10px] tracking-[0.2em] text-brand-gold">
                {item.status}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-white/60">
              <span>Expires {formatDate(item.expires)}</span>
              <span className="rounded-full border border-white/10 px-3 py-1">
                {item.code}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function NewDesignSite({ state, onSelectReward, onOpenPocketItem }) {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const previewTransactions = state.transactions.slice(0, 3);
  const progressPercent = Math.min((state.points / 18000) * 100, 100);
  const nextReward = Math.max(18000 - state.points, 0);
  const filteredRewards = rewards.filter((reward) => {
    const matchesCategory =
      activeCategory === "All" || reward.category === activeCategory;
    const matchesQuery = reward.title.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });
  const unclaimedVouchers = state.wallet.filter((item) =>
    ["Ready", "Scheduled"].includes(item.status)
  );
  const offers = [
    {
      reward: rewards[1],
      title: "Featured reward",
      detail: "Truffle Mushroom Pizza is ready to redeem with your points.",
      icon: Star
    },
    {
      reward: rewards[2],
      title: "Birthday month treat",
      detail: "Redeem one dessert from the rewards menu.",
      icon: Gift
    }
  ];
  const notifications = [
    {
      title: "Double points today",
      detail: "Scan your member QR at any Supersam branch before 2 PM.",
      time: "Now",
      action: "Scan"
    },
    {
      title: "Reward expiring soon",
      detail: "Chef's Table Voucher expires on May 20, 2026.",
      time: "1h",
      action: "Pocket"
    },
    {
      title: "New dessert reward",
      detail: "Mango Pavlova is now available in the rewards menu.",
      time: "Yesterday",
      action: "Rewards"
    }
  ];
  const tabs = [
    { label: "Home", icon: Home },
    { label: "Scan", icon: ScanLine },
    { label: "Rewards", icon: Star },
    { label: "Pocket", icon: Wallet },
    { label: "Profile", icon: User }
  ];
  const titleByView = {
    Home: "Good afternoon",
    Scan: "Scan to earn",
    Rewards: "Rewards",
    Pocket: "Pocket",
    Profile: "Account"
  };

  return (
    <main className="new-design -mx-5 min-h-screen bg-[#fff8d8] pb-28 text-[#221b05]">
      <header className="sticky top-0 z-30 border-b border-[#ead47a] bg-[#fff8d8]/95 px-5 pb-4 pt-5 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SupersamRewardsMark />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#8a6500]">
                Supersam Rewards
              </p>
              <h1 className="mt-1 text-2xl font-black">{titleByView[activeView]}</h1>
            </div>
          </div>
          <button
            className="relative grid h-10 w-10 place-items-center rounded-full border border-[#ead47a] bg-white text-[#221b05] shadow-sm"
            aria-label="Notifications"
            onClick={() => setNotificationsOpen(true)}
          >
            <Bell size={18} strokeWidth={2.25} />
            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#f3c437] ring-2 ring-white" />
          </button>
        </div>
      </header>

      <section className="space-y-5 px-5 pt-5">
        {activeView === "Home" && (
          <>
            <section className="overflow-hidden rounded-[1.75rem] bg-[#f3c437] text-[#221b05] shadow-soft">
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#6f5306]">
                      Hello, {state.user.name.split(" ")[0]}
                    </p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-5xl font-black leading-none">
                        {formatPoints(state.points)}
                      </span>
                      <span className="text-lg font-black text-[#6f5306]">pts</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-2 text-xs font-black text-[#8a6500]">
                    {state.user.tier}
                  </span>
                </div>
                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs font-bold text-[#6f5306]">
                    <span>{formatPoints(nextReward)} pts to Signature perk</span>
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="mt-2 h-3 rounded-full bg-white/55">
                    <div
                      className="h-full rounded-full bg-[#221b05]"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="border-t border-[#d4a91a] bg-[#221b05]">
                <button
                  className="flex w-full items-center justify-center gap-2 py-4 text-sm font-black text-white"
                  onClick={() => setActiveView("Scan")}
                >
                  <ScanLine size={18} /> Scan in store
                </button>
              </div>
            </section>

            <div className="grid grid-cols-3 gap-3">
              <RewardsAction icon={<ScanLine size={19} />} label="Scan" onClick={() => setActiveView("Scan")} />
              <RewardsAction icon={<Gift size={19} />} label="Rewards" onClick={() => setActiveView("Rewards")} />
              <RewardsAction icon={<Wallet size={19} />} label="Pocket" onClick={() => setActiveView("Pocket")} />
            </div>

            <RewardsSectionHeader title="For you" action="See rewards" onClick={() => setActiveView("Rewards")} />
            <div className="grid gap-3">
              {offers.map((offer) => {
                const Icon = offer.icon;
                return (
                  <button
                    key={offer.title}
                    className="flex items-center gap-4 rounded-[1.35rem] border border-[#ead47a] bg-white p-4 text-left shadow-sm"
                    onClick={() => onSelectReward(offer.reward)}
                  >
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#fff0a7] text-[#8a6500]">
                      <Icon size={21} strokeWidth={2.25} />
                    </div>
                    <div>
                      <h2 className="text-sm font-black">{offer.title}</h2>
                      <p className="mt-1 text-xs font-semibold leading-5 text-[#7b6b32]">
                        {offer.detail}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <RewardsSectionHeader title="Recent activity" action="History" onClick={() => setActiveView("Profile")} />
            <div className="space-y-3">
              {previewTransactions.map((transaction) => (
                <RewardsTransaction key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </>
        )}

        {activeView === "Scan" && (
          <div className="space-y-4">
            <section className="rounded-[1.75rem] bg-white p-5 text-center shadow-soft">
              <div className="mx-auto w-fit rounded-[1.4rem] bg-[#fff8d8] p-4">
                <QrPlaceholder value="SS-REWARDS-2045" size={172} />
              </div>
              <h2 className="mt-5 text-xl font-black">Scan to earn points</h2>
              <p className="mx-auto mt-2 max-w-[18rem] text-sm font-semibold leading-6 text-[#7b6b32]">
                Present this code before checkout so staff can add points to your account.
              </p>
            </section>
            <section className="rounded-[1.5rem] border border-[#ead47a] bg-white p-5">
              <RewardsSectionHeader title="Pocket" action={`${state.wallet.length} ready`} onClick={() => setActiveView("Pocket")} />
              <div className="mt-3 divide-y divide-[#f0df91]">
                {state.wallet.map((item) => (
                  <button
                    key={item.id}
                    className="flex w-full items-center justify-between gap-3 py-3 text-left"
                    onClick={() => onOpenPocketItem(item)}
                  >
                    <div>
                      <p className="text-sm font-black">{item.title}</p>
                      <p className="mt-1 text-xs font-semibold text-[#7b6b32]">{item.code}</p>
                    </div>
                    <span className="rounded-full bg-[#fff0a7] px-3 py-1 text-xs font-black text-[#8a6500]">
                      {item.status}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeView === "Rewards" && (
          <>
            <section className="rounded-[1.5rem] bg-[#f3c437] p-5 text-[#221b05] shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6f5306]">
                Reward store
              </p>
              <h2 className="mt-2 text-2xl font-black">Turn points into favorites.</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#6f5306]">
                You have {formatPoints(state.points)} points available today.
              </p>
            </section>
            <div className="rounded-[1.5rem] border border-[#ead47a] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <Filter size={16} strokeWidth={2.35} className="text-[#8a6500]" />
                <input
                  className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-[#221b05] placeholder:text-[#7b6b32] focus:ring-0"
                  placeholder="Search rewards"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${
                      activeCategory === category
                        ? "bg-[#221b05] text-white"
                        : "border border-[#ead47a] bg-white text-[#7b6b32]"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filteredRewards.map((reward) => (
                <button
                  key={reward.id}
                  className="overflow-hidden rounded-[1.35rem] border border-[#ead47a] bg-white text-left shadow-sm"
                  onClick={() => onSelectReward(reward)}
                >
                  <img src={reward.image} alt={reward.title} className="h-28 w-full object-cover" />
                  <div className="p-3">
                    <p className="min-h-10 text-sm font-black leading-5">{reward.title}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#7b6b32]">{reward.category}</span>
                      <span className="rounded-full bg-[#fff0a7] px-2 py-1 text-[11px] font-black text-[#8a6500]">
                        {formatPoints(reward.points)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {activeView === "Pocket" && (
          <div className="space-y-5">
            <section className="rounded-[1.5rem] bg-[#f3c437] p-5 text-[#221b05] shadow-soft">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#6f5306]">
                Voucher pocket
              </p>
              <h2 className="mt-2 text-2xl font-black">Redeemed, not yet claimed.</h2>
              <p className="mt-2 text-sm font-semibold leading-6 text-[#6f5306]">
                Your redeemed vouchers stay here until they are shown and claimed in-store.
              </p>
            </section>

            <section className="rounded-[1.5rem] border border-[#ead47a] bg-white p-5 shadow-sm">
              <RewardsSectionHeader title="Unclaimed vouchers" action={`${unclaimedVouchers.length} ready`} onClick={() => setActiveView("Scan")} />
              <div className="mt-3 divide-y divide-[#f0df91]">
                {unclaimedVouchers.map((item) => (
                  <button
                    key={item.id}
                    className="flex w-full items-center justify-between gap-3 py-4 text-left"
                    onClick={() => onOpenPocketItem(item)}
                  >
                    <div>
                      <p className="text-sm font-black">{item.title}</p>
                      <p className="mt-1 text-xs font-semibold text-[#7b6b32]">
                        Expires {formatDate(item.expires)} · {item.code}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#fff0a7] px-3 py-1 text-xs font-black text-[#8a6500]">
                      {item.status}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeView === "Profile" && (
          <div className="space-y-4">
            <section className="rounded-[1.75rem] bg-[#f3c437] p-5 text-[#221b05] shadow-soft">
              <div className="flex flex-col items-center text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white text-[#8a6500]">
                  <User size={28} strokeWidth={2.2} />
                </div>
                <h2 className="mt-4 text-xl font-black">{state.user.name}</h2>
                <p className="mt-1 text-sm font-semibold text-[#6f5306]">{state.user.email}</p>
              </div>
            </section>
            <section className="rounded-[1.5rem] border border-[#ead47a] bg-white p-5">
              <div className="space-y-3 text-sm">
                <RewardsProfileRow label="Tier" value={state.user.tier} />
                <RewardsProfileRow label="Member since" value={formatDate(state.user.memberSince)} />
                <RewardsProfileRow label="Lifetime points" value={formatPoints(state.user.lifetimePoints)} />
                <RewardsProfileRow label="Region" value={state.user.region} />
                <RewardsProfileRow label="Birthday" value={formatDate(state.user.birthday)} />
              </div>
            </section>
            <section className="rounded-[1.5rem] border border-[#ead47a] bg-white p-5">
              <RewardsSectionHeader title="Activity" action="Latest" onClick={() => setActiveView("Home")} />
              <div className="mt-2 divide-y divide-[#f0df91]">
                {state.transactions.slice(0, 5).map((transaction) => (
                  <div key={transaction.id} className="py-3">
                    <p className="text-sm font-black">{transaction.description}</p>
                    <p className="mt-1 text-xs font-semibold text-[#7b6b32]">
                      {formatDate(transaction.date)} · {transaction.points > 0 ? "+" : "-"}
                      {formatPoints(Math.abs(transaction.points))} pts
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <section className="rounded-[1.5rem] border border-[#ead47a] bg-white p-5">
              <RewardsSectionHeader title="Pocket" action={`${state.wallet.length} ready`} onClick={() => setActiveView("Pocket")} />
              <div className="mt-2 divide-y divide-[#f0df91]">
                {state.wallet.map((item) => (
                  <div key={item.id} className="py-3">
                    <p className="text-sm font-black">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold text-[#7b6b32]">
                      Expires {formatDate(item.expires)} · {item.code}
                    </p>
                  </div>
                ))}
              </div>
            </section>
            <button
              className="w-full rounded-full bg-[#1d2a21] py-3 text-sm font-black text-white"
              onClick={() => navigate("/login")}
            >
              Return to classic app
            </button>
          </div>
        )}
      </section>

      {notificationsOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 px-5 pb-6">
          <section className="w-full max-w-md rounded-[1.5rem] bg-white p-5 shadow-soft animate-fadeUp">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-[#8a6500]">Mock notifications</p>
                <h2 className="mt-1 text-xl font-black">What is new</h2>
              </div>
              <button
                className="rounded-full border border-[#ead47a] px-3 py-2 text-xs font-black"
                onClick={() => setNotificationsOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-4 divide-y divide-[#f0df91]">
              {notifications.map((notification) => (
                <button
                  key={notification.title}
                  className="flex w-full items-start gap-3 py-4 text-left"
                  onClick={() => {
                    setActiveView(notification.action);
                    setNotificationsOpen(false);
                  }}
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#f3c437]" />
                  <span className="flex-1">
                    <span className="block text-sm font-black">{notification.title}</span>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-[#7b6b32]">
                      {notification.detail}
                    </span>
                  </span>
                  <span className="text-xs font-black text-[#8a6500]">{notification.time}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto max-w-md border-t border-[#ead47a] bg-white px-4 pb-5 pt-3 shadow-[0_-12px_28px_rgba(34,27,5,0.08)]">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.label;
            return (
              <button
                key={tab.label}
                className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-bold ${
                  isActive ? "bg-[#fff0a7] text-[#8a6500]" : "text-[#7b6b32]"
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
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const previewTransactions = state.transactions.slice(0, 4);
  const filteredRewards = rewards.filter((reward) => {
    const matchesCategory =
      activeCategory === "All" || reward.category === activeCategory;
    const matchesQuery = reward.title.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });
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
    { label: "Redeem", icon: Gift },
    { label: "Profile", icon: User }
  ];
  const showHome = activeView === "Home";
  const showTransactions = activeView === "Transactions";
  const showBrands = activeView === "Brands";
  const showRedeem = activeView === "Redeem";
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
              {showRedeem && "Redeem"}
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
                label="Redeem"
                onClick={() => setActiveView("Redeem")}
              />
              <V2ActionButton
                icon={<Wallet size={20} strokeWidth={2.25} />}
                label="Pocket"
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
              <div className="flex items-center gap-3">
                <Filter size={16} strokeWidth={2.35} />
                <input
                  className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-black placeholder:text-black/40 focus:ring-0"
                  placeholder="Search menu items"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-black ${
                      activeCategory === category
                        ? "bg-brand-gold"
                        : "border border-black/10 bg-white text-black/55"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filteredRewards.map((reward) => (
                <button
                  key={reward.id}
                  className="overflow-hidden rounded-[1.35rem] border border-black/10 bg-white text-left"
                  onClick={() => setActiveView("Profile")}
                >
                  <img src={reward.image} alt={reward.title} className="h-28 w-full object-cover" />
                  <div className="p-3">
                    <p className="min-h-10 text-sm font-black leading-5">{reward.title}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-black/50">{reward.category}</span>
                      <span className="rounded-full bg-black px-2 py-1 text-[11px] font-black text-[#fbe106]">
                        {formatPoints(reward.points)}
                      </span>
                    </div>
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
              <V2SectionHeader title="Pocket" action={`${state.wallet.length} ready`} onClick={() => setActiveView("Redeem")} />
              <div className="mt-2 divide-y divide-black/10">
                {state.wallet.map((item) => (
                  <div key={item.id} className="py-3">
                    <p className="text-sm font-black">{item.title}</p>
                    <p className="mt-1 text-xs font-semibold text-black/50">
                      Expires {formatDate(item.expires)} · {item.code}
                    </p>
                  </div>
                ))}
              </div>
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
        <Wallet size={16} /> Rewards Pocket
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
    { to: "/redeem", label: "Redeem", icon: Gift },
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
