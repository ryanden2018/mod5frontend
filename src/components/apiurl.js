const apiurl = ( (!window.location.href.includes("localhost")) ? "http://ryanmod5backend.herokuapp.com" : "http://localhost:8000" );

export default apiurl;
