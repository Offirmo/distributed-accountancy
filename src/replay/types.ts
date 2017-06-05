import { DateISO8601 } from '../types'

type EventType = 'trade' | 'fix' | 'manual'

interface Event {
	type: EventType
	date: DateISO8601
}

