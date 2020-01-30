import React, { Component } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import Header from "../Header/index";
import Back from "@material-ui/icons/ArrowBack";
import { styled } from "@material-ui/styles";
import { Link } from "react-router-dom";
import LeftPanelexam from "./leftpanelexam.js";
import axios from "axios";
import URL from "../../Assets/url";
import RightExamPanel from "./rightpanelexam.js";
const MyBack = styled(Back)({
  color: "dimgrey",
  marginTop: "-0.2em",
  width: "1em"
});

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
          questions: [0],

          versions: [
            {
              content: "stringEng",
              language: "ENGLISH",
              name: "string",
              sectionName: "stringEnglish"
            },
            {
              content: "stringHin",
              language: "HINDI",
              name: "string",
              sectionName: "stringHindi"
            }
          ]
        }
      ]
    };
  }
  addSectionQuestions = index => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].questions.push("");
    this.setState({ listOfSection: tempsectionlist });
  };
  deleteSectionQuestion = index => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].questions.pop();
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
    // console.log(index,e)
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].negativeMarksPerQuestion = e.target.value;
    this.setState({ listOfSection: tempsectionlist });
  };
  handleMarksperQuesChange = (index, e) => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].marksPerQuestion = e.target.value;
    this.setState({ listOfSection: tempsectionlist });
  };
  addSection = () => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist.push({
      marksPerQuestion: 0,
      negativeMarksPerQuestion: 0,
      questions: [0],

      versions: [
        {
          content: "stringEng",
          language: "ENGLISH",
          name: "string",
          sectionName: "stringEnglish"
        },
        {
          content: "stringHin",
          language: "HINDI",
          name: "string",
          sectionName: "stringHindi"
        }
      ]
    });
  };
  deleteSection = () => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist.pop();
    this.setState({ listOfSection: tempsectionlist });
  };
  handleSectionnameChange = (index, language, e) => {
    let tempsectionlist = this.state.listOfSection;
    tempsectionlist[index].versions.filter(
      item => item.language === language
    )[0].sectionName = e.target.value;
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
  onTimeChange = option => {
    this.setState({ hour: option.hour, minute: option.minute });
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
        url: URL.fetchChapter + this.state.selectedSubjectID + "/" + "ENGLISH",
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
      () => {
        
      }
    );
  };
  handleTypeChange = e => {
    e.preventDefault();
    this.setState({ selectedType: e.target.value }, () => {
      // this.componentDidMount();
    });
  };
  render() {
    return (
      <React.Fragment>
        <Header />
        <div
          style={{
            boxShadow: "0px 3px 5px lightgrey",
            width: "auto",
            height: "4.5em",
            padding: "1em 3em"
          }}
        >
          <Link to="/" target="_self">
            <Button
              variant="light"
              style={{ background: "transparent", border: "transparent" }}
            >
              <MyBack />
              <span
                style={{
                  marginLeft: "1em",
                  fontSize: "1.2em",
                  color: "dimgrey"
                }}
              >
                Back to dashboard
              </span>
            </Button>
          </Link>
        </div>
        <Container
          fluid
          style={{
            width: "auto",
            background: "#EEEEEE",
            padding: "0.5em 1.5em"
          }}
        >
          <div style={{ padding: "20px 0", margin: "0 1em" }}>
            <Row>
              <Col
                lg="3"
                style={{
                  padding: "0em 1em"
                  // background: "#EEE"
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
                    onTimeChange={this.onTimeChange}
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
              <Col lg="1"></Col>
              <Col
                style={{
                  background: "#EEEEEE"
                }}
              >
                <RightExamPanel
                  testnameEnglish={this.state.testnameEnglish}
                  testInstructionEnglish={this.state.testInstructionEnglish}
                  testInstructionHindi={this.state.testInstructionHindi}
                  handleHindiInstructionChange={
                    this.handleHindiInstructionChange
                  }
                  handleEnglishInstructionChange={
                    this.handleEnglishInstructionChange
                  }
                  handleHindiTestNameChange={this.handleHindiTestNameChange}
                  handleEnglishTestNameChange={this.handleEnglishTestNameChange}
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
                />
              </Col>
              <Col lg="1"></Col>
            </Row>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export default Exam;