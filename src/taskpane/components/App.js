import PropTypes from "prop-types";
import * as React from "react";
import Header from "./Header";
import Login from "./Login";
import Progress from "./Progress";
import QueryEditor from "./QueryEditor";
import { getUsername, isUserLoggedIn, logout } from "./superset";

/* global console, Excel, require */

const getColumnName = (columnNumber) => {
  let dividend = columnNumber;
  let columnName = "";
  let modulo;

  while (dividend > 0) {
    modulo = (dividend - 1) % 26;
    columnName = String.fromCharCode(65 + modulo) + columnName;
    dividend = Math.floor((dividend - modulo) / 26);
  }

  return columnName;
};

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isUserLoggedIn: isUserLoggedIn(),
      message: isUserLoggedIn() ? "Welcome " + getUsername() + "!" : "",
    };
  }

  componentDidMount() {
    this.setState({});
  }

  onLoginSuccess = () => {
    this.setState({ isUserLoggedIn: true, message: "Welcome " + getUsername() + "!" });
  };

  onLogout = () => {
    logout();
    this.setState({ isUserLoggedIn: false, message: "" });
  };

  handleQueryResult = async (columns, rows) => {
    try {
      await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet();

        let data2d = [columns, ...rows];

        const range = sheet.getRange(`A1:${getColumnName(columns.length)}${data2d.length}`);
        range.values = data2d;

        await context.sync();
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header
          logo={require("./../../../assets/logo-filled.png")}
          title={this.props.title}
          message={this.state.message}
          onLogout={this.onLogout}
        />
        {this.state.isUserLoggedIn ? (
          <QueryEditor onQueryResult={this.handleQueryResult}></QueryEditor>
        ) : (
          <Login onLoginSuccess={this.onLoginSuccess}></Login>
        )}
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
