export default function lockReducer(state = {lockRequested:false,mouseDown:false,lockObtained:false,furnishingId:null,mousex:null,mousey:null}, action) {
  switch(action.type) {
    case "SET_FURNISHING":
      return {...state, furnishingId: action.furnishingId};
    case "UN_LOCK":
      return {lockRequested:false,dragging:false,lockObtained:false,furnishingId:null,mousex:null,mousey:null};
    case "SET_LOCK_REQUESTED":
      return {...state, lockRequested: true};
    case "SET_LOCK_APPROVED":
      return {...state, lockObtained:true};
    case "SET_MOUSE_DOWN":
      return {...state, mouseDown: true, mousex: action.mousex, mousey: action.mousey};
    case "UN_SET_MOUSE_DOWN":
      return {...state, mouseDown: false};
    case "LOCK_LOGOUT":
      return {lockRequested:false,mouseDown:false,lockObtained:false,furnishingId:null,mousex:null,mousey:null};
    default:
      return state
  }
}
