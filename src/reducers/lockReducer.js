export default function fileReducer(state = {lockRequested:false,mouseDown:false,lockObtained:false,furnishingId:null}, action) {
  switch(action.type) {
    case "SET_FURNISHING":
      return {...state, furnishingId: action.furnishingId};
    case "UN_LOCK":
      return {lockRequested:false,dragging:false,lockObtained:false,furnishingId:null};
    case "SET_LOCK_REQUESTED":
      return {...state, lockRequested: true};
    case "SET_LOCK_APPROVED":
      return {...state, lockObtained:true};
    case "SET_MOUSE_DOWN":
      return {...state, mouseDown: true};
    case "UN_SET_MOUSE_DOWN":
      return {...state, mouseDown: false};
    default:
      return state
  }
}
