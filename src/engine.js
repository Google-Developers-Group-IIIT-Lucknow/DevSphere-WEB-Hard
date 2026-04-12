// hard/src/engine.js

/**
 * Main timetable generation engine.
 * This module is mostly empty and requires core orchestration logic.
 * Students need to implement the full system.
 */

const {
  Subject,
  Faculty,
  Room
} = require('./models');
const {
  scheduleTimetable,
  generateScheduleSummary
} = require('./scheduler');
const {
  isValidTimeSlot,
  isFacultyAvailable,
  isRoomAvailable,
  canFacultyTeachSubject,
  isBatchConflict,
  isFacultyConflict,
  isRoomConflict,
} = require('./validator');

/**
 * Orchestrates the timetable generation process.
 * @param {Array<Object>} subjectsData - Raw subject data.
 * @param {Array<Object>} facultyData - Raw faculty data.
 * @param {Array<Object>} roomsData - Raw room data.
 * @param {Array<string>} batches - List of batch IDs.
 * @returns {Object} - The generated schedule and a summary.
 */
function generateTimetable(subjectsData, facultyData, roomsData, batches) {
  console.log('--- TimetableForge: Generating Timetable ---');

  // 1. Parse and validate input data
  const subjects = subjectsData.map(s => Subject.fromObject(s));
  const faculties = facultyData.map(f => Faculty.fromObject(f));
  const rooms = roomsData.map(r => Room.fromObject(r));

  // TODO: Add more comprehensive initial data validation here using validator.js functions.
  // For example, check if all faculty preferences are valid faculty IDs,
  // if room capacities are positive, etc.

  // 2. Schedule the timetable
  const scheduledSlots = scheduleTimetable(subjects, faculties, rooms, batches);

  // 3. Generate summary and perform post-scheduling validation
  const summary = generateScheduleSummary(scheduledSlots, subjects, faculties, rooms);

  // TODO: Implement post-scheduling conflict detection and reporting.
  // The scheduler might produce conflicts if validation rules are not fully integrated or are buggy.
  // This step should re-verify all constraints (batch, faculty, room conflicts, lab rules, etc.)
  // and add any detected issues to the summary.

  console.log('--- TimetableForge: Generation Complete ---');

  return {
    schedule: scheduledSlots,
    summary: summary,
  };
}

module.exports = {
  generateTimetable
};