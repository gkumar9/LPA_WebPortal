import React from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Tab,
  Nav
} from "react-bootstrap";
import GmailTreeView from "./tree.js";
import Bucket from "@material-ui/icons/Https";
import Edit from "@material-ui/icons/Edit";
import Header from "../Header/index";
import { Link } from "react-router-dom";

import "./index.css";
function Dashboard() {
  return (
    <React.Fragment>
      <Header />
      <Container fluid style={{ width: "auto" }}>
        <Row style={{ height: "90vh" }}>
          <Col
            lg="3"
            style={{
              background: "white",
              // height: "90vh",
              paddingLeft: "0em",
              paddingRight: "0em"
            }}
          >
            <GmailTreeView />
          </Col>

          <Col
            style={{
              background: "#EEEEEE",
              // height: "90vh",
              padding: "0em 2em"
            }}
          >
            <Tab.Container defaultActiveKey="first">
              <Row style={{ margin: "2em 0em" }}>
                <Col
                  lg="1.5"
                  style={{
                    background: "white",
                    borderRadius: "2em",
                    padding: "0.3em 1.5em",
                    letterSpacing: "0.2em"
                  }}
                >
                  <Nav.Link eventKey="first">
                    <span style={{ fontSize: "larger" }}>Q&A </span>
                  </Nav.Link>
                </Col>
                <Col
                  style={{
                    padding: "0.3em 1.5em"
                  }}
                >
                  <Nav.Link eventKey="second">
                    <span style={{ fontSize: "larger", color: "dimgrey" }}>
                      Exams
                    </span>
                  </Nav.Link>
                </Col>
              </Row>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <Row style={{ margin: "2em 0em" }}>
                    <Col lg="1.5">
                      {/* <BrowserRouter> */}
                      <Link to="/addques" target="_self">
                        <Button
                          style={{
                            fontSize: "1em",
                            fontWeight: "700",
                            background: "#6AA3FF",
                            borderColor: "#6AA3FF",
                            borderRadius: "0"
                          }}
                        >
                          {" "}
                          + Add
                        </Button>
                      </Link>
                      {/* </BrowserRouter> */}
                    </Col>
                    <Col
                      style={{
                        padding: "0.2em 1.5em"
                      }}
                    >
                      <p
                        style={{
                          lineHeight: "1em",
                          color: "dimgrey",
                          fontWeight: "400"
                        }}
                      >
                        Add new and review prevoius question and answers.
                        <br></br>
                        Please select the folder you want to access before
                        taking any actions.
                      </p>
                    </Col>
                  </Row>

                  <Row style={{ margin: "0em 0em" }}>
                    <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
                      <Form className="searchform">
                        <Form.Group controlId="formBasicSearch">
                          <Form.Control
                            type="text"
                            placeholder="&#128269;  Search a question with id number"
                            style={{ padding: "1.5em 2em", borderRadius: "0" }}
                          />
                        </Form.Group>
                      </Form>
                    </Col>
                  </Row>

                  <Row style={{ margin: "0 0em 1em" }}>
                    <Col style={{ paddingLeft: "0.5em" }} lg="1.5">
                      <Form.Check
                        type="switch"
                        id="custom-switch"
                        label="Select all"
                        // label={
                        //   <Button variant="outline-primary" size="sm">
                        //     Add to bucket
                        //   </Button>
                        // }
                        // label={
                        //   <Button variant="outline-dark" size="sm">
                        //     <Bucket className="svg_icons" /> Add to bucket
                        //   </Button>
                        // }
                      />
                    </Col>
                    <Col lg="9" />
                    <Col style={{ paddingRight: "0em" }}>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        // style={{ float: "right" }}
                      >
                        <Bucket className="svg_icons" /> Add to bucket
                      </Button>
                    </Col>
                  </Row>
                  <div
                    style={{
                      height: "45vh",
                      overflow: "scroll",
                      // border: "1px solid lightgrey",
                      // background: "white",
                      padding: "0.4em"
                    }}
                  >
                    <Row style={{ margin: "0.5em 0em" }}>
                      <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
                        <Card
                          style={{
                            background: "transparent",
                            borderColor: "transparent"
                          }}
                        >
                          <Card.Body style={{ padding: "0em" }}>
                            <Card.Title style={{ fontSize: "medium" }}>
                              <Form.Check inline type="checkbox" />

                              <span>
                                <b>Id#</b>{" "}
                                <span style={{ color: "dimgrey" }}>
                                  ABCD76{" "}
                                </span>
                              </span>
                              <span
                                style={{
                                  float: "right",
                                  fontSize: "15px",
                                  fontWeight: "600"
                                }}
                              >
                                <b>Tags: </b>
                                <span style={{ color: "blue" }}>
                                  Difficulty: ++
                                </span>
                                ,
                                <span style={{ color: "maroon" }}>
                                  {" "}
                                  2013 RSBSSB
                                </span>
                                ,
                                <span style={{ color: "darkgreen" }}>
                                  {" "}
                                  Single option obj
                                </span>
                              </span>
                            </Card.Title>

                            <Card.Text>
                              A coin is thrown 3 times. What is the probability
                              that atleast one head is obtained ?
                            </Card.Text>
                            <div style={{ float: "right" }}>
                              <Button
                                title="Add to bucket"
                                size="sm"
                                style={{
                                  borderRadius: "0"
                                }}
                                variant="primary"
                              >
                                {<Bucket />}{" "}
                              </Button>
                              <Button
                                title="Edit"
                                size="sm"
                                style={{
                                  borderRadius: "0",
                                  marginLeft: "1em"
                                }}
                                variant="secondary"
                              >
                                {<Edit />}{" "}
                              </Button>
                            </div>
                            {/* <Card.Link style={{float:'right'}} href="#">Card Link</Card.Link>
                  <Card.Link style={{float:'right'}}href="#">Another Link</Card.Link> */}
                          </Card.Body>
                          <hr />
                        </Card>
                      </Col>
                    </Row>
                    <Row style={{ margin: "0.5em 0em" }}>
                      <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
                        <Card
                          style={{
                            background: "transparent",
                            borderColor: "transparent"
                          }}
                        >
                          <Card.Body style={{ padding: "0em" }}>
                            <Card.Title style={{ fontSize: "medium" }}>
                              <Form.Check inline type="checkbox" />

                              <span>
                                <b>Id#</b>{" "}
                                <span style={{ color: "dimgrey" }}>
                                  ABCD76{" "}
                                </span>
                              </span>
                              <span
                                style={{
                                  float: "right",
                                  fontSize: "15px",
                                  fontWeight: "600"
                                }}
                              >
                                <b>Tags: </b>
                                <span style={{ color: "blue" }}>
                                  Difficulty: ++
                                </span>
                                ,
                                <span style={{ color: "maroon" }}>
                                  {" "}
                                  2013 RSBSSB
                                </span>
                                ,
                                <span style={{ color: "darkgreen" }}>
                                  {" "}
                                  Single option obj
                                </span>
                              </span>
                            </Card.Title>

                            <Card.Text>
                              A coin is thrown 3 times. What is the probability
                              that atleast one head is obtained ?
                            </Card.Text>
                            <div style={{ float: "right" }}>
                              <Button
                                title="Add to bucket"
                                size="sm"
                                style={{
                                  borderRadius: "0"
                                }}
                                variant="primary"
                              >
                                {<Bucket />}{" "}
                              </Button>
                              <Button
                                title="Edit"
                                size="sm"
                                style={{
                                  borderRadius: "0",
                                  marginLeft: "1em"
                                }}
                                variant="secondary"
                              >
                                {<Edit />}{" "}
                              </Button>
                            </div>
                            {/* <Card.Link style={{float:'right'}} href="#">Card Link</Card.Link>
                  <Card.Link style={{float:'right'}}href="#">Another Link</Card.Link> */}
                          </Card.Body>
                          <hr />
                        </Card>
                      </Col>
                    </Row>
                    <Row style={{ margin: "0.5em 0em" }}>
                      <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
                        <Card
                          style={{
                            background: "transparent",
                            borderColor: "transparent"
                          }}
                        >
                          <Card.Body style={{ padding: "0em" }}>
                            <Card.Title style={{ fontSize: "medium" }}>
                              <Form.Check inline type="checkbox" />

                              <span>
                                <b>Id#</b>{" "}
                                <span style={{ color: "dimgrey" }}>
                                  ABCD76{" "}
                                </span>
                              </span>
                              <span
                                style={{
                                  float: "right",
                                  fontSize: "15px",
                                  fontWeight: "600"
                                }}
                              >
                                <b>Tags: </b>
                                <span style={{ color: "blue" }}>
                                  Difficulty: ++
                                </span>
                                ,
                                <span style={{ color: "maroon" }}>
                                  {" "}
                                  2013 RSBSSB
                                </span>
                                ,
                                <span style={{ color: "darkgreen" }}>
                                  {" "}
                                  Single option obj
                                </span>
                              </span>
                            </Card.Title>

                            <Card.Text>
                              A coin is thrown 3 times. What is the probability
                              that atleast one head is obtained ?
                            </Card.Text>
                            <div style={{ float: "right" }}>
                              <Button
                                title="Add to bucket"
                                size="sm"
                                style={{
                                  borderRadius: "0"
                                }}
                                variant="primary"
                              >
                                {<Bucket />}{" "}
                              </Button>
                              <Button
                                title="Edit"
                                size="sm"
                                style={{
                                  borderRadius: "0",
                                  marginLeft: "1em"
                                }}
                                variant="secondary"
                              >
                                {<Edit />}{" "}
                              </Button>
                            </div>
                            {/* <Card.Link style={{float:'right'}} href="#">Card Link</Card.Link>
                  <Card.Link style={{float:'right'}}href="#">Another Link</Card.Link> */}
                          </Card.Body>
                          <hr />
                        </Card>
                      </Col>
                    </Row>
                    <Row style={{ margin: "0.5em 0em" }}>
                      <Col style={{ paddingLeft: "0em", paddingRight: "0em" }}>
                        <Card
                          style={{
                            background: "transparent",
                            borderColor: "transparent"
                          }}
                        >
                          <Card.Body style={{ padding: "0em" }}>
                            <Card.Title style={{ fontSize: "medium" }}>
                              <Form.Check inline type="checkbox" />

                              <span>
                                <b>Id#</b>{" "}
                                <span style={{ color: "dimgrey" }}>
                                  ABCD76{" "}
                                </span>
                              </span>
                              <span
                                style={{
                                  float: "right",
                                  fontSize: "15px",
                                  fontWeight: "600"
                                }}
                              >
                                <b>Tags: </b>
                                <span style={{ color: "blue" }}>
                                  Difficulty: ++
                                </span>
                                ,
                                <span style={{ color: "maroon" }}>
                                  {" "}
                                  2013 RSBSSB
                                </span>
                                ,
                                <span style={{ color: "darkgreen" }}>
                                  {" "}
                                  Single option obj
                                </span>
                              </span>
                            </Card.Title>

                            <Card.Text>
                              A coin is thrown 3 times. What is the probability
                              that atleast one head is obtained ?
                            </Card.Text>
                            <div style={{ float: "right" }}>
                              <Button
                                title="Add to bucket"
                                size="sm"
                                style={{
                                  borderRadius: "0"
                                }}
                                variant="primary"
                              >
                                {<Bucket />}{" "}
                              </Button>
                              <Button
                                title="Edit"
                                size="sm"
                                style={{
                                  borderRadius: "0",
                                  marginLeft: "1em"
                                }}
                                variant="secondary"
                              >
                                {<Edit />}{" "}
                              </Button>
                            </div>
                            {/* <Card.Link style={{float:'right'}} href="#">Card Link</Card.Link>
                  <Card.Link style={{float:'right'}}href="#">Another Link</Card.Link> */}
                          </Card.Body>
                          <hr />
                        </Card>
                      </Col>
                    </Row>
                  </div>
                </Tab.Pane>
                <Tab.Pane eventKey="second">asdasdasd</Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
}
export default Dashboard;
