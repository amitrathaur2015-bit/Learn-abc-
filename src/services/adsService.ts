import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { hasActiveSubscription, getMonetizationSettings } from './monetizationService'

export interface AdSettings {
  provider: string
  ad_unit_id: string | null
  home_page_ads: boolean
  subject_page_ads: boolean
  games_ads: boolean
}

const DEFAULT_AD_SETTINGS: AdSettings = {
  provider: 'none',
  ad_unit_id: null,
  home_page_ads: false,
  subject_page_ads: false,
  games_ads: false
}

export async function getAdSettings(): Promise<AdSettings> {
  if (!isSupabaseConfigured) return DEFAULT_AD_SETTINGS
  const { data, error } = await supabase.from('ad_settings').select('*').eq('id', 1).single()
  if (error || !data) return DEFAULT_AD_SETTINGS
  return data as AdSettings
}

export async function updateAdSettings(patch: Partial<AdSettings>): Promise<{ error?: string }> {
  if (!isSupabaseConfigured) return { error: 'not_configured' }
  const { error } = await supabase.from('ad_settings').update(patch).eq('id', 1)
  return { error: error?.message }
}

export type AdPlacement = 'home' | 'subject' | 'games'

/** The single question every ad slot in the app asks before rendering
 *  anything. Fails closed (no ad) on any uncertainty - a missing ad is
 *  invisible to a child; a wrongly-shown one is not. Writing Practice never
 *  calls this at all (no AdSlot is ever placed there), so it can't show ads
 *  even if every setting were switched on. */
export async function shouldShowAd(placement: AdPlacement): Promise<boolean> {
  const [settings, adSettings, premium] = await Promise.all([
    getMonetizationSettings(),
    getAdSettings(),
    hasActiveSubscription()
  ])

  if (!settings.ads_enabled) return false
  if (premium) return false

  const placementOn =
    placement === 'home' ? adSettings.home_page_ads : placement === 'subject' ? adSettings.subject_page_ads : adSettings.games_ads

  return placementOn
}

// ---- Provider abstraction ----
// No real ad network is wired in yet - the brief asked for an abstraction so
// one can be added later without touching any screen. A "house" placeholder
// provider renders a small, clearly-labelled, static, non-clickable-surprise
// card so the layout and toggle logic can be tested end-to-end today.
export interface AdCreative {
  provider: string
  render(): { title: string; note: string }
}

class HouseProvider implements AdCreative {
  provider = 'house'
  render() {
    return { title: 'Chhota Scholar', note: 'Ad space - no network connected yet' }
  }
}

export const activeAdProvider: AdCreative = new HouseProvider()
