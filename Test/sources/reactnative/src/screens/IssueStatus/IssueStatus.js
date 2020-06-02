import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import IssueStatusList from "components/IssueStatus/IssueStatusList";
import {
  fetchIssueStatuses,
  fetchIssueStatusesSuccess,
  fetchIssueStatusesFailure,
  showModalUpdateIssueStatus,
  updateIssueStatus,
  deleteIssueStatus
} from "../../store/actions/issue_status";

const mapStateToProps = (state) => {
  return {
    listIssueStatuses: state.reducer_issue_status.listIssueStatuses,
    updateIssueStatus: state.reducer_issue_status.updateIssueStatus
  };
};
const mapDispatchToProps = dispatch => bindActionCreators({
  fetchIssueStatuses,
  fetchIssueStatusesSuccess,
  fetchIssueStatusesFailure,
  showModalUpdateIssueStatus,
  updateIssueStatus,
  deleteIssueStatus
 }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(IssueStatusList);
