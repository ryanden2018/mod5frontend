import Furnishing from '../furnishings/furnishing';
import Table from '../furnishings/table';
import LongTable from '../furnishings/longtable';
import Stool from '../furnishings/stool';
import Chair from '../furnishings/chair';
import Bed from '../furnishings/bed';
import Dresser from '../furnishings/dresser';
import Desk from '../furnishings/desk';
import NightStand from '../furnishings/nightstand';
import Sofa from '../furnishings/sofa';
import BookCase from '../furnishings/bookcase';
import uuid from 'uuid/v4';


export default function roomReducer(state = [], action) {
  switch(action.type) {
    case 'addFurnishing':
      switch(action.name) {
        case 'bed':
          let bed = new Bed({id:uuid(),type:"bed",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:bed.objVal()});
          }
          return [...state,bed];
        case 'chair':
          let chair = new Chair({id:uuid(),type:"chair",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:chair.objVal()});
          }
          return [...state,chair];
        case 'desk':
          let desk = new Desk({id:uuid(),type:"desk",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors)
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:desk.objVal()});
          }
          return [...state,desk];
        case 'table':
          let table = new Table({id:uuid(),type:"table",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:table.objVal()});
          }
          return [...state,table];
        case 'bookcase':
          let bookcase = new BookCase({id:uuid(),type:"bookcase",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:bookcase.objVal()});
          }
          return [...state,bookcase];
        case 'dresser':
          let dresser = new Dresser({id:uuid(),type:"dresser",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:dresser.objVal()});
          }
          return [...state,dresser];
        case 'longtable':
          let longtable = new LongTable({id:uuid(),type:"longtable",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:longtable.objVal()});
          } 
          return [...state,longtable];
        case 'nightstand':
          let nightstand = new NightStand({id:uuid(),type:"nightstand",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:nightstand.objVal()});
          } 
          return [...state,nightstand];
        case 'sofa':
          let sofa = new Sofa({id:uuid(),type:"sofa",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:sofa.objVal()});
          }
          return [...state,sofa];
        case 'stool':
          let stool = new Stool({id:uuid(),type:"stool",posx:0.0,posz:0.0,theta:0.0,params:"",roomId:1,colorName:"red"},action.colors);
          if(action.socket) {
            action.socket.emit("createFurnishing",{furnishing:stool.objVal()});
          }
          return [...state,stool];
        default:
          break;
      }
      break;
    case 'addFurnishingFromObject':
      switch(action.obj.type) {
        case 'bed':
          return [...state, new Bed(action.obj,action.colors)]
        case 'chair':
          return [...state, new Chair(action.obj,action.colors)]
        case 'desk':
          return [...state, new Desk(action.obj,action.colors)]
        case 'table':
          return [...state, new Table(action.obj,action.colors)]
        case 'bookcase':
          return [...state, new BookCase(action.obj,action.colors)]
        case 'dresser':
          return [...state, new Dresser(action.obj,action.colors)]
        case 'longtable':
          return [...state, new LongTable(action.obj,action.colors)]
        case 'nightstand':
          return [...state, new NightStand(action.obj,action.colors)]
        case 'sofa':
          return [...state, new Sofa(action.obj,action.colors)]
        case 'stool':
          return [...state, new Stool(action.obj,action.colors)]
        default:
          break;
      }
      break;
    case 'removeAllFurnishings':
      return []
    default:
      return state;
  }
}
