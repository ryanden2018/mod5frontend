export default function modeReducer(state = {mode:"move",colorName:"green"}, action) {
  switch(action.type) {
    case "SET_MODE":
      return {...state, mode: action.mode}
    case "SET_COLOR":
      return {...state, colorName:action.colorName}
    case "MODE_LOGOUT":
      return {mode:"move",colorName:"green"};
    default:
      return state
  }
}
