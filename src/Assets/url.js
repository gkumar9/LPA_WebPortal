let Base_url;
console.log(process.env.REACT_APP_API_ENDPOINT);

if (process.env.REACT_APP_API_ENDPOINT === "prod") {
  Base_url = "/";
} else {
  Base_url = "http://api.frogbit.co/cd";
}

let URL = {
  fetchSubject: Base_url + "/api/subjects/",
  fetchChapter: Base_url + "/api/subject/sections/",
  fetchTopic: Base_url + "/api/subject/topics/",
  fetchSubTopic: Base_url + "/api/subject/subtopics/",
  createQuestion: Base_url + "/api/create/a/question/",
  createQuestionNewVersion: Base_url + "/api/add/new/question/version",
  searchquestion: Base_url + "/api/question/list/",
  searchexam: Base_url + "/api/test/list/",
  fetchExam: Base_url + "/api/exams/",
  fetchSubjectForExam: Base_url + "/api/exam/subject/mapping/",
  addnewExam: Base_url + "/api/add/new/test",
  geteditques: Base_url + "/api/question/content/",
  updateExistingQuestionVersion:
    Base_url + "/api/update/existing/question/version",
  getexamcontent: Base_url + "/api/test/content/",
  updatetest: Base_url + "/api/update/test",
  tagsearch: Base_url + "/api/tag/search/",
  authorlist: Base_url + "/api/authors",
  userlist: Base_url + "/api/users",
  reviewTest: Base_url + "/api/review/test/",
};
export default URL;
