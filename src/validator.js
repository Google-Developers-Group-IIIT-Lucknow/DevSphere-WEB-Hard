// hard/src/validator.js

/**
 * Timetable validation functions.
 * This module is incomplete and contains logical gaps.
 * Students need to implement core validation logic.
 */

const {
  Subject,
  Faculty,
  Room,
  ScheduledSlot
} = require('./models');

/**
 * Checks if a given time slot string is valid.
 * Format: DAY_HHMM_HHMM (e.g., "MON_0900_1000")
 * Days: MON, TUE, WED, THU, FRI
 * Hours: 0800-1700 (8 AM to 5 PM)
 * Slots are 1 hour long.
 * @param {string} timeSlot - The time slot string.
 * @returns {boolean} - True if the time slot is valid, false otherwise.
 */
function isValidTimeSlot(timeSlot) {
  // TODO: Implement robust time slot validation.
  // This is a placeholder and needs to check format, valid days, and valid hours.
  const parts = timeSlot.split('_');
  if (parts.length !== 3) return false;
  const [day, startTime, endTime] = parts;

  const validDays = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  if (!validDays.includes(day)) return false;

  // Basic check for time format and order, but not for actual valid hours (e.g., 0800-1700)
  if (!/^\d{4}$/.test(startTime) || !/^\d{4}$/.test(endTime)) return false;
  if (parseInt(startTime) >= parseInt(endTime)) return false;

  return true;
}

/**
 * Checks if a faculty member is available at a given time slot.
 * @param {Faculty} faculty - The faculty object.
 * @param {string} timeSlot - The time slot to check.
 * @returns {boolean} - True if available, false otherwise.
 */
function isFacultyAvailable(faculty, timeSlot) {
  // Bug/Incomplete: This only checks if the timeSlot is in their availability array.
  // It doesn't account for already scheduled slots for the faculty.
  // Also, it doesn't check for maxWeeklyHours.
  return faculty.availability.includes(timeSlot);
}

/**
 * Checks if a room is available at a given time slot.
 * @param {Room} room - The room object.
 * @param {string} timeSlot - The time slot to check.
 * @returns {boolean} - True if available, false otherwise.
 */
function isRoomAvailable(room, timeSlot) {
  // Bug/Incomplete: Similar to faculty, this only checks if the timeSlot is in their availability array.
  // It doesn't account for already scheduled slots for the room.
  return room.availability.includes(timeSlot);
}

/**
 * Checks if a faculty member has expertise in a given subject.
 * @param {Faculty} faculty - The faculty object.
 * @param {Subject} subject - The subject object.
 * @returns {boolean} - True if the faculty can teach the subject, false otherwise.
 */
function canFacultyTeachSubject(faculty, subject) {
  // Bug: This is a simple check. In a real system, expertise might be more complex (e.g., specific topics).
  return faculty.expertise.includes(subject.id);
}

/**
 * Checks for conflicts within a specific batch for a new slot.
 * A batch cannot have two classes at the same time.
 * @param {string} batchId - The ID of the batch.
 * @param {string} newTimeSlot - The time slot for the new class.
 * @param {Array<ScheduledSlot>} currentSchedule - The current schedule of all slots.
 * @returns {boolean} - True if there is a conflict, false otherwise.
 */
function isBatchConflict(batchId, newTimeSlot, currentSchedule) {
  // TODO: Implement batch conflict detection.
  // This needs to check if any existing slot for the given batchId overlaps with newTimeSlot.
  // For now, it's always false (no conflict).
  return false;
}

/**
 * Checks for global faculty conflicts for a new slot.
 * A faculty member cannot teach two classes at the same time.
 * @param {string} facultyId - The ID of the faculty member.
 * @param {string} newTimeSlot - The time slot for the new class.
 * @param {Array<ScheduledSlot>} currentSchedule - The current schedule of all slots.
 * @returns {boolean} - True if there is a conflict, false otherwise.
 */
function isFacultyConflict(facultyId, newTimeSlot, currentSchedule) {
  // TODO: Implement faculty conflict detection.
  // This needs to check if the facultyId is already assigned to newTimeSlot in currentSchedule.
  // For now, it's always false (no conflict).
  return false;
}

/**
 * Checks for global room conflicts for a new slot.
 * A room cannot be used for two classes at the same time.
 * @param {string} roomId - The ID of the room.
 * @param {string} newTimeSlot - The time slot for the new class.
 * @param {Array<ScheduledSlot>} currentSchedule - The current schedule of all slots.
 * @returns {boolean} - True if there is a conflict, false otherwise.
 */
function isRoomConflict(roomId, newTimeSlot, currentSchedule) {
  // TODO: Implement room conflict detection.
  // This needs to check if the roomId is already assigned to newTimeSlot in currentSchedule.
  // For now, it's always false (no conflict).
  return false;
}

module.exports = {
  isValidTimeSlot,
  isFacultyAvailable,
  isRoomAvailable,
  canFacultyTeachSubject,
  isBatchConflict,
  isFacultyConflict,
  isRoomConflict,
};