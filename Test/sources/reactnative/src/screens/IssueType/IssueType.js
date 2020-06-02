import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import IssueTypeList from "components/IssueType/IssueTypeList";
import {
  fetchIssueTypes,
  fetchIssueTypesSuccess,
  fetchIssueTypesFailure,
  showModalUpdateIssueType,
  updateIssueType,
  deleteIssueType
} from "../../store/actions/issue_type";

const mapStateToProps = (state) => {
  return {
    listIssueTypes: state.reducer_issue_type.listIssueTypes,
    updateIssueType: state.reducer_issue_type.updateIssueType
  };
};
const mapDispatchToProps = dispatch => bindActionCreators({
  fetchIssueTypes,
  fetchIssueTypesSuccess,
  fetchIssueTypesFailure,
  showModalUpdateIssueType,
  updateIssueType,
  deleteIssueType
 }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IssueTypeList);
