import { daysUntil } from '@/lib/utils'
import { ALERT_DANGER_DAYS, ALERT_WARN_DAYS } from '@/lib/constants'

interface Props { date: string }

export function Badge({ date }: Props) {
  const d = daysUntil(date)

  if (d < 0)                  return <span className="badge bhot">⚠ Süresi doldu</span>
  if (d === 0)                return <span className="badge bhot">⚡ Bugün!</span>
  if (d <= ALERT_DANGER_DAYS) return <span className="badge bhot">{d} gün kaldı</span>
  if (d <= ALERT_WARN_DAYS)   return <span className="badge bwarn">{d} gün kaldı</span>
  return                             <span className="badge bok">{d} gün kaldı</span>
}
