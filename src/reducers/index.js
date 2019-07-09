import { combineReducers } from "redux";
import roomReducer from "./roomReducer";
import fileReducer from "./fileReducer";
import lockReducer from "./lockReducer";
import modeReducer from "./modeReducer";
import undoReducer from "./undoReducer";
import redoReducer from "./redoReducer";

const rootReducer = combineReducers({
  room: roomReducer,
  file: fileReducer,
  lock: lockReducer,
  mode: modeReducer,
  undo: undoReducer,
  redo: redoReducer
});

export default rootReducer;
