// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    invitees: i.entity({
      name: i.string(),
      sortOrder: i.number(),
      meal: i.string().optional(),
      dietary: i.string().optional(),
      attendingEventIds: i.string().optional(),
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
      email: i.string().unique().indexed(),
      name: i.string(),
      rsvpStatus: i.string().optional(),
      rsvpSubmittedAt: i.number().optional(),
      scheduleGroup: i.string(),
    }),
    groups: i.entity({
      code: i.string().unique().indexed().optional(),
      name: i.string(),
    }),
    scheduleEvents: i.entity({
      day: i.string(),
      description: i.string().optional(),
      endTime: i.string().optional(),
      group: i.string(),
      location: i.string().optional(),
      locationUrl: i.string().optional(),
      sortOrder: i.number(),
      startTime: i.string(),
      title: i.string(),
    }),
    siteConfig: i.entity({
      key: i.string().unique().indexed(),
      value: i.string(),
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
    groupMembers: {
      forward: {
        on: "guests",
        has: "one",
        label: "group",
      },
      reverse: {
        on: "groups",
        has: "many",
        label: "members",
      },
    },
    groupEvents: {
      forward: {
        on: "scheduleEvents",
        has: "one",
        label: "eventGroup",
      },
      reverse: {
        on: "groups",
        has: "many",
        label: "scheduleEvents",
      },
    },
  },
  rooms: {
    "wedding-visitors": {
      presence: i.entity({
        joinedAt: i.number(),
        page: i.string().optional(),
      }),
    },
  },
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
