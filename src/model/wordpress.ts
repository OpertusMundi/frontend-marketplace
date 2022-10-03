interface Post {
  id: number,
  slug: string,
  date: string,
  title: {
    rendered: string,
  },
  content: {
    rendered: string,
    [otherProperties: string]: unknown,
  },
  categories: number[],
  acf: {
    image: {
      url: string,
      [otherProperties: string]: unknown,
    },
    cta_button_label: string,
    cta_button_url: string,
    category: number[],
    [otherProperties: string]: unknown,
  }
  _embedded: {
    author: {
      id: number,
      name: string,
      [otherProperties: string]: unknown,
    }[],
    [otherProperties: string]: unknown,
  },
  [otherProperties: string]: unknown,
}

interface Category {
  id: number,
  name: string,
  slug: string,
  [otherProperties: string]: unknown,
}

export { Post, Category };
