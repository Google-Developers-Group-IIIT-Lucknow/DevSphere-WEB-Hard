// hard/tests/visible.test.js
const assert = require('assert');
const {
  Subject,
  Faculty,
  Room,
  ScheduledSlot
} = require('../src/models');
const {
  isValidTimeSlot,
  isFacultyAvailable,
  isRoomAvailable,
  canFacultyTeachSubject,
  isBatchConflict,
  isFacultyConflict,
  isRoomConflict,
} = require('../src/validator');
const {
  generateWeeklyTimeSlots,
  findSlotForSubject,
  scheduleTimetable,
  generateScheduleSummary
} = require('../src/scheduler');
const {
  generateTimetable
} = require('../src/engine');

// Mock Data
const subjectsData = require('../data/subjects.json');
const facultyData = require('../data/faculty.json');
const roomsData = require('../data/rooms.json');
const { exit } = require('process');

let subjects, faculties, rooms;

function setup() {
  subjects = subjectsData.map(s => Subject.fromObject(s));
  faculties = facultyData.map(f => Faculty.fromObject(f));
  rooms = roomsData.map(r => Room.fromObject(r));
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function runTest(name, testFunction) {
  setup(); 
  totalTests++;
  try {
    testFunction();
    passedTests++;
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error("   →", error.message);
    failedTests++;
  }
}

console.log('Running Hard Level Tests: TimetableForge\n');

runTest('validator.isValidTimeSlot should validate time slot format and range', () => {
  assert.strictEqual(isValidTimeSlot('MON_0900_1000'), true, 'Valid time slot');
  assert.strictEqual(isValidTimeSlot('FRI_1600_1700'), true, 'Valid end-of-day slot');
  assert.strictEqual(isValidTimeSlot('SAT_0900_1000'), false, 'Invalid day');
  assert.strictEqual(isValidTimeSlot('MON_0700_0800'), false, 'Invalid early hour');
  assert.strictEqual(isValidTimeSlot('MON_1700_1800'), false, 'Invalid late hour');
  assert.strictEqual(isValidTimeSlot('MON_0900_0930'), false, 'Invalid slot duration');
  assert.strictEqual(isValidTimeSlot('MON_0900-1000'), false, 'Invalid format');
});

runTest('validator.isFacultyAvailable should check faculty availability', () => {
  const faculty = faculties.find(f => f.id === 'F001'); // Dr. Anya Sharma
  assert.strictEqual(isFacultyAvailable(faculty, 'MON_0900_1000'), true, 'F001 should be available MON_0900_1000');
  assert.strictEqual(isFacultyAvailable(faculty, 'MON_1100_1200'), false, 'F001 should not be available MON_1100_1200');
});

runTest('validator.isRoomAvailable should check room availability', () => {
  const room = rooms.find(r => r.id === 'CR101'); // Classroom 101
  assert.strictEqual(isRoomAvailable(room, 'MON_0900_1000'), true, 'CR101 should be available MON_0900_1000');
  assert.strictEqual(isRoomAvailable(room, 'MON_1200_1300'), false, 'CR101 should not be available MON_1200_1300');
});

runTest('validator.canFacultyTeachSubject should check faculty expertise', () => {
  const faculty = faculties.find(f => f.id === 'F001'); // Dr. Anya Sharma
  const subject = subjects.find(s => s.id === 'CS301'); // Data Structures
  assert.strictEqual(canFacultyTeachSubject(faculty, subject), true, 'F001 can teach CS301');

  const otherSubject = subjects.find(s => s.id === 'MA201'); // Linear Algebra
  assert.strictEqual(canFacultyTeachSubject(faculty, otherSubject), false, 'F001 cannot teach MA201');
});

runTest('scheduler.generateWeeklyTimeSlots should produce correct number of slots', () => {
  const weeklySlots = generateWeeklyTimeSlots();
  // 5 days * 9 hours/day = 45 slots
  assert.strictEqual(weeklySlots.length, 45, 'Should generate 45 weekly slots');
  assert.ok(weeklySlots.includes('MON_0800_0900'), 'Should include MON_0800_0900');
  assert.ok(weeklySlots.includes('FRI_1600_1700'), 'Should include FRI_1600_1700');
});

runTest('scheduler.findSlotForSubject should find a slot for a theory subject', () => {
  const cs301 = subjects.find(s => s.id === 'CS301'); // Data Structures (4 weekly hours)
  const currentSchedule = [];
  const slot = findSlotForSubject(cs301, faculties, rooms, currentSchedule);

  assert.ok(slot !== null, 'Should find a slot for CS301');
  assert.strictEqual(slot.subjectId, 'CS301', 'Scheduled subject ID should match');
  assert.ok(isValidTimeSlot(slot.timeSlot), 'Scheduled time slot should be valid');
});

runTest('scheduler.findSlotForSubject should find a slot for a lab subject (single hour)', () => {
  const cs302 = subjects.find(s => s.id === 'CS302'); // Algorithms Lab (2 weekly hours, lab type)
  const currentSchedule = [];
  const slot = findSlotForSubject(cs302, faculties, rooms, currentSchedule, 'B1');

  assert.ok(slot !== null, 'Should find a slot for CS302 for Batch B1');
  assert.strictEqual(slot.subjectId, 'CS302', 'Scheduled subject ID should match');
  assert.strictEqual(slot.batchId, 'B1', 'Scheduled batch ID should match');
  assert.ok(rooms.find(r => r.id === slot.roomId).type === 'lab', 'Scheduled room should be a lab');
});

runTest('scheduler.scheduleTimetable should schedule all subjects', () => {
  const batches = ['B1', 'B2'];
  const {
    schedule,
    summary
  } = generateTimetable(subjectsData, facultyData, roomsData, batches);

  // Total expected hours:
  // CS301: 4 hours
  // CS302: 2 hours * 2 batches = 4 hours (each batch needs 2 hours)
  // MA201: 3 hours
  // EL101: 3 hours
  // EL102: 3 hours
  // Total: 4 + 4 + 3 + 3 + 3 = 17 hours.
  // Since labs are 2-hour slots, CS302 for B1 and B2 will take 2 slots each.
  // So, 4 (CS301) + 2 (CS302 B1) + 2 (CS302 B2) + 3 (MA201) + 3 (EL101) + 3 (EL102) = 17 slots.
  // This test will likely fail until lab scheduling logic is correctly implemented.
  assert.strictEqual(schedule.length, 17, 'Total scheduled slots should match total weekly hours');

  // Check for basic conflicts (will fail until validator is complete)
  for (const slot of schedule) {
    const conflictingBatchSlots = schedule.filter(
      s => s.batchId === slot.batchId && s.timeSlot === slot.timeSlot && s !== slot
    );
    assert.strictEqual(conflictingBatchSlots.length, 0, `Batch conflict detected for ${slot.batchId} at ${slot.timeSlot}`);

    const conflictingFacultySlots = schedule.filter(
      s => s.facultyId === slot.facultyId && s.timeSlot === slot.timeSlot && s !== slot
    );
    assert.strictEqual(conflictingFacultySlots.length, 0, `Faculty conflict detected for ${slot.facultyId} at ${slot.timeSlot}`);

    const conflictingRoomSlots = schedule.filter(
      s => s.roomId === slot.roomId && s.timeSlot === slot.timeSlot && s !== slot
    );
    assert.strictEqual(conflictingRoomSlots.length, 0, `Room conflict detected for ${slot.roomId} at ${slot.timeSlot}`);
  }
});

runTest('engine.generateTimetable should return a schedule and summary', () => {
  const batches = ['B1', 'B2'];
  const {
    schedule,
    summary
  } = generateTimetable(subjectsData, facultyData, roomsData, batches);

  assert.ok(Array.isArray(schedule), 'Schedule should be an array');
  assert.ok(typeof summary === 'object', 'Summary should be an object');
  assert.ok(schedule.length > 0, 'Schedule should not be empty');
  assert.ok(summary.totalSlots === schedule.length, 'Summary totalSlots should match schedule length');
});

console.log('\n---------------------------');
console.log(`Total: ${totalTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
  console.log('🎉 All tests passed!');
  process.exit(0);
} else {
  console.log(`⚠️ ${passedTests}/${totalTests} tests passed`);
  process.exit(1);
}
console.log('\nAll Hard Level tests completed. Fix the incomplete logic and bugs to make them pass!');