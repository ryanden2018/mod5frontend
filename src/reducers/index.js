import { combineReducers } from "redux";
import roomReducer from "./roomReducer";
import fileReducer from "./fileReducer";

const rootReducer = combineReducers({
  room: roomReducer,
  file: fileReducer
});

export default rootReducer;
