import React, { Component } from "react";
import {
  Row,
  Col,
  Button,
  Form,
  Card,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import Edit from "@material-ui/icons/Edit";
import { Link } from "react-router-dom";
import axios from "axios";
import "./index.css";
import LeftPanelQuestion from "./leftpanelQAtab.js";
import URL from "../../Assets/url";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { withRouter } from "react-router-dom";
import BucketIcon from "./../../Assets/image.png";
import BucketIconOrange from "./../../Assets/image3.png";
import BucketIconGrey from "./../../Assets/image4.png";
import swal from "@sweetalert/with-react";
import BottomScrollListener from "react-bottom-scroll-listener";
import MathJax from "react-mathjax-preview";

class QAtab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfSubject: [],
      selectedSubjectID: localStorage.getItem("selectedSubjectIDQA")
        ? parseInt(localStorage.getItem("selectedSubjectIDQA"))
        : 0,
      listOfChapter: [],
      selectedChapterID: localStorage.getItem("selectedChapterIDQA")
        ? parseInt(localStorage.getItem("selectedChapterIDQA"))
        : 0,
      listOfTopic: [],
      selectedTopicID: localStorage.getItem("selectedTopicIDQA")
        ? parseInt(localStorage.getItem("selectedTopicIDQA"))
        : 0,
      listOfSubTopic: [],
      selectedSubTopicID: localStorage.getItem("selectedSubTopicID")
        ? parseInt(localStorage.getItem("selectedSubTopicID"))
        : 0,
      selectedLanguage: localStorage.getItem("selectedlanguageQA")
        ? localStorage.getItem("selectedlanguageQA")
        : "ENGLISH",
      listOfLanguage: ["ENGLISH", "HINDI"],
      searchbox: localStorage.getItem("selectedsearchboxQA")
        ? parseInt(localStorage.getItem("selectedsearchboxQA"))
        : "",
      authorId: localStorage.getItem("selectedAuthorIDQA")
        ? parseInt(localStorage.getItem("selectedAuthorIDQA"))
        : 0,
      userId: localStorage.getItem("selectedUserIDQA")
        ? localStorage.getItem("selectedUserIDQA")
        : null,
      searchResultList: [],
      listOfselectedPreview: [],
      isLoading: false,
      listOfsearchselected: [],
      searchSelectAll: false,
      pageNo: 1,
      hasMore: null,
      tags: localStorage.getItem("selectedTagsQA")
        ? JSON.parse(localStorage.getItem("selectedTagsQA"))
        : [],
      apisugges: [],
      suggestions: [],
      date: localStorage.getItem("selectedDateQA")
        ? new Date(localStorage.getItem("selectedDateQA"))
        : null,
    };
  }
  handleDateChange = (date) => {
    this.setState(
      {
        date: date,
      },
      () => {
        localStorage.setItem("selectedDateQA", date);
      }
    );
  };
  onDelete = (i) => {
    // e.preventDefault()
    const tags = this.state.tags.slice(0);
    tags.splice(i, 1);
    localStorage.setItem("selectedTagsQA", JSON.stringify(tags));
    this.setState({ tags });
  };
  onAddition = (tag) => {
    // e.preventDefault()
    const tags = [].concat(this.state.tags, tag);
    let suggestions = this.state.apisugges;
    // let tempapisugges = this.state.apisugges;
    localStorage.setItem("selectedTagsQA", JSON.stringify(tags));
    this.setState({ tags, suggestions });
  };
  handleChangeTags = (tags) => {
    // console.log(tags);
    let tempsugg = this.state.suggestions;
    let tempapisugges = this.state.apisugges;
    // console.log("apisugges", tempapisugges);
    // tempsugg=tempsugg.filter((item)=>item.id!==999)
    // tempsugg.push({ id: null, name: tags });
    // this.setState({ suggestions: tempsugg }, () => {
    if (tags) {
      axios({
        method: "POST",
        url: URL.tagsearch + tags,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          if (res.data.data.list.length > 0) {
            let temp = res.data.data.list.map((item) => {
              return { id: item.tagId, name: item.tag };
            });
            tempsugg = temp;
            tempsugg = tempsugg.concat(tempapisugges);
            // eslint-disable-next-line array-callback-return
            tempsugg = tempsugg.filter(function (a) {
              var key = a.id + "|" + a.name;
              if (!this[key]) {
                this[key] = true;
                return true;
              }
            }, Object.create(null));
            tempapisugges = tempapisugges.concat(temp);
            // eslint-disable-next-line array-callback-return
            let result = tempapisugges.filter(function (a) {
              var key = a.id + "|" + a.name;
              if (!this[key]) {
                this[key] = true;
                return true;
              }
            }, Object.create(null));
            // tempsugg.push({ id: null, name: tags });
            this.setState({ suggestions: tempsugg, apisugges: result });
            // console.log(tempsugg);
          } else {
            // console.log(tempsugg);
          }
        }
      });
    }
    // });

    // console.log(tempsugg)
  };
  handleAddToBucket = () => {
    let tempsearchlistselected = this.state.listOfsearchselected.filter(
      (item) => item.status === true
    );
    tempsearchlistselected.map((item) => {
      console.log(item.id);

      return this.onAddpreviewdata(item.id);
    });
    this.setState({
      searchSelectAll: false,
    });
  };
  handleSelectAllCheck = (e) => {
    if (e.target.checked) {
      let tempsearchlist = this.state.listOfsearchselected.map((item) => {
        let temp = this.state.listOfselectedPreview.filter(
          (obj) => obj.questionId === item.id
        );
        let objj =
          temp.length > 0
            ? { id: item.id, status: false }
            : { id: item.id, status: true };
        return objj;
      });
      this.setState({
        searchSelectAll: e.target.checked,
        listOfsearchselected: tempsearchlist,
      });
    } else {
      let tempsearchlist = this.state.listOfsearchselected.map((item) => {
        item.status = false;
        return item;
      });
      this.setState({
        searchSelectAll: e.target.checked,
        listOfsearchselected: tempsearchlist,
      });
    }
  };
  compare = (a, b) => {
    const bandA = a.questionId;
    const bandB = b.questionId;

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  };
  OnPreviewClick = () => {
    let temp = this.state.listOfselectedPreview.sort(this.compare);
    // console.log(temp);
    localStorage.setItem("Previewdata", JSON.stringify(temp));
    localStorage.setItem("previewLanguage", this.state.selectedLanguage);

    this.props.history.push({
      pathname: "/quespreview",
      state: {
        data: this.state.listOfselectedPreview,
      },
    });
  };
  onAddpreviewdata = async (id) => {
    // this.setState({ isLoading: false }, () => {
    let filterchecktemp = this.state.listOfselectedPreview.filter(
      (item) => item.questionId === id
    );
    if (filterchecktemp.length > 0) {
      let templist = this.state.listOfselectedPreview;
      templist = templist.filter((obj) => obj.questionId !== id);
      let templistOfsearchselected = this.state.listOfsearchselected.map(
        (item) => {
          let obj =
            item.id === id
              ? { id: item.id, status: false }
              : { id: item.id, status: item.status };
          return obj;
        }
      );
      this.setState(
        {
          listOfselectedPreview: templist,
          listOfsearchselected: templistOfsearchselected,
          isLoading: false,
        },
        () => {
          localStorage.setItem("Previewdata", JSON.stringify(templist));
        }
      );
    } else {
      await axios({
        method: "POST",
        url: URL.geteditques + id,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            let temppreviewlist = this.state.listOfselectedPreview;
            temppreviewlist.push(res.data.data.question);
            let templistOfsearchselected = this.state.listOfsearchselected.map(
              (item) => {
                let obj =
                  item.id === id
                    ? { id: item.id, status: false }
                    : { id: item.id, status: item.status };
                return obj;
              }
            );
            this.setState(
              {
                listOfselectedPreview: temppreviewlist,
                listOfsearchselected: templistOfsearchselected,
                isLoading: false,
              },
              () => {
                localStorage.setItem(
                  "Previewdata",
                  JSON.stringify(temppreviewlist)
                );
              }
            );
          } else {
            this.setState({ isLoading: false }, () => {
              alert("Data not found");
            });
          }
        })
        .catch((e) => {
          this.setState({ isLoading: false }, () => {
            alert("Error found");
          });
        });
    }
    // });
  };
  handleSearchboxChange = (e) => {
    e.preventDefault();
    this.setState({ searchbox: e.target.value, pageNo: 1 });
    localStorage.setItem("selectedsearchboxQA", e.target.value);
    if (e.target.value && e.target.value !== "") {
      axios({
        method: "POST",
        url: URL.searchquestion + "1",
        data: {
          authToken: "string",
          language: this.state.selectedLanguage,
          questionId: e.target.value ? parseInt(e.target.value) : 0,
          // sectionId: this.state.selectedChapterID
          //   ? this.state.selectedChapterID
          //   : 0,
          // subjectId: this.state.selectedSubjectID
          //   ? this.state.selectedSubjectID
          //   : 0,
          // subtopicId: this.state.selectedSubTopicID
          //   ? this.state.selectedSubTopicID
          //   : 0,
          // topicId: this.state.selectedTopicID ? this.state.selectedTopicID : 0,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        // console.log(res.data.data.list);
        if (res.status === 200) {
          let templist = res.data.data.list.map((item) => {
            let filtertemplist = this.state.listOfselectedPreview.filter(
              (obj) => obj.questionId === item.questionId
            );
            if (filtertemplist.length > 0) {
              return { id: item.questionId, status: true };
            } else {
              return { id: item.questionId, status: false };
            }
          });
          // console.log(templist);
          this.setState({
            searchResultList: res.data.data.list,
            listOfsearchselected: templist,
            pageNo: this.state.pageNo + 1,
            hasMore: res.data.data.hasMore,
          });
        }
      });
    } else {
      this.setState({ searchResultList: [], listOfsearchselected: [] });
    }
  };
  handlesearchWithFilter = () => {
    var Date = null;
    if (this.state.date !== null) {
      var Datetemp = this.state.date;

      var dd = Datetemp.getDate();
      var mm = Datetemp.getMonth() + 1; //January is 0!

      var yyyy = Datetemp.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      Date = yyyy + "-" + mm + "-" + dd;
    }
    axios({
      method: "POST",
      url: URL.searchquestion + "1",
      data: {
        authToken: "string",
        authorId: this.state.authorId,
        userId: this.state.userId,
        language: this.state.selectedLanguage,
        date: Date,
        questionId: this.state.searchbox ? parseInt(this.state.searchbox) : 0,
        sectionId: this.state.selectedChapterID,
        subjectId: this.state.selectedSubjectID,
        subtopicId: this.state.selectedSubTopicID,
        topicId: this.state.selectedTopicID,
        tags: this.state.tags.map((item) => {
          return item.id;
        }),
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      // console.log(res.data.data.list);
      if (res.status === 200) {
        let templist = res.data.data.list.map((item) => {
          let filtertemplist = this.state.listOfselectedPreview.filter(
            (obj) => obj.questionId === item.questionId
          );
          if (filtertemplist.length > 0) {
            return { id: item.questionId, status: true };
          } else {
            return { id: item.questionId, status: false };
          }
        });
        // console.log(templist);
        this.setState({
          searchResultList: res.data.data.list,
          listOfsearchselected: templist,
          pageNo: 2,
          hasMore: res.data.data.hasMore,
        });
      }
    });
  };
  clearSearchFromFilters = () => {
    localStorage.setItem("selectedSubjectIDQA", "0");
    localStorage.setItem("selectedAuthorIDQA", "0");
    localStorage.setItem("selectedUserIDQA", null);
    localStorage.setItem("selectedDateQA", "");
    localStorage.setItem("selectedChapterIDQA", "0");
    localStorage.setItem("selectedTopicIDQA", "0");
    localStorage.setItem("selectedSubTopicID", "0");
    localStorage.setItem("selectedsearchboxQA", "");
    localStorage.setItem("selectedTagsQA", JSON.stringify([]));

    this.setState(
      {
        // searchResultList: [],
        // listOfsearchselected: [],
        authorId: 0,
        userId: null,
        date: null,
        searchbox: "",
        listOfChapter: [],
        selectedChapterID: 0,
        // listOfSubject:[],
        selectedSubjectID: 0,
        listOfTopic: [],
        selectedTopicID: 0,
        listOfSubTopic: [],
        selectedSubTopicID: 0,
        pageNo: 1,
        hasMore: true,
        tags: [],
      },
      () => {
        this.handlesearchWithFilter();
      }
    );
  };
  handleLanguageChange = (e) => {
    e.preventDefault();
    localStorage.setItem("selectedlanguageQA", e.target.value);
    this.setState(
      { selectedLanguage: e.target.value, pageNo: 1, hasMore: true },
      () => {
        this.componentDidMount();
      }
    );
  };
  componentDidMount() {
    let templistOfselectedPreview =
      localStorage.getItem("Previewdata") !== null &&
      localStorage.getItem("Previewdata") !== ""
        ? JSON.parse(localStorage.getItem("Previewdata"))
        : [];

    this.setState(
      { isLoading: false, listOfselectedPreview: templistOfselectedPreview },
      () => {
        axios({
          method: "POST",
          url: URL.fetchSubject + this.state.selectedLanguage,
          data: { authToken: "string" },
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.status === 200) {
              this.setState(
                {
                  listOfSubject: res.data.data.list,
                  selectedSubjectID:
                    localStorage.getItem("selectedSubjectIDQA") &&
                    res.data.data.list.filter(
                      (itm) =>
                        itm.subject.subjectId ===
                        parseInt(localStorage.getItem("selectedSubjectIDQA"))
                    ).length > 0
                      ? parseInt(localStorage.getItem("selectedSubjectIDQA"))
                      : 0,
                  isLoading: false,
                },
                () => {
                  if (
                    localStorage.getItem("selectedSubjectIDQA") &&
                    parseInt(localStorage.getItem("selectedSubjectIDQA")) !== 0
                  ) {
                    localStorage.setItem(
                      "selectedSubjectIDQA",
                      localStorage.getItem("selectedSubjectIDQA") &&
                        res.data.data.list.filter(
                          (itm) =>
                            itm.subject.subjectId ===
                            parseInt(
                              localStorage.getItem("selectedSubjectIDQA")
                            )
                        ).length > 0
                        ? parseInt(
                            localStorage.getItem("selectedSubjectIDQA")
                          ).toString()
                        : "0"
                    );
                    this.callApiForChapter();
                  }
                  var Date = null;
                  if (this.state.date !== null) {
                    var Datetemp = this.state.date;

                    var dd = Datetemp.getDate();
                    var mm = Datetemp.getMonth() + 1; //January is 0!

                    var yyyy = Datetemp.getFullYear();
                    if (dd < 10) {
                      dd = "0" + dd;
                    }
                    if (mm < 10) {
                      mm = "0" + mm;
                    }
                    Date = yyyy + "-" + mm + "-" + dd;
                  }

                  axios({
                    method: "POST",
                    url: URL.searchquestion + this.state.pageNo,
                    data: {
                      authToken: "string",
                      authorId: this.state.authorId,
                      userId: this.state.userId,
                      language: this.state.selectedLanguage,
                      date: Date,
                      questionId:
                        this.state.searchbox !== ""
                          ? parseInt(this.state.searchbox)
                          : 0,
                      sectionId:
                        localStorage.getItem("selectedChapterIDQA") &&
                        parseInt(localStorage.getItem("selectedChapterIDQA"))
                          ? parseInt(
                              localStorage.getItem("selectedChapterIDQA")
                            )
                          : 0,
                      subjectId:
                        localStorage.getItem("selectedSubjectIDQA") &&
                        parseInt(
                          localStorage.getItem("selectedSubjectIDQA")
                        ) !== 0
                          ? parseInt(
                              localStorage.getItem("selectedSubjectIDQA")
                            )
                          : 0,
                      subtopicId:
                        localStorage.getItem("selectedSubTopicID") &&
                        parseInt(localStorage.getItem("selectedSubTopicID")) !==
                          0
                          ? parseInt(localStorage.getItem("selectedSubTopicID"))
                          : 0,
                      topicId:
                        localStorage.getItem("selectedTopicIDQA") &&
                        parseInt(localStorage.getItem("selectedTopicIDQA")) !==
                          0
                          ? parseInt(localStorage.getItem("selectedTopicIDQA"))
                          : 0,
                      tags: this.state.tags.map((item) => {
                        return item.id;
                      }),
                    },
                    headers: {
                      "Content-Type": "application/json",
                    },
                  })
                    .then((res) => {
                      if (res.status === 200) {
                        let templist = res.data.data.list.map((item) => {
                          return { id: item.questionId, status: false };
                        });
                        this.setState({
                          searchResultList: res.data.data.list,
                          listOfsearchselected: templist,
                          pageNo: this.state.pageNo + 1,
                          hasMore: res.data.data.hasMore,
                        });
                      }
                    })
                    .catch((e) => {
                      alert(e);
                    });
                }
              );
            } else {
              alert("Unexpected code");
              this.setState({ isLoading: false });
            }
          })
          .catch((e) => {
            console.log(e);
            alert(e);
            this.setState({ isLoading: false });
          });
      }
    );
  }
  callApiForChapter = () => {
    console.log("call for chapter");
    // console.log(this.state.selectedSubjectID);
    if (this.state.selectedSubjectID !== "") {
      axios({
        method: "POST",
        url:
          URL.fetchChapter +
          this.state.selectedSubjectID +
          "/" +
          this.state.selectedLanguage,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState(
              {
                listOfChapter: res.data.data.list,
                selectedChapterID:
                  res.data.data.list.length > 0
                    ? localStorage.getItem("selectedChapterIDQA") &&
                      res.data.data.list.filter(
                        (itm) =>
                          itm.subjectSection.sectionId ===
                          parseInt(localStorage.getItem("selectedChapterIDQA"))
                      ).length > 0
                      ? parseInt(localStorage.getItem("selectedChapterIDQA"))
                      : 0
                    : // : res.data.data.list[0].subjectSection.sectionId
                      0,
              },
              () => {
                localStorage.setItem(
                  "selectedChapterIDQA",
                  res.data.data.list.length > 0
                    ? localStorage.getItem("selectedChapterIDQA") &&
                      res.data.data.list.filter(
                        (itm) =>
                          itm.subjectSection.sectionId ===
                          parseInt(localStorage.getItem("selectedChapterIDQA"))
                      ).length > 0
                      ? parseInt(
                          localStorage.getItem("selectedChapterIDQA")
                        ).toString()
                      : "0"
                    : // : res.data.data.list[0].subjectSection.sectionId.toString()
                      "0"
                );
                this.callApiForTopic();
              }
            );
          } else {
            alert("Unexpected code");
          }
        })
        .catch((e) => {
          console.log(e);
          alert(e);
          this.setState({ isLoading: false });
        });
    } else {
      console.log(
        "(English)subjectid is blank. API not called. checksubject list"
      );
      localStorage.setItem("selectedChapterIDQA", "0");
      localStorage.setItem("selectedTopicIDQA", "0");
      localStorage.setItem("selectedSubTopicID", "0");
      this.setState({
        listOfChapter: [],
        selectedChapterID: 0,
        listOfTopic: [],
        selectedTopicID: 0,
        listOfSubTopic: [],
        selectedSubTopicID: 0,
        isLoading: false,
      });
    }
  };
  callApiForTopic = () => {
    if (this.state.selectedChapterID !== "") {
      axios({
        method: "POST",
        url:
          URL.fetchTopic +
          this.state.selectedChapterID +
          "/" +
          this.state.selectedLanguage,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 200) {
            this.setState(
              {
                listOfTopic: res.data.data.list,
                selectedTopicID:
                  res.data.data.list.length > 0
                    ? localStorage.getItem("selectedTopicIDQA") &&
                      res.data.data.list.filter(
                        (itm) =>
                          itm.subjectTopic.topicId ===
                          parseInt(localStorage.getItem("selectedTopicIDQA"))
                      ).length > 0
                      ? parseInt(localStorage.getItem("selectedTopicIDQA"))
                      : 0
                    : // : res.data.data.list[0].subjectTopic.topicId
                      0,
              },
              () => {
                localStorage.setItem(
                  "selectedTopicIDQA",
                  res.data.data.list.length > 0
                    ? localStorage.getItem("selectedTopicIDQA") &&
                      res.data.data.list.filter(
                        (itm) =>
                          itm.subjectTopic.topicId ===
                          parseInt(localStorage.getItem("selectedTopicIDQA"))
                      ).length > 0
                      ? parseInt(
                          localStorage.getItem("selectedTopicIDQA")
                        ).toString()
                      : "0"
                    : // : res.data.data.list[0].subjectTopic.topicId.toString()
                      "0"
                );
                this.callApiForSubTopic();
              }
            );
          } else {
            alert("Unexpected code");
          }
        })
        .catch((e) => {
          console.log(e);
          alert(e);
          this.setState({ isLoading: false });
        });
    } else {
      console.log(
        "(English)chapterid is blank.API not called. checkchapter list"
      );
      localStorage.setItem("selectedTopicIDQA", "0");
      localStorage.setItem("selectedSubTopicID", "0");
      this.setState({
        listOfTopic: [],
        selectedTopicID: 0,
        listOfSubTopic: [],
        selectedSubTopicID: 0,
      });
    }
  };
  callApiForSubTopic = () => {
    if (this.state.selectedTopicID !== "") {
      axios({
        method: "POST",
        url:
          URL.fetchSubTopic +
          this.state.selectedTopicID +
          "/" +
          this.state.selectedLanguage,
        data: { authToken: "string" },
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          // console.log(res.data.data);
          if (res.status === 200) {
            this.setState({
              listOfSubTopic: res.data.data.list,
              selectedSubTopicID:
                res.data.data.list.length > 0
                  ? localStorage.getItem("selectedSubTopicID") &&
                    res.data.data.list.filter(
                      (itm) =>
                        itm.subjectSubtopic.subtopicId ===
                        parseInt(localStorage.getItem("selectedSubTopicID"))
                    ).length > 0
                    ? parseInt(localStorage.getItem("selectedSubTopicID"))
                    : 0
                  : // : res.data.data.list[0].subjectSubtopic.subtopicId
                    0,
            });
            localStorage.setItem(
              "selectedSubTopicID",
              res.data.data.list.length > 0
                ? localStorage.getItem("selectedSubTopicID") &&
                  res.data.data.list.filter(
                    (itm) =>
                      itm.subjectSubtopic.subtopicId ===
                      parseInt(localStorage.getItem("selectedSubTopicID"))
                  ).length > 0
                  ? parseInt(
                      localStorage.getItem("selectedSubTopicID")
                    ).toString()
                  : "0"
                : // : res.data.data.list[0].subjectSubtopic.subtopicId.toString()
                  "0"
            );
          } else {
            alert("Unexpected code");
          }
        })
        .catch((e) => {
          console.log(e);
          alert(e);
          this.setState({ isLoading: false });
        });
    } else {
      console.log("(English)topicid is blank.API not called. checktopic list");
      localStorage.setItem("selectedSubTopicID", "0");
      this.setState({ listOfSubTopic: [], selectedSubTopicID: 0 });
    }
  };
  handleSubjectChange = (e) => {
    // e.preventDefault();
    // console.log(e.target.value)
    if (e.target.value === "") {
      localStorage.setItem("selectedSubjectIDQA", "0");
      this.setState(
        {
          selectedSubjectID: 0,
        },
        () => {
          this.callApiForChapter();
        }
      );
    } else {
      localStorage.setItem(
        "selectedSubjectIDQA",
        this.state.listOfSubject[
          e.target.options.selectedIndex
        ].subject.subjectId.toString()
      );
      this.setState(
        {
          selectedSubjectID: this.state.listOfSubject[
            e.target.options.selectedIndex
          ].subject.subjectId,
        },
        () => {
          this.callApiForChapter();
        }
      );
    }
  };
  handleChapterChange = (e) => {
    // e.preventDefault();
    if (e.target.value === "") {
      localStorage.setItem("selectedChapterIDQA", "0");
      this.setState(
        {
          selectedChapterID: 0,
        },
        () => {
          this.callApiForTopic();
        }
      );
    } else {
      localStorage.setItem(
        "selectedChapterIDQA",
        this.state.listOfChapter[
          e.target.options.selectedIndex
        ].subjectSection.sectionId.toString()
      );
      this.setState(
        {
          selectedChapterID: this.state.listOfChapter[
            e.target.options.selectedIndex
          ].subjectSection.sectionId,
        },
        () => {
          this.callApiForTopic();
        }
      );
    }
  };
  handleTopicChange = (e) => {
    // e.preventDefault();
    if (e.target.value === "") {
      localStorage.setItem("selectedTopicIDQA", "0");
      this.setState(
        {
          selectedTopicID: 0,
        },
        () => {
          this.callApiForSubTopic();
        }
      );
    } else {
      localStorage.setItem(
        "selectedTopicIDQA",
        this.state.listOfTopic[
          e.target.options.selectedIndex
        ].subjectTopic.topicId.toString()
      );
      this.setState(
        {
          selectedTopicID: this.state.listOfTopic[
            e.target.options.selectedIndex
          ].subjectTopic.topicId,
        },
        () => {
          this.callApiForSubTopic();
        }
      );
    }
  };
  handleSubTopicChange = (e) => {
    // e.preventDefault();
    if (e.target.value === "") {
      localStorage.setItem("selectedSubTopicID", "0");
      this.setState({
        selectedSubTopicID: 0,
      });
    } else {
      localStorage.setItem(
        "selectedSubTopicID",
        this.state.listOfSubTopic[
          e.target.options.selectedIndex
        ].subjectSubtopic.subtopicId.toString()
      );
      this.setState({
        selectedSubTopicID: this.state.listOfSubTopic[
          e.target.options.selectedIndex
        ].subjectSubtopic.subtopicId,
      });
    }
  };
  handleInputChangeCheckboxlistsearch = (index, e) => {
    let tempsearchlist = this.state.listOfsearchselected;
    tempsearchlist[index].status = e.target.checked;
    this.setState({ listOfsearchselected: tempsearchlist });
  };
  handleeditafterpreview = (data) => {
    // console.log(data);
    localStorage.setItem("editquesdata", JSON.stringify(data));
    this.props.history.push({
      pathname:
        "/editques/" + this.state.selectedLanguage + "/" + data.questionId,
    });
    swal.close();
  };
  onEditClickques = (id) => {
    axios({
      method: "POST",
      url: URL.geteditques + id,
      data: { authToken: "string" },
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      // console.log(res);
      swal({
        buttons: false,
        content: (
          <div>
            <Row
              // noGutters={true}
              // key={res.data.data.question.questionId}
              style={{
                margin: "0.5em 0em",
                textAlign: "left",
                // borderBottom: "1px #c2c2c2 solid"
              }}
            >
              <Col
                style={{
                  paddingLeft: "0em",
                  paddingRight: "0em",
                }}
              >
                <Card
                  id="previewcard"
                  style={{
                    background: "transparent",
                    borderColor: "transparent",
                  }}
                >
                  <Card.Body style={{ padding: "0", margin: "0.5em 0" }}>
                    <Card.Title style={{ fontSize: "medium" }}>
                      <Row noGutters={true}>
                        <Col lg="1">
                          <span>
                            <small>
                              <b>#</b>
                            </small>
                            <span style={{ color: "dimgrey" }}>
                              {res.data.data.question.questionId}
                            </span>
                          </span>
                        </Col>

                        <Col>
                          <span
                            style={{
                              float: "right",
                              fontSize: "15px",
                              fontWeight: "600",
                            }}
                          >
                            <b>Tags: </b>
                            <span style={{ color: "#1D4B7F" }}>
                              {/* Difficulty:{" "} */}
                              {res.data.data.question.level === "EASY"
                                ? res.data.data.question.level === "MILD"
                                  ? "++"
                                  : "+"
                                : res.data.data.question.level === "MILD"
                                ? "++"
                                : "+++"}
                            </span>
                            ,
                            <span
                              style={{
                                color: "darkgreen",
                                textTransform: "lowercase",
                              }}
                            >
                              {" "}
                              {res.data.data.question.type}
                            </span>
                            <span
                              style={{
                                color: "darkgoldenrod",
                                textTransform: "lowercase",
                              }}
                            >
                              {res.data.data.question.tags.length > 0 &&
                                res.data.data.question.tags.map((itm) => {
                                  return `, ${itm.tag}`;
                                })}
                            </span>
                          </span>
                        </Col>
                      </Row>
                    </Card.Title>

                    <Card.Text
                      style={{ marginBottom: "0.5em", display: "flex" }}
                    >
                      <b>{"Q. "}</b>
                      <MathJax
                        style={{ display: "inline-flex" }}
                        math={
                          res.data.data.question.questionVersions.filter(
                            (obbj) =>
                              obbj.language === this.state.selectedLanguage
                          )[0].content
                        }
                      />
                    </Card.Text>
                    <Row>
                      {res.data.data.question.questionVersions
                        .filter(
                          (obbj) =>
                            obbj.language === this.state.selectedLanguage
                        )[0]
                        .options.map((optionitem, optionindex) => {
                          return (
                            <React.Fragment key={optionindex}>
                              <Col lg="6" style={{ margin: "0.5em 0" }}>
                                {" "}
                                {optionindex + 1}
                                {") "}{" "}
                                <MathJax
                                  style={{ display: "inline-flex" }}
                                  math={optionitem.content}
                                />
                                <sub
                                  style={
                                    {
                                      // display: "inline-block",
                                      // position: "absolute",
                                      // bottom: "0",
                                      // left: "0",
                                      // margin: "0em 0.5em"
                                    }
                                  }
                                >
                                  <b>( {optionitem.weightage} )</b>
                                </sub>
                              </Col>
                            </React.Fragment>
                          );
                        })}{" "}
                    </Row>
                    <Row style={{ margin: "0.2em 0.1em" }}>
                      <b>{" Sol. "}</b>&nbsp;
                      <MathJax
                        style={{ display: "inline-flex" }}
                        math={
                          res.data.data.question.questionVersions.filter(
                            (obbj) =>
                              obbj.language === this.state.selectedLanguage
                          )[0].solution
                        }
                      />
                      {/* {res.data.data.question.questionVersions
                        .filter(
                          obbj => obbj.language === this.state.selectedLanguage
                        )[0]
                        .solution.replace(/<\/?[^>]+(>|$)/g, "")} */}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* <Link
              to={`/editques/${this.state.selectedLanguage}/${res.data.data.question.questionId}`}
              target="_self"
            > */}{" "}
            <Button
              // title="Edit"
              onClick={this.handleeditafterpreview.bind(
                this,
                res.data.data.question
              )}
              size="sm"
              style={{
                fontSize: "1em",
                fontWeight: "700",
                background: "#6AA3FF",
                borderColor: "#6AA3FF",
                borderRadius: "0",
                paddingRight: "1.1em",
              }}
              // variant="secondary"

              // onClick={this.handleQAEdit.bind(this,item.questionId)}
            >
              {<Edit className="svg_icons" />}
              {" Edit"}
            </Button>
            {/* </Link> */}
          </div>
        ),
      });
    });
  };
  callbackofend = () => {
    console.log("questions");
    if (this.state.hasMore) {
      axios({
        method: "POST",
        url: URL.searchquestion + this.state.pageNo,
        data: {
          authToken: "string",
          language: this.state.selectedLanguage,

          questionId: this.state.searchbox ? parseInt(this.state.searchbox) : 0,
          sectionId: this.state.selectedChapterID
            ? this.state.selectedChapterID
            : 0,
          subjectId: this.state.selectedSubjectID
            ? this.state.selectedSubjectID
            : 0,
          subtopicId: this.state.selectedSubTopicID
            ? this.state.selectedSubTopicID
            : 0,
          topicId: this.state.selectedTopicID ? this.state.selectedTopicID : 0,
          tags: this.state.tags.map((item) => {
            return item.id;
          }),
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        if (res.status === 200) {
          let templist = res.data.data.list.map((item) => {
            let filtertemplist = this.state.listOfselectedPreview.filter(
              (obj) => obj.questionId === item.questionId
            );
            if (filtertemplist.length > 0) {
              return { id: item.questionId, status: true };
            } else {
              return { id: item.questionId, status: false };
            }
          });
          let currsearchResultList = this.state.searchResultList;
          let currlistOfsearchselected = this.state.listOfsearchselected;
          this.setState({
            searchResultList: currsearchResultList.concat(res.data.data.list),
            listOfsearchselected: currlistOfsearchselected.concat(templist),
            pageNo: this.state.pageNo + 1,
            hasMore: res.data.data.hasMore,
          });
        }
      });
    }
  };
  handleUserChange = (e) => {
    if (e.target.value === "") {
      localStorage.setItem("selectedUserIDQA", null);
      this.setState({
        userId: null,
      });
    } else {
      localStorage.setItem(
        "selectedUserIDQA",
        this.props.userList[e.target.options.selectedIndex].userId.toString()
      );
      this.setState({
        userId: this.props.userList[e.target.options.selectedIndex].userId,
      });
    }
  };
  handleAuthorChange = (e) => {
    if (e.target.value === "") {
      localStorage.setItem("selectedAuthorIDQA", "0");
      this.setState({
        authorId: 0,
      });
    } else {
      localStorage.setItem(
        "selectedAuthorIDQA",
        this.props.authorList[
          e.target.options.selectedIndex
        ].authorId.toString()
      );
      this.setState({
        authorId: this.props.authorList[e.target.options.selectedIndex]
          .authorId,
      });
    }
  };
  render() {
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <center>
            <Loader type="TailSpin" color="#00BFFF" height={120} width={250} />
          </center>
        ) : (
          <Row style={{ height: "90vh" }}>
            <Col
              lg="3"
              style={{
                padding: "2.5em 2.5em",
                background: "#EEE",
                boxShadow: "rgba(0, 0, 0, 0.75) 2px 0px 4px -3px",
                zIndex: "88",
                position: "relative",
              }}
            >
              <LeftPanelQuestion
                searchResultListLength={this.state.searchResultList.length}
                handlesearchWithFilter={this.handlesearchWithFilter}
                clearSearchFromFilters={this.clearSearchFromFilters}
                listOfSubject={this.state.listOfSubject}
                listOfChapter={this.state.listOfChapter}
                listOfTopic={this.state.listOfTopic}
                listOfSubTopic={this.state.listOfSubTopic}
                handleSubjectChange={this.handleSubjectChange}
                handleChapterChange={this.handleChapterChange}
                handleTopicChange={this.handleTopicChange}
                handleSubTopicChange={this.handleSubTopicChange}
                selectedSubjectID={this.state.selectedSubjectID}
                selectedChapterID={this.state.selectedChapterID}
                selectedTopicID={this.state.selectedTopicID}
                selectedSubTopicID={this.state.selectedSubTopicID}
                listOfLanguage={this.state.listOfLanguage}
                selectedlanguage={this.state.selectedLanguage}
                handleLanguageChange={this.handleLanguageChange}
                tags={this.state.tags}
                suggestions={this.state.suggestions}
                onAddition={this.onAddition}
                onDelete={this.onDelete}
                handleChangeTags={this.handleChangeTags}
                authorList={this.props.authorList}
                userList={this.props.userList}
                userId={this.state.userId}
                authorId={this.state.authorId}
                handleAuthorChange={this.handleAuthorChange}
                handleUserChange={this.handleUserChange}
                date={this.state.date}
                handleDateChange={this.handleDateChange}
              />
            </Col>
            <Col
              lg="9"
              style={{
                background: "#EEEEEE",
                padding: "0em 2.5em",
              }}
              onScroll={this.handleScroll}
            >
              <Row style={{ margin: "2em 0em" }}>
                <Col lg="1.5">
                  <Link
                    to={{
                      pathname: "/addques",
                      // state: { authorList: this.props.authorList },
                    }}
                    target="_self"
                  >
                    <Button
                      style={{
                        fontSize: "1em",
                        fontWeight: "700",
                        background: "#6AA3FF",
                        borderColor: "#6AA3FF",
                        borderRadius: "0",
                      }}
                    >
                      {" "}
                      + Add Question
                    </Button>
                  </Link>
                </Col>
                <Col style={{ padding: "0" }}>
                  <Button
                    onClick={this.OnPreviewClick}
                    style={
                      this.state.listOfselectedPreview.length > 0
                        ? {
                            fontSize: "1em",
                            fontWeight: "700",
                            background: "rgba(254, 134, 53, 0.86)",
                            borderColor: "rgba(254, 134, 53, 0.86)",
                            borderRadius: "0",
                            float: "right",
                          }
                        : {
                            fontSize: "1em",
                            fontWeight: "700",
                            background: "#adb5bd",
                            borderColor: "#adb5bd",
                            borderRadius: "0",
                            float: "right",
                          }
                    }
                  >
                    {" "}
                    <img
                      src={BucketIcon}
                      width="22"
                      alt="bucket"
                      style={{ paddingBottom: "0.2em", marginRight: "0.3em" }}
                    />
                    Bucket
                  </Button>
                </Col>
              </Row>

              <Row style={{ margin: "0em 0em" }}>
                <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
                  <Form className="searchform">
                    <Form.Group controlId="formBasicSearch">
                      <Form.Control
                        type="text"
                        value={this.state.searchbox}
                        onChange={this.handleSearchboxChange}
                        placeholder="&#128269;  Search a question with id number"
                        style={{
                          padding: "1.5em 2em",
                          borderRadius: "0",
                        }}
                      />
                    </Form.Group>
                  </Form>
                </Col>
              </Row>
              <BottomScrollListener onBottom={this.callbackofend}>
                {this.state.searchResultList.length > 0 && (
                  <Row style={{ margin: "0 0em 1em" }}>
                    <Col
                      style={{ paddingLeft: "0.5em", paddingTop: "0.3em" }}
                      lg="1.5"
                    >
                      <Form.Check
                        id="custom-switch"
                        label="Select all"
                        checked={this.state.searchSelectAll}
                        onChange={this.handleSelectAllCheck}
                      />
                    </Col>

                    <Col style={{ paddingRight: "0em" }}>
                      <Button
                        onClick={this.handleAddToBucket}
                        variant="outline-light"
                        size="sm"
                        style={{
                          color: "black",
                          borderColor: "transparent",
                        }}
                      >
                        <img
                          src={
                            this.state.listOfsearchselected.filter(
                              (item) => item.status === true
                            ).length > 0
                              ? BucketIconOrange
                              : BucketIconGrey
                          }
                          width="22"
                          alt="bucket"
                          style={{
                            paddingBottom: "0.2em",
                            marginRight: "0.3em",
                          }}
                        />{" "}
                        Add to bucket
                      </Button>
                    </Col>
                    <Col lg="6" />
                  </Row>
                )}
                <div
                  style={{
                    padding: "0.4em",
                  }}
                >
                  {this.state.searchResultList.length > 0 ? (
                    this.state.searchResultList.map((item, index) => {
                      return (
                        <Row
                          key={index}
                          style={{
                            margin: "1.2em 0em",
                          }}
                        >
                          <Col
                            style={{
                              paddingLeft: "0em",
                              paddingRight: "0em",
                            }}
                          >
                            <Card
                              style={{
                                background: "transparent",
                                borderColor: "transparent",
                              }}
                            >
                              <Card.Body
                                style={{ padding: "0", margin: "0.5em 0" }}
                              >
                                <Card.Title
                                  style={{
                                    fontSize: "medium",
                                    marginBottom: ".2rem",
                                  }}
                                >
                                  <Form.Check
                                    size="lg"
                                    inline
                                    disabled={
                                      this.state.listOfselectedPreview.filter(
                                        (ob) =>
                                          ob.questionId === item.questionId
                                      ).length > 0
                                        ? true
                                        : false
                                    }
                                    type="checkbox"
                                    checked={
                                      this.state.listOfsearchselected[index]
                                        .status
                                    }
                                    onChange={this.handleInputChangeCheckboxlistsearch.bind(
                                      this,
                                      index
                                    )}
                                  />

                                  <span>
                                    <b>Id#</b>{" "}
                                    <span style={{ color: "dimgrey" }}>
                                      {item.questionId}
                                    </span>
                                  </span>
                                  <span style={{ marginLeft: "2.2em" }}>
                                    <OverlayTrigger
                                      placement="top"
                                      delay={{ show: 250, hide: 400 }}
                                      overlay={renderTooltip("Edit questions")}
                                    >
                                      <Button
                                        onClick={this.onEditClickques.bind(
                                          this,
                                          item.questionId
                                        )}
                                        size="sm"
                                        style={{
                                          borderRadius: "0",
                                          padding: ".15rem .15rem",
                                          background: "transparent",
                                          color: "rgb(106, 163, 255) ",
                                          border: "none",
                                        }}
                                        variant="secondary"
                                      >
                                        {<Edit className="svg_icons" />}{" "}
                                      </Button>
                                    </OverlayTrigger>
                                    <OverlayTrigger
                                      placement="top"
                                      delay={{ show: 250, hide: 400 }}
                                      overlay={renderTooltip(
                                        this.state.listOfselectedPreview.filter(
                                          (objj) =>
                                            objj.questionId === item.questionId
                                        ).length > 0
                                          ? "Remove from bucket"
                                          : "Add to bucket"
                                      )}
                                    >
                                      <Button
                                        size="sm"
                                        style={{
                                          borderRadius: "0",
                                          marginLeft: "1em",
                                          padding: ".15rem .15rem",
                                          background: "transparent",
                                          border: "none",
                                        }}
                                        onClick={this.onAddpreviewdata.bind(
                                          this,
                                          item.questionId
                                        )}
                                        variant="primary"
                                      >
                                        {this.state.listOfselectedPreview.filter(
                                          (objj) =>
                                            objj.questionId === item.questionId
                                        ).length > 0 ? (
                                          <img
                                            src={BucketIconGrey}
                                            width="22"
                                            alt="bucket"
                                          />
                                        ) : (
                                          <img
                                            src={BucketIconOrange}
                                            width="22"
                                            alt="bucket"
                                          />
                                        )}
                                      </Button>
                                    </OverlayTrigger>
                                  </span>
                                  <span
                                    style={{
                                      float: "right",
                                      fontSize: "15px",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <b>Tags: </b>
                                    <span style={{ color: "#1D4B7F" }}>
                                      {item.level === "EASY"
                                        ? item.level === "MILD"
                                          ? "++"
                                          : "+"
                                        : item.level === "MILD"
                                        ? "++"
                                        : "+++"}
                                    </span>
                                    ,
                                    <span
                                      style={{
                                        color: "darkgreen",
                                        textTransform: "lowercase",
                                      }}
                                    >
                                      {" "}
                                      {item.type}
                                    </span>
                                  </span>
                                </Card.Title>

                                <Card.Text
                                  style={{
                                    marginBottom: "0.5em",
                                    // display: "block",
                                    // width: "50%"
                                  }}
                                >
                                  {item.content !== "" ? (
                                    <MathJax
                                      style={{ display: "inline-flex" }}
                                      math={item.content}
                                    />
                                  ) : (
                                    <MathJax
                                      style={{ display: "inline-flex" }}
                                      math={" "}
                                    />
                                  )}
                                </Card.Text>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      );
                    })
                  ) : (
                    <Row style={{ margin: "0.5em 0em" }}>
                      <h5>No data found</h5>
                    </Row>
                  )}
                </div>
              </BottomScrollListener>
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
  }
}
function renderTooltip(name) {
  return <Tooltip>{name}</Tooltip>;
}
export default withRouter(QAtab);
