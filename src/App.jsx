import React, { useMemo, useReducer, useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Wallet,
  Gift,
  User,
  Coins,
  Sparkles,
  Crown,
  LogOut,
  BadgeCheck,
  Ticket,
  Filter,
  ChevronRight,
  Utensils,
  QrCode,
  Store
} from "lucide-react";

const initialState = {
  user: {
    name: "Gerry Sy",
    memberSince: "2022",
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
    {
      id: "tx-14",
      date: "2025-12-05",
      description: "Bought Points - Gold Bundle",
      points: 1000
    }
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
    title: "Signature Tasting Menu",
    points: 4200,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    tag: "Chef's Choice",
    category: "Dining"
  },
  {
    id: "rw-2",
    title: "Chef's Table Experience",
    points: 7200,
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80",
    tag: "Exclusive",
    category: "Experience"
  },
  {
    id: "rw-3",
    title: "Dessert & Wine Pairing",
    points: 1800,
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80",
    tag: "Limited",
    category: "Dessert"
  },
  {
    id: "rw-4",
    title: "Private Lounge Voucher",
    points: 2600,
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    tag: "Premium",
    category: "Experience"
  },
  {
    id: "rw-5",
    title: "Seasonal Chef's Platter",
    points: 2200,
    image:
      "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
    tag: "Seasonal",
    category: "Dining"
  },
  {
    id: "rw-6",
    title: "Seafood Bar Upgrade",
    points: 1600,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    tag: "New",
    category: "Dining"
  },
  {
    id: "rw-7",
    title: "Sommelier Pairing Flight",
    points: 2400,
    image:
      "https://images.unsplash.com/photo-1510626176961-4b57d4fbad03?auto=format&fit=crop&w=800&q=80",
    tag: "Signature",
    category: "Beverage"
  },
  {
    id: "rw-8",
    title: "Gold Room Reservation",
    points: 5200,
    image:
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?auto=format&fit=crop&w=800&q=80",
    tag: "Private",
    category: "Experience"
  },
  {
    id: "rw-9",
    title: "Weekend Brunch Suite",
    points: 2800,
    image:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80",
    tag: "Weekend",
    category: "Dining"
  },
  {
    id: "rw-10",
    title: "Signature Mocktail Bar",
    points: 1200,
    image:
      "https://images.unsplash.com/photo-1514361892635-6a3845b606ad?auto=format&fit=crop&w=800&q=80",
    tag: "Refreshing",
    category: "Beverage"
  },
  {
    id: "rw-11",
    title: "Chef Collaboration Dinner",
    points: 8800,
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80",
    tag: "Rare",
    category: "Experience"
  }
];

const bundles = [
  { id: "bn-1", label: "500 pts", points: 500, price: "₱399" },
  { id: "bn-2", label: "1,000 pts", points: 1000, price: "₱749" },
  { id: "bn-3", label: "5,000 pts", points: 5000, price: "₱3,499" }
];

const paymentMethods = [
  { id: "pm-1", label: "GCash" },
  { id: "pm-2", label: "Maya" },
  { id: "pm-3", label: "Credit Card" },
  { id: "pm-4", label: "Debit Card" }
];

const categories = ["All", "Dining", "Experience", "Dessert", "Beverage"];

function reducer(state, action) {
  switch (action.type) {
    case "ADD_POINTS":
      return {
        ...state,
        points: state.points + action.payload.points,
        user: {
          ...state.user,
          lifetimePoints: state.user.lifetimePoints + action.payload.points
        },
        transactions: [action.payload.transaction, ...state.transactions]
      };
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

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toasts, setToasts] = useState([]);
  const [earnQrOpen, setEarnQrOpen] = useState(false);
  const [redeemOpen, setRedeemOpen] = useState(null);
  const [rewardCodeOpen, setRewardCodeOpen] = useState(null);

  const addToast = (message) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2400);
  };

  return (
    <div className="app-shell text-white">
      <div className="mx-auto min-h-screen w-full max-w-md px-5 pb-28 pt-8 safe-bottom">
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
            element={<BrandsScreen onEarnQr={() => setEarnQrOpen(true)} />}
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
            path="/buy"
            element={
              <BuyPointsScreen
                transactions={state.transactions}
                onPurchase={(bundle, method) => {
                  dispatch({
                    type: "ADD_POINTS",
                    payload: {
                      points: bundle.points,
                      transaction: {
                        id: crypto.randomUUID(),
                        date: new Date().toISOString().slice(0, 10),
                        description: `Bought Points - ${bundle.label} (${method})`,
                        points: bundle.points
                      }
                    }
                  });
                  addToast("Points purchase completed.");
                }}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfileScreen state={state} />
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
                  date: new Date().toISOString().slice(0, 10),
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

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 text-xs text-white/60">
        By continuing, you agree to the Supersam Loyalty membership terms.
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
              <button
                className="flex items-center gap-1 text-sm text-brand-dark"
                onClick={() => navigate("/buy")}
              >
                Buy Points <ChevronRight size={16} />
              </button>
            </div>
            <h3 className="mt-4 text-3xl font-semibold">
              {formatPoints(state.points)} pts
            </h3>
            <p className="text-sm text-white/60">
              Approx. ₱{formatPoints(Math.round(state.points * 0.08))}
            </p>
            <button
              className="mt-6 flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white transition"
              onClick={() => navigate("/wallet")}
            >
              Rewards Wallet
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
            label="Buy"
            onClick={() => navigate("/buy")}
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

function BrandsScreen({ onEarnQr }) {
  const brands = [
    {
      id: "br-1",
      name: "Supersam Bonifacio",
      type: "Flagship",
      perk: "2x points on weekdays"
    },
    {
      id: "br-2",
      name: "Supersam Rockwell",
      type: "Fine Dining",
      perk: "Complimentary dessert for members"
    },
    {
      id: "br-3",
      name: "Supersam Makati",
      type: "Signature Lounge",
      perk: "Happy hour bonus points"
    },
    {
      id: "br-4",
      name: "Supersam Seaside",
      type: "Resort Dining",
      perk: "Weekend brunch points boost"
    }
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <header className="space-y-1">
        <h2 className="font-display text-2xl">Partner Brands</h2>
        <p className="text-sm text-white/60">
          Earn points across the Supersam group.
        </p>
      </header>

      <div className="space-y-3">
        {brands.map((brand) => (
          <div key={brand.id} className="glass-card rounded-3xl p-4 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-gold">
                <Store size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold">{brand.name}</h3>
                <p className="text-xs text-white/60">{brand.type}</p>
                <p className="mt-2 text-xs text-white/60">{brand.perk}</p>
              </div>
              <button
                className="rounded-full border border-white/15 px-3 py-1 text-xs text-white transition active:scale-95"
                onClick={onEarnQr}
              >
                Earn Qr
              </button>
            </div>
          </div>
        ))}
      </div>
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
        <h2 className="font-display text-2xl">Redeem Rewards</h2>
        <p className="text-sm text-white/60">
          Choose curated experiences, paid with your points.
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-6 pb-8">
      <div className="glass-card w-full max-w-sm rounded-3xl p-6 shadow-soft animate-fadeUp">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-brand-gold/70">
              Menu Reward
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-6 pb-8">
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
        <h2 className="font-display text-2xl">Rewards Wallet</h2>
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
              <span>Expires {item.expires}</span>
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

function BuyPointsScreen({ onPurchase, transactions }) {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [selectedBundle, setSelectedBundle] = useState(bundles[1]);
  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);

  return (
    <div className="space-y-6 animate-fadeUp text-black">
      <header className="space-y-1">
        <h2 className="font-display text-2xl text-black">Buy Points</h2>
        <p className="text-sm text-black/60">
          Add points instantly with trusted payment partners.
        </p>
      </header>

      <section className="space-y-3">
        <h3 className="text-xs tracking-[0.25em] text-black/60">
          Bundles
        </h3>
        <div className="grid gap-3">
          {bundles.map((bundle) => {
            const active = bundle.id === selectedBundle.id;
            return (
              <button
                key={bundle.id}
                onClick={() => setSelectedBundle(bundle)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                  active
                    ? "border-brand-gold bg-brand-gold/20"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{bundle.label}</p>
                  <p className="text-xs text-black/60">{bundle.price}</p>
                </div>
                <Coins className={active ? "text-brand-gold" : "text-black/50"} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs tracking-[0.25em] text-black/60">
          Payment Method
        </h3>
        <div className="space-y-2">
          {paymentMethods.map((method) => {
            const active = method.id === selectedMethod.id;
            return (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-brand-gold bg-brand-gold/20"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <span className="text-sm">{method.label}</span>
                <BadgeCheck
                  size={16}
                  className={active ? "text-brand-gold" : "text-black/50"}
                />
              </button>
            );
          })}
        </div>
      </section>

      <button
        className="w-full rounded-2xl bg-brand-gold py-3 text-sm font-semibold text-brand-dark transition active:scale-95"
        onClick={() => onPurchase(selectedBundle, selectedMethod.label)}
      >
        Purchase {selectedBundle.label} with {selectedMethod.label}
      </button>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs tracking-[0.25em] text-black/60">
            Transaction History
          </h3>
        </div>
        <div className="space-y-3">
          {recent.map((tx) => (
            <TransactionCard key={tx.id} transaction={tx} tone="dark" />
          ))}
        </div>
      </section>
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
        <button className="rounded-full border border-white/20 bg-white/10 p-2 text-brand-gold">
          <ChevronRight size={16} />
        </button>
      </header>

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10">
          <User size={28} />
        </div>
        <h3 className="text-xl font-semibold text-brand-dark">{state.user.name}</h3>
        <p className="text-sm text-white/70">{state.user.email}</p>
        <button className="flex items-center gap-2 text-sm text-brand-dark">
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
          <ProfileRow label="Member since">{state.user.memberSince}</ProfileRow>
          <ProfileRow label="Lifetime points">
            {formatPoints(state.user.lifetimePoints)}
          </ProfileRow>
          <ProfileRow label="Region">{state.user.region}</ProfileRow>
          <ProfileRow label="City">{state.user.city}</ProfileRow>
          <ProfileRow label="Birthday">{state.user.birthday}</ProfileRow>
          <ProfileRow label="Gender">{state.user.gender}</ProfileRow>
        </div>
      </div>

      <div className="grid gap-3">
        <button className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white transition active:scale-95">
          Change PIN
          <ChevronRight size={16} />
        </button>
        <button className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white transition active:scale-95">
          Help
          <ChevronRight size={16} />
        </button>
        <button className="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white transition active:scale-95">
          Contact Us
          <ChevronRight size={16} />
        </button>
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3 text-sm text-white transition active:scale-95"
        onClick={() => navigate("/wallet")}
      >
        <Wallet size={16} /> Rewards Wallet
      </button>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 py-3 text-sm text-white transition active:scale-95"
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
  if (location.pathname === "/" || location.pathname === "/login") return null;

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
  const dateTone = tone === "dark" ? "text-black/60" : "text-white/60";
  return (
    <div className="glass-card flex items-center justify-between rounded-2xl px-4 py-4 shadow-soft">
      <div className="space-y-1">
        <p className={`text-xs ${dateTone}`}>{transaction.date}</p>
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
      <span className="text-sm text-brand-dark">{children}</span>
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
            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
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
          className="mt-5 w-full rounded-2xl bg-brand-gold py-2 text-sm font-semibold text-brand-dark transition active:scale-95"
          onClick={onCopy}
        >
          Copy Code
        </button>
      </div>
    </div>
  );
}

function QrPlaceholder({ value }) {
  const size = 160;
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
    <div className="rounded-3xl bg-white p-4 shadow-soft">
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
            className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70"
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
