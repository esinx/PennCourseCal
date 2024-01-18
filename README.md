# PennCourseCal
Extract [Path@Penn](https://courses.upenn.edu) course data and generate iCalendar files.

## Usage

### Obtaining schedule.json

1. Go to [Path@Penn](https://courses.upenn.edu)
2. Open Dev Console
3. Go to `Console` tab
4. Copy and paste the contents of `fetch.ts`. (don't worry, I promise you I'm not doing anything suspicious with your data)
5. Console should output a JSON object. Copy and paste this into a file called `schedule.json` in the root directory of this project.

### Creating calendar files

1. `yarn install`
2. `npx ts-node ./index.ts`
3. You should see a `calendar.ics` file in the root directory of this project.

## Todo
- Create hosted website
- Add location field to events
- Remove hardcoded semester (`202410` for Spring 2024)