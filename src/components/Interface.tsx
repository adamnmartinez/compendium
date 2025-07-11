class Book {
  title: string;
  author: string;
  publishedYear: number;
  pages: number;
  edition: string;
  notes: Note[];
  uuid: string;
  constructor(
    title: string,
    author: string,
    publishedYear: number,
    pages: number,
    edition: string,
    uuid: string,
  ) {
    this.title = title;
    this.author = author;
    this.publishedYear = publishedYear;
    this.pages = pages;
    this.edition = edition;
    this.notes = [];
    this.uuid = uuid;
  }
} // Book Class Definition

class Note {
  title: string;
  content: string;
  quote: string;
  chapter: string;
  page: number;
  speaker: string;
  uuid: string;
  constructor(
    title: string,
    content: string,
    quote: string,
    chapter: string,
    page: number,
    speaker: string,
    uuid: string,
  ) {
    this.title = title;
    this.content = content;
    this.quote = quote;
    this.chapter = chapter;
    this.page = page;
    this.speaker = speaker;
    this.uuid = uuid;
  }
} // Note Class Definition

export { Book, Note }