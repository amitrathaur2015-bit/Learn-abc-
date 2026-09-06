import ScreenHeader from '../../components/ScreenHeader'
import StickerCard from '../../components/StickerCard'
import AdSlot from '../../components/AdSlot'

interface Props {
  onBack: () => void
  onOpen: (section: 'swar' | 'vyanjan') => void
}

export default function HindiHub({ onBack, onOpen }: Props) {
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🅰️ Hindi" subtitle="स्वर और व्यंजन" onBack={onBack} />
      <div className="flex flex-col gap-3">
        <StickerCard title="Swar (स्वर)" emoji="अ" color="sun" onClick={() => onOpen('swar')} />
        <StickerCard title="Vyanjan (व्यंजन)" emoji="क" color="leaf" onClick={() => onOpen('vyanjan')} />
      </div>
      <p className="mt-6 text-center text-sm text-ink/40">
        Finger-tracing for Hindi letters is coming in the next update - recognition and pronunciation work now! ✨
      </p>
      <AdSlot placement="subject" />
    </div>
  )
}
