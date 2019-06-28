import { combineReducers } from "redux";
import roomReducer from "./roomReducer";

const rootReducer = combineReducers({
  room: roomReducer
});

export default rootReducer;
