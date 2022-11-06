import { DefaultButton, Dropdown, PrimaryButton, TextField } from "@fluentui/react";
import PropTypes from "prop-types";
import * as React from "react";
import { createDataset, executeQuery, getDatabase, getDataset, getSchema } from "./superset";
const dropdownStyles = {
  dropdown: { width: 300 },
};

export default class QueryEditor extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      databaseList: [],
      schemaList: [],
      query: "select * from ab_user",
      table: "ab_user",
      database: null,
      schema: null,
    };
  }

  componentDidMount = async () => {
    this.setState({ databaseList: await getDatabase() });
    this.setState({});
  };

  handleDatabaseChange = async (event, option) => {
    this.setState({ database: option, schemaList: await getSchema(option.key) });
  };

  handleSchemaChange = (event, option) => {
    this.setState({ schema: option });
  };

  handleTableChange = (event) => {
    this.setState({ table: event.target.value });
  };

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
  };

  runQuery = async () => {
    const dsId = await createDataset(
      this.state.query,
      this.state.database.key,
      this.state.schema.key,
      this.state.table
    );
    const ds = await getDataset(dsId);
    const columns = ds.columns.map((c) => c.column_name);

    const response = await executeQuery(dsId, columns);
    const data = response?.result[0]?.data;
    const rows = data.map((row) => {
      return columns.map((column) => row[column]);
    });
    console.log(rows, columns);
    this.props.onQueryResult(columns, rows);
  };

  askAI = () => {
    // TODO: implement
  };

  render() {
    const { databaseList, schemaList, query, table, schema, database } = this.state;
    return (
      <div>
        <Dropdown
          placeholder="Choose the database"
          label="Database"
          options={databaseList}
          styles={dropdownStyles}
          selectedKey={database ? database.key : undefined}
          onChange={this.handleDatabaseChange}
        />
        <Dropdown
          placeholder="Choose the schema"
          label="Schema"
          options={schemaList}
          styles={dropdownStyles}
          selectedKey={schema ? schema.key : undefined}
          onChange={this.handleSchemaChange}
        />
        <strong>Table</strong>
        <TextField value={table} onChange={this.handleTableChange} style={{ width: "96%" }} />
        <strong>Query</strong>
        <textarea style={{ width: "100%", height: 120 }} value={query} onChange={this.handleQueryChange} />
        <PrimaryButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.runQuery}>
          Run
        </PrimaryButton>
        <DefaultButton
          className="ms-welcome__action"
          iconProps={{ iconName: "ChevronRight" }}
          onClick={this.askAI}
          style={{ marginLeft: "10px" }}
        >
          Ask AI
        </DefaultButton>
      </div>
    );
  }
}

QueryEditor.propTypes = {
  onQueryResult: PropTypes.func,
};
