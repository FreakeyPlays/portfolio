import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { config } from 'cms';
import { getPayload } from 'payload';

export const server = {
  addPost: defineAction({
    input: z.object({
      title: z.string(),
    }),
    accept: 'json',
    handler: async (input) => {
      const payload = await getPayload({ config });
      return payload.create({ collection: 'posts', data: input });
    },
  }),
  deletePost: defineAction({
    input: z.object({
      id: z.string(),
    }),
    accept: 'json',
    handler: async (input) => {
      const payload = await getPayload({ config });
      return payload.delete({ collection: 'posts', id: input.id });
    },
  }),
};
