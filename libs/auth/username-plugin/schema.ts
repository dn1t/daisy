import type { BetterAuthPluginDBSchema } from "better-auth/db";

export const getSchema = (normalizer: { username: (username: string) => string }) => {
  return {
    user: {
      fields: {
        username: {
          type: "string",
          required: false,
          sortable: true,
          unique: true,
          returned: true,
          transform: {
            input(value) {
              return typeof value !== "string" ? value : normalizer.username(value as string);
            },
          },
        },
      },
    },
  } satisfies BetterAuthPluginDBSchema;
};

export type UsernameSchema = ReturnType<typeof getSchema>;
