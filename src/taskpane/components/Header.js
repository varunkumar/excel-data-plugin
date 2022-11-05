import PropTypes from "prop-types";
import * as React from "react";

export default class Header extends React.Component {
  render() {
    const { title, logo, message, onLogout } = this.props;

    return (
      <section className="ms-welcome__header ms-bgColor-neutralLighter ms-u-fadeIn500">
        <img width="90" height="90" src={logo} alt={title} title={title} />
        <br />
        {message && (
          <div
            className="ms-fontWeight-light ms-fontColor-neutralPrimary"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              position: "absolute",
              right: "20px",
              top: "20px",
              fontWeight: "bold",
            }}
          >
            {message}
            <a
              href="#"
              onClick={onLogout}
              style={{ textAlign: "right", display: "inline", paddingLeft: "5px", fontWeight: "normal" }}
            >
              Logout
            </a>
            <br />
            <h3 style={{ fontWeight: "normal" }}>Data explorer</h3>
          </div>
        )}
        <div style={{ clear: "both" }}></div>
        <hr />
      </section>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string,
  logo: PropTypes.string,
  message: PropTypes.string,
  onLogout: PropTypes.func,
};
