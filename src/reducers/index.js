import { combineReducers } from "redux";
import roomReducer from "./roomReducer";
import fileReducer from "./fileReducer";
import lockReducer from "./lockReducer";

const rootReducer = combineReducers({
  room: roomReducer,
  file: fileReducer,
  lock: lockReducer
});

export default rootReducer;
