// hard/src/models.js

/**
 * Represents a Subject in the timetable system.
 */
class Subject {
  /**
   * @param {string} id - Unique subject ID (e.g., "CS301").
   * @param {string} name - Subject name (e.g., "Data Structures").
   * @param {string} type - Type of subject ('theory', 'lab', 'elective').
   * @param {number} credits - Number of credits for the subject.
   * @param {number} weeklyHours - Total weekly contact hours for the subject.
   * @param {number} batchSize - Number of students in a batch for this subject (relevant for labs).
   * @param {Array<string>} facultyPreferences - List of preferred faculty IDs for this subject.
   */
  constructor(id, name, type, credits, weeklyHours, batchSize = 0, facultyPreferences = []) {
    this.id = id;
    this.name = name;
    this.type = type; // 'theory', 'lab', 'elective'
    this.credits = credits;
    this.weeklyHours = weeklyHours;
    this.batchSize = batchSize; // For labs, indicates how many students can be in one lab slot
    this.facultyPreferences = facultyPreferences;
  }

  static fromObject(data) {
    return new Subject(
      data.id,
      data.name,
      data.type,
      data.credits,
      data.weeklyHours,
      data.batchSize,
      data.facultyPreferences
    );
  }
}

/**
 * Represents a Faculty member in the timetable system.
 */
class Faculty {
  /**
   * @param {string} id - Unique faculty ID (e.g., "F001").
   * @param {string} name - Faculty member's name.
   * @param {Array<string>} expertise - List of subject IDs this faculty can teach.
   * @param {number} maxWeeklyHours - Maximum hours this faculty can teach per week.
   * @param {Array<string>} availability - Array of available time slots (e.g., ["MON_0900_1000", "TUE_1000_1100"]).
   */
  constructor(id, name, expertise, maxWeeklyHours, availability = []) {
    this.id = id;
    this.name = name;
    this.expertise = expertise;
    this.maxWeeklyHours = maxWeeklyHours;
    this.availability = availability;
  }

  static fromObject(data) {
    return new Faculty(
      data.id,
      data.name,
      data.expertise,
      data.maxWeeklyHours,
      data.availability
    );
  }
}

/**
 * Represents a Room in the timetable system.
 */
class Room {
  /**
   * @param {string} id - Unique room ID (e.g., "CR101", "LAB01").
   * @param {string} name - Room name (e.g., "Classroom 101").
   * @param {string} type - Type of room ('classroom', 'lab').
   * @param {number} capacity - Seating capacity of the room.
   * @param {Array<string>} availability - Array of available time slots.
   */
  constructor(id, name, type, capacity, availability = []) {
    this.id = id;
    this.name = name;
    this.type = type; // 'classroom', 'lab'
    this.capacity = capacity;
    this.availability = availability;
  }

  static fromObject(data) {
    return new Room(
      data.id,
      data.name,
      data.type,
      data.capacity,
      data.availability
    );
  }
}

/**
 * Represents a scheduled slot in the timetable.
 */
class ScheduledSlot {
  /**
   * @param {string} subjectId - ID of the scheduled subject.
   * @param {string} facultyId - ID of the assigned faculty.
   * @param {string} roomId - ID of the assigned room.
   * @param {string} timeSlot - Time slot string (e.g., "MON_0900_1000").
   * @param {string} batchId - ID of the batch for this slot (e.g., "B1", "B2").
   */
  constructor(subjectId, facultyId, roomId, timeSlot, batchId = null) {
    this.subjectId = subjectId;
    this.facultyId = facultyId;
    this.roomId = roomId;
    this.timeSlot = timeSlot;
    this.batchId = batchId;
  }

  static fromObject(data) {
    return new ScheduledSlot(
      data.subjectId,
      data.facultyId,
      data.roomId,
      data.timeSlot,
      data.batchId
    );
  }
}

module.exports = {
  Subject,
  Faculty,
  Room,
  ScheduledSlot
};