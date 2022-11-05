import { DefaultButton } from "@fluentui/react";
import PropTypes from "prop-types";
import * as React from "react";
import Header from "./Header";
import Login from "./Login";
import Progress from "./Progress";
import { getUsername, isUserLoggedIn, logout } from "./superset";

/* global console, Excel, require */

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

  click = async () => {
    try {
      await Excel.run(async (context) => {
        /**
         * Insert your Excel code here
         */
        const range = context.workbook.getSelectedRange();

        // Read the range address
        range.load("address");

        // Update the fill color
        range.format.fill.color = "yellow";

        await context.sync();
        console.log(`The range address was ${range.address}.`);
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
          <div>
            <textarea style={{ width: "100%", height: 120 }} />
            <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.click}>
              Run
            </DefaultButton>
          </div>
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
