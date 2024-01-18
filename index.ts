import ical, {
	ICalCalendarMethod,
	ICalEventRepeatingFreq,
	ICalWeekday,
} from "ical-generator"
import { DateTime, WeekdayNumbers } from "luxon"
import fs from "node:fs/promises"

type MeetingTime = {
	meet_day: `${0 | 1 | 2 | 3 | 4 | 5 | 6}`
	start_time: string
	end_time: string
}

type Course = {
	key: string
	code: string
	title: string
	meetingTimes: string
	instr: string
	start_date: string
	end_date: string
}

const meetingDayToICalDay = (day: MeetingTime["meet_day"]): ICalWeekday => {
	switch (day) {
		case "0":
			return ICalWeekday.MO
		case "1":
			return ICalWeekday.TU
		case "2":
			return ICalWeekday.WE
		case "3":
			return ICalWeekday.TH
		case "4":
			return ICalWeekday.FR
		case "5":
			return ICalWeekday.SA
		case "6":
			return ICalWeekday.SU
		default:
			throw new Error("Invalid day")
	}
}

const firstWeekdayAfter = (date: DateTime, weekday: WeekdayNumbers) => {
	const diff = weekday - date.weekday
	if (diff < 0) {
		return date.plus({ days: 7 + diff })
	}
	return date.plus({ days: diff })
}

const createCalendar = async () => {
	const calendar = ical({ name: "PennCourseCal" })
	calendar.method(ICalCalendarMethod.REQUEST)
	calendar.timezone("America/New_York")

	const data = await fs.readFile("schedule.json", "utf-8")
	const cart: Course[] = JSON.parse(data)

	for (const course of cart) {
		const startDate = DateTime.fromFormat(course.start_date, "yyyy-MM-dd")
		const endDate = DateTime.fromFormat(course.end_date, "yyyy-MM-dd")
		const meetingTimeData: MeetingTime[] = JSON.parse(course.meetingTimes)
		for (const meeting of meetingTimeData) {
			const weekday = meetingDayToICalDay(meeting.meet_day)
			const weekdayNumber = (Number(meeting.meet_day) + 1) as WeekdayNumbers
			const startTime = DateTime.fromFormat(
				meeting.start_time.padStart(4, "0"),
				"HHmm"
			)
			const endTime = DateTime.fromFormat(
				meeting.end_time.padStart(4, "0"),
				"HHmm"
			)
			const firstDay = firstWeekdayAfter(startDate, weekdayNumber)
			const start = firstDay.set({
				hour: startTime.get("hour"),
				minute: startTime.get("minute"),
			})
			const end = firstDay.set({
				hour: endTime.get("hour"),
				minute: endTime.get("minute"),
			})
			calendar.createEvent({
				start: start.toJSDate(),
				end: end.toJSDate(),
				floating: true,
				repeating: {
					freq: ICalEventRepeatingFreq.WEEKLY,
					byDay: weekday,
					until: endDate.toJSDate(),
				},
				summary: `${course.code}: ${course.title}`,
			})
		}
	}
	return calendar
}

const main = async () => {
	const calendar = await createCalendar()
	await fs.writeFile("calendar.ics", calendar.toString())
}

main()
