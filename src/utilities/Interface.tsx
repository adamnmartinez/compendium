class Book {
  title: string;
  author: string;
  publishedYear: number;
  pages: number;
  edition: string;
  publisher: string;
  container: string;
  volume: number;
  number: number;
  notes: Note[];
  uuid: string;
  url: string;
  favorite: boolean;
  constructor(
    title: string,
    author: string,
    publishedYear: number,
    pages: number,
    uuid: string,
    edition?: string,
    publisher?: string,
    container?: string,
    volume?: number,
    number?: number, 
    url?: string
  ) {
    this.title = title;
    this.author = author;
    this.publishedYear = publishedYear;
    this.pages = pages;
    this.uuid = uuid;

    this.edition = edition || ""
    this.publisher = publisher || ""
    this.container = container || ""
    this.volume = volume || 0
    this.number = number || 0
    this.url = url || ""

    this.notes = [];
    this.favorite = false;
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