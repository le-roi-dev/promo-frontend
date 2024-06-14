const runGoogleFunction = (funcName, queryString) => {
    return new Promise((resolve, reject) => {
      google.script.run
        .withSuccessHandler((data) => {
          resolve(data);
        })
        .withFailureHandler((er) => {
          reject(er);
        })
        [funcName](queryString);
    });
};

export default runGoogleFunction;