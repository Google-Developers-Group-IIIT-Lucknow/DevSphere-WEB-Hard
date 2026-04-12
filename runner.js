// hard/runner.js
const {
  generateTimetable
} = require('./src/engine');

// Load initial data
const subjectsData = require('./data/subjects.json');
const facultyData = require('./data/faculty.json');
const roomsData = require('./data/rooms.json');

function main() {
  console.log('--- TimetableForge: Running Timetable Generation ---');

  const batches = ['B1', 'B2']; // Example batches

  const {
    schedule,
    summary
  } = generateTimetable(subjectsData, facultyData, roomsData, batches);

  console.log('\n--- Generated Schedule ---');
  if (schedule.length > 0) {
    schedule.forEach(slot => {
      console.log(
        `Subject: ${slot.subjectId}, Faculty: ${slot.facultyId}, Room: ${slot.roomId}, Time: ${slot.timeSlot}${slot.batchId ? `, Batch: ${slot.batchId}` : ''}`
      );
    });
  } else {
    console.log('No schedule generated.');
  }


  console.log('\n--- Schedule Summary ---');
  console.log(JSON.stringify(summary, null, 2));

  console.log('\n--- TimetableForge: Run Complete ---');
}

main();