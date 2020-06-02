import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import PriorityList from "components/Priority/PriorityList";
import {
  fetchPriorities,
  fetchPrioritiesSuccess,
  fetchPrioritiesFailure,
  showModalUpdatePriority,
  updatePriority,
  deletePriority
} from "../../store/actions/priority";

const mapStateToProps = (state) => {
  return {
    listPriorities: state.reducer_priority.listPriorities,
    updatePriority: state.reducer_priority.updatePriority
  };
};
const mapDispatchToProps = dispatch => bindActionCreators({
  fetchPriorities,
  fetchPrioritiesSuccess,
  fetchPrioritiesFailure,
  showModalUpdatePriority,
  updatePriority,
  deletePriority
 }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PriorityList);
