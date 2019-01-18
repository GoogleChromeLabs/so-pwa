/// <reference lib="webworker"/>

interface Answer {
  body: string,
  link: string,
  score: number,
  creation_date: number,
  owner: Owner,
}

interface Owner {
  display_name: string,
  link: string,
  profile_image: string,
}

interface Question {
  answers: Array<Answer>,
  body: string,
  creation_date: number,
  link: string,
  owner: Owner,
  question_id: string,
  title: string,
}

let workbox: any;
