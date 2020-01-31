import React from "react";
import "./diff.css";
export default class Radio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      coffeeTypes: ["+", "++", "+++"]
    };
  }
  render() {
    const options = this.state.coffeeTypes.map((loan, key) => {
      const isCurrent = this.props.difficulty === loan;
      return (
        <div key={key} className="radioPad">
          <div>
            <label
              className={
                isCurrent
                  ? "radioPad__wrapper radioPad__wrapper--selected"
                  : "radioPad__wrapper"
              }
            >
              <input
                className="radioPad__radio"
                type="radio"
                name="coffeeTypes"
                id={key}
                value={loan}
                onChange={this.props.handleDifficultyRadio}
              />
              {loan}
            </label>
          </div>
        </div>
      );
    });
    return (
      <div className="container center">
        <div className="row">{options}</div>
      </div>
    );
  }
}
