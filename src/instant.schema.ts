// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
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
      attendingEventIds: i.string().optional(),
      dietaryRestrictions: i.string().optional(),
      email: i.string().unique().indexed(),
      mealPreference: i.string().optional(),
      name: i.string(),
      partyMembers: i.string().optional(),
      partySize: i.number().optional(),
      rsvpStatus: i.string().optional(),
      rsvpSubmittedAt: i.number().optional(),
      scheduleGroup: i.string(),
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
