const apiurl = ( (!window.location.href.includes("localhost")) ? "https://spaceplanner3d.herokuapp.com" : "http://localhost:8000" );

export default apiurl;
