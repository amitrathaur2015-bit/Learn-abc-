import { useState } from 'react'
import ScreenHeader from '../../components/ScreenHeader'
import AdminGate from './AdminGate'
import AdminDashboard from './AdminDashboard'
import AdminMonetization from './AdminMonetization'
import AdminAds from './AdminAds'
import AdminContent from './AdminContent'

const TABS = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'monetization', label: '💰 Monetization' },
  { id: 'ads', label: '📢 Ads' },
  { id: 'content', label: '📚 Content' }
] as const

type TabId = (typeof TABS)[number]['id']

export default function AdminHub({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<TabId>('dashboard')

  return (
    <AdminGate onBack={onBack}>
      <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
        <ScreenHeader title="🛠️ Admin Panel" onBack={onBack} />

        <div className="mb-4 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-4 py-2 font-display text-sm font-bold ${
                tab === t.id ? 'bg-ink text-white' : 'bg-white text-ink'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'monetization' && <AdminMonetization />}
        {tab === 'ads' && <AdminAds />}
        {tab === 'content' && <AdminContent />}
      </div>
    </AdminGate>
  )
}
