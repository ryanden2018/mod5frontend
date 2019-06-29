export default function modeeReducer(state = {mode:"move",colorName:"green"}, action) {
  switch(action.type) {
    case "SET_MODE":
      return {...state, mode: action.mode}
    case "SET_COLOR":
      return {...state, colorName:action.colorName}
    default:
      return state
  }
}
