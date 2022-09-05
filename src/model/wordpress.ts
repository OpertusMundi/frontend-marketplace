interface Post {
  id: number,
  date: string,
  title: {
    rendered: string,
  },
  content: {
    rendered: string,
    [otherProperties: string]: unknown,
  },
  acf: {
    image: {
      url: string,
      [otherProperties: string]: unknown,
    },
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