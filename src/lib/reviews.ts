/**
 * Google reviews shown on the reviews wall.
 *
 * IMPORTANT: `placeholder: true` entries exist only so the section can be
 * designed and reviewed. They are never emitted as Review structured data,
 * because marking up invented reviews is a Google policy violation and can get
 * a business's rich results suppressed. Replace them with the real review text
 * and first names, set `placeholder` to false, and fill in `aggregate` from the
 * live Google listing. Only then does the schema switch on.
 */

export type Review = {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  /** ISO date, used for the datePublished field. */
  date?: string;
  placeholder?: boolean;
};

export const aggregate: { rating: number; count: number } | null = null;

export const reviews: Review[] = [
  {
    author: "Placeholder",
    rating: 5,
    body: "Waiting on the real Google reviews. Paste six to ten here with the reviewer's first name and star rating, then flip placeholder to false.",
    placeholder: true,
  },
  {
    author: "Placeholder",
    rating: 5,
    body: "This card shows how a medium length review sits in the layout, so the spacing can be judged before the real text lands.",
    placeholder: true,
  },
  {
    author: "Placeholder",
    rating: 5,
    body: "A short one.",
    placeholder: true,
  },
  {
    author: "Placeholder",
    rating: 5,
    body: "And a long one, to prove the card grows without breaking the grid or pushing the sticker rotation off its baseline when somebody writes a genuine paragraph about the elote chorreado.",
    placeholder: true,
  },
  {
    author: "Placeholder",
    rating: 5,
    body: "Another medium length review to fill out the masonry and keep the columns balanced on desktop.",
    placeholder: true,
  },
  {
    author: "Placeholder",
    rating: 5,
    body: "One more so the wall reads as a wall rather than a row.",
    placeholder: true,
  },
];

export const hasRealReviews = reviews.some((r) => !r.placeholder);
