
// lockReducer
//   Tracks mouse down and furnishing locks.
//
// state keys: lockRequested, lockObtained, mouseDown, furnishingId, mousex, mousey
//   lockRequested: true if a lock has been requested and is pending response from the server
//   lockObtained: true if the user has a lock on a furnishing
//   mouseDown: true if the mouse is currently depressed
//   furnishingId: the id of the furnishing which presently has a lock
//   mousex: (if mouseDown is true) the x position of the mouse, in normalized coordinates, at time of mousedown event
//   mousey: (if mouseDOwn is true) the y position of the mouse, in normalized coordinates, at time of mousedown event
//
// action.type must be one of 'SET_FURNISHING', 'UN_LOCK', 'SET_LOCK_REQUESTED', 'SET_LOCK_APPROVED',
//                       'SET_MOUSE_DOWN', 'UN_SET_MOUSE_DOWN', or 'LOCK_LOGOUT'
//
// 

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
