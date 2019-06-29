import { combineReducers } from "redux";
import roomReducer from "./roomReducer";
import fileReducer from "./fileReducer";
import lockReducer from "./lockReducer";
import modeReducer from "./modeReducer";

const rootReducer = combineReducers({
  room: roomReducer,
  file: fileReducer,
  lock: lockReducer,
  mode: modeReducer
});

export default rootReducer;
