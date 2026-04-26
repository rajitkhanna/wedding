// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    invitees: i.entity({
      name: i.string(),
      sortOrder: i.number(),
    }),
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $streams: i.entity({
      abortReason: i.string().optional(),
      clientId: i.string().unique().indexed(),
      done: i.boolean().optional(),
      size: i.number().optional(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    guests: i.entity({
      code: i.string().unique().indexed().optional(),
      contactEmail: i.string().optional(),
      email: i.string().unique().indexed(),
      name: i.string(),
      rsvpStatus: i.string().optional(),
      rsvpSubmittedAt: i.number().optional(),
    }),
    scheduleEvents: i.entity({
      day: i.string(),
      description: i.string().optional(),
      endTime: i.string().optional(),
      location: i.string().optional(),
      locationUrl: i.string().optional(),
      sortOrder: i.number(),
      startTime: i.string(),
      title: i.string(),
    }),
  },
  links: {
    $streams$files: {
      forward: {
        on: "$streams",
        has: "many",
        label: "$files",
      },
      reverse: {
        on: "$files",
        has: "one",
        label: "$stream",
        onDelete: "cascade",
      },
    },
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    guestInvitees: {
      forward: {
        on: "guests",
        has: "many",
        label: "invitees",
      },
      reverse: {
        on: "invitees",
        has: "one",
        label: "guest",
        onDelete: "cascade",
      },
    },
    guestEvents: {
      forward: {
        on: "guests",
        has: "many",
        label: "invitedEvents",
      },
      reverse: {
        on: "scheduleEvents",
        has: "many",
        label: "invitedGuests",
      },
    },
    inviteeAttendance: {
      forward: {
        on: "invitees",
        has: "many",
        label: "attendingEvents",
      },
      reverse: {
        on: "scheduleEvents",
        has: "many",
        label: "attendingInvitees",
      },
    },
  },
  rooms: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
