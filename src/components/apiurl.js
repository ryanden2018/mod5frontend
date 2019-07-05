const apiurl = ( (process.env.NODE_HOME && process.env.NODE_HOME.include("heroku")) ? "https://ryanmod5backend.herokuapp.com" : "http://localhost:8000" );

export default apiurl;
