import ScreenHeader from '../../components/ScreenHeader'
import StickerCard from '../../components/StickerCard'
import AdSlot from '../../components/AdSlot'

interface Props {
  onBack: () => void
  onOpen: (section: 'alphabet' | 'words' | 'class1') => void
}

export default function EnglishHub({ onBack, onOpen }: Props) {
  return (
    <div className="mx-auto min-h-screen max-w-md px-4 pb-10 pt-6">
      <ScreenHeader title="🔤 English" subtitle="Letters, words and more" onBack={onBack} />
      <div className="flex flex-col gap-3">
        <StickerCard title="Alphabet A-Z" emoji="🔡" color="sky" onClick={() => onOpen('alphabet')} />
        <StickerCard title="Simple Words" emoji="📖" color="coral" onClick={() => onOpen('words')} />
        <StickerCard title="Class 1 Practice" emoji="📝" color="grape" onClick={() => onOpen('class1')} />
      </div>
      <AdSlot placement="subject" />
    </div>
  )
}
