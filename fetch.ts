const data = await fetch(
	"https://courses.upenn.edu/api/?page=fose&route=search",
	{
		body: encodeURIComponent(
			JSON.stringify({
				criteria: [
					{
						field: "crn",
						value: sam.user.registeredSections("202410").join(","),
					},
				],
				other: { srcdb: "202410" },
			})
		),
		method: "POST",
	}
).then((r) => r.json())

const schedule = data.results

console.log(JSON.stringify(schedule, null, 2))
