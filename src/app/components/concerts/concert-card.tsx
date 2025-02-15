import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'

type ConcertCardProps = {
  id: string
  title: string
  date: string
  venue: string
  slug: string
  artists: Array<{ name: string }>
}

export function ConcertCard({ title, date, venue, artists, slug }: ConcertCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">
          <Link href={`/concerts/${slug}`}>{title} </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{date}</p>
          <p className="font-medium">{venue}</p>
          <p className="text-sm text-muted-foreground">{artists.map((a) => a.name).join(', ')}</p>
        </div>
      </CardContent>
    </Card>
  )
}
