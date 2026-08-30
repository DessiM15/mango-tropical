/**
 * Real Google reviews, transcribed as given.
 *
 * No star ratings are recorded because none were supplied, and inventing them
 * would mean publishing fabricated `Review` structured data, which is a Google
 * policy violation that gets rich results suppressed for the whole site. The
 * wall therefore shows the words and the attribution, and the markup carries
 * `reviewBody` and `author` without a `reviewRating`. That is valid schema; it
 * just cannot produce a star snippet until the numbers arrive.
 *
 * To switch the full markup on: fill in each review's `rating`, and set
 * `aggregate` from the live listing's average and total.
 */

export type Review = {
  author: string;
  body: string;
  /** Google's relative timestamp, kept as given rather than guessed at. */
  when: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  /** True where Google translated the review into English from the original. */
  translated?: boolean;
};

/** Set from the live Google listing. Until then the badge stays hidden. */
export const aggregate: { rating: number; count: number } | null = null;

export const reviews: Review[] = [
  {
    author: "Ashley Castillo",
    when: "a month ago",
    body: "100/10 first time coming here. I work across the street, once it opened I knew I had to come try it. I got the elote en vaso, it was so delicious, and the mangonada tropical, omg 1000/10 my favorite! Customer service was amazing. I definitely recommend this place!",
  },
  {
    author: "Honest Abe",
    when: "a month ago",
    body: "Wow! We got the mangonadas. Super fresh! Super delicious! Super polite staff! Ana and her teammates will definitely have my wife and I returning. See you soon, Mango Tropical!",
  },
  {
    author: "Hyunie Kang",
    when: "a month ago",
    body: "Mango ice cream was so good and so fresh tasting! A really great refreshing treat for a warm summer night. The elote was really good too.",
  },
  {
    author: "Andrea Teran",
    when: "a month ago",
    body: "Me and my sister came in for a quick snack and we really loved everything we ordered: the salchipapas, helado de guayaba, and the drinks. Overall the owner was very welcoming and kind, and they even give samples for the ice cream!",
  },
  {
    author: "Cristina Madrigal",
    when: "a month ago",
    body: "Hands down the best snack spot in town! The staff is incredibly welcoming, and the menu offers a fantastic variety of fresh, high-quality treats. I tried the mangonada, loaded nachos, elote and Jamaica.",
  },
  {
    author: "Jessica Rocha",
    when: "a week ago",
    body: "I was so excited that there's a place like this so close to home! The service was AMAZING and the food and drinks were so yummy! Fruit was very fresh.",
  },
  {
    author: "Julio Salazar Murphy",
    when: "a month ago",
    body: "Good service and the best garrafas I have tasted. Location is clean, and the vibe is great.",
  },
  {
    author: "Bridget Jones",
    when: "4 weeks ago",
    body: "Great variety of snacks to choose from! The staff was kind, welcoming, and helpful. The place was also super clean and well-maintained. I ate the fruit and it was fresh! Overall, a great experience and I'll definitely be coming back!",
  },
  {
    author: "Catalina Gomez",
    when: "3 weeks ago",
    body: "Their agua mineral preparada is soooo good! They got everything out to us really fast, elote was perfect!",
  },
  {
    author: "Enrique Lara",
    when: "a week ago",
    translated: true,
    body: "On such a hot summer day, nothing beats a delicious ice cream, a shaved ice, or a popsicle here at Mango Tropical. Everything is made with all-natural ingredients. It was our first time visiting, and it was incredibly refreshing. The service was top-notch, and we highly recommend it.",
  },
  {
    author: "Marlen Rodriguez",
    when: "a month ago",
    translated: true,
    body: "A great place to come and enjoy with the whole family! They have a wide variety of snacks, and you can sit inside or outside. Very accessible and welcoming place.",
  },
  {
    author: "Karen",
    when: "2 weeks ago",
    body: "This place is great! Amazing atmosphere, super friendly and welcoming staff, and food was delicious. The variety in their menu is great and I will definitely be coming back to try more!",
  },
];

export const hasRatings = reviews.every((review) => review.rating !== undefined);
