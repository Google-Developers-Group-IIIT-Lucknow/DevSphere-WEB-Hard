// hard/src/scheduler.js

/**
 * Timetable scheduling logic.
 * This module is partially implemented and contains logical gaps.
 * Students need to complete the implementation and fix bugs.
 */

const {
  Subject,
  Faculty,
  Room,
  ScheduledSlot
} = require('./models');

const {
  isValidTimeSlot,
  canFacultyTeachSubject,
  isBatchConflict,
  isFacultyConflict,
  isRoomConflict,
} = require('./validator');

/**
 * Generates all possible time slots for a week.
 * MON-FRI, 08:00-17:00, 1-hour slots.
 */
function generateWeeklyTimeSlots() {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  const slots = [];

  for (const day of days) {
    for (let hour = 8; hour < 17; hour++) {
      const start = String(hour).padStart(2, '0') + '00';
      const end = String(hour + 1).padStart(2, '0') + '00';
      slots.push(`${day}_${start}_${end}`);
    }
  }

  return slots;
}

const ALL_TIME_SLOTS = generateWeeklyTimeSlots();

/**
 * Attempts to find a suitable slot for a given subject.
 * Implements a first-fit scheduling algorithm.
 */
function findSlotForSubject(subject, faculties, rooms, currentSchedule, batchId = null) {

  for (const timeSlot of ALL_TIME_SLOTS) {

    if (!isValidTimeSlot(timeSlot)) continue;

    if (batchId && isBatchConflict(batchId, timeSlot, currentSchedule)) continue;

    // NOTE:
    // Availability is intentionally NOT enforced here to avoid deadlock with limited data.
    // Students may choose to reintroduce availability with better logic.

    const eligibleFaculties = faculties.filter(
      (f) =>
        canFacultyTeachSubject(f, subject) &&
        !isFacultyConflict(f.id, timeSlot, currentSchedule)
    );

    for (const faculty of eligibleFaculties) {

      const eligibleRooms = rooms.filter(
        (r) =>
          r.type === (subject.type === 'lab' ? 'lab' : 'classroom') &&
          r.capacity >= Math.max(subject.batchSize, 1) &&
          !isRoomConflict(r.id, timeSlot, currentSchedule)
      );

      /**
       * TODO:
       * Improve room selection strategy.
       * Currently first-fit — may cause poor distribution.
       */

      if (eligibleRooms.length > 0) {
        const room = eligibleRooms[0];

        return new ScheduledSlot(
          subject.id,
          faculty.id,
          room.id,
          timeSlot,
          batchId
        );
      }
    }
  }

  return null;
}

/**
 * Schedules all subjects.
 */
function scheduleTimetable(subjects, faculties, rooms, batches) {

  const schedule = [];

  const remainingSubjects = [...subjects];

  // Prioritize labs and heavy subjects
  remainingSubjects.sort((a, b) => {
    if (a.type === 'lab' && b.type !== 'lab') return -1;
    if (a.type !== 'lab' && b.type === 'lab') return 1;
    return b.weeklyHours - a.weeklyHours;
  });

  for (const subject of remainingSubjects) {

    let hoursScheduled = 0;

    while (hoursScheduled < subject.weeklyHours) {

      let slotFound = false;

      if (subject.type === 'lab') {

        // TODO:
        // Implement proper lab scheduling:
        // - Labs require 2 consecutive slots
        // - Both slots must be free (faculty + room)
        // - Should not cross lunch break (optional)
        // Currently only 1 slot is assigned → BUG

        for (const batch of batches) {

          const slot = findSlotForSubject(
            subject,
            faculties,
            rooms,
            schedule,
            batch // correct for labs
          );

          if (slot) {
            schedule.push(slot);

            // BUG:
            // Lab should count as 2 hours, but only 1 is counted here.
            hoursScheduled++;

            slotFound = true;
            break;
          }
        }

      } else {

        // FIXED: batchId must NOT be null to avoid conflicts
        const slot = findSlotForSubject(
          subject,
          faculties,
          rooms,
          schedule,
          subject.id // ensures no null batch conflict
        );

        if (slot) {
          schedule.push(slot);
          hoursScheduled++;
          slotFound = true;
        }
      }

      if (!slotFound && hoursScheduled < subject.weeklyHours) {
        console.warn(
          `Could not schedule all hours for subject ${subject.name}. Remaining: ${subject.weeklyHours - hoursScheduled}`
        );
        break;
      }
    }
  }

  return schedule;
}

/**
 * Generates summary of timetable.
 */
function generateScheduleSummary(schedule, subjects, faculties, rooms) {

  // TODO:
  // Implement full summary:
  // - faculty load
  // - room utilization
  // - unscheduled subjects

  return {
    totalSlots: schedule.length, // required for tests
    facultyLoad: {},
    roomUtilization: {},
    unscheduledSubjects: [],
    conflicts: []
  };
}

module.exports = {
  generateWeeklyTimeSlots,
  findSlotForSubject,
  scheduleTimetable,
  generateScheduleSummary,
};