import React, { Component } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import Header from "../Header/index";
import LeftPanelexam from "./leftpanelexam.js";
import axios from "axios";
import URL from "../../Assets/url";
import RightExamPanel from "./rightpanelexam.js";
import swal from "sweetalert";

class Exam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfExam: [],
      selectedExamID: "",
      listOfSubject: [],
      selectedSubjectID: "",
      listOfChapter: [],
      selectedChapterID: "",
      listOfType: ["Free", "Weekly", "Practise test", "Previous year paper"],
      selectedType: "Free",
      selectedTypeYear: "",
      hour: "",
      minute: "",
      startDate: new Date(),
      endDate: new Date(),
      testnameEnglish: "",
      testnameHindi: "",
      testInstructionEnglish: "",
      testInstructionHindi: "",
      listOfSection: [
        {
          marksPerQuestion: 0,
          negativeMarksPerQuestion: 0,
          questions: [],

          versions: [
            {
              content: "",
              language: "ENGLISH",
              name: "",
              sectionName: ""
            },
            {
              content: "",
              language: "HINDI",
              name: "",
              sectionName: ""
            }
          ]
        }
      ]
    };
    this.myReftestdescEnglish = React.createRef();
    this.myReftestdescHindi = React.createRef();
    this.refsSectionEnglish = [];
    this.refsSectionHindi = [];
    window.Exam = this;
  }
  addSectionQuestions = index => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].questions.push("");
    this.setState({ listOfSection: tempsectionlist });
  };
  deleteSectionQuestion = (index, indexquestion) => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].questions.splice(indexquestion, 1);
    this.setState({ listOfSection: tempsectionlist });
  };
  handlSectionQuestionValueChange = (index, indexquestion, e) => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].questions[indexquestion] = parseInt(e.target.value);
    this.setState({ listOfSection: tempsectionlist });
  };
  handleSectionDescriptionChange = (index, language, data) => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].versions.filter(
      item => item.language === language
    )[0].content = data;

    this.setState({ listOfSection: tempsectionlist });
  };
  handleNegativeMarksPerQuesChange = (index, e) => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].negativeMarksPerQuestion = e.target.value
      ? parseInt(e.target.value)
      : 0;
    this.setState({ listOfSection: tempsectionlist });
  };
  handleMarksperQuesChange = (index, e) => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].marksPerQuestion = e.target.value
      ? parseInt(e.target.value)
      : 0;
    this.setState({ listOfSection: tempsectionlist });
  };
  addSection = () => {
    // console.log('add section');
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist.push({
      marksPerQuestion: 0,
      negativeMarksPerQuestion: 0,
      questions: [],

      versions: [
        {
          content: "",
          language: "ENGLISH",
          name: "",
          sectionName: ""
        },
        {
          content: "",
          language: "HINDI",
          name: "",
          sectionName: ""
        }
      ]
    });
    this.setState({ listOfSection: tempsectionlist });
  };
  deleteSection = index => {
    let tempsections = this.state.listOfSection.map((item, index) => {
      return {
        marksPerQuestion: item.marksPerQuestion,
        negativeMarksPerQuestion: item.negativeMarksPerQuestion,
        questions: item.questions,
        versions: [
          {
            content: this.refsSectionEnglish[index].editor.getData(),
            language: "ENGLISH",
            name: item.versions[0].name,
            sectionName: item.versions[0].sectionName
          },
          {
            content: this.refsSectionHindi[index].editor.getData(),
            language: "HINDI",
            name: item.versions[1].name,
            sectionName: item.versions[1].sectionName
          }
        ]
      };
    });
    let tempsectionlist = tempsections;
    this.refsSectionEnglish.splice(index, 1);
    this.refsSectionHindi.splice(index, 1);
    tempsectionlist.splice(index, 1);
    this.setState({ listOfSection: tempsectionlist });
  };
  handleSectionnameChange = (index, language, e) => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].versions.filter(
      item => item.language === language
    )[0].name = e.target.value;
    this.setState({ listOfSection: tempsectionlist });
  };
  handleEnglishTestNameChange = e => {
    this.setState({ testnameEnglish: e.target.value });
  };
  handleHindiTestNameChange = e => {
    this.setState({ testnameHindi: e.target.value });
  };
  handleEnglishInstructionChange = data => {
    this.setState({ testInstructionEnglish: data });
  };
  handleHindiInstructionChange = data => {
    this.setState({ testInstructionHindi: data });
  };
  onHourChange = e => {
    this.setState({ hour: e.target.value });
  };

  onMinuteChange = e => {
    this.setState({ minute: e.target.value });
  };
  handleStartDateChange = date => {
    this.setState({
      startDate: date
    });
  };
  handleEndDateChange = date => {
    this.setState({
      endDate: date
    });
  };
  handleTypeYearChange = e => {
    this.setState({ selectedTypeYear: e.target.value });
  };
  componentDidMount() {
    axios({
      method: "POST",
      url: URL.fetchExam + "ENGLISH",
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        // console.log(res.data.data);
        if (res.status === 200) {
          this.setState(
            {
              listOfExam: res.data.data.list,
              selectedExamID:
                res.data.data.list.length > 0
                  ? res.data.data.list[0].exam.examId
                  : ""
            },
            () => {
              this.callApiForSubject();
            }
          );
        } else {
          alert("Unexpected code");
        }
      })
      .catch(e => {
        console.log(e);
        swal(e, "error");
      });
  }
  callApiForSubject = () => {
    if (this.state.selectedExamID !== "") {
      axios({
        method: "POST",
        url: URL.fetchSubjectForExam + this.state.selectedExamID,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status === 200) {
            axios({
              method: "POST",
              url: URL.fetchSubject + "ENGLISH",
              data: { authToken: "string" },
              headers: {
                "Content-Type": "application/json"
              }
            }).then(response => {
              if (response.status === 200) {
                let tempsubjectlist = [];
                for (let i = 0; i < res.data.data.list.length; i++) {
                  for (let j = 0; j < response.data.data.list.length; j++) {
                    if (
                      response.data.data.list[j].subject.subjectId ===
                      res.data.data.list[i].subjectId
                    ) {
                      tempsubjectlist.push(response.data.data.list[j]);
                    }
                  }
                }
                // console.log(tempsubjectlist);
                this.setState(
                  {
                    listOfSubject: tempsubjectlist,
                    selectedSubjectID:
                      tempsubjectlist.length > 0
                        ? tempsubjectlist[0].subject.subjectId
                        : ""
                  },
                  () => {
                    this.callApiForChapter();
                  }
                );
              }
            });
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      console.log("(English)examid is blank. API not called. exam list");
      this.setState({
        listOfChapter: [],
        selectedChapterID: "",

        listOfSubject: [],
        selectedSubjectId: ""
      });
    }
  };
  callApiForChapter = () => {
    if (this.state.selectedSubjectID !== "") {
      axios({
        method: "POST",
        url: URL.fetchChapter + this.state.selectedSubjectID + "/ENGLISH",
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          if (res.status === 200) {
            this.setState(
              {
                listOfChapter: res.data.data.list,
                selectedChapterID:
                  res.data.data.list.length > 0
                    ? res.data.data.list[0].subjectSection.sectionId
                    : ""
              },
              () => {
                // this.callApiForTopic();
              }
            );
          } else {
            alert("Unexpected code");
          }
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      console.log(
        "(English)subjectid is blank. API not called. checksubject list"
      );
      this.setState({
        listOfChapter: [],
        selectedChapterID: ""
      });
    }
  };
  handleExamChange = e => {
    e.preventDefault();

    this.setState(
      {
        selectedExamID: this.state.listOfExam[e.target.options.selectedIndex]
          .exam.examId
      },
      () => {
        this.callApiForSubject();
      }
    );
  };
  handleSubjectChange = e => {
    e.preventDefault();

    this.setState(
      {
        selectedSubjectID: this.state.listOfSubject[
          e.target.options.selectedIndex
        ].subject.subjectId
      },
      () => {
        this.callApiForChapter();
      }
    );
  };
  handleChapterChange = e => {
    e.preventDefault();
    this.setState(
      {
        selectedChapterID: this.state.listOfChapter[
          e.target.options.selectedIndex
        ].subjectSection.sectionId
      },
      () => {}
    );
  };
  handleTypeChange = e => {
    e.preventDefault();
    this.setState({ selectedType: e.target.value }, () => {
      // this.componentDidMount();
    });
  };
  saveExamdata = () => {
    let testdescEnglish = this.myReftestdescEnglish.current;
    let testdescHindi = this.myReftestdescHindi.current;
    let tempsections = this.state.listOfSection.map((item, index) => {
      return {
        marksPerQuestion: item.marksPerQuestion,
        negativeMarksPerQuestion: item.negativeMarksPerQuestion,
        questions: item.questions,

        versions: [
          {
            content: this.refsSectionEnglish[index].editor.getData(),
            language: "ENGLISH",
            name: item.versions[0].name,
            sectionName: item.versions[0].sectionName
          },
          {
            content: this.refsSectionHindi[index].editor.getData(),
            language: "HINDI",
            name: item.versions[1].name,
            sectionName: item.versions[1].sectionName
          }
        ]
      };
    });
    var startDatetemp = this.state.startDate;

    var dd = startDatetemp.getDate();
    var mm = startDatetemp.getMonth() + 1; //January is 0!

    var yyyy = startDatetemp.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    var startDate = yyyy + "-" + mm + "-" + dd;
    var endDatetemp = this.state.endDate;

    var ddendDatetemp = endDatetemp.getDate();
    var mmendDatetemp = endDatetemp.getMonth() + 1; //January is 0!

    var yyyyendDatetemp = endDatetemp.getFullYear();
    if (ddendDatetemp < 10) {
      ddendDatetemp = "0" + ddendDatetemp;
    }
    if (mmendDatetemp < 10) {
      mmendDatetemp = "0" + mmendDatetemp;
    }
    var endDate = yyyyendDatetemp + "-" + mmendDatetemp + "-" + ddendDatetemp;
    axios({
      method: "POST",
      url: URL.addnewExam,
      data: {
        authToken: "string",
        endDate: endDate,
        examId: this.state.selectedExamID,
        subjectId: this.state.selectedSubjectID,
        sectionId: this.state.selectedChapterID,
        sections: tempsections,
        startDate: startDate,
        testInstructions: [
          {
            instructions: testdescEnglish.editor.getData(),
            language: "ENGLISH",
            name: this.state.testnameEnglish
          },
          {
            instructions: testdescHindi.editor.getData(),
            language: "HINDI",
            name: this.state.testnameHindi
          }
        ],
        time:
          parseFloat(this.state.hour) +
          parseFloat(Number(parseInt(this.state.minute) / 60))
            ? parseFloat(this.state.hour) +
              parseFloat(Number(parseInt(this.state.minute) / 60))
            : 0,
        type: this.state.selectedType,
        year: this.state.selectedTypeYear
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status === 200) {
          swal(
            "Success",
            `Added newTest, Id:${res.data.data.testId}`,
            "success"
          );
          this.setState({
            testnameEnglish: "",
            testnameHindi: "",
            testInstructionEnglish: "",
            testInstructionHindi: "",
            listOfSection: [
              {
                marksPerQuestion: 0,
                negativeMarksPerQuestion: 0,
                questions: [],

                versions: [
                  {
                    content: "",
                    language: "ENGLISH",
                    name: "",
                    sectionName: ""
                  },
                  {
                    content: "",
                    language: "HINDI",
                    name: "",
                    sectionName: ""
                  }
                ]
              }
            ]
          });
        }
      })
      .catch(e => {
        console.log(e);
        swal("error");
      });
  };
  render() {
    return (
      <React.Fragment>
        <Header props={this.props} />
        <Container
          fluid
          style={{
            width: "auto",
            background: "#EEEEEE",
            padding: "0"
          }}
        >
          <div>
            <Row noGutters={true}>
              <Col
                lg="3"
                style={{
                  padding: "2.5em 3em",
                  background: "#EEE",
                  boxShadow: "rgba(0, 0, 0, 0.75) 2px 0px 4px -4px",
                  zIndex: "88",
                  position: "relative"
                }}
              >
                <div>
                  <LeftPanelexam
                    startDate={this.state.startDate}
                    endDate={this.state.endDate}
                    handleEndDateChange={this.handleEndDateChange}
                    handleStartDateChange={this.handleStartDateChange}
                    hour={this.state.hour}
                    minute={this.state.minute}
                    onHourChange={this.onHourChange}
                    onMinuteChange={this.onMinuteChange}
                    listOfSubject={this.state.listOfSubject}
                    listOfChapter={this.state.listOfChapter}
                    listOfExam={this.state.listOfExam}
                    handleSubjectChange={this.handleSubjectChange}
                    handleChapterChange={this.handleChapterChange}
                    handleExamChange={this.handleExamChange}
                    selectedSubjectID={this.state.selectedSubjectID}
                    selectedChapterID={this.state.selectedChapterID}
                    selectedExamID={this.state.selectedExamID}
                    listOfType={this.state.listOfType}
                    selectedType={this.state.selectedType}
                    handleTypeChange={this.handleTypeChange}
                    handleTypeYearChange={this.handleTypeYearChange}
                    selectedTypeYear={this.state.selectedTypeYear}
                  />
                </div>
              </Col>
              {/* <Col lg="1"></Col> */}
              <Col style={{ background: "#EEEEEE", padding: "0em 4em" }}>
                <div style={{ margin: "2.5em 0em" }}>
                  <RightExamPanel
                    testnameEnglish={this.state.testnameEnglish}
                    testnameHindi={this.state.testnameHindi}
                    testInstructionEnglish={this.state.testInstructionEnglish}
                    testInstructionHindi={this.state.testInstructionHindi}
                    handleHindiInstructionChange={
                      this.handleHindiInstructionChange
                    }
                    handleEnglishInstructionChange={
                      this.handleEnglishInstructionChange
                    }
                    handleHindiTestNameChange={this.handleHindiTestNameChange}
                    handleEnglishTestNameChange={
                      this.handleEnglishTestNameChange
                    }
                    listOfSection={this.state.listOfSection}
                    deleteSection={this.deleteSection}
                    handleSectionnameChange={this.handleSectionnameChange}
                    handleNegativeMarksPerQuesChange={
                      this.handleNegativeMarksPerQuesChange
                    }
                    handleMarksperQuesChange={this.handleMarksperQuesChange}
                    handleSectionDescriptionChange={
                      this.handleSectionDescriptionChange
                    }
                    addSectionQuestions={this.addSectionQuestions}
                    deleteSectionQuestion={this.deleteSectionQuestion}
                    addSection={this.addSection}
                    handlSectionQuestionValueChange={
                      this.handlSectionQuestionValueChange
                    }
                    myReftestdescEnglish={this.myReftestdescEnglish}
                    myReftestdescHindi={this.myReftestdescHindi}
                    refsSectionEnglish={this.refsSectionEnglish}
                    refsSectionHindi={this.refsSectionHindi}
                  />
                  <div style={{ margin: "1em 0", textAlign: "center" }}>
                    <Button
                      style={{
                        borderRadius: "0",
                        background: "#3F5FBB",
                        borderColor: "#3F5FBB",
                        padding: "0.6em 2.5em",
                        fontSize: "1.1em",
                        fontWeight: "600"
                      }}
                      onClick={this.saveExamdata}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export default Exam;
