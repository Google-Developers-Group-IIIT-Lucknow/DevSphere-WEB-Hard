# 🔴 Hard: TimetableForge (Full System Implementation)

## Challenge Overview

This is the ultimate challenge: a full system design and implementation problem for a university timetable generation system. You will be working with an existing codebase that has complete data models but incomplete and buggy logic across its `validator`, `scheduler`, and `engine` modules.

Your task is to bring this system to life by implementing core functionalities, fixing logical gaps, and ensuring all complex scheduling rules and edge cases are handled correctly. This challenge demands structured thinking, careful algorithm design, and meticulous attention to detail.

## Problem Description

The TimetableForge system aims to generate an optimal weekly timetable for subjects, faculty, and rooms, considering various constraints.

### Code State:

*   **`src/models.js`**: **Complete**. Defines `Subject`, `Faculty`, `Room`, and `ScheduledSlot` data structures. You should understand these models thoroughly.
*   **`src/validator.js`**: **Incomplete**. Contains placeholder functions and needs core validation logic implemented.
*   **`src/scheduler.js`**: **Partially Implemented + Tricky Logical Gaps**. Contains the main scheduling algorithm but has missing logic for complex rules and subtle bugs.
*   **`src/engine.js`**: **Mostly Empty**. This is the orchestration layer that ties everything together. You will need to implement the main `generateTimetable` function.

### Core Requirements to Implement:

1.  **Slot Validation (`validator.js`):**
    *   Implement robust `isValidTimeSlot` to check format (e.g., `MON_0900_1000`), valid days (MON-FRI), and valid hours (08:00-17:00, 1-hour slots).
    *   Enhance `isFacultyAvailable` and `isRoomAvailable` to consider already scheduled slots, not just their static availability.
    *   Implement `isBatchConflict`, `isFacultyConflict`, and `isRoomConflict` to detect overlaps in the `currentSchedule`.

2.  **Lab Slot Rules (`scheduler.js`):**
    *   Lab subjects (`type: 'lab'`) require **2 consecutive hours**.
    *   A lab slot cannot cross the lunch break (13:00-14:00). For example, a lab cannot be scheduled from `1200_1300` to `1300_1400`.
    *   Each batch must have its lab scheduled separately.

3.  **Conflict Detection (`scheduler.js` and `engine.js`):**
    *   **Batch Conflicts:** A single batch cannot have two classes at the same time.
    *   **Faculty Conflicts (Global):** A faculty member cannot be assigned to two different classes at the same time.
    *   **Room Conflicts:** A room cannot be used for two different classes at the same time.
    *   **Elective Edge Cases:** Elective subjects (`type: 'elective'`) *can* overlap with other electives for different students/batches, but *not* if they use the same room or faculty.

4.  **Scheduling Algorithm (`scheduler.js`):**
    *   Implement a **first-fit scheduling algorithm**: Iterate through time slots from Monday to Friday, 08:00 to 17:00, and assign the first available valid slot.
    *   Consider subject priorities (e.g., labs might be harder to schedule).

5.  **Summary Generation (`scheduler.js`):**
    *   Implement `generateScheduleSummary` to provide insights into the generated timetable, including:
        *   Total scheduled hours per faculty.
        *   Total scheduled hours per room.
        *   List of unscheduled subjects/hours (if any).
        *   Report any conflicts detected *after* scheduling (as a final check).

## How to Run

1.  Navigate to the `hard` directory:
    ```bash
    cd hard
    ```
2.  Run the visible tests:
    ```bash
    node tests/visible.test.js
    ```
    These tests are designed to fail initially. Your goal is to modify `hard/src/**/*.js` files until all tests pass.

3.  (Optional) Run the `runner.js` to generate and view a timetable:
    ```bash
    node runner.js
    ```
    This script will call your `generateTimetable` function and print the resulting schedule and summary. Use this to observe the output of your implemented logic.

## Complexity Expectations

*   This challenge involves multiple nested loops and conditional logic to handle various constraints.
*   You will need to carefully layer rules and ensure that edge cases are correctly managed.
*   Structured thinking and a systematic approach to problem-solving are crucial.

**Remember:** This is a full system implementation. You are expected to complete the missing parts and fix all logical flaws to produce a robust timetable generator.

**Good luck, and may your algorithms be efficient and conflict-free!**
