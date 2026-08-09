import {defineCollection, z} from 'astro:content';
import {glob} from 'astro/loaders';

const blog = defineCollection({
  loader: glob({base: './src/content/blog', pattern: '**/*.md'}),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    /** Short label above the title, e.g. "Retention". */
    category: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string().default('Compound Growth Studio'),
    /** Hide from the index and sitemap without deleting the file. */
    draft: z.boolean().default(false),
  }),
});

export const collections = {blog};
